# SidePanelRight Component

Componente de panel lateral reutilizable que se despliega desde la derecha para contener formularios y contenido en el sistema GestiaSoft. Diseñado con el mismo estilo y proporciones que el panel de gestión de la plantilla.

## Características

- **Reutilizable**: Se adapta a diferentes tipos de contenido
- **Responsivo**: Diseño adaptativo para diferentes tamaños de pantalla
- **Personalizable**: Título, subtítulo y opciones configurables
- **Accesible**: Navegación por teclado y lectores de pantalla
- **Consistente**: Sigue el diseño del sistema Soft UI Dashboard PRO
- **Estilo Mejorado**: Mismas proporciones y diseño que el panel de gestión
- **Botón X Superior**: Botón de cerrar siempre visible en la parte superior derecha

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Controla si el panel está visible |
| `onClose` | `function` | ✅ | - | Función llamada al cerrar el panel |
| `title` | `string` | ❌ | "Panel" | Título principal del panel |
| `subtitle` | `string` | ❌ | "Descripción del panel" | Subtítulo descriptivo |
| `children` | `node` | ✅ | - | Contenido del panel |
| `showCloseButton` | `boolean` | ❌ | `true` | Si mostrar el botón de cerrar |
| `showDivider` | `boolean` | ❌ | `true` | Si mostrar el divisor bajo el header |

## Estilos y Proporciones

### Ancho Responsivo
- **xs (móviles)**: 100% del ancho de pantalla
- **sm (tablets)**: 350px
- **md (desktop)**: 400px
- **lg (pantallas grandes)**: 450px

### Padding Interno
- **xs**: 0 8px
- **sm**: 0 12px
- **md**: 0 16px

### Sombra y Bordes
- Sombra: `0 0 20px 0 rgba(0, 0, 0, 0.1)`
- Sin bordes redondeados
- Altura completa de la ventana

### Botón de Cerrar
- **Posición**: Siempre en la parte superior derecha del header
- **Estilo**: Icono X con fondo sutil y efectos hover
- **Tamaño**: Large para mejor accesibilidad

## Ejemplos de Uso

### 1. Panel Básico
```jsx
<SidePanelRight
  open={isOpen}
  onClose={handleClose}
  title="Mi Panel"
  subtitle="Descripción del contenido del panel"
>
  <div>Contenido del panel</div>
</SidePanelRight>
```

### 2. Panel Personalizado
```jsx
<SidePanelRight
  open={isOpen}
  onClose={handleClose}
  title="Formulario de Usuario"
  subtitle="Crear o editar información de usuario"
  showDivider={false}
>
  <UserForm />
</SidePanelRight>
```

### 3. Panel sin Botón de Cerrar
```jsx
<SidePanelRight
  open={isOpen}
  onClose={handleClose}
  title="Información de Ayuda"
  subtitle="Guía de uso del sistema"
  showCloseButton={false}
>
  <HelpContent />
</SidePanelRight>
```

## Integración

El componente está disponible en:
```jsx
import { SidePanelRight } from "Views/componentsApp";
```

## Casos de Uso Comunes

- **Formularios**: Creación y edición de registros
- **Paneles de Información**: Detalles y estadísticas
- **Configuración**: Ajustes del sistema
- **Ayuda**: Documentación y guías
- **Búsqueda Avanzada**: Filtros y opciones de búsqueda
- **Timeline**: Seguimiento de procesos

## Diferencias con la Versión Anterior

- ✅ **Ancho fijo responsivo** en lugar de ancho personalizable
- ✅ **Subtítulo** agregado al header
- ✅ **Botón de cerrar** siempre en la parte superior derecha como X
- ✅ **Estilos consistentes** con el panel de gestión de la plantilla
- ✅ **Padding interno** optimizado para mejor legibilidad
- ✅ **Sombra mejorada** para mayor profundidad visual
- ✅ **Validaciones inmediatas** en los formularios
- ✅ **Layout descendente** para mejor flujo de trabajo
