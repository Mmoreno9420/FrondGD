# Gestión de Usuarios - API Documentation

## Endpoint Principal
```
POST /api/usuarios/manage
```

## Estructura del Payload

Todas las operaciones utilizan el mismo endpoint con diferentes valores de `accion`:

```json
{
  "accion": 5,
  "user_id": 1,
  "data": {}
}
```

## Operaciones Disponibles

### 1. Listar Usuarios (accion: 5)
```json
{
  "accion": 5,
  "user_id": 1,
  "data": {}
}
```

### 2. Obtener Detalle de Usuario (accion: 4)
```json
{
  "accion": 4,
  "user_id": 1,
  "data": {
    "user_id": 123
  }
}
```

### 3. Crear Usuario (accion: 1)
```json
{
  "accion": 1,
  "user_id": 1,
  "data": {
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "123456789"
  }
}
```

### 4. Actualizar Usuario (accion: 2)
```json
{
  "accion": 2,
  "user_id": 1,
  "data": {
    "id": 123,
    "nombre": "Juan Pérez Actualizado",
    "email": "juan.nuevo@ejemplo.com"
  }
}
```

### 5. Eliminar Usuario (accion: 3)
```json
{
  "accion": 3,
  "user_id": 1,
  "data": {
    "user_id": 123
  }
}
```

## Uso en React

### Importar el Hook
```javascript
import { useUserApi } from "../services/userService";
```

### Usar en Componente
```javascript
const MyComponent = () => {
    const {
        users,
        loading,
        error,
        listUsers,
        getUserDetail,
        createUserWithManage,
        updateUserWithManage,
        deleteUserWithManage
    } = useUserApi();

    // Cargar lista de usuarios
    useEffect(() => {
        listUsers(1); // user_id: 1
    }, []);

    // Crear usuario
    const handleCreate = async (userData) => {
        await createUserWithManage(1, userData);
    };

    // Actualizar usuario
    const handleUpdate = async (userId, userData) => {
        await updateUserWithManage(1, { id: userId, ...userData });
    };

    // Eliminar usuario
    const handleDelete = async (userId) => {
        await deleteUserWithManage(1, userId);
    };

    return (
        <div>
            {loading && <div>Cargando...</div>}
            {error && <div>Error: {error.message}</div>}
            {users.map(user => (
                <div key={user.id}>{user.nombre}</div>
            ))}
        </div>
    );
};
```

## Constantes de Operaciones

```javascript
import { API_OPERTATIONS } from "../config/apiConfig";

// Valores disponibles:
API_OPERTATIONS.Insert  // 1 - Crear
API_OPERTATIONS.edit    // 2 - Actualizar
API_OPERTATIONS.delete  // 3 - Eliminar
API_OPERTATIONS.detail  // 4 - Obtener detalle
API_OPERTATIONS.list    // 5 - Listar
```

## Manejo de Errores

El servicio maneja automáticamente:
- Errores de red
- Timeouts
- Errores de autenticación (401)
- Errores de autorización (403)
- Errores de validación (422)
- Errores del servidor (500)

## Ejemplo Completo

Ver el archivo `src/examples/UserManagementExample.js` para un ejemplo completo de implementación.

## Notas Importantes

1. **user_id**: Siempre debe ser el ID del usuario que está realizando la operación
2. **accion**: Determina qué operación se realizará
3. **data**: Contiene los datos específicos de la operación
4. Todas las operaciones son POST al mismo endpoint
5. El servicio maneja automáticamente los headers de autorización





