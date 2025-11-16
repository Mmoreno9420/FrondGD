/**
=========================================================
* GestiaSoft - Users Hook
=========================================================
* Hook personalizado para la gestión de usuarios
*/

import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { API_OPERTATIONS } from "../config/apiConfig";

export const useUsers = () => {
    // Estados principales
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados de paginación
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });

    // Estados de filtros
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        department: "all",
        role: "all"
    });

    // Cargar usuarios usando el endpoint /api/usuarios/manage
    const fetchUsers = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            // Usar la nueva función que envía el payload correcto al endpoint /api/usuarios/manage
            const response = await userService.listUsers(1); // user_id: 1

            console.log("API Response:", response); // Debug

            // Manejar diferentes formatos de respuesta
            let usersData = [];
            let paginationData = {};

            if (response && typeof response === 'object') {
                // Si la respuesta es response.data.usuarios (estructura anidada del API)
                if (response.data && response.data.usuarios && Array.isArray(response.data.usuarios)) {
                    usersData = response.data.usuarios;
                    paginationData = response.data.pagination || {};
                }
                // Si la respuesta es un objeto con data y pagination
                else if (Array.isArray(response.data)) {
                    usersData = response.data;
                    paginationData = response.pagination || {};
                }
                // Si la respuesta es directamente un array
                else if (Array.isArray(response)) {
                    usersData = response;
                }
                // Si la respuesta tiene una estructura diferente
                else if (response.users && Array.isArray(response.users)) {
                    usersData = response.users;
                    paginationData = response.pagination || {};
                }
                // Si la respuesta tiene una estructura con 'result' o 'items'
                else if (response.result && Array.isArray(response.result)) {
                    usersData = response.result;
                    paginationData = response.pagination || {};
                }
                else if (response.items && Array.isArray(response.items)) {
                    usersData = response.items;
                    paginationData = response.pagination || {};
                }
                // Si no es ninguno de los anteriores, intentar usar la respuesta completa
                else {
                    console.warn("Formato de respuesta no reconocido:", response);
                    usersData = Array.isArray(response) ? response : [];
                }
            }

            // Debug específico para ver la estructura de los datos
            console.log("usersData después del procesamiento:", usersData);
            if (usersData.length > 0) {
                console.log("Primer usuario en usersData:", usersData[0]);
                console.log("Estructura del primer usuario:", {
                    usuario: usersData[0].usuario,
                    grupos: usersData[0].grupos,
                    roles: usersData[0].roles
                });
            }

            // Asegurar que usersData sea siempre un array
            if (!Array.isArray(usersData)) {
                console.error("usersData no es un array:", usersData);
                usersData = [];
            }

            setUsers(usersData);

            // Actualizar paginación si existe
            if (paginationData.total !== undefined) {
                setPagination(prev => ({
                    ...prev,
                    total: paginationData.total,
                    totalPages: paginationData.totalPages || Math.ceil(paginationData.total / prev.limit)
                }));
            }

            return response;
        } catch (err) {
            setError(err);
            console.error("Error fetching users:", err);
            // En caso de error, establecer un array vacío
            setUsers([]);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filters]);

    // Crear usuario usando el endpoint /api/usuarios/manage
    const createUser = useCallback(async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const newUser = await userService.createUserWithManage(1, userData); // user_id: 1
            // Asegurar que el nuevo usuario tenga la estructura correcta
            const userWithStructure = {
                usuario: newUser,
                grupos: [],
                roles: []
            };
            setUsers(prev => [userWithStructure, ...prev]);
            return newUser;
        } catch (err) {
            setError(err);
            console.error("Error creating user:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Actualizar usuario usando el endpoint /api/usuarios/manage
    const updateUser = useCallback(async (id, userData) => {
        setLoading(true);
        setError(null);

        try {
            const updatedUser = await userService.updateUserWithManage(1, { id, ...userData }); // user_id: 1
            setUsers(prev => prev.map(user =>
                user.usuario?.usuario_id === id ? { ...user, usuario: updatedUser } : user
            ));
            return updatedUser;
        } catch (err) {
            setError(err);
            console.error("Error updating user:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Eliminar usuario usando el endpoint /api/usuarios/manage
    const deleteUser = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await userService.deleteUserWithManage(1, id); // user_id: 1, target_user_id: id
            setUsers(prev => prev.filter(user => user.usuario?.usuario_id !== id));
        } catch (err) {
            setError(err);
            console.error("Error deleting user:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Obtener detalle de usuario usando el endpoint /api/usuarios/manage
    const getUserDetail = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const userDetail = await userService.getUserDetail(1, id); // user_id: 1, target_user_id: id
            return userDetail;
        } catch (err) {
            setError(err);
            console.error("Error getting user detail:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Buscar usuarios
    const searchUsers = useCallback(async (searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    // Filtrar por estado
    const filterByStatus = useCallback(async (status) => {
        setFilters(prev => ({ ...prev, status }));
    }, []);

    // Filtrar por departamento
    const filterByDepartment = useCallback(async (department) => {
        setFilters(prev => ({ ...prev, department }));
    }, []);

    // Cambiar página
    const changePage = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    // Cambiar límite de elementos por página
    const changeLimit = useCallback((newLimit) => {
        setPagination(prev => ({
            ...prev,
            limit: newLimit,
            page: 1 // Reset a la primera página
        }));
    }, []);

    // Limpiar filtros
    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            status: "all",
            department: "all",
            role: "all"
        });
    }, []);

    // Cargar usuarios al montar el componente o cambiar filtros/paginación
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        // Estados
        users,
        loading,
        error,
        pagination,
        filters,

        // Acciones
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        getUserDetail,
        searchUsers,
        filterByStatus,
        filterByDepartment,
        changePage,
        changeLimit,
        clearFilters,

        // Utilidades
        hasUsers: users.length > 0,
        totalUsers: pagination.total,
        currentPage: pagination.page,
        totalPages: pagination.totalPages
    };
};
