/**
 * =========================================================
 * File Service - Manejo de archivos y documentos
 * =========================================================
 * Servicio para subir, descargar y gestionar archivos
 */

import api from './api';

/**
 * Función para subir archivos de una gestión
 * @param {number} gestionId - ID de la gestión
 * @param {Array} files - Array de archivos a subir
 * @param {number} userId - ID del usuario de sesión
 * @param {number} workflowId - ID del workflow
 * @param {number} unidadId - ID de la unidad
 * @returns {Promise} - Respuesta del servidor
 */
export const uploadGestionFiles = async (gestionId, files, userId, workflowId = 0, unidadId = 0) => {
    try {
        console.log('📤 Iniciando subida de archivos:', {
            gestionId,
            userId,
            workflowId,
            unidadId,
            totalArchivos: files.length
        });

        // Subir cada archivo individualmente
        const uploadPromises = files.map(async (fileObj) => {
            const file = fileObj.file || fileObj;

            // Crear FormData para el archivo
            const formData = new FormData();
            formData.append('file', file);

            // Preparar la estructura de datos requerida
            const dataPayload = {
                accion: 1,
                user_id: userId,
                data: {
                    gestion_id: gestionId,
                    adjunto_id: 0, // Nuevo archivo
                    workflow_id: workflowId,
                    nombre_archivo: fileObj.documentName || file.name,
                    ruta_archivo: `DocsGestiones/${gestionId}/${fileObj.documentName || file.name}`, // Estructura correcta
                    tipo_mime: file.type || 'application/pdf',
                    unidad_id: unidadId
                }
            };

            // Agregar los datos como JSON string
            formData.append('metadata', JSON.stringify(dataPayload));

            console.log('📎 Subiendo archivo:', {
                nombre: file.name,
                tamaño: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                tipo: file.type
            });

            // Enviar archivo al servidor
            const response = await api.post('/adjuntos/manage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`   Progreso: ${percentCompleted}%`);
                },
            });

            console.log('✅ Archivo subido exitosamente:', file.name);
            return response.data;
        });

        // Esperar a que todos los archivos se suban
        const results = await Promise.all(uploadPromises);

        console.log('✅ Todos los archivos subidos exitosamente');
        return results;
    } catch (error) {
        console.error('❌ Error al subir archivos:', error);
        throw error;
    }
};

/**
 * Función para subir archivos usando FormData directamente
 * @param {number} gestionId - ID de la gestión
 * @param {Array} files - Array de archivos a subir
 * @param {number} userId - ID del usuario
 * @param {number} workflowId - ID del workflow
 * @param {number} unidadId - ID de la unidad (de sesión)
 * @returns {Promise} - Resultado de la subida
 */
export const uploadFilesLocally = async (gestionId, files, userId, workflowId = 0, unidadId = null) => {
    try {
        console.log('📤 Iniciando subida REAL de archivos:', {
            gestionId,
            userId,
            workflowId,
            unidadId,
            totalArchivos: files.length,
            ruta: `DocsGestiones/Gestiones_${gestionId}`
        });

        // Subir cada archivo individualmente
        const uploadPromises = files.map(async (fileObj) => {
            const file = fileObj.file || fileObj;
            const fileName = fileObj.documentName || file.name;
            const descripcion = fileObj.description || fileObj.descripcion || 'Documento adjunto a la gestión';

            console.log('📎 Subiendo archivo:', {
                nombre: fileName,
                tamaño: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                tipo: file.type
            });

            // Crear FormData según el formato que me indicaste
            const formData = new FormData();
            formData.append('accion', '1');
            formData.append('user_id', userId.toString());
            formData.append('gestion_id', gestionId.toString());
            formData.append('workflow_id', workflowId.toString());
            formData.append('descripcion', descripcion);
            formData.append('archivo', file); // El archivo real

            // Agregar unidad_id de la sesión si está disponible
            if (unidadId) {
                formData.append('unidad_id', unidadId.toString());
            }

            console.log('📋 FormData preparado:', {
                accion: '1',
                user_id: userId,
                gestion_id: gestionId,
                workflow_id: workflowId,
                unidad_id: unidadId || 'no especificada',
                descripcion: descripcion,
                archivo: fileName
            });

            // Enviar archivo al servidor usando FormData
            const response = await api.post('/adjuntos/manage', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    console.log(`   Progreso ${fileName}: ${percentCompleted}%`);
                },
            });

            console.log(`✅ Archivo subido exitosamente: ${fileName}`);
            return {
                success: true,
                fileName: fileName,
                filePath: `DocsGestiones/Gestiones_${gestionId}/${fileName}`,
                size: file.size,
                type: file.type,
                gestionId: gestionId,
                response: response
            };
        });

        // Esperar a que todos los archivos se suban
        const results = await Promise.all(uploadPromises);

        console.log(`✅ Todos los archivos subidos REALMENTE a DocsGestiones/Gestiones_${gestionId}`);
        return results;
    } catch (error) {
        console.error('❌ Error al subir archivos:', error);
        throw error;
    }
};

/**
 * Función para crear carpeta en el servidor (ya no necesaria - el backend la crea automáticamente)
 * @param {number} gestionId - ID de la gestión
 * @returns {Promise} - Respuesta del servidor
 */
export const createGestionFolder = async (gestionId) => {
    // Esta función ya no es necesaria porque el backend crea la carpeta automáticamente
    // al subir el primer archivo con /adjuntos/manage
    console.log(`📂 La carpeta para gestión ${gestionId} se creará automáticamente en el backend`);
    return Promise.resolve({ success: true, message: 'Carpeta se creará automáticamente' });
};

/**
 * Función para obtener archivos de una gestión
 * @param {number} gestionId - ID de la gestión
 * @returns {Promise} - Lista de archivos
 */
export const getGestionFiles = async (gestionId) => {
    try {
        const response = await api.get(`/gestiones/${gestionId}/archivos`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener archivos:', error);
        throw error;
    }
};

/**
 * Función para eliminar un archivo
 * @param {number} gestionId - ID de la gestión
 * @param {number} fileId - ID del archivo
 * @returns {Promise} - Respuesta del servidor
 */
export const deleteGestionFile = async (gestionId, fileId) => {
    try {
        const response = await api.delete(`/gestiones/${gestionId}/archivos/${fileId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar archivo:', error);
        throw error;
    }
};

/**
 * Función para descargar un archivo
 * @param {number} gestionId - ID de la gestión
 * @param {number} fileId - ID del archivo
 * @returns {Promise} - Blob del archivo
 */
export const downloadGestionFile = async (gestionId, fileId) => {
    try {
        const response = await api.get(`/gestiones/${gestionId}/archivos/${fileId}/download`, {
            responseType: 'blob'
        });

        return response.data;
    } catch (error) {
        console.error('Error al descargar archivo:', error);
        throw error;
    }
};

/**
 * Función para validar archivos antes de subir
 * @param {Array} files - Array de archivos
 * @param {Object} options - Opciones de validación
 * @returns {Object} - { valid: boolean, errors: Array }
 */
export const validateFiles = (files, options = {}) => {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB por defecto
        allowedTypes = ['application/pdf'], // Solo PDF por defecto
        maxFiles = 10
    } = options;

    const errors = [];

    // Validar número de archivos
    if (files.length > maxFiles) {
        errors.push(`Solo se permiten hasta ${maxFiles} archivos`);
    }

    // Validar cada archivo
    files.forEach((file, index) => {
        const actualFile = file.file || file;

        // Validar tamaño
        if (actualFile.size > maxSize) {
            errors.push(
                `El archivo "${actualFile.name}" excede el tamaño máximo de ${maxSize / 1024 / 1024}MB`
            );
        }

        // Validar tipo
        if (!allowedTypes.includes(actualFile.type)) {
            errors.push(
                `El archivo "${actualFile.name}" no es un tipo permitido. Solo se permiten: ${allowedTypes.join(', ')}`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
};

export default {
    uploadGestionFiles,
    createGestionFolder,
    getGestionFiles,
    deleteGestionFile,
    downloadGestionFile,
    validateFiles
};

