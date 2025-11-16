/**
=========================================================
* GestiaSoft - User Service
=========================================================
* Servicio específico para operaciones de usuarios
*/

import React, { useState, useCallback } from "react";
import { apiService } from "./api";
import { API_CONFIG, buildUrl, API_OPERTATIONS } from "../config/apiConfig";

// Servicio de usuarios
export const userService = {
    // Obtener lista de usuarios
    getUsers: async (userId, params = {}) => {
        const payload = {
            accion: 2, // Listar usuarios
            user_id: userId,
            data: params
        };
        return await apiService.post('/usuarios/manage', payload);
    },

    // Obtener un usuario específico
    getUser: async (userId, id) => {
        const payload = {
            accion: 3, // Obtener detalle de usuario
            user_id: userId,
            data: { id }
        };
        return await apiService.post('/usuarios/manage', payload);
    },

    // Crear un nuevo usuario
    createUser: async (userId, userData) => {
        const payload = {
            accion: 1, // Crear usuario
            user_id: userId,
            data: userData
        };
        return await apiService.post('/usuarios/manage', payload);
    },

    // Actualizar un usuario
    updateUser: async (userId, id, userData) => {
        const payload = {
            accion: 4, // Actualizar usuario
            user_id: userId,
            data: { id, ...userData }
        };
        return await apiService.post('/usuarios/manage', payload);
    },

    // Eliminar un usuario
    deleteUser: async (userId, id) => {
        const payload = {
            accion: 5, // Eliminar usuario
            user_id: userId,
            data: { id }
        };
        return await apiService.post('/usuarios/manage', payload);
    },

    // Gestión de usuarios usando el endpoint /api/usuarios/manage
    manageUsers: async (action, userId = 1, data = {}) => {
        const url = API_CONFIG.endpoints.users.manage;
        const payload = {
            accion: action,
            user_id: userId,
            data: data
        };
        return await apiService.post(url, payload);
    },

    // Listar usuarios usando el endpoint de gestión
    listUsers: async (userId = 1) => {
        return await userService.manageUsers(API_OPERTATIONS.list, userId);
    },

    // Obtener detalle de usuario usando el endpoint de gestión
    getUserDetail: async (userId, targetUserId) => {
        return await userService.manageUsers(API_OPERTATIONS.detail, userId, { user_id: targetUserId });
    },

    // Crear usuario usando el endpoint de gestión
    createUserWithManage: async (userId, userData) => {
        return await userService.manageUsers(API_OPERTATIONS.Insert, userId, userData);
    },

    // Actualizar usuario usando el endpoint de gestión
    updateUserWithManage: async (userId, userData) => {
        return await userService.manageUsers(API_OPERTATIONS.edit, userId, userData);
    },

    // Eliminar usuario usando el endpoint de gestión
    deleteUserWithManage: async (userId, targetUserId) => {
        return await userService.manageUsers(API_OPERTATIONS.delete, userId, { user_id: targetUserId });
    },
};

// Hooks personalizados para usuarios
export const useUserApi = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async (userId, params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUsers(userId, params);
            setUsers(data);
            return data;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const createUser = useCallback(async (userId, userData) => {
        setLoading(true);
        setError(null);
        try {
            const newUser = await userService.createUser(userId, userData);
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateUser = useCallback(async (userId, id, userData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedUser = await userService.updateUser(userId, id, userData);
            setUsers(prev => prev.map(user =>
                user.id === id ? updatedUser : user
            ));
            return updatedUser;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (userId, id) => {
        setLoading(true);
        setError(null);
        try {
            await userService.deleteUser(userId, id);
            setUsers(prev => prev.filter(user => user.id !== id));
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        users,
        loading,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        // Nuevas funciones usando el endpoint de gestión
        listUsers: useCallback(async (userId = 1) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userService.listUsers(userId);
                setUsers(data);
                return data;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        }, []),
        getUserDetail: useCallback(async (userId, targetUserId) => {
            setLoading(true);
            setError(null);
            try {
                const data = await userService.getUserDetail(userId, targetUserId);
                return data;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        }, []),
        createUserWithManage: useCallback(async (userId, userData) => {
            setLoading(true);
            setError(null);
            try {
                const newUser = await userService.createUserWithManage(userId, userData);
                setUsers(prev => [...prev, newUser]);
                return newUser;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        }, []),
        updateUserWithManage: useCallback(async (userId, userData) => {
            setLoading(true);
            setError(null);
            try {
                const updatedUser = await userService.updateUserWithManage(userId, userData);
                setUsers(prev => prev.map(user =>
                    user.id === userData.id ? updatedUser : user
                ));
                return updatedUser;
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        }, []),
        deleteUserWithManage: useCallback(async (userId, targetUserId) => {
            setLoading(true);
            setError(null);
            try {
                await userService.deleteUserWithManage(userId, targetUserId);
                setUsers(prev => prev.filter(user => user.id !== targetUserId));
            } catch (err) {
                setError(err);
                throw err;
            } finally {
                setLoading(false);
            }
        }, [])
    };
};

export default userService;
