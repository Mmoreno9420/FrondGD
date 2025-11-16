# Pantalla de Gestiones

## 📋 Descripción

Pantalla para la gestión de flujos de trabajo y gestiones activas del sistema. Permite visualizar, crear, editar y eliminar gestiones, manteniendo el mismo estilo visual y funcionalidad de la pantalla de Usuarios.

## 🎯 Características Principales

### Columnas Visibles en la Tabla
- **ID de gestión** (`gestion_id`)
- **Nombre de gestión** (`nombre_gestion`)
- **Estado** (`estado_nombre`) - Con badge colorido
- **Prioridad** (`prioridad_nombre`) - Con badge colorido
- **Paso actual** (`nombre_paso` + `paso_numero`)
- **Unidades atendiendo** - Mostradas como chips
- **Fecha de creación** (`fecha_creacion`)

### Información Oculta (Visible en Panel Lateral)
- Descripción (`descripcion`)
- Descripción del paso (`descripcion_paso`)
- Fecha de llegada al paso (`fecha_llegada_paso`)
- ID de flujo (`workflow_id`)
- Tipo de flujo (`tipo_flujo_id`)
- Estado del flujo (`estado_flujo`)

## 🚀 Funcionalidades

### 1. Listado de Gestiones
- Tabla interactiva con Material React Table v1
- Ordenamiento por columnas
- Filtrado global
- Paginación
- Búsqueda

### 2. Acciones Disponibles
- **Ver detalles** - Abre panel lateral con toda la información
- **Editar** - Permite modificar la gestión
- **Eliminar** - Con confirmación previa
- **Crear nueva gestión** - Botón en el encabezado

### 3. Panel Lateral (SidePanelRight)
- **Modo Vista**: Muestra toda la información organizada en tarjetas
- **Modo Editar**: Formulario para modificar datos
- **Modo Crear**: Formulario para nueva gestión

## 📁 Estructura de Archivos

```
src/Views/Gestiones/Gestion/
├── Gestiones.js          # Componente principal con tabla
├── GestionDetail.js      # Panel lateral para ver/editar/crear
├── index.js              # Exportación del componente
└── README.md             # Este archivo
```

## 🔌 Servicios y Hooks

### Servicio: `gestionService.js`
```javascript
// Ubicación: src/services/gestionService.js

// Métodos disponibles:
- listGestiones(userId)
- getGestionDetail(userId, gestionId)
- createGestion(userId, gestionData)
- updateGestion(userId, gestionData)
- deleteGestion(userId, gestionId)
```

### Hook: `useGestiones.js`
```javascript
// Ubicación: src/hooks/useGestiones.js

// Estado y métodos:
const {
  gestiones,          // Array de gestiones
  loading,            // Estado de carga
  error,              // Errores
  pagination,         // Info de paginación
  filters,            // Filtros activos
  fetchGestiones,     // Recargar gestiones
  createGestion,      // Crear nueva
  updateGestion,      // Actualizar existente
  deleteGestion,      // Eliminar
  getGestionDetail,   // Obtener detalles
  searchGestiones,    // Buscar
  filterByEstado,     // Filtrar por estado
  filterByPrioridad,  // Filtrar por prioridad
  hasGestiones,       // Boolean: tiene gestiones
  totalGestiones      // Total de gestiones
} = useGestiones();
```

## 🎨 Estilos y Colores

### Estados (Badges)
- **Completado/Finalizado**: Verde (`success`)
- **En progreso/Activo**: Azul (`info`)
- **Pendiente**: Naranja (`warning`)
- **Cancelado/Rechazado**: Rojo (`error`)

### Prioridades (Badges)
- **Alta/Urgente**: Rojo (`error`)
- **Media**: Naranja (`warning`)
- **Baja**: Azul (`info`)

### Unidades (Chips)
- Fondo: Azul claro (`#e3f2fd`)
- Texto: Azul (`#1976d2`)

## 📡 API Endpoint

```javascript
POST /api/gestiones/manage

// Payload:
{
  "accion": "list" | "detail" | "insert" | "edit" | "delete",
  "user_id": 1,
  // ... otros datos según la acción
}
```

## 🔗 Ruta en el Menú

- **Ubicación**: Gestiones > Gestión
- **Ruta**: `/gestiones/gestion`
- **Key**: `gestiones-main`

## 📊 Formato de Datos (API Response)

```json
[
  {
    "gestion_id": 22,
    "nombre_gestion": "Revisión de servidores",
    "descripcion": "Monitoreo preventivo de racks eléctricos",
    "estado_nombre": "En progreso",
    "prioridad_nombre": "Alta",
    "tipo_flujo_id": 1,
    "fecha_creacion": "2025-10-07T20:15:00Z",
    "workflow_id": 9,
    "paso_numero": 3,
    "nombre_paso": "Revisión técnica",
    "descripcion_paso": "Evaluación del equipo eléctrico",
    "fecha_llegada_paso": "2025-10-08T09:30:00Z",
    "estado_flujo": "Activo",
    "unidades_atendiendo": [
      {
        "unidad_id": 3,
        "nombre_unidad": "Departamento de Infraestructura"
      },
      {
        "unidad_id": 4,
        "nombre_unidad": "Seguridad de red"
      }
    ]
  }
]
```

## 🛠️ Mejoras Implementadas vs. Pantalla de Usuarios

1. ✅ **Colores corregidos**: Todos los badges usan los colores del tema
2. ✅ **Chips para unidades**: Visualización moderna y clara
3. ✅ **Panel lateral organizado**: Información agrupada en tarjetas
4. ✅ **Tres modos**: Ver, Editar y Crear
5. ✅ **Validación de colores**: No hay colores hardcodeados inválidos
6. ✅ **Consistencia visual**: Mismo estilo que el resto del sistema

## 🎯 Uso

```javascript
import Gestiones from "Views/Gestiones/Gestion";

// En el router o menú:
<Route path="/gestiones/gestion" element={<Gestiones />} />
```

## 📝 Notas

- Los datos secundarios (descripción, fechas, etc.) solo se muestran en el panel lateral
- El modo "view" es de solo lectura y muestra toda la información
- Los modos "create" y "edit" muestran un formulario simplificado
- La tabla es completamente responsive y se adapta a móviles y tablets
- Los colores de estados y prioridades son consistentes en toda la aplicación

## ✨ Próximas Mejoras

- [ ] Agregar más filtros avanzados
- [ ] Implementar exportación a Excel/PDF
- [ ] Agregar gráficos de estadísticas
- [ ] Implementar búsqueda avanzada
- [ ] Agregar notificaciones de cambios
- [ ] Implementar historial de cambios

---

**Creado**: 2025
**Última actualización**: 2025
**Autor**: GestiaSoft Development Team











