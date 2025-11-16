/**
=========================================================
* GestiaSoft - useSavedElements Hook
=========================================================
* Hook específico para manejar elementos guardados temporalmente
*/

import { useCallback, useMemo } from "react";
import { useAppActions } from "../context/AppActionsContext";

export const useSavedElements = () => {
    const { state, saveElement, updateSavedElement, removeSavedElement, clearSavedElements } = useAppActions();

    const { savedElements } = state;

    // Guardar un elemento
    const save = useCallback((category, key, value) => {
        saveElement(category, key, value);
    }, [saveElement]);

    // Actualizar un elemento existente
    const update = useCallback((category, key, value) => {
        updateSavedElement(category, key, value);
    }, [updateSavedElement]);

    // Remover un elemento
    const remove = useCallback((category, key) => {
        removeSavedElement(category, key);
    }, [removeSavedElement]);

    // Limpiar todos los elementos de una categoría
    const clear = useCallback((category) => {
        clearSavedElements(category);
    }, [clearSavedElements]);

    // Obtener un elemento específico
    const get = useCallback((category, key) => {
        return savedElements[category]?.[key] || null;
    }, [savedElements]);

    // Obtener todos los elementos de una categoría
    const getAll = useCallback((category) => {
        return savedElements[category] || {};
    }, [savedElements]);

    // Verificar si existe un elemento
    const has = useCallback((category, key) => {
        return savedElements[category]?.[key] !== undefined;
    }, [savedElements]);

    // Obtener elementos de formularios
    const forms = useMemo(() => savedElements.forms || {}, [savedElements.forms]);

    // Obtener elementos de selecciones
    const selections = useMemo(() => savedElements.selections || {}, [savedElements.selections]);

    // Obtener elementos de filtros
    const filters = useMemo(() => savedElements.filters || {}, [savedElements.filters]);

    // Obtener elementos de preferencias
    const preferences = useMemo(() => savedElements.preferences || {}, [savedElements.preferences]);

    // Guardar formulario
    const saveForm = useCallback((formKey, formData) => {
        save("forms", formKey, formData);
    }, [save]);

    // Obtener formulario
    const getForm = useCallback((formKey) => {
        return get("forms", formKey);
    }, [get]);

    // Guardar selección
    const saveSelection = useCallback((selectionKey, selectionData) => {
        save("selections", selectionKey, selectionData);
    }, [save]);

    // Obtener selección
    const getSelection = useCallback((selectionKey) => {
        return get("selections", selectionKey);
    }, [get]);

    // Guardar filtro
    const saveFilter = useCallback((filterKey, filterData) => {
        save("filters", filterKey, filterData);
    }, [save]);

    // Obtener filtro
    const getFilter = useCallback((filterKey) => {
        return get("filters", filterKey);
    }, [get]);

    // Guardar preferencia
    const savePreference = useCallback((preferenceKey, preferenceData) => {
        save("preferences", preferenceKey, preferenceData);
    }, [save]);

    // Obtener preferencia
    const getPreference = useCallback((preferenceKey) => {
        return get("preferences", preferenceKey);
    }, [get]);

    // Limpiar formularios
    const clearForms = useCallback(() => {
        clear("forms");
    }, [clear]);

    // Limpiar selecciones
    const clearSelections = useCallback(() => {
        clear("selections");
    }, [clear]);

    // Limpiar filtros
    const clearFilters = useCallback(() => {
        clear("filters");
    }, [clear]);

    // Limpiar preferencias
    const clearPreferences = useCallback(() => {
        clear("preferences");
    }, [clear]);

    // Limpiar todo
    const clearAll = useCallback(() => {
        clear("forms");
        clear("selections");
        clear("filters");
        clear("preferences");
    }, [clear]);

    return {
        // Estado
        savedElements,
        forms,
        selections,
        filters,
        preferences,

        // Acciones generales
        save,
        update,
        remove,
        clear,
        get,
        getAll,
        has,

        // Acciones específicas para formularios
        saveForm,
        getForm,
        clearForms,

        // Acciones específicas para selecciones
        saveSelection,
        getSelection,
        clearSelections,

        // Acciones específicas para filtros
        saveFilter,
        getFilter,
        clearFilters,

        // Acciones específicas para preferencias
        savePreference,
        getPreference,
        clearPreferences,

        // Acciones de limpieza
        clearAll,
    };
};
