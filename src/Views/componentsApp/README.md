# GestiaSoft - Componentes de Aplicación Personalizados

## 📋 Descripción

Este directorio contiene componentes personalizados para la aplicación GestiaSoft, basados en el template Soft UI Dashboard PRO React pero adaptados a las necesidades específicas del proyecto.

## 🚀 Componentes Disponibles

### 1. **AppNavbar** - Barra de Navegación Personalizada
- **Ubicación**: `Navbars/AppNavbar.js`
- **Características**: 
  - Logo y nombre de marca
  - Navegación simplificada
  - Menú de usuario desplegable
  - Menú de notificaciones
  - Responsive design
- **Uso**: Reemplaza la navbar estándar del tema

### 2. **AppFooter** - Pie de Página Personalizado
- **Ubicación**: `Footer/AppFooter.js`
- **Características**:
  - Información de copyright
  - Enlaces de navegación
  - Diseño transparente y minimalista
  - Posicionamiento automático en el pie de página
- **Uso**: Pie de página personalizado para la aplicación

### 3. **AppSidenav** - Menú Lateral Personalizado ⭐ **NUEVO**
- **Ubicación**: `Sidenav/AppSidenav.js`
- **Características**:
  - Navegación colapsable y anidada
  - Soporte para submenús
  - Estado persistente de menús
  - Navegación automática
  - Responsive design
- **Uso**: Menú lateral personalizado con comportamiento similar al original

### 4. **AppDashboardLayout** - Layout de Dashboard
- **Ubicación**: `Layouts/AppDashboardLayout.js`
- **Características**:
  - Layout personalizado con AppNavbar y AppFooter
  - Padding automático para navbar fijo
  - Footer posicionado en el pie de página
- **Uso**: Layout alternativo al DashboardLayout estándar

### 5. **AppSidenavLayout** - Layout con Sidenav ⭐ **NUEVO**
- **Ubicación**: `Layouts/AppSidenavLayout.js`
- **Características**:
  - Layout completo con AppSidenav, AppNavbar y AppFooter
  - Soporte para RTL
  - Manejo automático de temas
  - Navegación integrada
- **Uso**: Layout principal para páginas que requieren sidenav

### 6. **AppDefaultDashboard** - Dashboard Personalizado
- **Ubicación**: `Dashboards/AppDefaultDashboard.js`
- **Características**:
  - Dashboard personalizado en español
  - Estadísticas y gráficos
  - Tabla de ventas
  - Usa AppDashboardLayout
- **Uso**: Dashboard principal de la aplicación

### 7. **UsersPage** - Página de Usuarios ⭐ **NUEVO**
- **Ubicación**: `Pages/UsersPage.js`
- **Características**:
  - Página de gestión de usuarios
  - Estadísticas con tarjetas complejas
  - Tabla de datos
  - Usa AppSidenavLayout
- **Uso**: Página de usuarios con sidenav integrado

## 🔧 Implementación

### Opción 1: Usar Componentes Individuales
```jsx
import { AppNavbar, AppFooter } from "Views/componentsApp";

function MyComponent() {
  return (
    <div>
      <AppNavbar />
      {/* Contenido */}
      <AppFooter />
    </div>
  );
}
```

### Opción 2: Usar Layouts Completos
```jsx
import { AppDashboardLayout } from "Views/componentsApp";

function MyDashboard() {
  return (
    <AppDashboardLayout>
      {/* Contenido del dashboard */}
    </AppDashboardLayout>
  );
}
```

### Opción 3: Usar Layout con Sidenav ⭐ **NUEVO**
```jsx
import { AppSidenavLayout } from "Views/componentsApp";

function MyPage() {
  const routes = [
    {
      type: "collapse",
      name: "Usuarios",
      key: "users",
      icon: "people",
      collapse: [
        {
          name: "Reportes",
          key: "reports",
          route: "/reports",
        },
      ],
    },
  ];

  return (
    <AppSidenavLayout routes={routes} brandName="GestiaSoft">
      {/* Contenido de la página */}
    </AppSidenavLayout>
  );
}
```

## 📁 Estructura de Archivos

```
src/Views/componentsApp/
├── Navbars/
│   ├── AppNavbar.js          # Navbar personalizado
│   └── index.js
├── Footer/
│   ├── AppFooter.js          # Footer personalizado
│   └── index.js
├── Sidenav/                  # ⭐ NUEVO
│   ├── AppSidenav.js         # Sidenav personalizado
│   ├── README.md             # Documentación del sidenav
│   └── index.js
├── Layouts/
│   ├── AppDashboardLayout.js # Layout con navbar y footer
│   ├── AppSidenavLayout.js   # ⭐ NUEVO - Layout completo con sidenav
│   └── index.js
├── Dashboards/
│   ├── AppDefaultDashboard.js # Dashboard personalizado
│   └── index.js
├── Pages/                     # ⭐ NUEVO
│   ├── UsersPage.js          # Página de usuarios con sidenav
│   └── index.js
├── routes.js                  # Rutas personalizadas
├── README.md                  # Este archivo
└── index.js                   # Exportaciones principales
```

## 🎯 Casos de Uso

### 1. **Dashboard Simple**
- Usar `AppDashboardLayout` con `AppNavbar` y `AppFooter`
- Ideal para páginas sin navegación lateral

### 2. **Página con Navegación Lateral**
- Usar `AppSidenavLayout` con `AppSidenav`
- Perfecto para páginas que requieren menú lateral

### 3. **Página de Usuarios**
- Usar `UsersPage` que ya incluye `AppSidenavLayout`
- Ejemplo completo de implementación

## 🚨 Notas Importantes

1. **Importaciones**: Usar siempre las importaciones desde `Views/componentsApp`
2. **Rutas**: Las rutas personalizadas están en `routes.js`
3. **Temas**: Los componentes usan el sistema de temas de Soft UI
4. **Responsive**: Todos los componentes son responsive por defecto
5. **Estado**: El sidenav maneja automáticamente el estado de los menús

## 🔗 Rutas Disponibles

- `/app-dashboard` - Dashboard personalizado
- `/users-sidenav` - ⭐ **NUEVO** - Página de usuarios con sidenav
- `/dashboards/default` - Dashboard estándar del tema

## 📚 Documentación Adicional

- **AppSidenav**: Ver `Sidenav/README.md` para documentación completa
- **Componentes**: Cada componente tiene comentarios detallados en el código
- **Ejemplos**: Ver `UsersPage.js` para ejemplo de implementación completa

## 🆕 Novedades en esta Versión

### ✨ **AppSidenav** - Menú Lateral Personalizado
- Navegación colapsable y anidada
- Estado persistente de menús
- Navegación automática
- Soporte completo para RTL

### ✨ **AppSidenavLayout** - Layout Completo
- Integra sidenav, navbar y footer
- Manejo automático de temas
- Soporte para RTL
- Layout responsive

### ✨ **UsersPage** - Página de Usuarios
- Página completa con sidenav
- Estadísticas y tablas
- Ejemplo de implementación
- Usa el nuevo layout

## 🚀 Próximos Pasos

1. **Probar la nueva página**: Visitar `/users-sidenav`
2. **Personalizar rutas**: Modificar `routes.js` según necesidades
3. **Crear nuevas páginas**: Usar `UsersPage.js` como plantilla
4. **Adaptar sidenav**: Personalizar colores y estilos
