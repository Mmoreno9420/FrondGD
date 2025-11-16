/**
=========================================================
* GestiaSoft - useApi Hook
=========================================================
* Hook personalizado para manejar llamadas a la API
*/

import { useState, useCallback, useRef } from "react";
import { API_STATUS } from "../config/apiConfig";
import { apiService, apiWithRetry, createCancelToken } from "../services/api";

export const useApi = () => {
    const [status, setStatus] = useState(API_STATUS.IDLE);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const cancelTokenRef = useRef(null);

    // Función para hacer peticiones GET
    const get = useCallback(async (url, config = {}) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            // Crear token de cancelación
            cancelTokenRef.current = createCancelToken();
            config.cancelToken = cancelTokenRef.current.token;

            const result = await apiService.get(url, config);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            if (!err.isCanceled) {
                setError(err);
                setStatus(API_STATUS.ERROR);
            }
            throw err;
        }
    }, []);

    // Función para hacer peticiones POST
    const post = useCallback(async (url, data = {}, config = {}) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            // Crear token de cancelación
            cancelTokenRef.current = createCancelToken();
            config.cancelToken = cancelTokenRef.current.token;

            const result = await apiService.post(url, data, config);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            if (!err.isCanceled) {
                setError(err);
                setStatus(API_STATUS.ERROR);
            }
            throw err;
        }
    }, []);

    // Función para hacer peticiones PUT
    const put = useCallback(async (url, data = {}, config = {}) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            // Crear token de cancelación
            cancelTokenRef.current = createCancelToken();
            config.cancelToken = cancelTokenRef.current.token;

            const result = await apiService.put(url, data, config);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            if (!err.isCanceled) {
                setError(err);
                setStatus(API_STATUS.ERROR);
            }
            throw err;
        }
    }, []);

    // Función para hacer peticiones PATCH
    const patch = useCallback(async (url, data = {}, config = {}) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            // Crear token de cancelación
            cancelTokenRef.current = createCancelToken();
            config.cancelToken = cancelTokenRef.current.token;

            const result = await apiService.patch(url, data, config);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            if (!err.isCanceled) {
                setError(err);
                setStatus(API_STATUS.ERROR);
            }
            throw err;
        }
    }, []);

    // Función para hacer peticiones DELETE
    const del = useCallback(async (url, config = {}) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            // Crear token de cancelación
            cancelTokenRef.current = createCancelToken();
            config.cancelToken = cancelTokenRef.current.token;

            const result = await apiService.delete(url, config);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            if (!err.isCanceled) {
                setError(err);
                setStatus(API_STATUS.ERROR);
            }
            throw err;
        }
    }, []);

    // Función para hacer peticiones con reintentos
    const requestWithRetry = useCallback(async (apiCall, maxRetries = 3) => {
        try {
            setStatus(API_STATUS.LOADING);
            setError(null);

            const result = await apiWithRetry(apiCall, maxRetries);
            setData(result);
            setStatus(API_STATUS.SUCCESS);
            return result;
        } catch (err) {
            setError(err);
            setStatus(API_STATUS.ERROR);
            throw err;
        }
    }, []);

    // Función para cancelar petición actual
    const cancelRequest = useCallback(() => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Petición cancelada por el usuario");
            cancelTokenRef.current = null;
        }
    }, []);

    // Función para resetear el estado
    const reset = useCallback(() => {
        setStatus(API_STATUS.IDLE);
        setData(null);
        setError(null);
        cancelRequest();
    }, [cancelRequest]);

    // Función para actualizar datos manualmente
    const updateData = useCallback((newData) => {
        setData(newData);
    }, []);

    // Función para actualizar error manualmente
    const updateError = useCallback((newError) => {
        setError(newError);
        setStatus(API_STATUS.ERROR);
    }, []);

    return {
        // Estados
        status,
        data,
        error,
        isLoading: status === API_STATUS.LOADING,
        isSuccess: status === API_STATUS.SUCCESS,
        isError: status === API_STATUS.ERROR,
        isIdle: status === API_STATUS.IDLE,

        // Funciones
        get,
        post,
        put,
        patch,
        delete: del,
        requestWithRetry,
        cancelRequest,
        reset,
        updateData,
        updateError,
    };
};

// Hook específico para peticiones GET
export const useGet = (url, config = {}) => {
    const api = useApi();

    const execute = useCallback(async () => {
        return await api.get(url, config);
    }, [api, url, config]);

    return {
        ...api,
        execute,
    };
};

// Hook específico para peticiones POST
export const usePost = (url, config = {}) => {
    const api = useApi();

    const execute = useCallback(async (data) => {
        return await api.post(url, data, config);
    }, [api, url, config]);

    return {
        ...api,
        execute,
    };
};

// Hook específico para peticiones PUT
export const usePut = (url, config = {}) => {
    const api = useApi();

    const execute = useCallback(async (data) => {
        return await api.put(url, data, config);
    }, [api, url, config]);

    return {
        ...api,
        execute,
    };
};

// Hook específico para peticiones DELETE
export const useDelete = (url, config = {}) => {
    const api = useApi();

    const execute = useCallback(async () => {
        return await api.delete(url, config);
    }, [api, url, config]);

    return {
        ...api,
        execute,
    };
};
