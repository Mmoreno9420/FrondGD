/**
=========================================================
* GestiaSoft - Comentarios Service
=========================================================
* Servicio específico para manejar comentarios de gestiones
*/

import apiService from './api';

class ComentariosService {
    /**
     * Listar comentarios de una gestión
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     * @returns {Promise} Respuesta del API
     */
    async listarComentarios(gestionId, workflowId, unidadId, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        const url = '/comentarios/manage';
        const payload = {
            accion: 2,
            user_id: userId,
            data: {
                gestion_id: gestionId,
                workflow_id: workflowId,
                unidad_id: unidadId
            }
        };

        console.log('📤 Listando comentarios:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            console.log('✅ Comentarios listados exitosamente:', response);
            return response;
        } catch (error) {
            console.error('❌ Error en ComentariosService.listarComentarios:', error);
            throw error;
        }
    }

    /**
     * Crear nuevo comentario
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {string} comentario - Texto del comentario
     * @param {number} userId - ID del usuario
     * @returns {Promise} Respuesta del API
     */
    async crearComentario(gestionId, workflowId, unidadId, comentario, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        const url = '/comentarios/manage';
        const payload = {
            accion: 1,
            user_id: userId,
            data: {
                gestion_id: gestionId,
                comentario_id: 0, // 0 para crear nuevo
                workflow_id: workflowId,
                unidad_id: unidadId,
                comentario: comentario
            }
        };

        console.log('📤 Creando comentario:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            console.log('✅ Comentario creado exitosamente:', response);
            return response;
        } catch (error) {
            console.error('❌ Error en ComentariosService.crearComentario:', error);
            throw error;
        }
    }

    /**
     * Eliminar comentario
     * @param {number} gestionId - ID de la gestión
     * @param {number} comentarioId - ID del comentario
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     * @returns {Promise} Respuesta del API
     */
    async eliminarComentario(gestionId, comentarioId, unidadId, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        const url = '/comentarios/manage';
        const payload = {
            accion: 4,
            user_id: userId,
            data: {
                gestion_id: gestionId,
                comentario_id: comentarioId,
                unidad_id: unidadId
            }
        };

        console.log('🗑️ Eliminando comentario:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            console.log('✅ Comentario eliminado exitosamente:', response);
            return response;
        } catch (error) {
            console.error('❌ Error en ComentariosService.eliminarComentario:', error);
            throw error;
        }
    }
}

const comentariosService = new ComentariosService();
export default comentariosService;
