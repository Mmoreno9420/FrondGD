# AppTable - Componente de Tabla Reutilizable

## 📋 Descripción

`AppTable` es un componente de tabla completamente reutilizable que permite crear tablas de datos con configuración flexible, incluyendo columnas personalizables, acciones, búsqueda, paginación y estilos personalizados.

## ✨ Características

- **🔍 Búsqueda inteligente** - Búsqueda en tiempo real en campos específicos
- **📄 Paginación** - Paginación automática con opciones configurables
- **🎨 Tipos de columna** - Texto, estado, booleano, fecha, acciones
- **⚡ Acciones** - Botones de acción configurables por fila
- **🎯 Estilos personalizables** - Colores, alineación, anchos personalizables
- **📱 Responsive** - Se adapta a diferentes tamaños de pantalla
- **🔄 Estados** - Loading, vacío, con datos
- **🎭 Interactividad** - Clics en filas y acciones

## 🚀 Uso Básico

```jsx
import { AppTable } from "Views/componentsApp";

function MyComponent() {
  const columns = [
    { field: "id", header: "ID", type: "text" },
    { field: "nombre", header: "Nombre", type: "text" },
    { field: "estado", header: "Estado", type: "status" }
  ];

  const data = [
    { id: 1, nombre: "Juan", estado: "Activo" },
    { id: 2, nombre: "María", estado: "Inactivo" }
  ];

  return (
    <AppTable
      columns={columns}
      data={data}
      title="Mi Tabla"
    />
  );
}
```

## 📊 Configuración de Columnas

### Propiedades de Columna

| Propiedad | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `field` | string | Campo del objeto de datos | `"nombre"` |
| `header` | string | Título de la columna | `"Nombre"` |
| `type` | string | Tipo de columna | `"text"`, `"status"`, `"boolean"`, `"date"`, `"actions"` |
| `width` | string/number | Ancho de la columna | `"200px"`, `200` |
| `align` | string | Alineación del contenido | `"left"`, `"center"`, `"right"` |
| `render` | function | Renderizador personalizado | `(value, row) => <CustomComponent />` |

### Tipos de Columna

#### 1. **Text** (por defecto)
```jsx
{
  field: "nombre",
  header: "Nombre",
  type: "text"
}
```

#### 2. **Status** (con chips de colores)
```jsx
{
  field: "estado",
  header: "Estado",
  type: "status",
  statusConfig: {
    "Activo": "success",
    "Inactivo": "error",
    "Pendiente": "warning"
  }
}
```

#### 3. **Boolean** (Sí/No con chips)
```jsx
{
  field: "activo",
  header: "Activo",
  type: "boolean"
}
```

#### 4. **Date** (formato de fecha)
```jsx
{
  field: "fechaCreacion",
  header: "Fecha de Creación",
  type: "date"
}
```

#### 5. **Actions** (botones de acción)
```jsx
{
  field: "actions",
  header: "Acciones",
  type: "actions"
}
```

## 🎯 Configuración de Acciones

```jsx
const actions = [
  {
    label: "Ver",
    icon: <VisibilityIcon />,
    color: "info",
    tooltip: "Ver detalles",
    onClick: (row) => console.log("Ver:", row)
  },
  {
    label: "Editar",
    icon: <EditIcon />,
    color: "primary",
    tooltip: "Editar registro",
    onClick: (row) => console.log("Editar:", row)
  }
];
```

## ⚙️ Props del Componente

### Props Principales

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | array | `[]` | Configuración de columnas |
| `data` | array | `[]` | Datos a mostrar |
| `actions` | array | `[]` | Acciones por fila |

### Props de Funcionalidad

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `searchable` | boolean | `true` | Habilita barra de búsqueda |
| `pagination` | boolean | `true` | Habilita paginación |
| `searchPlaceholder` | string | `"Buscar..."` | Placeholder del campo de búsqueda |
| `searchFields` | array | `null` | Campos específicos para búsqueda |
| `customSearch` | function | `null` | Función de búsqueda personalizada |

### Props de Apariencia

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `title` | string | `"Tabla de Datos"` | Título de la tabla |
| `subtitle` | string | `""` | Subtítulo de la tabla |
| `showTitle` | boolean | `true` | Muestra/oculta título |
| `elevation` | number | `0` | Elevación del Paper |
| `dense` | boolean | `false` | Tabla compacta |
| `hover` | boolean | `true` | Efecto hover en filas |
| `striped` | boolean | `false` | Filas alternadas |

### Props de Paginación

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `rowsPerPageOptions` | array | `[5, 10, 25]` | Opciones de filas por página |
| `defaultRowsPerPage` | number | `10` | Filas por página por defecto |

### Props de Eventos

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `onRowClick` | function | `null` | Callback al hacer clic en fila |
| `onActionClick` | function | `null` | Callback al hacer clic en acción |
| `loading` | boolean | `false` | Estado de carga |

### Props de Estilos

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `customStyles` | object | `{}` | Estilos personalizados |
| `actionColumnWidth` | string | `"120px"` | Ancho de columna de acciones |

## 🎨 Estilos Personalizados

```jsx
const customStyles = {
  container: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px'
  },
  table: {
    '& .MuiTableCell-root': {
      borderColor: '#f0f0f0'
    }
  },
  row: {
    '&:hover': {
      backgroundColor: '#f5f5f5'
    }
  }
};

<AppTable
  customStyles={customStyles}
  // ... otras props
/>
```

## 📱 Ejemplo Completo

```jsx
import React, { useState } from "react";
import { AppTable } from "Views/componentsApp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function UsersTable() {
  const [users, setUsers] = useState([
    { id: 1, nombre: "Juan", email: "juan@email.com", estado: "Activo" },
    { id: 2, nombre: "María", email: "maria@email.com", estado: "Inactivo" }
  ]);

  const columns = [
    { field: "id", header: "ID", type: "text", width: "80px", align: "center" },
    { field: "nombre", header: "Nombre", type: "text", width: "200px" },
    { field: "email", header: "Email", type: "text", width: "250px" },
    { 
      field: "estado", 
      header: "Estado", 
      type: "status",
      statusConfig: {
        "Activo": "success",
        "Inactivo": "error"
      }
    },
    { field: "actions", header: "Acciones", type: "actions" }
  ];

  const actions = [
    {
      label: "Editar",
      icon: <EditIcon />,
      color: "primary",
      onClick: (user) => console.log("Editar:", user)
    },
    {
      label: "Eliminar",
      icon: <DeleteIcon />,
      color: "error",
      onClick: (user) => {
        if (window.confirm(`¿Eliminar a ${user.nombre}?`)) {
          setUsers(users.filter(u => u.id !== user.id));
        }
      }
    }
  ];

  return (
    <AppTable
      columns={columns}
      data={users}
      actions={actions}
      title="Gestión de Usuarios"
      subtitle="Administra los usuarios del sistema"
      searchable={true}
      pagination={true}
      onActionClick={(action, row) => action.onClick(row)}
      hover={true}
      striped={true}
    />
  );
}
```

## 🔧 Personalización Avanzada

### Renderizado Personalizado de Celdas

```jsx
{
  field: "avatar",
  header: "Avatar",
  type: "text",
  render: (value, row) => (
    <Avatar src={value} alt={row.nombre} />
  )
}
```

### Búsqueda Personalizada

```jsx
const customSearch = (data, searchTerm) => {
  return data.filter(item => 
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

<AppTable
  customSearch={customSearch}
  // ... otras props
/>
```

### Estilos de Columna Específicos

```jsx
{
  field: "estado",
  header: "Estado",
  type: "status",
  headerStyles: {
    backgroundColor: '#f5f5f5',
    fontWeight: 'bold'
  },
  cellStyles: {
    padding: '8px 4px'
  }
}
```

## 🎯 Casos de Uso Comunes

1. **Lista de Usuarios** - Con acciones de editar, eliminar, ver
2. **Reportes** - Solo lectura, con filtros y paginación
3. **Dashboard** - Tablas compactas con datos resumidos
4. **Formularios de búsqueda** - Con filtros avanzados
5. **Administración** - CRUD completo con validaciones

## 🚨 Consideraciones

- **Performance**: Para grandes volúmenes de datos, considera implementar virtualización
- **Accesibilidad**: Los tooltips y labels están incluidos por defecto
- **Responsive**: La tabla se adapta automáticamente a diferentes tamaños
- **Internacionalización**: Los textos están en español por defecto, pero se pueden personalizar

## 📚 Dependencias

- Material-UI v5
- React 16.8+
- Soft UI Dashboard PRO React
- PropTypes para validación

---

¡Con `AppTable` puedes crear tablas profesionales en minutos! 🎉

















