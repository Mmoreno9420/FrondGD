/**
=========================================================
* GestiaSoft - Gestiones Hook
=========================================================
* Hook personalizado para la gestión de gestiones y flujos
*/

import { useState, useEffect, useCallback } from "react";
import { gestionService } from "../services/gestionService";
import { useUserSession } from "./useUserSession";

export const useGestiones = () => {
    // Obtener usuario autenticado
    const { user } = useUserSession();
    const userId = user?.usuario_id || user?.id;

    // Estados principales
    const [gestiones, setGestiones] = useState([]);
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
        estado: "all",
        prioridad: "all"
    });

    /**
     * Cargar gestiones
     */
    const fetchGestiones = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await gestionService.listGestiones(userId);

            console.log("API Response Gestiones:", response);
            console.log("Datos extraídos:", response?.data?.data || response?.data || response);

            // Manejar diferentes formatos de respuesta
            let gestionesData = [];
            let paginationData = {};

            if (response && typeof response === 'object') {
                // Caso 1: response.data.data (estructura anidada de Axios + Backend)
                if (response.data && response.data.data && Array.isArray(response.data.data)) {
                    gestionesData = response.data.data;
                }
                // Caso 2: response.data (solo un nivel)
                else if (response.data && Array.isArray(response.data)) {
                    gestionesData = response.data;
                }
                // Caso 3: response directamente es un array
                else if (Array.isArray(response)) {
                    gestionesData = response;
                }

                // Actualizar paginación si viene en la respuesta
                if (response.pagination) {
                    paginationData = response.pagination;
                } else if (response.data && response.data.pagination) {
                    paginationData = response.data.pagination;
                }
            }

            console.log("Gestiones procesadas:", gestionesData);
            console.log("Total gestiones:", gestionesData.length);
            setGestiones(gestionesData);

            if (Object.keys(paginationData).length > 0) {
                setPagination(prev => ({
                    ...prev,
                    ...paginationData
                }));
            }
        } catch (err) {
            // Extraer mensaje específico del error del servidor
            let errorMessage = "Error al cargar gestiones";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error fetching gestiones:", err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Crear gestión
     */
    const createGestion = useCallback(async (gestionData) => {
        setLoading(true);
        setError(null);

        try {
            const newGestion = await gestionService.createGestion(userId, gestionData);
            setGestiones(prev => [newGestion, ...prev]);
            return newGestion;
        } catch (err) {
            // Extraer mensaje específico del error del servidor
            let errorMessage = "Error al crear gestión";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error creating gestion:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Actualizar gestión
     */
    const updateGestion = useCallback(async (id, gestionData) => {
        setLoading(true);
        setError(null);

        try {
            // Asegurar que gestion_id esté presente en los datos
            // Si gestionData ya incluye gestion_id, usarlo; si no, usar el id del parámetro
            const dataWithId = {
                ...gestionData,
                gestion_id: gestionData.gestion_id || parseInt(id)
            };

            // Validar que gestion_id sea válido
            if (!dataWithId.gestion_id || isNaN(dataWithId.gestion_id)) {
                throw new Error("gestion_id es requerido y debe ser un número válido");
            }

            console.log("🔄 useGestiones.updateGestion - Datos enviados:", JSON.stringify(dataWithId, null, 2));

            const updatedGestion = await gestionService.updateGestion(userId, dataWithId);
            setGestiones(prev => prev.map(gestion =>
                gestion.gestion_id === id ? updatedGestion : gestion
            ));
            return updatedGestion;
        } catch (err) {
            // Extraer mensaje específico del error del servidor
            let errorMessage = "Error al actualizar gestión";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error updating gestion:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Eliminar gestión
     */
    const deleteGestion = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await gestionService.deleteGestion(userId, id);
            setGestiones(prev => prev.filter(gestion => gestion.gestion_id !== id));
        } catch (err) {
            // Extraer mensaje específico del error del servidor
            let errorMessage = "Error al eliminar gestión";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error deleting gestion:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Obtener detalles de una gestión
     */
    const getGestionDetail = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            const gestion = await gestionService.getGestionDetail(userId, id);
            return gestion;
        } catch (err) {
            // Extraer mensaje específico del error del servidor
            let errorMessage = "Error al cargar detalles de gestión";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error getting gestion detail:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    /**
     * Buscar gestiones
     */
    const searchGestiones = useCallback((searchTerm) => {
        setFilters(prev => ({ ...prev, search: searchTerm }));
    }, []);

    /**
     * Filtrar por estado
     */
    const filterByEstado = useCallback((estado) => {
        setFilters(prev => ({ ...prev, estado }));
    }, []);

    /**
     * Filtrar por prioridad
     */
    const filterByPrioridad = useCallback((prioridad) => {
        setFilters(prev => ({ ...prev, prioridad }));
    }, []);

    /**
     * Cambiar página
     */
    const changePage = useCallback((newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    }, []);

    /**
     * Cambiar límite de resultados
     */
    const changeLimit = useCallback((newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    }, []);

    /**
     * Limpiar filtros
     */
    const clearFilters = useCallback(() => {
        setFilters({
            search: "",
            estado: "all",
            prioridad: "all"
        });
    }, []);

    /**
     * Cambiar etapa de una gestión
     */
    const cambiarEtapa = useCallback(async (etapaData) => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Cambiando etapa:', etapaData);
            const response = await gestionService.cambiarEtapa(userId, etapaData);

            console.log('✅ Etapa cambiada exitosamente:', response);

            // Recargar gestiones para obtener datos actualizados
            await fetchGestiones();

            return response;
        } catch (err) {
            let errorMessage = "Error al cambiar etapa";
            if (err?.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err?.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            console.error("Error cambiando etapa:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId, fetchGestiones]);

    // NO cargar gestiones automáticamente al montar
    // Permitir que cada componente decida cuándo cargar los datos
    // Esto evita llamadas innecesarias cuando solo se necesita un detalle

    return {
        // Estado
        gestiones,
        loading,
        error,
        pagination,
        filters,

        // Acciones
        fetchGestiones,
        createGestion,
        updateGestion,
        deleteGestion,
        getGestionDetail,
        searchGestiones,
        filterByEstado,
        filterByPrioridad,
        changePage,
        changeLimit,
        clearFilters,
        cambiarEtapa,

        // Utilidades
        hasGestiones: gestiones.length > 0,
        totalGestiones: pagination.total,
        currentPage: pagination.page,
        totalPages: pagination.totalPages
    };
};

export default useGestiones;

