# AppFooter - Footer Personalizado

## Descripción
El `AppFooter` es un componente de footer simplificado y personalizado para la aplicación GestiaSoft, basado en el footer estándar de Soft UI Dashboard PRO React pero adaptado a las necesidades específicas del proyecto.

## Características

### 🎨 **Diseño Simplificado**
- **Footer limpio** con información esencial
- **Bordes sutiles** para separación visual
- **Colores consistentes** con el tema de la aplicación
- **Responsive** para todos los dispositivos

### 🔗 **Enlaces de Navegación**
- **Perfil** - Enlace al perfil del usuario
- **Reportes** - Acceso a reportes del sistema
- **Configuración** - Configuración de la cuenta
- **Dashboard** - Acceso al dashboard principal

### 📱 **Responsive Design**
- **Desktop**: Enlaces en línea horizontal
- **Mobile**: Enlaces apilados verticalmente
- **Adaptativo**: Se ajusta automáticamente al tamaño de pantalla

## Uso

### **Importación Básica**
```jsx
import { AppFooter } from "Views/componentsApp/Footer";

function MyComponent() {
  return <AppFooter />;
}
```

### **Con Configuración Personalizada**
```jsx
import { AppFooter } from "Views/componentsApp/Footer";

function MyComponent() {
  const customCompany = {
    href: "/",
    name: "Mi Empresa"
  };

  const customLinks = [
    { href: "/dashboard", name: "Inicio" },
    { href: "/usuarios", name: "Usuarios" },
    { href: "/configuracion", name: "Configuración" }
  ];

  return (
    <AppFooter 
      company={customCompany}
      links={customLinks}
    />
  );
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `company` | `object` | `{ href: "/", name: "GestiaSoft" }` | Información de la empresa |
| `links` | `array` | Enlaces predefinidos | Array de enlaces de navegación |

### **Estructura de Props**

#### Company Object
```jsx
{
  href: "/",           // URL de la empresa
  name: "GestiaSoft"     // Nombre de la empresa
}
```

#### Links Array
```jsx
[
  {
    href: "/ruta",      // URL del enlace
    name: "Nombre"      // Texto del enlace
  }
]
```

## Implementación en Layouts

### **En AppDashboardLayout (Recomendado)**
El footer ya está integrado en `AppDashboardLayout` y se posiciona automáticamente al final de la página:

```jsx
import { AppDashboardLayout } from "Views/componentsApp/Layouts";

function MyDashboard() {
  return (
    <AppDashboardLayout>
      {/* Contenido del dashboard */}
      <h1>Mi Dashboard</h1>
    </AppDashboardLayout>
  );
}
```

### **En App.js (Alternativa)**
Para usar el footer en lugar del layout estándar, descomenta las líneas en `App.js`:

```jsx
{/* 
Custom AppNavbar and AppFooter - Uncomment to use instead of Sidenav:
<AppNavbar />
<AppFooter />
*/}
```

## Personalización

### **Cambiar Colores**
```jsx
// En el componente AppFooter
<SoftTypography variant="button" fontWeight="medium" color="primary">
  {name}
</SoftTypography>
```

### **Modificar Enlaces**
```jsx
// En el componente AppFooter
const defaultLinks = [
  { href: "/mi-ruta", name: "Mi Enlace" },
  // ... más enlaces
];
```

### **Ajustar Espaciado**
```jsx
// En el componente AppFooter
<SoftBox
  component="footer"
  py={4}        // Padding vertical
  px={3}        // Padding horizontal
  mt="auto"     // Margen superior automático
>
```

## Estructura del Componente

```
AppFooter/
├── AppFooter.js          # Componente principal
├── index.js             # Exportación
└── README.md            # Documentación
```

## Integración con el Sistema

- **Tema**: Utiliza el sistema de temas de Soft UI Dashboard PRO React
- **Tipografía**: Aprovecha las configuraciones de tipografía del tema
- **Colores**: Se adapta automáticamente al esquema de colores
- **Breakpoints**: Responsive usando los breakpoints del tema

## Ventajas

✅ **Consistencia visual** con el resto de la aplicación  
✅ **Fácil personalización** mediante props  
✅ **Responsive design** automático  
✅ **Integración nativa** con el sistema de temas  
✅ **Mantenimiento simple** y código limpio  
✅ **Reutilizable** en diferentes partes de la aplicación

















