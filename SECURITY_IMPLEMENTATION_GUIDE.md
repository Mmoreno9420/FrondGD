# 🛡️ Guía de Implementación de Seguridad

## 📦 Componentes Creados

### 1. ProtectedRoute Component
**Ubicación**: `src/components/ProtectedRoute.js`

Componente para proteger rutas completas.

#### Uso Básico:
```javascript
import ProtectedRoute from 'components/ProtectedRoute';

// Proteger una ruta completa
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

#### Con Permisos:
```javascript
// Requiere al menos un permiso
<ProtectedRoute requiredPermissions={['usuarios.ver', 'usuarios.editar']}>
  <UsersPage />
</ProtectedRoute>

// Requiere TODOS los permisos
<ProtectedRoute 
  requiredPermissions={['usuarios.ver', 'usuarios.editar']}
  requireAllPermissions={true}
>
  <AdminPanel />
</ProtectedRoute>
```

#### Con Fallback Personalizado:
```javascript
<ProtectedRoute 
  requiredPermissions={['admin.access']}
  fallback={<CustomAccessDenied />}
>
  <AdminDashboard />
</ProtectedRoute>
```

---

### 2. RequirePermission Component
**Ubicación**: `src/components/RequirePermission.js`

Componente para proteger elementos individuales dentro de una página.

#### Uso Básico:
```javascript
import RequirePermission from 'components/RequirePermission';

function UserList() {
  return (
    <div>
      <h1>Usuarios</h1>
      
      {/* Solo mostrar botón si tiene permiso */}
      <RequirePermission permission="usuarios.crear">
        <button onClick={handleCreate}>Crear Usuario</button>
      </RequirePermission>

      <table>
        {/* Renderizar tabla */}
      </table>
      
      {/* Requiere múltiples permisos */}
      <RequirePermission 
        permission={['usuarios.eliminar', 'admin.access']}
        requireAll={true}
      >
        <button onClick={handleDeleteAll}>Eliminar Todo</button>
      </RequirePermission>
    </div>
  );
}
```

#### Con Fallback:
```javascript
<RequirePermission 
  permission="advanced.feature"
  fallback={<UpgradeMessage />}
>
  <AdvancedFeature />
</RequirePermission>
```

---

### 3. Security Utils
**Ubicación**: `src/utils/security.js`

Utilidades de seguridad.

#### Validación de Token:
```javascript
import { isTokenValid, getTokenTimeRemaining } from 'utils/security';

const token = localStorage.getItem('authToken');

// Verificar si el token es válido
if (isTokenValid(token)) {
  console.log('Token válido');
}

// Obtener tiempo restante
const timeRemaining = getTokenTimeRemaining(token);
console.log(`Token expira en ${timeRemaining}ms`);
```

#### Validación de Datos:
```javascript
import { isValidEmail, validatePassword, sanitizeString } from 'utils/security';

// Validar email
if (isValidEmail(email)) {
  console.log('Email válido');
}

// Validar contraseña
const { valid, errors } = validatePassword(password, {
  minLength: 12,
  requireSpecialChars: true,
});

// Sanitizar string
const safeString = sanitizeString(userInput);
```

#### Logging Seguro:
```javascript
import { secureLog } from 'utils/security';

// Loguear de forma segura (solo en desarrollo)
secureLog('log', 'Usuario autenticado', { 
  userId: 123, 
  password: 'secret123', // Este campo será redactado
});

// Resultado en desarrollo:
// Usuario autenticado { userId: 123, password: '***REDACTED***' }

// Resultado en producción:
// (no se loguea nada)
```

---

## 🔧 Implementación en tu App

### Paso 1: Actualizar routes.js

```javascript
import ProtectedRoute from 'components/ProtectedRoute';
import Users from 'Views/Users/User/Users';
import Gestiones from 'Views/Gestiones/Gestion/Gestiones';

// En tu archivo de rutas
const routes = [
  {
    type: "collapse",
    name: "Configuración",
    key: "configuracion",
    icon: <Shop size="small" />,
    collapse: [
      { 
        name: "Usuarios", 
        key: "default", 
        route: "/pages/users/usuarios",
        // Opcional: especificar permisos en la definición de la ruta
        // requiredPermissions: ['usuarios.ver']
      },
    ],
  },
];
```

### Paso 2: Actualizar App.js

```javascript
import ProtectedRoute from 'components/ProtectedRoute';

// En lugar de renderizar directamente, envolver con ProtectedRoute
<Route 
  path="/pages/users/usuarios" 
  element={
    <ProtectedRoute requiredPermissions={['usuarios.ver']}>
      <Users />
    </ProtectedRoute>
  } 
/>
```

### Paso 3: Usar en Componentes

```javascript
import RequirePermission from 'components/RequirePermission';

function UsersTable() {
  return (
    <div>
      <SoftBox display="flex" justifyContent="space-between">
        <SoftTypography variant="h5">Usuarios</SoftTypography>
        
        <RequirePermission permission="usuarios.crear">
          <SoftButton onClick={handleCreate} color="primary">
            Crear Usuario
          </SoftButton>
        </RequirePermission>
      </SoftBox>

      <RequirePermission permission="usuarios.ver">
        <UsersList />
      </RequirePermission>
    </div>
  );
}
```

---

## 🔐 Mejoras Adicionales Recomendadas

### 1. Implementar Token Refresh Automático

```javascript
// En src/services/api.js
import { isTokenValid, getTokenTimeRemaining } from 'utils/security';

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Verificar si el token está a punto de expirar
      const timeRemaining = getTokenTimeRemaining(token);
      
      // Si queda menos de 5 minutos, refrescar
      if (timeRemaining < 5 * 60 * 1000 && timeRemaining > 0) {
        try {
          const newToken = await refreshToken();
          localStorage.setItem('authToken', newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (error) {
          // Si falla el refresh, redirigir a login
          window.location.href = '/login';
        }
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  }
);
```

### 2. Agregar Timeout de Sesión

```javascript
// Crear hook useSessionTimeout.js
import { useEffect } from 'react';
import { useUserSession } from 'hooks/useUserSession';

export const useSessionTimeout = (timeoutMinutes = 30) => {
  const { logout } = useUserSession();
  const timeout = timeoutMinutes * 60 * 1000;
  
  useEffect(() => {
    let timer;
    
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.warn('Sesión expirada por inactividad');
        logout();
      }, timeout);
    };
    
    // Eventos que resetean el timer
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });
    
    resetTimer();
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      clearTimeout(timer);
    };
  }, [timeout, logout]);
};
```

### 3. Agregar Headers de Seguridad

En `public/index.html`, agregar:

```html
<head>
  <!-- Headers de Seguridad -->
  <meta http-equiv="Content-Security-Policy" 
        content="default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;">
  
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-Frame-Options" content="DENY">
  <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
  
  <!-- ... resto del head ... -->
</head>
```

### 4. Implementar Rate Limiting en Login

```javascript
// En Login.js
import { useState, useEffect } from 'react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos

function Login() {
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  
  useEffect(() => {
    const attempts = parseInt(localStorage.getItem('failedAttempts') || '0');
    const lastAttempt = parseInt(localStorage.getItem('lastAttempt') || '0');
    const timeSinceLastAttempt = Date.now() - lastAttempt;
    
    if (attempts >= MAX_ATTEMPTS && timeSinceLastAttempt < LOCKOUT_TIME) {
      setLocked(true);
      const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLastAttempt) / 1000 / 60);
      console.warn(`Cuenta bloqueada por ${remainingTime} minutos`);
    }
  }, []);
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Limpiar contador en éxito
      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('lastAttempt');
    } catch (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('failedAttempts', newAttempts);
      localStorage.setItem('lastAttempt', Date.now());
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setLocked(true);
      }
    }
  };
}
```

---

## 📋 Checklist de Seguridad

### Funcionalidad Básica
- [ ] Implementar ProtectedRoute en rutas principales
- [ ] Usar RequirePermission en botones críticos
- [ ] Validar tokens en cada request
- [ ] Implementar refresh token automático

### Protecciones Adicionales
- [ ] Agregar timeout de sesión por inactividad
- [ ] Implementar rate limiting en login
- [ ] Agregar headers de seguridad (CSP, X-Frame-Options, etc.)
- [ ] Sanitizar todos los inputs del usuario
- [ ] Validar datos del servidor antes de renderizar

### Monitoreo y Auditoría
- [ ] Registrar intentos de acceso no autorizado
- [ ] Logear cambios críticos
- [ ] Implementar alerts para actividad sospechosa

### Producción
- [ ] Eliminar credenciales hardcodeadas
- [ ] Deshabilitar logs sensibles
- [ ] Forzar HTTPS
- [ ] Implementar HSTS
- [ ] Configurar CSP estricto

---

## 🚨 Notas Importantes

1. **No confiar en validación solo del frontend**: Toda validación debe ser duplicada en el backend.

2. **Tokens JWT**: Implementar tokens JWT reales con el backend, no tokens estáticos.

3. **Cookies HttpOnly**: En producción, preferir cookies HttpOnly sobre localStorage.

4. **HTTPS Obligatorio**: Nunca enviar tokens por HTTP.

5. **CSP**: Ajustar Content Security Policy según las necesidades específicas de tu app.

---

**Fecha**: 2024  
**Versión**: 1.0
