/**
=========================================================
* GestiaSoft - Gestiones Service
=========================================================
* Servicio para la gestión de gestiones y flujos de trabajo
*/

import apiService from './api';
import { API_OPERTATIONS } from '../config/apiConfig';

class GestionService {
    /**
     * Gestión genérica de gestiones usando el endpoint /api/gestiones/manage
     * @param {string} accion - Acción a realizar (list, detail, insert, edit, delete)
     * @param {number} userId - ID del usuario que realiza la acción
     * @param {object} data - Datos adicionales para la acción
     * @returns {Promise} Respuesta del API
     */
    async manageGestiones(accion, userId, params = {}) {
        const url = '/gestiones/manage';

        // Para las acciones 2, 3, 4 y 6, los datos deben ir dentro del campo 'data'
        let payload;
        if (accion === 2 || accion === 3 || accion === 4 || accion === 6) {
            payload = {
                accion,
                user_id: userId,
                data: params
            };
        } else {
            // Para acción 1 (Insertar), los datos van directamente
            payload = {
                accion,
                user_id: userId,
                ...params
            };
        }

        console.log('📤 Payload enviado al backend:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            return response;
        } catch (error) {
            console.error(`Error en gestionService.manageGestiones (${accion}):`, error);
            throw error;
        }
    }

    /**
     * Listar todas las gestiones
     * @param {number} userId - ID del usuario
     * @returns {Promise} Lista de gestiones
     */
    async listGestiones(userId) {
        return await this.manageGestiones(API_OPERTATIONS.list, userId);
    }

    /**
     * Obtener detalles de una gestión específica
     * @param {number} userId - ID del usuario
     * @param {number} gestionId - ID de la gestión
     * @returns {Promise} Detalles de la gestión
     */
    async getGestionDetail(userId, gestionId) {
        return await this.manageGestiones(API_OPERTATIONS.detail, userId, { gestion_id: gestionId });
    }

    /**
     * Crear una nueva gestión
     * @param {number} userId - ID del usuario
     * @param {object} gestionData - Datos de la nueva gestión
     * @returns {Promise} Gestión creada
     */
    async createGestion(userId, gestionData) {
        return await this.manageGestiones(API_OPERTATIONS.Insert, userId, { data: gestionData });
    }

    /**
     * Actualizar una gestión existente
     * @param {number} userId - ID del usuario
     * @param {object} gestionData - Datos actualizados de la gestión (debe incluir gestion_id)
     * @returns {Promise} Gestión actualizada
     */
    async updateGestion(userId, gestionData) {
        // Para acción 2 (edit), manageGestiones ya envuelve los datos en 'data'
        // Por lo tanto, pasamos gestionData directamente, no envuelto
        return await this.manageGestiones(API_OPERTATIONS.edit, userId, gestionData);
    }

    /**
     * Eliminar una gestión
     * @param {number} userId - ID del usuario
     * @param {number} gestionId - ID de la gestión a eliminar
     * @returns {Promise} Resultado de la eliminación
     */
    async deleteGestion(userId, gestionId) {
        return await this.manageGestiones(API_OPERTATIONS.delete, userId, { gestion_id: gestionId });
    }

    /**
     * Inactivar una gestión
     * @param {number} userId - ID del usuario de sesión
     * @param {number} gestionId - ID de la gestión a inactivar
     * @returns {Promise} Respuesta del API
     */
    async inactivateGestion(userId, gestionId) {
        return await this.manageGestiones(3, userId, { gestion_id: gestionId });
    }

    /**
     * Cambiar etapa de una gestión
     * @param {number} userId - ID del usuario
     * @param {object} etapaData - Datos de la nueva etapa
     * @returns {Promise} Respuesta del API
     */
    async cambiarEtapa(userId, etapaData) {
        const url = '/workflow/manage';
        const payload = {
            accion: 5, // Acción: Cambiar etapa
            user_id: userId,
            data: etapaData
        };

        console.log('📤 Payload para cambio de etapa:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            return response;
        } catch (error) {
            console.error('Error en gestionService.cambiarEtapa:', error);
            throw error;
        }
    }

    /**
     * Procesar acuse de recibido de una gestión
     * @param {number} userId - ID del usuario
     * @param {object} acuseData - Datos del acuse de recibido
     * @returns {Promise} Respuesta del API
     */
    async procesarAcuseRecibido(userId, acuseData) {
        const url = '/workflow/manage';
        const payload = {
            accion: 6, // Acción: Procesar acuse de recibido
            user_id: userId,
            data: acuseData
        };

        console.log('📤 Payload para acuse de recibido:', JSON.stringify(payload, null, 2));

        try {
            const response = await apiService.post(url, payload);
            return response;
        } catch (error) {
            console.error('Error en gestionService.procesarAcuseRecibido:', error);
            throw error;
        }
    }
}

export const gestionService = new GestionService();
export default gestionService;


