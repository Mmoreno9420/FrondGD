/**
 * =========================================================
 * useUtilityLists Hook
 * =========================================================
 * Custom hook for managing utility lists (roles, groups, units)
 * Provides centralized data management for user forms
 */

import { useState, useEffect, useCallback } from 'react';
import utilityListsService from 'services/utilityListsService';

const useUtilityLists = (userId = 1) => {
    // State for each utility list
    const [roles, setRoles] = useState([]);
    const [groups, setGroups] = useState([]);
    const [units, setUnits] = useState([]);

    // Loading states
    const [rolesLoading, setRolesLoading] = useState(false);
    const [groupsLoading, setGroupsLoading] = useState(false);
    const [unitsLoading, setUnitsLoading] = useState(false);

    // Error states
    const [rolesError, setRolesError] = useState(null);
    const [groupsError, setGroupsError] = useState(null);
    const [unitsError, setUnitsError] = useState(null);

    // Combined loading state
    const isLoading = rolesLoading || groupsLoading || unitsLoading;

    // Combined error state
    const hasError = rolesError || groupsError || unitsError;

    /**
     * Normalize API response data to consistent format
     * @param {*} data - Raw API response data
     * @returns {Array} Normalized array of options
     */
    const normalizeApiResponse = (data) => {
        if (!data) return [];

        console.log("normalizeApiResponse - data recibida:", data); // Debug

        let normalizedData = [];

        // Handle different response formats
        if (Array.isArray(data)) {
            normalizedData = data.map(item => {
                console.log("normalizeApiResponse - procesando item:", item); // Debug
                if (typeof item === 'string') {
                    return {
                        value: item.toLowerCase().replace(/\s+/g, '_'),
                        label: item
                    };
                }
                if (typeof item === 'object' && (item.id || item.codigo || item.unidad_id) && (item.nombre || item.nombre_unidad)) {
                    return {
                        value: (item.codigo || item.id || item.unidad_id).toString(),
                        label: item.nombre || item.nombre_unidad
                    };
                }
                // Nuevo caso: solo viene nombre (sin código)
                if (typeof item === 'object' && (item.nombre || item.nombre_unidad) && !item.codigo && !item.id && !item.unidad_id) {
                    return {
                        value: (item.nombre || item.nombre_unidad).toLowerCase().replace(/\s+/g, '_'),
                        label: item.nombre || item.nombre_unidad
                    };
                }
                if (typeof item === 'object' && item.value && item.label) {
                    return item;
                }
                return {
                    value: item.toString(),
                    label: item.toString()
                };
            });
        }

        // Handle object response
        if (typeof data === 'object') {
            if (data.data && Array.isArray(data.data)) {
                normalizedData = data.data.map(item => {
                    // Si tiene código/id/unidad_id, usarlo como value
                    if (item.codigo || item.id || item.unidad_id) {
                        return {
                            value: (item.codigo || item.id || item.unidad_id).toString(),
                            label: item.nombre || item.nombre_unidad || item.name || item.toString()
                        };
                    }
                    // Si solo tiene nombre, usar nombre como value y label
                    return {
                        value: (item.nombre || item.nombre_unidad || item.name || item.toString()).toLowerCase().replace(/\s+/g, '_'),
                        label: item.nombre || item.nombre_unidad || item.name || item.toString()
                    };
                });
            }

            if (data.success && data.data) {
                return normalizeApiResponse(data.data);
            }
        }

        // Remove duplicates based on value
        const uniqueData = normalizedData.filter((item, index, self) =>
            index === self.findIndex(t => t.value === item.value)
        );

        console.log("🔍 normalizeApiResponse - resultado final:", uniqueData);
        console.log("🔍 normalizeApiResponse - cantidad de elementos:", uniqueData.length);
        return uniqueData;
    };

    /**
     * Fetch roles from API
     */
    const fetchRoles = useCallback(async () => {
        setRolesLoading(true);
        setRolesError(null);

        try {
            const response = await utilityListsService.getRoles(userId);
            console.log("🔍 API RESPONSE ROLES RAW:", response);
            const normalizedData = normalizeApiResponse(response);
            console.log("🔍 ROLES NORMALIZED:", normalizedData);
            setRoles(normalizedData);
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRolesError(error.message || 'Error al cargar roles');
        } finally {
            setRolesLoading(false);
        }
    }, [userId]);

    /**
     * Fetch groups from API
     */
    const fetchGroups = useCallback(async () => {
        setGroupsLoading(true);
        setGroupsError(null);

        try {
            const response = await utilityListsService.getGroups(userId);
            console.log("🔍 API RESPONSE GROUPS RAW:", response);
            console.log("🔍 API RESPONSE TYPE:", typeof response);
            console.log("🔍 API RESPONSE IS ARRAY:", Array.isArray(response));
            if (response && response.data) {
                console.log("🔍 API RESPONSE DATA:", response.data);
                console.log("🔍 API RESPONSE DATA IS ARRAY:", Array.isArray(response.data));
            }
            const normalizedData = normalizeApiResponse(response);
            console.log("🔍 GROUPS NORMALIZED:", normalizedData);
            setGroups(normalizedData);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setGroupsError(error.message || 'Error al cargar grupos');
        } finally {
            setGroupsLoading(false);
        }
    }, [userId]);

    /**
     * Fetch units from API
     */
    const fetchUnits = useCallback(async () => {
        setUnitsLoading(true);
        setUnitsError(null);

        try {
            const response = await utilityListsService.getUnits(userId);
            console.log("🔍 API RESPONSE UNITS RAW:", response);
            const normalizedData = normalizeApiResponse(response);
            console.log("🔍 UNITS NORMALIZED:", normalizedData);
            setUnits(normalizedData);
        } catch (error) {
            console.error('Error fetching units:', error);
            setUnitsError(error.message || 'Error al cargar unidades');
        } finally {
            setUnitsLoading(false);
        }
    }, [userId]);

    /**
     * Fetch all utility lists
     */
    const fetchAllLists = useCallback(async () => {
        try {
            await Promise.all([
                fetchRoles(),
                fetchGroups(),
                fetchUnits()
            ]);
        } catch (error) {
            console.error('Error fetching all utility lists:', error);
        }
    }, [fetchRoles, fetchGroups, fetchUnits]);

    /**
     * Refresh a specific list
     */
    const refreshList = useCallback((listType) => {
        switch (listType) {
            case 'roles':
                fetchRoles();
                break;
            case 'groups':
                fetchGroups();
                break;
            case 'units':
                fetchUnits();
                break;
            default:
                fetchAllLists();
        }
    }, [fetchRoles, fetchGroups, fetchUnits, fetchAllLists]);

    /**
     * Get options for a specific list type
     */
    const getOptions = useCallback((listType) => {
        switch (listType) {
            case 'roles':
                return roles;
            case 'groups':
                return groups;
            case 'units':
                return units;
            default:
                return [];
        }
    }, [roles, groups, units]);

    /**
     * Get loading state for a specific list type
     */
    const getLoadingState = useCallback((listType) => {
        switch (listType) {
            case 'roles':
                return rolesLoading;
            case 'groups':
                return groupsLoading;
            case 'units':
                return unitsLoading;
            default:
                return isLoading;
        }
    }, [rolesLoading, groupsLoading, unitsLoading, isLoading]);

    /**
     * Get error state for a specific list type
     */
    const getErrorState = useCallback((listType) => {
        switch (listType) {
            case 'roles':
                return rolesError;
            case 'groups':
                return groupsError;
            case 'units':
                return unitsError;
            default:
                return hasError;
        }
    }, [rolesError, groupsError, unitsError, hasError]);

    // Load all lists on mount
    useEffect(() => {
        fetchAllLists();
    }, [fetchAllLists]);

    return {
        // Data
        roles,
        groups,
        units,

        // Loading states
        rolesLoading,
        groupsLoading,
        unitsLoading,
        isLoading,

        // Error states
        rolesError,
        groupsError,
        unitsError,
        hasError,

        // Actions
        fetchRoles,
        fetchGroups,
        fetchUnits,
        fetchAllLists,
        refreshList,

        // Utilities
        getOptions,
        getLoadingState,
        getErrorState,

        // Combined state for convenience
        listsLoading: {
            roles: rolesLoading,
            groups: groupsLoading,
            units: unitsLoading
        },

        listsError: {
            roles: rolesError,
            groups: groupsError,
            units: unitsError
        }
    };
};

export default useUtilityLists;