/**
=========================================================
* GestiaSoft - useDocuments Hook
=========================================================
* Hook personalizado para manejar la carga de documentos adjuntos
*/

import { useState, useEffect, useCallback } from 'react';
import adjuntosService from 'services/adjuntosService';

export const useDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Cargar documentos adjuntos de una gestión específica
     * @param {number} gestionId - ID de la gestión
     * @param {number} workflowId - ID del workflow
     * @param {number} unidadId - ID de la unidad
     * @param {number} userId - ID del usuario
     */
    const loadDocuments = useCallback(async (gestionId, workflowId, unidadId, userId) => {
        if (!gestionId) {
            console.warn('⚠️ No se puede cargar documentos sin gestionId');
            return;
        }

        if (!userId) {
            throw new Error('userId es requerido para cargar documentos');
        }

        setLoading(true);
        setError(null);

        try {
            // Llamar al servicio de adjuntos específico
            const response = await adjuntosService.listarAdjuntos(gestionId, workflowId, unidadId, userId);

            if (response?.status === 200 && response?.data) {
                // Asegurar que response.data sea un array
                const documentsData = Array.isArray(response.data.data) ? response.data.data : [];
                setDocuments(documentsData);
            } else {
                throw new Error(response?.mensaje || 'Error al cargar documentos');
            }
        } catch (error) {
            console.error('❌ Error al cargar documentos:', error);
            setError(error.message || 'Error al cargar los documentos');
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refrescar documentos (recargar)
     */
    const refreshDocuments = useCallback((gestionId, workflowId, unidadId, userId) => {
        loadDocuments(gestionId, workflowId, unidadId, userId);
    }, [loadDocuments]);

    /**
     * Limpiar documentos
     */
    const clearDocuments = useCallback(() => {
        setDocuments([]);
        setError(null);
    }, []);

    return {
        documents,
        loading,
        error,
        loadDocuments,
        refreshDocuments,
        clearDocuments
    };
};

export default useDocuments;
