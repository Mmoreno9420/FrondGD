/**
=========================================================
* GestiaSoft - API Configuration
=========================================================
* Configuración centralizada para las llamadas a la API
*/

// Configuración base de la API
export const API_CONFIG = {
    // URL base de la API
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:8000/api",

    // Timeout para las peticiones (en milisegundos)
    // Aumentado a 30 segundos para permitir peticiones que pueden tardar más tiempo
    timeout: 30000,

    // Headers por defecto
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },

    // Configuración de reintentos
    retry: {
        attempts: 3,
        delay: 1000,
    },

    // Endpoints principales
    endpoints: {
        // Autenticación
        auth: {
            login: "/auth/login",
            logout: "/auth/logout",
            refresh: "/auth/refresh",
            profile: "/auth/profile",
        },

        // Usuarios
        users: {
            list: "/users",
            create: "/users",
            update: "/users/:id",
            delete: "/users/:id",
            detail: "/users/:id",
            manage: "/usuarios/manage", // Endpoint para gestión de usuarios
        },

        // Permisos
        permissions: {
            list: "/permissions",
            create: "/permissions",
            update: "/permissions/:id",
            delete: "/permissions/:id",
            detail: "/permissions/:id",
        },

        // Grupos
        groups: {
            list: "/groups",
            create: "/groups",
            update: "/groups/:id",
            delete: "/groups/:id",
            detail: "/groups/:id",
        },

        // Roles
        roles: {
            list: "/roles",
            create: "/roles",
            update: "/roles/:id",
            delete: "/roles/:id",
            detail: "/roles/:id",
        },
    },
};

// Estados de respuesta de la API
export const API_STATUS = {
    IDLE: "idle",
    LOADING: "loading",
    SUCCESS: "success",
    ERROR: "error",
};

// Códigos de error comunes
export const ERROR_CODES = {
    NETWORK_ERROR: "NETWORK_ERROR",
    TIMEOUT_ERROR: "TIMEOUT_ERROR",
    UNAUTHORIZED: "UNAUTHORIZED",
    FORBIDDEN: "FORBIDDEN",
    NOT_FOUND: "NOT_FOUND",
    VALIDATION_ERROR: "VALIDATION_ERROR",
    SERVER_ERROR: "SERVER_ERROR",
};

// Mensajes de error por defecto
export const ERROR_MESSAGES = {
    [ERROR_CODES.NETWORK_ERROR]: "Error de conexión. Verifica tu internet.",
    [ERROR_CODES.TIMEOUT_ERROR]: "La petición tardó demasiado. Intenta de nuevo.",
    [ERROR_CODES.UNAUTHORIZED]: "No tienes autorización para acceder a este recurso.",
    [ERROR_CODES.FORBIDDEN]: "Acceso denegado.",
    [ERROR_CODES.NOT_FOUND]: "El recurso solicitado no fue encontrado.",
    [ERROR_CODES.VALIDATION_ERROR]: "Los datos proporcionados no son válidos.",
    [ERROR_CODES.SERVER_ERROR]: "Error interno del servidor. Intenta más tarde.",
    DEFAULT: "Ha ocurrido un error inesperado.",
};

// Función para construir URLs con parámetros
export const buildUrl = (endpoint, params = {}) => {
    let url = endpoint;

    // Reemplazar parámetros en la URL
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
};

// Función para obtener mensaje de error
export const getErrorMessage = (error) => {
    if (error?.response?.status) {
        const status = error.response.status;

        switch (status) {
            case 401:
                return ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED];
            case 403:
                return ERROR_MESSAGES[ERROR_CODES.FORBIDDEN];
            case 404:
                return ERROR_MESSAGES[ERROR_CODES.NOT_FOUND];
            case 422:
                return ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR];
            case 500:
                return ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR];
            default:
                return ERROR_MESSAGES.DEFAULT;
        }
    }

    if (error?.code === "ECONNABORTED") {
        return ERROR_MESSAGES[ERROR_CODES.TIMEOUT_ERROR];
    }

    if (error?.message) {
        return error.message;
    }

    return ERROR_MESSAGES.DEFAULT;
};

export const API_OPERTATIONS = {
    Insert: 1,
    edit: 2,
    delete: 3,
    detail: 4,
    list: 5,
};