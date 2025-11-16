/**
=========================================================
* dataUtlService - Servicio para Data UTL (Asignaciones/Notificaciones)
=========================================================
*/

import apiService from './api';

class DataUtlService {
    /**
     * Listar asignaciones/pendientes para panel de notificaciones
     * Backend: POST /data-utl/manage con accion: 4
     * @param {number} userId
     * @param {object} extraData opcional
     */
    async listAsignaciones(userId, extraData = {}) {
        const url = '/data-utl/manage';
        const payload = {
            accion: 4,
            user_id: userId,
            data: extraData
        };

        try {
            const response = await apiService.post(url, payload);
            return response;
        } catch (error) {
            console.error('Error en dataUtlService.listAsignaciones:', error);
            throw error;
        }
    }
}

export const dataUtlService = new DataUtlService();
export default dataUtlService;






