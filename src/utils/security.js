/**
=========================================================
* GestiaSoft - Security Utils
=========================================================
* Utilidades de seguridad
*/

/**
 * Valida si un token JWT es válido y no ha expirado
 * 
 * @param {string} token - Token JWT a validar
 * @returns {boolean} - true si el token es válido, false si no
 */
export const isTokenValid = (token) => {
    if (!token || typeof token !== 'string') {
        return false;
    }

    try {
        // Decodificar JWT (solo payload)
        const parts = token.split('.');
        if (parts.length !== 3) {
            return false;
        }

        const payload = JSON.parse(atob(parts[1]));

        // Verificar expiración
        if (payload.exp) {
            const expirationTime = payload.exp * 1000; // Convertir a milisegundos
            const currentTime = Date.now();

            if (currentTime >= expirationTime) {
                return false; // Token expirado
            }
        }

        return true;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

/**
 * Obtiene el tiempo restante hasta que expire el token
 * 
 * @param {string} token - Token JWT
 * @returns {number} - Milisegundos restantes, o null si no tiene expiración
 */
export const getTokenTimeRemaining = (token) => {
    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const payload = JSON.parse(atob(parts[1]));

        if (!payload.exp) return null;

        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        const timeRemaining = expirationTime - currentTime;

        return timeRemaining > 0 ? timeRemaining : 0;
    } catch (error) {
        return null;
    }
};

/**
 * Sanitiza una cadena de texto para prevenir XSS
 * 
 * @param {string} str - Cadena a sanitizar
 * @returns {string} - Cadena sanitizada
 */
export const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;

    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

/**
 * Valida si un email es válido
 * 
 * @param {string} email - Email a validar
 * @returns {boolean} - true si es válido
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 * 
 * @param {string} password - Contraseña a validar
 * @param {Object} options - Opciones de validación
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validatePassword = (password, options = {}) => {
    const {
        minLength = 8,
        requireUppercase = true,
        requireLowercase = true,
        requireNumbers = true,
        requireSpecialChars = true,
    } = options;

    const errors = [];

    if (!password || password.length < minLength) {
        errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
    }

    if (requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra mayúscula');
    }

    if (requireLowercase && !/[a-z]/.test(password)) {
        errors.push('La contraseña debe contener al menos una letra minúscula');
    }

    if (requireNumbers && !/[0-9]/.test(password)) {
        errors.push('La contraseña debe contener al menos un número');
    }

    if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('La contraseña debe contener al menos un carácter especial');
    }

    return {
        valid: errors.length === 0,
        errors,
    };
};

/**
 * Genera un token CSRF aleatorio
 * 
 * @returns {string} - Token CSRF
 */
export const generateCSRFToken = () => {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Encripta un string simple (solo para desarrollo, NO usar en producción)
 * 
 * @param {string} str - String a encriptar
 * @returns {string} - String encriptado
 */
export const simpleEncrypt = (str) => {
    if (!str) return '';
    return btoa(str).split('').reverse().join('');
};

/**
 * Desencripta un string simple (solo para desarrollo, NO usar en producción)
 * 
 * @param {string} encryptedStr - String encriptado
 * @returns {string} - String original
 */
export const simpleDecrypt = (encryptedStr) => {
    if (!encryptedStr) return '';
    return atob(encryptedStr.split('').reverse().join(''));
};

/**
 * Limpia datos sensibles de un objeto para logging
 * 
 * @param {Object} obj - Objeto a limpiar
 * @param {Array} sensitiveKeys - Claves sensibles a ocultar
 * @returns {Object} - Objeto sin datos sensibles
 */
export const sanitizeLogData = (obj, sensitiveKeys = ['password', 'token', 'apiKey', 'auth']) => {
    const sanitized = { ...obj };

    sensitiveKeys.forEach(key => {
        if (sanitized[key]) {
            sanitized[key] = '***REDACTED***';
        }
    });

    return sanitized;
};

/**
 * Detecta si el usuario está en un entorno de producción
 * 
 * @returns {boolean}
 */
export const isProduction = () => {
    return process.env.NODE_ENV === 'production';
};

/**
 * Log seguro que no expone datos sensibles en producción
 * 
 * @param {string} level - Nivel de log (log, warn, error)
 * @param {string} message - Mensaje
 * @param {any} data - Datos adicionales
 */
export const secureLog = (level = 'log', message, data = null) => {
    // No loguear en producción
    if (isProduction()) return;

    // Sanitizar datos
    const sanitizedData = data ? sanitizeLogData(data) : null;

    switch (level) {
        case 'warn':
            console.warn(message, sanitizedData);
            break;
        case 'error':
            console.error(message, sanitizedData);
            break;
        default:
            console.log(message, sanitizedData);
    }
};

export default {
    isTokenValid,
    getTokenTimeRemaining,
    sanitizeString,
    isValidEmail,
    validatePassword,
    generateCSRFToken,
    simpleEncrypt,
    simpleDecrypt,
    sanitizeLogData,
    isProduction,
    secureLog,
};
