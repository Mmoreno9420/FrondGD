# UserDetail Component

Componente de formulario para crear y editar usuarios en el sistema GestiaSoft, diseñado con un estilo moderno y elegante basado en la plantilla Soft UI Dashboard PRO.

## Características

- **Modo Dual**: Soporta creación y edición de usuarios
- **Validación Completa**: Validaciones en tiempo real con mensajes de error
- **Diseño Moderno**: Interfaz estilizada con iconos y colores consistentes
- **Responsivo**: Se adapta a diferentes tamaños de pantalla
- **Accesible**: Navegación por teclado y validaciones claras

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `user` | `object` | ❌ | `null` | Datos del usuario para edición |
| `mode` | `"create" \| "edit"` | ❌ | `"create"` | Modo del formulario |
| `onSave` | `function` | ✅ | - | Función llamada al guardar |
| `onCancel` | `function` | ✅ | - | Función llamada al cancelar |
| `loading` | `boolean` | ❌ | `false` | Estado de carga del formulario |

## Estructura del Formulario

### 1. Header Informativo
- **Modo Creación**: Fondo azul primario con título "Nuevo Usuario"
- **Modo Edición**: Fondo azul informativo con título "Editar Usuario"
- Incluye descripción contextual del modo actual

### 2. Información Personal
- **ID de Usuario**: Solo visible en modo edición, campo bloqueado
- **Nombre Completo**: Campo requerido, bloqueado en modo edición
- **Correo Electrónico**: Campo requerido con validación de email

### 3. Información Organizacional
- **Rol del Usuario**: Select con opciones predefinidas
- **Departamento**: Select con departamentos del sistema
- **Estado del Usuario**: Switch toggle con indicadores visuales

### 4. Validaciones

#### Nombre
- Requerido
- Mínimo 2 caracteres
- Máximo 100 caracteres

#### Email
- Requerido
- Formato válido de email
- Máximo 100 caracteres

#### Rol
- Requerido
- Debe seleccionarse de la lista

#### Departamento
- Requerido
- Debe seleccionarse de la lista

## Opciones Predefinidas

### Roles Disponibles
- Administrador
- Usuario
- Supervisor
- Auditor

### Departamentos Disponibles
- Tecnología de la Información
- Recursos Humanos
- Finanzas
- Salud Pública
- Epidemiología
- Logística
- Compras
- Atención al Ciudadano

## Estados del Formulario

### Modo Creación
- Formulario vacío
- Todos los campos editables
- Header azul primario
- Título "Nuevo Usuario"

### Modo Edición
- Formulario prellenado con datos del usuario
- Campo ID bloqueado y visible
- Campo nombre bloqueado
- Header azul informativo
- Título "Editar Usuario"

## Integración

```jsx
import UserDetail from "./UserDetail";

// En modo creación
<UserDetail
  mode="create"
  onSave={handleSave}
  onCancel={handleCancel}
  loading={isLoading}
/>

// En modo edición
<UserDetail
  user={userData}
  mode="edit"
  onSave={handleSave}
  onCancel={handleCancel}
  loading={isLoading}
/>
```

## Estilos y Diseño

- **Cards**: Cada sección está en una tarjeta con sombras y bordes
- **Iconos**: Iconos descriptivos para cada campo y sección
- **Colores**: Paleta de colores consistente con el sistema
- **Espaciado**: Espaciado uniforme y respirable
- **Tipografía**: Jerarquía visual clara con SoftTypography

## Funcionalidades

- **Validación en Tiempo Real**: Los errores se muestran al perder el foco
- **Estado de Carga**: Indicador visual durante el guardado
- **Manejo de Errores**: Alertas claras para errores de validación
- **Responsividad**: Adaptación automática a diferentes tamaños de pantalla
- **Accesibilidad**: Navegación por teclado y mensajes de error claros
