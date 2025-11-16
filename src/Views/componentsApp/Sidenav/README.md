# AppSidenav - Sidenav Personalizado

## 📋 Descripción

`AppSidenav` es un sidenav personalizado basado en el template original de Soft UI Dashboard PRO React, pero adaptado específicamente para la aplicación GestiaSoft.

## ✨ Características

- **Navegación Colapsable**: Menús que se expanden y contraen
- **Navegación Anidada**: Soporte para submenús
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Tema Integrado**: Utiliza el sistema de temas de Soft UI
- **Estado Persistente**: Mantiene el estado de los menús abiertos
- **Navegación Automática**: Abre automáticamente la sección correspondiente

## 🚀 Uso

### Importación Básica

```jsx
import { AppSidenav } from "Views/componentsApp";

function MyComponent() {
  const routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: "dashboard",
      route: "/dashboard",
    },
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
    <AppSidenav
      routes={routes}
      brandName="GestiaSoft"
      color="info"
    />
  );
}
```

### Con Layout Personalizado

```jsx
import { AppSidenavLayout } from "Views/componentsApp";

function UsersPage() {
  const customRoutes = [
    {
      type: "collapse",
      name: "Usuarios",
      key: "users",
      icon: "people",
      collapse: [
        {
          name: "Reportes",
          key: "reports",
          route: "/pages/users/reports",
        },
        {
          name: "Nuevo Usuario",
          key: "new-user",
          route: "/pages/users/new-user",
        },
      ],
    },
  ];

  return (
    <AppSidenavLayout routes={customRoutes} brandName="GestiaSoft">
      {/* Contenido de la página */}
    </AppSidenavLayout>
  );
}
```

## 🔧 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|------------|-------------|
| `routes` | `Array` | ✅ | Array de rutas para el sidenav |
| `brandName` | `String` | ✅ | Nombre de la marca |
| `color` | `String` | ❌ | Color del sidenav (default: "info") |
| `brand` | `String` | ❌ | URL del logo de la marca |

## 📁 Estructura de Rutas

### Tipos de Ruta

#### 1. **collapse** - Menú Colapsable
```jsx
{
  type: "collapse",
  name: "Usuarios",
  key: "users",
  icon: "people",
  collapse: [
    // Submenús aquí
  ],
}
```

#### 2. **title** - Título de Sección
```jsx
{
  type: "title",
  title: "Pantallas",
  key: "title-pages"
}
```

#### 3. **divider** - Separador
```jsx
{
  type: "divider"
}
```

### Propiedades de Ruta

| Propiedad | Descripción |
|-----------|-------------|
| `type` | Tipo de elemento (`collapse`, `title`, `divider`) |
| `name` | Nombre visible en el sidenav |
| `key` | Identificador único |
| `icon` | Icono de Material-UI |
| `route` | Ruta de navegación |
| `collapse` | Array de submenús |
| `href` | Enlace externo |
| `noCollapse` | Si es true, no se puede colapsar |

## 🎨 Personalización

### Colores Disponibles

- `primary`
- `secondary`
- `info`
- `success`
- `warning`
- `error`
- `dark`

### Iconos

Utiliza iconos de Material-UI. Ejemplos:
- `dashboard`
- `people`
- `settings`
- `person`
- `assessment`

## 📱 Responsive

- **Desktop**: Sidenav completo visible
- **Tablet**: Sidenav mini con hover para expandir
- **Mobile**: Sidenav oculto con botón para mostrar

## 🔄 Estado

El sidenav mantiene automáticamente:
- Menús abiertos/cerrados
- Navegación activa
- Estado responsive
- Posición del scroll

## 📝 Ejemplo Completo

```jsx
import { AppSidenavLayout } from "Views/componentsApp";

function MyPage() {
  const routes = [
    {
      type: "collapse",
      name: "Dashboard",
      key: "dashboard",
      icon: "dashboard",
      route: "/dashboard",
    },
    { type: "title", title: "Gestión", key: "title-gestion" },
    {
      type: "collapse",
      name: "Usuarios",
      key: "users",
      icon: "people",
      collapse: [
        {
          name: "Lista",
          key: "list",
          route: "/users/list",
        },
        {
          name: "Crear",
          key: "create",
          route: "/users/create",
        },
      ],
    },
    {
      type: "collapse",
      name: "Configuración",
      key: "settings",
      icon: "settings",
      route: "/settings",
    },
  ];

  return (
    <AppSidenavLayout routes={routes} brandName="GestiaSoft">
      <h1>Mi Página</h1>
      <p>Contenido de la página aquí...</p>
    </AppSidenavLayout>
  );
}
```

## 🚨 Notas Importantes

1. **Rutas Únicas**: Cada ruta debe tener un `key` único
2. **Iconos Válidos**: Usar solo iconos válidos de Material-UI
3. **Navegación**: Las rutas deben coincidir con las configuradas en React Router
4. **Estado**: El sidenav maneja automáticamente el estado de los menús

## 🔗 Dependencias

- React Router DOM
- Material-UI
- Soft UI Dashboard PRO React
- Emotion (para estilos)

















