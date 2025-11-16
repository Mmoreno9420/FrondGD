/**
=========================================================
* GestiaSoft - App Actions Context
=========================================================
* Contexto para manejar acciones globales de la aplicación
*/

import React, { createContext, useContext, useReducer, useCallback } from "react";
import PropTypes from "prop-types";

// Crear el contexto
const AppActionsContext = createContext(null);

// Nombre para React DevTools
AppActionsContext.displayName = "AppActionsContext";

// Estados iniciales
const initialState = {
    // Sesión de usuario
    userSession: {
        isAuthenticated: false,
        user: null,
        token: null,
        permissions: [],
        lastActivity: null,
        usuario_id: null,           // ID del usuario
        unidad_actual_id: null,     // ID de la unidad actual
    },

    // Pasos de pantallas (wizard/stepper)
    screenSteps: {
        currentStep: 0,
        totalSteps: 0,
        steps: [],
        isCompleted: false,
        canGoBack: true,
        canGoNext: false,
    },

    // Elementos guardados temporalmente
    savedElements: {
        forms: {},
        selections: {},
        filters: {},
        preferences: {},
    },

    // Estado de carga global
    loading: {
        global: false,
        specific: {},
    },

    // Notificaciones y mensajes
    notifications: {
        messages: [],
        unreadCount: 0,
    },

    // Estado de modales y paneles
    modals: {
        active: null,
        data: {},
    },

    // Historial de navegación
    navigation: {
        history: [],
        currentPath: "",
        previousPath: "",
    },

    // Configuraciones temporales
    tempConfig: {
        theme: "light",
        language: "es",
        sidebarCollapsed: false,
    },
};

// Tipos de acciones
export const ACTION_TYPES = {
    // Sesión de usuario
    SET_USER_SESSION: "SET_USER_SESSION",
    UPDATE_USER_SESSION: "UPDATE_USER_SESSION",
    CLEAR_USER_SESSION: "CLEAR_USER_SESSION",
    UPDATE_USER_PERMISSIONS: "UPDATE_USER_PERMISSIONS",
    UPDATE_LAST_ACTIVITY: "UPDATE_LAST_ACTIVITY",

    // Pasos de pantallas
    SET_SCREEN_STEPS: "SET_SCREEN_STEPS",
    NEXT_STEP: "NEXT_STEP",
    PREVIOUS_STEP: "PREVIOUS_STEP",
    GO_TO_STEP: "GO_TO_STEP",
    RESET_STEPS: "RESET_STEPS",
    COMPLETE_STEPS: "COMPLETE_STEPS",

    // Elementos guardados
    SAVE_ELEMENT: "SAVE_ELEMENT",
    UPDATE_SAVED_ELEMENT: "UPDATE_SAVED_ELEMENT",
    REMOVE_SAVED_ELEMENT: "REMOVE_SAVED_ELEMENT",
    CLEAR_SAVED_ELEMENTS: "CLEAR_SAVED_ELEMENTS",

    // Estado de carga
    SET_LOADING: "SET_LOADING",
    SET_SPECIFIC_LOADING: "SET_SPECIFIC_LOADING",
    CLEAR_LOADING: "CLEAR_LOADING",

    // Notificaciones
    ADD_NOTIFICATION: "ADD_NOTIFICATION",
    REMOVE_NOTIFICATION: "REMOVE_NOTIFICATION",
    MARK_NOTIFICATION_READ: "MARK_NOTIFICATION_READ",
    CLEAR_NOTIFICATIONS: "CLEAR_NOTIFICATIONS",

    // Modales
    OPEN_MODAL: "OPEN_MODAL",
    CLOSE_MODAL: "CLOSE_MODAL",
    UPDATE_MODAL_DATA: "UPDATE_MODAL_DATA",

    // Navegación
    UPDATE_NAVIGATION: "UPDATE_NAVIGATION",
    ADD_TO_HISTORY: "ADD_TO_HISTORY",

    // Configuraciones temporales
    UPDATE_TEMP_CONFIG: "UPDATE_TEMP_CONFIG",
    RESET_TEMP_CONFIG: "RESET_TEMP_CONFIG",
};

// Reducer principal
function appActionsReducer(state, action) {
    switch (action.type) {
        // === SESIÓN DE USUARIO ===
        case ACTION_TYPES.SET_USER_SESSION:
            return {
                ...state,
                userSession: {
                    ...state.userSession,
                    ...action.payload,
                },
            };

        case ACTION_TYPES.UPDATE_USER_SESSION:
            return {
                ...state,
                userSession: {
                    ...state.userSession,
                    ...action.payload,
                },
            };

        case ACTION_TYPES.CLEAR_USER_SESSION:
            return {
                ...state,
                userSession: initialState.userSession,
            };

        case ACTION_TYPES.UPDATE_USER_PERMISSIONS:
            return {
                ...state,
                userSession: {
                    ...state.userSession,
                    permissions: action.payload,
                },
            };

        case ACTION_TYPES.UPDATE_LAST_ACTIVITY:
            return {
                ...state,
                userSession: {
                    ...state.userSession,
                    lastActivity: new Date().toISOString(),
                },
            };

        // === PASOS DE PANTALLAS ===
        case ACTION_TYPES.SET_SCREEN_STEPS:
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    ...action.payload,
                },
            };

        case ACTION_TYPES.NEXT_STEP:
            const nextStep = Math.min(state.screenSteps.currentStep + 1, state.screenSteps.totalSteps - 1);
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    currentStep: nextStep,
                    canGoNext: nextStep < state.screenSteps.totalSteps - 1,
                    canGoBack: nextStep > 0,
                },
            };

        case ACTION_TYPES.PREVIOUS_STEP:
            const prevStep = Math.max(state.screenSteps.currentStep - 1, 0);
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    currentStep: prevStep,
                    canGoNext: prevStep < state.screenSteps.totalSteps - 1,
                    canGoBack: prevStep > 0,
                },
            };

        case ACTION_TYPES.GO_TO_STEP:
            const targetStep = Math.max(0, Math.min(action.payload, state.screenSteps.totalSteps - 1));
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    currentStep: targetStep,
                    canGoNext: targetStep < state.screenSteps.totalSteps - 1,
                    canGoBack: targetStep > 0,
                },
            };

        case ACTION_TYPES.RESET_STEPS:
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    currentStep: 0,
                    canGoNext: state.screenSteps.totalSteps > 1,
                    canGoBack: false,
                    isCompleted: false,
                },
            };

        case ACTION_TYPES.COMPLETE_STEPS:
            return {
                ...state,
                screenSteps: {
                    ...state.screenSteps,
                    isCompleted: true,
                },
            };

        // === ELEMENTOS GUARDADOS ===
        case ACTION_TYPES.SAVE_ELEMENT:
            return {
                ...state,
                savedElements: {
                    ...state.savedElements,
                    [action.payload.category]: {
                        ...state.savedElements[action.payload.category],
                        [action.payload.key]: action.payload.value,
                    },
                },
            };

        case ACTION_TYPES.UPDATE_SAVED_ELEMENT:
            return {
                ...state,
                savedElements: {
                    ...state.savedElements,
                    [action.payload.category]: {
                        ...state.savedElements[action.payload.category],
                        [action.payload.key]: {
                            ...state.savedElements[action.payload.category]?.[action.payload.key],
                            ...action.payload.value,
                        },
                    },
                },
            };

        case ACTION_TYPES.REMOVE_SAVED_ELEMENT:
            const { [action.payload.key]: removed, ...rest } = state.savedElements[action.payload.category];
            return {
                ...state,
                savedElements: {
                    ...state.savedElements,
                    [action.payload.category]: rest,
                },
            };

        case ACTION_TYPES.CLEAR_SAVED_ELEMENTS:
            return {
                ...state,
                savedElements: {
                    ...state.savedElements,
                    [action.payload.category]: {},
                },
            };

        // === ESTADO DE CARGA ===
        case ACTION_TYPES.SET_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    global: action.payload,
                },
            };

        case ACTION_TYPES.SET_SPECIFIC_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    specific: {
                        ...state.loading.specific,
                        [action.payload.key]: action.payload.value,
                    },
                },
            };

        case ACTION_TYPES.CLEAR_LOADING:
            return {
                ...state,
                loading: {
                    global: false,
                    specific: {},
                },
            };

        // === NOTIFICACIONES ===
        case ACTION_TYPES.ADD_NOTIFICATION:
            const newNotification = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                read: false,
                ...action.payload,
            };
            return {
                ...state,
                notifications: {
                    messages: [newNotification, ...state.notifications.messages],
                    unreadCount: state.notifications.unreadCount + 1,
                },
            };

        case ACTION_TYPES.REMOVE_NOTIFICATION:
            const filteredNotifications = state.notifications.messages.filter(
                (msg) => msg.id !== action.payload
            );
            return {
                ...state,
                notifications: {
                    messages: filteredNotifications,
                    unreadCount: filteredNotifications.filter((msg) => !msg.read).length,
                },
            };

        case ACTION_TYPES.MARK_NOTIFICATION_READ:
            const updatedNotifications = state.notifications.messages.map((msg) =>
                msg.id === action.payload ? { ...msg, read: true } : msg
            );
            return {
                ...state,
                notifications: {
                    messages: updatedNotifications,
                    unreadCount: updatedNotifications.filter((msg) => !msg.read).length,
                },
            };

        case ACTION_TYPES.CLEAR_NOTIFICATIONS:
            return {
                ...state,
                notifications: {
                    messages: [],
                    unreadCount: 0,
                },
            };

        // === MODALES ===
        case ACTION_TYPES.OPEN_MODAL:
            return {
                ...state,
                modals: {
                    active: action.payload.type,
                    data: action.payload.data || {},
                },
            };

        case ACTION_TYPES.CLOSE_MODAL:
            return {
                ...state,
                modals: {
                    active: null,
                    data: {},
                },
            };

        case ACTION_TYPES.UPDATE_MODAL_DATA:
            return {
                ...state,
                modals: {
                    ...state.modals,
                    data: {
                        ...state.modals.data,
                        ...action.payload,
                    },
                },
            };

        // === NAVEGACIÓN ===
        case ACTION_TYPES.UPDATE_NAVIGATION:
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    ...action.payload,
                },
            };

        case ACTION_TYPES.ADD_TO_HISTORY:
            return {
                ...state,
                navigation: {
                    ...state.navigation,
                    history: [...state.navigation.history, action.payload].slice(-10), // Mantener solo los últimos 10
                },
            };

        // === CONFIGURACIONES TEMPORALES ===
        case ACTION_TYPES.UPDATE_TEMP_CONFIG:
            return {
                ...state,
                tempConfig: {
                    ...state.tempConfig,
                    ...action.payload,
                },
            };

        case ACTION_TYPES.RESET_TEMP_CONFIG:
            return {
                ...state,
                tempConfig: initialState.tempConfig,
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

// Proveedor del contexto
export function AppActionsProvider({ children }) {
    const [state, dispatch] = useReducer(appActionsReducer, initialState);

    // === ACCIONES DE SESIÓN ===
    const setUserSession = useCallback((sessionData) => {
        dispatch({ type: ACTION_TYPES.SET_USER_SESSION, payload: sessionData });
    }, []);

    const updateUserSession = useCallback((updates) => {
        dispatch({ type: ACTION_TYPES.UPDATE_USER_SESSION, payload: updates });
    }, []);

    const clearUserSession = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_USER_SESSION });
    }, []);

    const updateUserPermissions = useCallback((permissions) => {
        dispatch({ type: ACTION_TYPES.UPDATE_USER_PERMISSIONS, payload: permissions });
    }, []);

    const updateLastActivity = useCallback(() => {
        dispatch({ type: ACTION_TYPES.UPDATE_LAST_ACTIVITY });
    }, []);

    // === ACCIONES DE PASOS ===
    const setScreenSteps = useCallback((stepsConfig) => {
        dispatch({ type: ACTION_TYPES.SET_SCREEN_STEPS, payload: stepsConfig });
    }, []);

    const nextStep = useCallback(() => {
        dispatch({ type: ACTION_TYPES.NEXT_STEP });
    }, []);

    const previousStep = useCallback(() => {
        dispatch({ type: ACTION_TYPES.PREVIOUS_STEP });
    }, []);

    const goToStep = useCallback((stepIndex) => {
        dispatch({ type: ACTION_TYPES.GO_TO_STEP, payload: stepIndex });
    }, []);

    const resetSteps = useCallback(() => {
        dispatch({ type: ACTION_TYPES.RESET_STEPS });
    }, []);

    const completeSteps = useCallback(() => {
        dispatch({ type: ACTION_TYPES.COMPLETE_STEPS });
    }, []);

    // === ACCIONES DE ELEMENTOS GUARDADOS ===
    const saveElement = useCallback((category, key, value) => {
        dispatch({ type: ACTION_TYPES.SAVE_ELEMENT, payload: { category, key, value } });
    }, []);

    const updateSavedElement = useCallback((category, key, value) => {
        dispatch({ type: ACTION_TYPES.UPDATE_SAVED_ELEMENT, payload: { category, key, value } });
    }, []);

    const removeSavedElement = useCallback((category, key) => {
        dispatch({ type: ACTION_TYPES.REMOVE_SAVED_ELEMENT, payload: { category, key } });
    }, []);

    const clearSavedElements = useCallback((category) => {
        dispatch({ type: ACTION_TYPES.CLEAR_SAVED_ELEMENTS, payload: { category } });
    }, []);

    // === ACCIONES DE CARGA ===
    const setLoading = useCallback((isLoading) => {
        dispatch({ type: ACTION_TYPES.SET_LOADING, payload: isLoading });
    }, []);

    const setSpecificLoading = useCallback((key, isLoading) => {
        dispatch({ type: ACTION_TYPES.SET_SPECIFIC_LOADING, payload: { key, value: isLoading } });
    }, []);

    const clearLoading = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_LOADING });
    }, []);

    // === ACCIONES DE NOTIFICACIONES ===
    const addNotification = useCallback((notification) => {
        dispatch({ type: ACTION_TYPES.ADD_NOTIFICATION, payload: notification });
    }, []);

    const removeNotification = useCallback((id) => {
        dispatch({ type: ACTION_TYPES.REMOVE_NOTIFICATION, payload: id });
    }, []);

    const markNotificationRead = useCallback((id) => {
        dispatch({ type: ACTION_TYPES.MARK_NOTIFICATION_READ, payload: id });
    }, []);

    const clearNotifications = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLEAR_NOTIFICATIONS });
    }, []);

    // === ACCIONES DE MODALES ===
    const openModal = useCallback((type, data = {}) => {
        dispatch({ type: ACTION_TYPES.OPEN_MODAL, payload: { type, data } });
    }, []);

    const closeModal = useCallback(() => {
        dispatch({ type: ACTION_TYPES.CLOSE_MODAL });
    }, []);

    const updateModalData = useCallback((data) => {
        dispatch({ type: ACTION_TYPES.UPDATE_MODAL_DATA, payload: data });
    }, []);

    // === ACCIONES DE NAVEGACIÓN ===
    const updateNavigation = useCallback((navigationData) => {
        dispatch({ type: ACTION_TYPES.UPDATE_NAVIGATION, payload: navigationData });
    }, []);

    const addToHistory = useCallback((path) => {
        dispatch({ type: ACTION_TYPES.ADD_TO_HISTORY, payload: path });
    }, []);

    // === ACCIONES DE CONFIGURACIÓN ===
    const updateTempConfig = useCallback((config) => {
        dispatch({ type: ACTION_TYPES.UPDATE_TEMP_CONFIG, payload: config });
    }, []);

    const resetTempConfig = useCallback(() => {
        dispatch({ type: ACTION_TYPES.RESET_TEMP_CONFIG });
    }, []);

    // Valor del contexto
    const value = {
        // Estado
        state,

        // Acciones de sesión
        setUserSession,
        updateUserSession,
        clearUserSession,
        updateUserPermissions,
        updateLastActivity,

        // Acciones de pasos
        setScreenSteps,
        nextStep,
        previousStep,
        goToStep,
        resetSteps,
        completeSteps,

        // Acciones de elementos guardados
        saveElement,
        updateSavedElement,
        removeSavedElement,
        clearSavedElements,

        // Acciones de carga
        setLoading,
        setSpecificLoading,
        clearLoading,

        // Acciones de notificaciones
        addNotification,
        removeNotification,
        markNotificationRead,
        clearNotifications,

        // Acciones de modales
        openModal,
        closeModal,
        updateModalData,

        // Acciones de navegación
        updateNavigation,
        addToHistory,

        // Acciones de configuración
        updateTempConfig,
        resetTempConfig,
    };

    return (
        <AppActionsContext.Provider value={value}>
            {children}
        </AppActionsContext.Provider>
    );
}

// Hook personalizado para usar el contexto
export function useAppActions() {
    const context = useContext(AppActionsContext);

    if (!context) {
        throw new Error("useAppActions must be used within an AppActionsProvider");
    }

    return context;
}

// PropTypes
AppActionsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppActionsContext;
