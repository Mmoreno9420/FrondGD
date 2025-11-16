/**
 * =========================================================
 * Utility Lists Service
 * =========================================================
 * Service for managing utility lists (roles, groups, units)
 * from the /data-utl/manage API endpoint
 */

import apiService from './api';

class UtilityListsService {
    /**
     * Generic method to get utility list data
     * @param {string} accion - The action type (1: roles, 2: groups, 3: units)
     * @param {number} userId - User ID for the request
     * @returns {Promise} API response
     */
    async getUtilityList(accion, userId) {
        if (!userId) {
            throw new Error('userId es requerido para operaciones de seguridad');
        }

        try {
            const payload = {
                accion: accion,
                user_id: userId
            };

            const response = await apiService.post('/data-utl/manage', payload);
            return response.data;
        } catch (error) {
            console.error(`Error fetching utility list for action ${accion}:`, error);
            throw error;
        }
    }

    /**
     * Get roles list (accion: 1)
     * @param {number} userId - User ID for the request
     * @returns {Promise} Roles data
     */
    async getRoles(userId) {
        if (!userId) {
            throw new Error('userId es requerido para obtener roles');
        }
        return this.getUtilityList(1, userId);
    }

    /**
     * Get groups list (accion: 2)
     * @param {number} userId - User ID for the request
     * @returns {Promise} Groups data
     */
    async getGroups(userId) {
        if (!userId) {
            throw new Error('userId es requerido para obtener grupos');
        }
        return this.getUtilityList(2, userId);
    }

    /**
     * Get units list (accion: 3)
     * @param {number} userId - User ID for the request
     * @returns {Promise} Units data
     */
    async getUnits(userId) {
        if (!userId) {
            throw new Error('userId es requerido para obtener unidades');
        }
        return this.getUtilityList(3, userId);
    }

    /**
     * Get all utility lists at once
     * @param {number} userId - User ID for the request
     * @returns {Promise} Object with roles, groups, and units
     */
    async getAllLists(userId) {
        if (!userId) {
            throw new Error('userId es requerido para obtener todas las listas');
        }

        try {
            const [roles, groups, units] = await Promise.all([
                this.getRoles(userId),
                this.getGroups(userId),
                this.getUnits(userId)
            ]);

            return {
                roles,
                groups,
                units
            };
        } catch (error) {
            console.error('Error fetching all utility lists:', error);
            throw error;
        }
    }
}

export default new UtilityListsService();
