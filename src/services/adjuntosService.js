/**
=========================================================
* GestiaSoft - Adjuntos Service
=========================================================
* Servicio específico para manejar documentos adjuntos
*/

import apiService from './api';

class AdjuntosService {
    /**
     * Listar documentos adjuntos de una gestión
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     * @returns {Promise} Respuesta del API
     */
    async listarAdjuntos(gestionId, workflowId, unidadId, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        const url = '/adjuntos/manage';
        const payload = {
            accion: 2,
            user_id: userId,
            data: {
                gestion_id: gestionId,
                workflow_id: workflowId,
                unidad_id: unidadId
            }
        };

        console.log('📤 Payload enviado al servicio de adjuntos:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            return response;
        } catch (error) {
            console.error('Error en AdjuntosService.listarAdjuntos:', error);
            throw error;
        }
    }

    /**
     * Subir documento adjunto
     * @param {FormData} formData - Datos del formulario con el archivo
     * @returns {Promise} Respuesta del API
     */
    async subirAdjunto(formData) {
        const url = '/adjuntos/manage';

        console.log('📤 Subiendo adjunto al servicio:', url);

        try {
            const response = await apiService.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            console.error('Error en AdjuntosService.subirAdjunto:', error);
            throw error;
        }
    }

    /**
     * Eliminar documento adjunto
     * @param {number} gestionId - ID de la gestión
     * @param {number} adjuntoId - ID del adjunto a eliminar
     * @param {number} unidadId - ID de la unidad (sesión)
     * @param {number} userId - ID del usuario (sesión)
     * @returns {Promise} Respuesta del API
     */
    async eliminarAdjunto(gestionId, adjuntoId, unidadId, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        const url = '/adjuntos/manage';
        const payload = {
            accion: 4,  // Acción 4 = Eliminar
            user_id: userId,
            data: {
                gestion_id: gestionId,
                adjunto_id: adjuntoId,
                unidad_id: unidadId
            }
        };

        console.log('🗑️ Eliminando adjunto:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            console.log('✅ Adjunto eliminado exitosamente:', response);
            return response;
        } catch (error) {
            console.error('❌ Error en AdjuntosService.eliminarAdjunto:', error);
            throw error;
        }
    }
}

const adjuntosService = new AdjuntosService();
export default adjuntosService;
