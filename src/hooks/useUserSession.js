/**
=========================================================
* GestiaSoft - useUserSession Hook
=========================================================
* Hook específico para manejar la sesión de usuario
*/

import { useCallback, useEffect } from "react";
import { useAppActions } from "../context/AppActionsContext";

export const useUserSession = () => {
    const { state, setUserSession, updateUserSession, clearUserSession, updateUserPermissions, updateLastActivity } = useAppActions();

    const { userSession } = state;

    // Verificar si el usuario está autenticado
    const isAuthenticated = userSession.isAuthenticated;
    const user = userSession.user;
    const token = userSession.token;
    const permissions = userSession.permissions;
    const lastActivity = userSession.lastActivity;
    const usuario_id = userSession.usuario_id;
    const unidad_actual_id = userSession.unidad_actual_id;

    // Obtener rol del usuario (puede ser string o objeto)
    const rol = userSession.user?.rol;
    const id_rol = userSession.user?.id_rol || userSession.user?.rol?.id_rol;

    // Login del usuario
    const login = useCallback((userData, userToken, userPermissions = [], usuarioId = null, unidadActualId = null) => {
        // Extraer IDs del userData si no se proveen explícitamente
        const finalUsuarioId = usuarioId || userData?.usuario_id || userData?.id;
        const finalUnidadActualId = unidadActualId || userData?.unidad_actual_id || userData?.unidad?.unidad_id;

        setUserSession({
            isAuthenticated: true,
            user: userData,
            token: userToken,
            permissions: userPermissions,
            lastActivity: new Date().toISOString(),
            usuario_id: finalUsuarioId,
            unidad_actual_id: finalUnidadActualId,
        });

        // Guardar en localStorage
        localStorage.setItem("authToken", userToken);
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
        localStorage.setItem("usuario_id", finalUsuarioId.toString());
        localStorage.setItem("unidad_actual_id", finalUnidadActualId.toString());
    }, [setUserSession]);

    // Logout del usuario
    const logout = useCallback(() => {
        clearUserSession();

        // Limpiar localStorage
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("userPermissions");
        localStorage.removeItem("usuario_id");
        localStorage.removeItem("unidad_actual_id");
    }, [clearUserSession]);

    // Actualizar datos del usuario
    const updateUser = useCallback((userData) => {
        updateUserSession({ user: userData });

        // Actualizar en localStorage
        localStorage.setItem("userData", JSON.stringify(userData));
    }, [updateUserSession]);

    // Actualizar permisos del usuario
    const updatePermissions = useCallback((newPermissions) => {
        updateUserPermissions(newPermissions);

        // Actualizar en localStorage
        localStorage.setItem("userPermissions", JSON.stringify(newPermissions));
    }, [updateUserPermissions]);

    // Verificar si el usuario tiene un permiso específico
    const hasPermission = useCallback((permission) => {
        if (!isAuthenticated || !permissions) return false;
        return permissions.includes(permission);
    }, [isAuthenticated, permissions]);

    // Verificar si el usuario tiene al menos uno de los permisos
    const hasAnyPermission = useCallback((permissionList) => {
        if (!isAuthenticated || !permissions) return false;
        return permissionList.some(permission => permissions.includes(permission));
    }, [isAuthenticated, permissions]);

    // Verificar si el usuario tiene todos los permisos
    const hasAllPermissions = useCallback((permissionList) => {
        if (!isAuthenticated || !permissions) return false;
        return permissionList.every(permission => permissions.includes(permission));
    }, [isAuthenticated, permissions]);

    // Actualizar última actividad
    const updateActivity = useCallback(() => {
        updateLastActivity();
    }, [updateLastActivity]);

    // Cargar sesión desde localStorage al iniciar
    useEffect(() => {
        const loadSessionFromStorage = () => {
            try {
                const storedToken = localStorage.getItem("authToken");
                const storedUserData = localStorage.getItem("userData");
                const storedPermissions = localStorage.getItem("userPermissions");
                const storedUsuarioId = localStorage.getItem("usuario_id");
                const storedUnidadActualId = localStorage.getItem("unidad_actual_id");

                if (storedToken && storedUserData) {
                    const userData = JSON.parse(storedUserData);
                    const permissions = storedPermissions ? JSON.parse(storedPermissions) : [];

                    // Obtener IDs con fallback
                    const usuarioId = storedUsuarioId ? parseInt(storedUsuarioId, 10) : (userData?.usuario_id || userData?.id);
                    const unidadActualId = storedUnidadActualId ? parseInt(storedUnidadActualId, 10) : (userData?.unidad_actual_id || userData?.unidad?.unidad_id);

                    setUserSession({
                        isAuthenticated: true,
                        user: userData,
                        token: storedToken,
                        permissions: permissions,
                        lastActivity: new Date().toISOString(),
                        usuario_id: usuarioId,
                        unidad_actual_id: unidadActualId,
                    });
                }
            } catch (error) {
                console.error("Error loading session from storage:", error);
                // Si hay error, limpiar datos corruptos
                localStorage.removeItem("authToken");
                localStorage.removeItem("userData");
                localStorage.removeItem("userPermissions");
                localStorage.removeItem("usuario_id");
                localStorage.removeItem("unidad_actual_id");
            }
        };

        // Solo cargar si no hay sesión activa
        if (!isAuthenticated) {
            loadSessionFromStorage();
        }
    }, [isAuthenticated, setUserSession]);

    // Actualizar actividad en intervalos
    useEffect(() => {
        if (!isAuthenticated) return;

        const activityInterval = setInterval(() => {
            updateActivity();
        }, 60000); // Actualizar cada minuto

        return () => clearInterval(activityInterval);
    }, [isAuthenticated, updateActivity]);

    return {
        // Estado
        isAuthenticated,
        user,
        token,
        permissions,
        lastActivity,
        usuario_id,
        unidad_actual_id,
        rol,
        id_rol,

        // Acciones
        login,
        logout,
        updateUser,
        updatePermissions,
        updateActivity,

        // Verificaciones de permisos
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    };
};
