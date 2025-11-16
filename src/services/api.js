/**
=========================================================
* GestiaSoft - API Service
=========================================================
* Servicio base para las llamadas a la API usando axios
*/

import axios from "axios";
import { API_CONFIG, getErrorMessage } from "../config/apiConfig";

// Configuración específica para navegador
// Railway: Configuración optimizada para Railway.com
const apiClient = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
    // Railway: Si tienes problemas de CORS, es posible que necesites esto
    // withCredentials: true, // Descomenta si Railway requiere cookies/credentials
});

// Interceptor de solicitudes
apiClient.interceptors.request.use(
    (config) => {
        // Agregar token de autenticación si existe
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log de solicitudes en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log('API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuestas
apiClient.interceptors.response.use(
    (response) => {
        // Log de respuestas en desarrollo
        if (process.env.NODE_ENV === 'development') {
            console.log('API Response:', response.status, response.config.url);
        }
        return response;
    },
    (error) => {
        // Manejo de errores
        const errorMessage = getErrorMessage(error);
        console.error('API Error:', errorMessage);

        // Manejar errores específicos de Railway
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            console.error('Railway Connection Error: Verifica que la API esté desplegada y accesible');
        }

        // Manejar token expirado
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            // Redirigir a login si es necesario
            window.location.href = '/login';
        }

        // Manejar CORS errors (común en Railway si no está configurado correctamente)
        if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
            console.error('Railway CORS Error: Verifica la configuración de CORS en tu backend');
        }

        return Promise.reject(error);
    }
);

// Servicios base
export const apiService = {
    get: async (url, config = {}) => {
        try {
            const response = await apiClient.get(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    post: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.post(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    put: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.put(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    patch: async (url, data = {}, config = {}) => {
        try {
            const response = await apiClient.patch(url, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (url, config = {}) => {
        try {
            const response = await apiClient.delete(url, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

// Función para reintentos
export const apiWithRetry = async (apiCall, maxRetries = API_CONFIG.retry.attempts) => {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;

            if (attempt === maxRetries) {
                throw error;
            }

            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, API_CONFIG.retry.delay * attempt));
        }
    }

    throw lastError;
};

// Función para crear tokens de cancelación
export const createCancelToken = () => {
    return axios.CancelToken.source();
};

export default apiClient;
