# ConfirmAlert Component

Componente de alerta de confirmación genérico y reutilizable para operaciones de eliminación o confirmación en el sistema GestiaSoft.

## Características

- **Reutilizable**: Se adapta a diferentes contextos
- **Responsivo**: Diseño adaptativo para diferentes tamaños de pantalla
- **Personalizable**: Colores, textos y etiquetas configurables
- **Accesible**: Navegación por teclado y lectores de pantalla
- **Consistente**: Sigue el diseño del sistema Soft UI Dashboard PRO

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `open` | `boolean` | ✅ | - | Controla si el alert está visible |
| `onClose` | `function` | ✅ | - | Función llamada al cerrar el alert |
| `onConfirm` | `function` | ✅ | - | Función llamada al confirmar la acción |
| `title` | `string` | ❌ | "Confirmar Acción" | Título del alert |
| `message` | `string` | ❌ | "¿Estás seguro de que deseas continuar con esta acción?" | Mensaje principal |
| `confirmText` | `string` | ❌ | "Confirmar" | Texto del botón de confirmación |
| `cancelText` | `string` | ❌ | "Cancelar" | Texto del botón de cancelación |
| `severity` | `"warning" \| "error" \| "info"` | ❌ | "warning" | Nivel de severidad (afecta colores) |
| `itemName` | `string` | ❌ | "" | Nombre del elemento a mostrar |
| `showItemName` | `boolean` | ❌ | `false` | Si mostrar el nombre del elemento |
| `itemLabel` | `string` | ❌ | "Elemento" | Etiqueta personalizable para el elemento |

## Ejemplos de Uso

### 1. Eliminación de Usuario
```jsx
<ConfirmAlert
  open={deleteAlert.open}
  onClose={handleDeleteCancel}
  onConfirm={handleDeleteConfirm}
  title="Confirmar Eliminación"
  message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
  confirmText="Eliminar"
  cancelText="Cancelar"
  severity="error"
  itemName={user.nombre}
  showItemName={true}
  itemLabel="Usuario"
/>
```

### 2. Eliminación de Producto
```jsx
<ConfirmAlert
  open={deleteProductAlert.open}
  onClose={handleDeleteCancel}
  onConfirm={handleDeleteConfirm}
  title="Confirmar Eliminación de Producto"
  message="¿Estás seguro de que deseas eliminar este producto del catálogo?"
  confirmText="Eliminar Producto"
  cancelText="Mantener"
  severity="warning"
  itemName={product.nombre}
  showItemName={true}
  itemLabel="Producto"
/>
```

### 3. Confirmación de Acción Crítica
```jsx
<ConfirmAlert
  open={criticalActionAlert.open}
  onClose={handleCancel}
  onConfirm={handleConfirm}
  title="Acción Crítica"
  message="Esta acción cambiará permanentemente la configuración del sistema. ¿Deseas continuar?"
  confirmText="Continuar"
  cancelText="Cancelar"
  severity="error"
  itemName="Configuración del Sistema"
  showItemName={true}
  itemLabel="Configuración"
/>
```

### 4. Confirmación Simple (sin elemento)
```jsx
<ConfirmAlert
  open={simpleAlert.open}
  onClose={handleCancel}
  onConfirm={handleConfirm}
  title="Confirmar Cambios"
  message="¿Deseas guardar los cambios realizados?"
  confirmText="Guardar"
  cancelText="Descartar"
  severity="info"
/>
```

## Niveles de Severidad

### Warning (Naranja)
- Confirmaciones generales
- Acciones que requieren atención
- Cambios importantes

### Error (Rojo)
- Eliminaciones
- Acciones destructivas
- Operaciones críticas

### Info (Azul)
- Confirmaciones informativas
- Acciones de bajo riesgo
- Cambios menores

## Integración

El componente está disponible en:
```jsx
import { ConfirmAlert } from "Views/componentsApp";
```

## Estilos

- **Colores**: Se adaptan automáticamente según la severidad
- **Sombras**: Efectos visuales consistentes con el sistema
- **Tipografía**: Usa los componentes SoftTypography del sistema
- **Responsivo**: Se adapta a diferentes tamaños de pantalla

---

# AppNotification Component

Componente de notificación reutilizable para mostrar mensajes del sistema de manera consistente y estandarizada.

## Características

- **Reutilizable**: Componente genérico para cualquier tipo de notificación
- **Tipos múltiples**: Soporta success, error, warning e info
- **Consistente**: Usa el componente SoftSnackbar del sistema
- **Configurable**: Duración, título y mensaje personalizables
- **Accesible**: Integrado con el sistema de accesibilidad de Soft UI

## Props

| Prop | Tipo | Requerido | Default | Descripción |
|------|------|-----------|---------|-------------|
| `type` | `"success" \| "error" \| "warning" \| "info"` | ❌ | "info" | Tipo de notificación |
| `message` | `string` | ✅ | - | Mensaje a mostrar |
| `title` | `string` | ❌ | - | Título personalizado (opcional) |
| `duration` | `number` | ❌ | 5000 | Duración en milisegundos |
| `open` | `boolean` | ❌ | false | Controla si está visible |
| `onClose` | `function` | ✅ | - | Función llamada al cerrar |

## Ejemplos de Uso

### 1. Notificación de Éxito
```jsx
import { AppNotification } from "Views/componentsApp/Alert";

const [notification, setNotification] = useState({
  open: false,
  type: 'success',
  message: ''
});

const showSuccess = () => {
  setNotification({
    open: true,
    type: 'success',
    message: 'Usuario creado exitosamente'
  });
};

<AppNotification
  type={notification.type}
  message={notification.message}
  open={notification.open}
  onClose={() => setNotification(prev => ({ ...prev, open: false }))}
/>
```

### 2. Notificación de Error
```jsx
<AppNotification
  type="error"
  message="Error de conexión: Tiempo de espera agotado"
  open={errorNotification.open}
  onClose={() => setErrorNotification(prev => ({ ...prev, open: false }))}
  duration={8000}
/>
```

### 3. Notificación de Advertencia
```jsx
<AppNotification
  type="warning"
  message="Advertencia: Los datos no han sido guardados"
  open={warningNotification.open}
  onClose={() => setWarningNotification(prev => ({ ...prev, open: false }))}
/>
```

### 4. Notificación Informativa
```jsx
<AppNotification
  type="info"
  message="Información: Sistema actualizado correctamente"
  open={infoNotification.open}
  onClose={() => setInfoNotification(prev => ({ ...prev, open: false }))}
/>
```

## Tipos de Notificación

### Success (Verde)
- Operaciones exitosas
- Guardado de datos
- Creación de elementos
- Actualizaciones completadas

### Error (Rojo)
- Errores de conexión
- Fallos en operaciones
- Validaciones fallidas
- Problemas del sistema

### Warning (Naranja)
- Advertencias importantes
- Datos no guardados
- Acciones pendientes
- Alertas de seguridad

### Info (Azul)
- Información general
- Actualizaciones del sistema
- Notificaciones informativas
- Consejos y tips

## Integración

El componente está disponible en:
```jsx
import { AppNotification } from "Views/componentsApp/Alert";
```

## Ejemplo Completo

Ver `ExampleUsage.js` para un ejemplo interactivo completo del componente.







