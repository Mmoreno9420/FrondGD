/**
=========================================================
* GestiaSoft - Permission Service
=========================================================
* Servicio específico para operaciones de permisos
*/

import { apiService } from "./api";
import { API_CONFIG, buildUrl } from "../config/apiConfig";

// Servicio de permisos
export const permissionService = {
    // Obtener lista de permisos
    getPermissions: async (userId, params = {}) => {
        try {
            const payload = {
                accion: 2, // Listar permisos
                user_id: userId,
                data: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    search: params.search || "",
                    status: params.status || "all",
                    ...params
                }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Obtener un permiso específico
    getPermission: async (userId, id) => {
        try {
            const payload = {
                accion: 3, // Obtener detalle de permiso
                user_id: userId,
                data: { id }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Crear un nuevo permiso
    createPermission: async (userId, permissionData) => {
        try {
            const payload = {
                accion: 1, // Crear permiso
                user_id: userId,
                data: permissionData
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar un permiso existente
    updatePermission: async (userId, id, permissionData) => {
        try {
            const payload = {
                accion: 4, // Actualizar permiso
                user_id: userId,
                data: { id, ...permissionData }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar un permiso
    deletePermission: async (userId, id) => {
        try {
            const payload = {
                accion: 5, // Eliminar permiso
                user_id: userId,
                data: { id }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Obtener permisos por módulo
    getPermissionsByModule: async (userId, module) => {
        try {
            const payload = {
                accion: 6, // Obtener permisos por módulo
                user_id: userId,
                data: { module }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Obtener permisos por acción
    getPermissionsByAction: async (userId, action) => {
        try {
            const payload = {
                accion: 7, // Obtener permisos por acción
                user_id: userId,
                data: { action }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Activar/desactivar permiso
    togglePermissionStatus: async (userId, id) => {
        try {
            const payload = {
                accion: 8, // Activar/desactivar permiso
                user_id: userId,
                data: { id }
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Obtener estadísticas de permisos
    getPermissionStats: async (userId) => {
        try {
            const payload = {
                accion: 9, // Obtener estadísticas de permisos
                user_id: userId,
                data: {}
            };
            const response = await apiService.post('/permisos/manage', payload);
            return response;
        } catch (error) {
            throw error;
        }
    },
};

// Hooks específicos para permisos usando useApi
import { useApi } from "../hooks/useApi";

export const usePermissionApi = () => {
    const { get, post, put, patch, delete: del } = useApi();

    return {
        // Obtener permisos
        getPermissions: (userId, params) => {
            const payload = {
                accion: 2,
                user_id: userId,
                data: params
            };
            return post('/permisos/manage', payload);
        },

        // Obtener permiso específico
        getPermission: (userId, id) => {
            const payload = {
                accion: 3,
                user_id: userId,
                data: { id }
            };
            return post('/permisos/manage', payload);
        },

        // Crear permiso
        createPermission: (userId, data) => {
            const payload = {
                accion: 1,
                user_id: userId,
                data: data
            };
            return post('/permisos/manage', payload);
        },

        // Actualizar permiso
        updatePermission: (userId, id, data) => {
            const payload = {
                accion: 4,
                user_id: userId,
                data: { id, ...data }
            };
            return post('/permisos/manage', payload);
        },

        // Eliminar permiso
        deletePermission: (userId, id) => {
            const payload = {
                accion: 5,
                user_id: userId,
                data: { id }
            };
            return post('/permisos/manage', payload);
        },

        // Toggle status
        togglePermissionStatus: (userId, id) => {
            const payload = {
                accion: 8,
                user_id: userId,
                data: { id }
            };
            return post('/permisos/manage', payload);
        },
    };
};

export default permissionService;
