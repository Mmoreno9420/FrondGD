/**
=========================================================
* GestiaSoft - Role Permissions Configuration
=========================================================
* Configuración centralizada de permisos por rol
* 
* @description
* Este archivo contiene la configuración de qué puede ver/hacer cada rol.
* Es fácil de administrar y modificar sin tocar el código de componentes.
*/

/**
 * IDs de roles del sistema
 */
export const ROL_IDS = {
    ADMINISTRADOR: 1,
    GESTOR: 2,
    USUARIO: 3,
};

/**
 * Permisos de visualización de gestiones
 */
export const GESTIONES_VIEW_PERMISSIONS = {
    [ROL_IDS.ADMINISTRADOR]: {
        canViewAll: true,          // Ver todas las gestiones
        canViewByUnit: true,       // Ver gestiones por unidad (redundante con canViewAll)
        description: "Administrador - Ve todas las gestiones",
    },
    [ROL_IDS.GESTOR]: {
        canViewAll: true,          // Ve todas las gestiones (igual que admin)
        canViewByUnit: true,       // También puede filtrar por unidad
        description: "Gestor - Ve todas las gestiones",
    },
    [ROL_IDS.USUARIO]: {
        canViewAll: false,         // Solo ve gestiones de su unidad
        canViewByUnit: true,       // Ve gestiones filtradas por su unidad
        description: "Usuario - Solo ve gestiones de su unidad",
    },
};

/**
 * Permisos de acciones sobre gestiones
 */
export const GESTIONES_ACTION_PERMISSIONS = {
    [ROL_IDS.ADMINISTRADOR]: {
        canCreate: true,           // Crear gestiones
        canEdit: true,             // Editar gestiones
        canDelete: true,           // Eliminar gestiones
        canInactivate: true,       // Inactivar gestiones
        canReactivate: true,       // Reactivar gestiones
        canViewDetails: true,      // Ver detalles
        description: "Administrador - Acceso completo",
    },
    [ROL_IDS.GESTOR]: {
        canCreate: true,           // Crear gestiones
        canEdit: true,             // Editar gestiones
        canDelete: true,           // Eliminar gestiones
        canInactivate: true,       // Inactivar gestiones
        canReactivate: true,       // Reactivar gestiones
        canViewDetails: true,      // Ver detalles
        description: "Gestor - Acceso completo",
    },
    [ROL_IDS.USUARIO]: {
        canCreate: false,          // No puede crear gestiones
        canEdit: false,            // No puede editar gestiones
        canDelete: false,          // No puede eliminar gestiones
        canInactivate: false,      // No puede inactivar gestiones
        canReactivate: false,      // No puede reactivar gestiones
        canViewDetails: true,      // Solo puede ver detalles
        description: "Usuario - Solo visualización",
    },
};

/**
 * Permisos de gestión de usuarios
 */
export const USERS_PERMISSIONS = {
    [ROL_IDS.ADMINISTRADOR]: {
        canManage: true,           // Gestionar usuarios
        canView: true,             // Ver usuarios
        canCreate: true,           // Crear usuarios
        canEdit: true,             // Editar usuarios
        canDelete: true,           // Eliminar usuarios
        description: "Administrador - Gestión completa de usuarios",
    },
    [ROL_IDS.GESTOR]: {
        canManage: false,          // No puede gestionar usuarios
        canView: false,            // No puede ver usuarios
        canCreate: false,          // No puede crear usuarios
        canEdit: false,            // No puede editar usuarios
        canDelete: false,          // No puede eliminar usuarios
        description: "Gestor - Sin acceso a gestión de usuarios",
    },
    [ROL_IDS.USUARIO]: {
        canManage: false,          // No puede gestionar usuarios
        canView: false,            // No puede ver usuarios
        canCreate: false,          // No puede crear usuarios
        canEdit: false,            // No puede editar usuarios
        canDelete: false,          // No puede eliminar usuarios
        description: "Usuario - Sin acceso a gestión de usuarios",
    },
};

/**
 * Función helper para verificar si un rol puede ver todas las gestiones
 * 
 * @param {number} rolId - ID del rol
 * @returns {boolean} - true si puede ver todas, false si solo su unidad
 */
export const canViewAllGestiones = (rolId) => {
    return GESTIONES_VIEW_PERMISSIONS[rolId]?.canViewAll || false;
};

/**
 * Función helper para verificar si un rol puede realizar una acción específica
 * 
 * @param {number} rolId - ID del rol
 * @param {string} action - Acción a verificar (canCreate, canEdit, canDelete, canInactivate, canReactivate)
 * @returns {boolean} - true si puede realizar la acción
 */
export const canPerformAction = (rolId, action) => {
    return GESTIONES_ACTION_PERMISSIONS[rolId]?.[action] || false;
};

/**
 * Función helper para verificar si un rol puede acceder a gestión de usuarios
 * 
 * @param {number} rolId - ID del rol
 * @param {string} action - Acción específica (canManage, canView, canCreate, etc.)
 * @returns {boolean} - true si puede realizar la acción
 */
export const canManageUsers = (rolId, action = 'canManage') => {
    return USERS_PERMISSIONS[rolId]?.[action] || false;
};

/**
 * Exportar configuración completa
 */
export default {
    ROL_IDS,
    GESTIONES_VIEW_PERMISSIONS,
    GESTIONES_ACTION_PERMISSIONS,
    USERS_PERMISSIONS,
    canViewAllGestiones,
    canPerformAction,
    canManageUsers,
};
