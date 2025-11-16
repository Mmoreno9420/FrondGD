/**
=========================================================
* GestiaSoft - Authentication Service
=========================================================
* Servicio específico para operaciones de autenticación
*/

import { apiService } from "./api";

// Servicio de autenticación
export const authService = {
    /**
     * Iniciar sesión
     * 
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    login: async (email, password) => {
        try {
            const response = await apiService.post('/auth/login', {
                email: email,
                password_hash: password // El backend espera password_hash
            });

            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Cerrar sesión
     * 
     * @returns {Promise} - Promesa con la respuesta del servidor
     */
    logout: async () => {
        try {
            const response = await apiService.post('/auth/logout');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Obtener perfil del usuario autenticado
     * 
     * @returns {Promise} - Promesa con los datos del usuario
     */
    getProfile: async () => {
        try {
            const response = await apiService.get('/auth/profile');
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Refrescar token
     * 
     * @returns {Promise} - Promesa con el nuevo token
     */
    refreshToken: async () => {
        try {
            const response = await apiService.post('/auth/refresh');
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default authService;
