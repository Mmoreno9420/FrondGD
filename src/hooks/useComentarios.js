/**
=========================================================
* GestiaSoft - useComentarios Hook
=========================================================
* Hook personalizado para manejar la carga y gestión de comentarios
*/

import { useState, useEffect, useCallback } from 'react';
import comentariosService from 'services/comentariosService';

export const useComentarios = () => {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Cargar comentarios de una gestión específica
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     */
    const loadComentarios = useCallback(async (gestionId, workflowId, unidadId, userId) => {
        if (!gestionId) {
            console.warn('⚠️ No se pueden cargar comentarios sin gestionId');
            return;
        }

        if (!userId) {
            throw new Error('userId es requerido para cargar comentarios');
        }

        setLoading(true);
        setError(null);

        try {
            // Llamar al servicio de comentarios
            const response = await comentariosService.listarComentarios(gestionId, workflowId, unidadId, userId);

            // Soportar múltiples formatos de respuesta del backend:
            // 1) { status: 200, data: { data: [...] } }
            // 2) { status: 200, data: [...] }
            // 3) { data: [...] } o respuesta directa [...]
            let comentariosData = [];
            if (response?.data?.data && Array.isArray(response.data.data)) {
                comentariosData = response.data.data;
            } else if (Array.isArray(response?.data)) {
                comentariosData = response.data;
            } else if (Array.isArray(response)) {
                comentariosData = response;
            } else {
                comentariosData = [];
            }
            setComentarios(comentariosData);
        } catch (error) {
            console.error('❌ Error cargando comentarios:', error);
            setError(error.message || 'Error al cargar comentarios');
            setComentarios([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crear nuevo comentario
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {string} comentario - Texto del comentario
     * @param {number} userId - ID del usuario
     */
    const createComentario = useCallback(async (gestionId, workflowId, unidadId, comentario, userId) => {
        if (!userId) {
            throw new Error('userId es requerido para crear comentarios');
        }

        try {
            console.log('📤 Creando comentario:', {
                gestionId,
                workflowId,
                unidadId,
                comentario,
                userId
            });

            const response = await comentariosService.crearComentario(gestionId, workflowId, unidadId, comentario, userId);

            if (response?.status === 200) {
                console.log('✅ Comentario creado exitosamente');
                // Recargar comentarios después de crear uno nuevo
                await loadComentarios(gestionId, workflowId, unidadId, userId);
                return response;
            } else {
                throw new Error(response?.mensaje || 'Error al crear comentario');
            }
        } catch (error) {
            console.error('❌ Error creando comentario:', error);
            throw error;
        }
    }, [loadComentarios]);

    /**
     * Eliminar comentario
     * @param {number} gestionId - ID de la gestión
     * @param {number} comentarioId - ID del comentario
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     */
    const deleteComentario = useCallback(async (gestionId, comentarioId, unidadId, userId) => {
        if (!userId) {
            throw new Error('userId es requerido para eliminar comentarios');
        }

        try {
            console.log('🗑️ Eliminando comentario:', {
                gestionId,
                comentarioId,
                unidadId,
                userId
            });

            const response = await comentariosService.eliminarComentario(gestionId, comentarioId, unidadId, userId);

            if (response?.status === 200) {
                console.log('✅ Comentario eliminado exitosamente');
                // Recargar comentarios después de eliminar
                await loadComentarios(gestionId, 0, unidadId, userId);
                return response;
            } else {
                throw new Error(response?.mensaje || 'Error al eliminar comentario');
            }
        } catch (error) {
            console.error('❌ Error eliminando comentario:', error);
            throw error;
        }
    }, [loadComentarios]);

    /**
     * Refrescar comentarios
     */
    const refreshComentarios = useCallback((gestionId, workflowId, unidadId, userId) => {
        if (gestionId) {
            loadComentarios(gestionId, workflowId, unidadId, userId);
        }
    }, [loadComentarios]);

    return {
        comentarios,
        loading,
        error,
        loadComentarios,
        createComentario,
        deleteComentario,
        refreshComentarios
    };
};
