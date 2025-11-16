/**
=========================================================
* GestiaSoft - Attach Documents Modal Component
=========================================================
* Modal for attaching documents to a gestion
*/

import React, { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Chip,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    LinearProgress,
    Box,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DescriptionIcon from "@mui/icons-material/Description";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Hooks
import { useUserSession } from "hooks/useUserSession";

function AttachDocumentsModal({ open, onClose, gestion, onSave, userId, unidadActualId, userName }) {
    // Obtener datos del usuario de la sesión
    const { user, unidad_actual_id: sessionUnidadActualId } = useUserSession();
    // Obtener el nombre de la unidad de la sesión (prioridad sobre cualquier otra unidad)
    const unidadNombre = user?.unidad?.nombre || user?.departamento || user?.unidad_actual?.nombre || "No especificada";
    // Estados del formulario
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [errors, setErrors] = useState({});

    // Tipos de documentos eliminados - ya no se necesitan

    // Función para formatear tamaño de archivo
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Función para obtener extensión de archivo
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toUpperCase();
    };

    const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    // Manejar archivos seleccionados (solo PDF <= 10MB)
    const handleFiles = (files) => {
        let rejectedCount = 0;
        const validFiles = Array.from(files).filter(file => {
            const isPdf = file.type === 'application/pdf';
            const withinSize = file.size <= MAX_SIZE_BYTES;
            if (!isPdf || !withinSize) {
                rejectedCount += 1;
                console.warn(`Archivo rechazado: ${file.name} (${file.type}, ${file.size} bytes)`);
                return false;
            }
            return true;
        });

        const newFiles = validFiles.map(file => ({
            id: Date.now() + Math.random(),
            file: file,  // IMPORTANTE: Mantener el objeto File real
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        setErrors(rejectedCount > 0 ? { files: `Se omitieron ${rejectedCount} archivo(s). Solo PDF y máximo 10MB por archivo.` } : {});
    };

    // Manejar drop de archivos
    const handleFileDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
    };

    // Manejar selección de archivos
    const handleFileSelect = (event) => {
        handleFiles(event.target.files);
        event.target.value = ''; // Limpiar input
    };

    // Eliminar archivo
    const handleRemoveFile = (fileId) => {
        setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    // Función eliminada - ya no se necesitan metadatos adicionales

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};

        if (selectedFiles.length === 0) {
            newErrors.files = "Debe seleccionar al menos un archivo";
        }

        // Validaciones de campos eliminados - ya no son necesarias

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Subir archivos realmente
    const handleUpload = async () => {
        if (!validateForm()) {
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            console.log("📤 Iniciando subida REAL de archivos:", selectedFiles);

            // Actualizar progreso inicial
            setUploadProgress(10);

            // Llamar función de guardado que subirá los archivos al backend
            // Esta función ya maneja toda la lógica de subida en GestionEdit.js
            await onSave(selectedFiles);

            // Actualizar progreso final
            setUploadProgress(100);

            // Esperar un momento antes de cerrar para mostrar el progreso
            await new Promise(resolve => setTimeout(resolve, 300));

            // Cerrar modal
            handleClose();

        } catch (error) {
            console.error("❌ Error al subir archivos:", error);
            setErrors({ files: error.message || "Error al subir archivos" });
            setUploading(false);
        } finally {
            // No resetear uploadProgress aquí porque se cierra dry modal
            // setUploadProgress(0);
        }
    };

    // Cerrar modal
    const handleClose = () => {
        setSelectedFiles([]);
        setErrors({});
        setUploading(false);
        setUploadProgress(0);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    maxHeight: '90vh'
                }
            }}
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px',
                    borderRadius: '16px 16px 0 0'
                }}
            >
                <SoftBox display="flex" alignItems="center" gap={2}>
                    <AttachFileIcon sx={{ fontSize: 28 }} />
                    <SoftBox>
                        <SoftTypography variant="h5" fontWeight="bold" color="white">
                            Adjuntar Documentos
                        </SoftTypography>
                        <SoftTypography variant="body2" color="white" opacity={0.9}>
                            Gestión: {gestion?.nombre || "Nueva Gestión"} – Paso actual: {gestion?.nombre_paso || "Paso Actual"}
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
                <IconButton
                    onClick={handleClose}
                    disabled={uploading}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ padding: '24px', maxHeight: 'calc(90vh - 200px)', overflowY: 'auto' }}>
                <SoftBox display="flex" flexDirection="column" gap={3}>
                    {/* Área de carga principal */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: '12px',
                            border: `2px dashed ${isDragging ? '#1976d2' : '#dee2e6'}`,
                            backgroundColor: isDragging ? '#e3f2fd' : '#f8f9fa',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                backgroundColor: '#e9ecef',
                                borderColor: '#1976d2'
                            }
                        }}
                        onDrop={handleFileDrop}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onClick={() => document.getElementById('file-input-attach').click()}
                    >
                        <input
                            id="file-input-attach"
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            accept="application/pdf"
                            disabled={uploading}
                        />
                        <CloudUploadIcon
                            sx={{
                                fontSize: 64,
                                color: isDragging ? '#1976d2' : '#6c757d',
                                mb: 2
                            }}
                        />
                        <SoftTypography variant="h6" fontWeight="medium" color="text" mb={1}>
                            Arrastra tus archivos aquí o haz clic para seleccionarlos
                        </SoftTypography>
                        <SoftTypography variant="body2" color="text" opacity={0.7}>
                            Soporta múltiples archivos • Máximo 10MB por archivo
                        </SoftTypography>
                    </Paper>

                    {/* Lista de archivos seleccionados */}
                    {selectedFiles.length > 0 && (
                        <Paper
                            elevation={0}
                            sx={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                                📁 Archivos Seleccionados ({selectedFiles.length})
                            </SoftTypography>

                            {selectedFiles.map((file, index) => (
                                <Paper
                                    key={file.id}
                                    sx={{
                                        p: 2,
                                        mb: 2,
                                        borderRadius: '8px',
                                        border: '1px solid #e0e0e0',
                                        background: '#fafafa'
                                    }}
                                >
                                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <SoftBox display="flex" alignItems="center" gap={2}>
                                            <DescriptionIcon sx={{ color: '#1976d2' }} />
                                            <SoftBox>
                                                <SoftTypography variant="body2" fontWeight="bold" color="dark">
                                                    {file.name}
                                                </SoftTypography>
                                                <SoftTypography variant="caption" color="text">
                                                    {formatFileSize(file.size)} • {getFileExtension(file.name)}
                                                </SoftTypography>
                                            </SoftBox>
                                        </SoftBox>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveFile(file.id)}
                                            disabled={uploading}
                                            sx={{ color: '#dc3545' }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </SoftBox>

                                    {/* Campos eliminados según solicitud del usuario */}
                                </Paper>
                            ))}

                            {errors.files && (
                                <SoftTypography variant="caption" color="error" sx={{ mt: 1 }}>
                                    {errors.files}
                                </SoftTypography>
                            )}
                        </Paper>
                    )}

                    {/* Información contextual */}
                    <Paper
                        elevation={0}
                        sx={{
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                        }}
                    >
                        <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                            📋 Información Contextual
                        </SoftTypography>
                        <SoftBox display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                            <SoftBox>
                                <SoftTypography variant="caption" color="text" fontWeight="bold">
                                    Unidad Actual:
                                </SoftTypography>
                                <SoftTypography variant="body2" color="dark">
                                    {unidadNombre}
                                </SoftTypography>
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography variant="caption" color="text" fontWeight="bold">
                                    Paso del Flujo:
                                </SoftTypography>
                                <SoftTypography variant="body2" color="dark">
                                    {gestion?.nombre_paso || "Revisión Técnica"}
                                </SoftTypography>
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography variant="caption" color="text" fontWeight="bold">
                                    Usuario:
                                </SoftTypography>
                                <SoftTypography variant="body2" color="dark">
                                    {userName || 'Usuario'}
                                </SoftTypography>
                            </SoftBox>
                            <SoftBox>
                                <SoftTypography variant="caption" color="text" fontWeight="bold">
                                    Fecha y Hora:
                                </SoftTypography>
                                <SoftTypography variant="body2" color="dark">
                                    {new Date().toLocaleString('es-ES')}
                                </SoftTypography>
                            </SoftBox>
                        </SoftBox>
                    </Paper>

                    {/* Barra de progreso durante subida */}
                    {uploading && (
                        <Paper
                            elevation={0}
                            sx={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0',
                                background: '#f8f9fa'
                            }}
                        >
                            <SoftTypography variant="body2" fontWeight="medium" color="dark" mb={1}>
                                Subiendo archivos...
                            </SoftTypography>
                            <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                                sx={{
                                    height: 8,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                                    }
                                }}
                            />
                            <SoftTypography variant="caption" color="text" mt={1}>
                                {uploadProgress}% completado
                            </SoftTypography>
                        </Paper>
                    )}
                </SoftBox>
            </DialogContent>

            {/* Footer con acciones */}
            <DialogActions
                sx={{
                    padding: '20px 24px',
                    borderTop: '1px solid #e0e0e0',
                    background: '#f8f9fa'
                }}
            >
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <SoftTypography variant="body2" color="text">
                        {selectedFiles.length > 0 && `${selectedFiles.length} archivo(s) seleccionado(s)`}
                    </SoftTypography>

                    <SoftBox display="flex" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={handleClose}
                            disabled={uploading}
                            sx={{
                                border: '2px solid #9e9e9e',
                                color: '#616161',
                                borderRadius: '8px',
                                padding: '10px 24px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textTransform: 'none',
                                background: 'white',
                                '&:hover': {
                                    borderColor: '#757575',
                                    background: '#f5f5f5'
                                },
                                '&:disabled': {
                                    opacity: 0.6
                                }
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploading}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                borderRadius: '8px',
                                padding: '10px 16px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textTransform: 'none',
                                color: '#ffffff',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    color: '#ffffff',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                                },
                                '&:disabled': {
                                    background: '#e0e0e0',
                                    color: '#9e9e9e',
                                    transform: 'none',
                                    boxShadow: 'none'
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {uploading ? 'Subiendo...' : 'Subir Archivos'}
                        </Button>
                    </SoftBox>
                </SoftBox>
            </DialogActions>
        </Dialog>
    );
}

AttachDocumentsModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    gestion: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    userId: PropTypes.number,
    unidadActualId: PropTypes.number,
    userName: PropTypes.string
};

export default AttachDocumentsModal;
