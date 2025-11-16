/**
=========================================================
* GestiaSoft - Change Stage Modal Component
=========================================================
* Modal for changing the current stage of a gestion
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
    Autocomplete,
    Paper,
    LinearProgress,
    Box,
    Typography,
    Divider,
    Alert
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import TimelineIcon from "@mui/icons-material/Timeline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftEditor from "components/SoftEditor";

// Utils
import { buildTimelineFromAPI } from "../utils/timelineBuilder";

// Hooks
import { useUserSession } from "hooks/useUserSession";

function ChangeStageModal({ open, onClose, gestion, onSave }) {
    // Obtener datos del usuario de la sesión
    const { user, unidad_actual_id: sessionUnidadActualId } = useUserSession();
    // Obtener el nombre de la unidad de la sesión (prioridad sobre cualquier otra unidad)
    const unidadNombre = user?.unidad?.nombre || user?.departamento || user?.unidad_actual?.nombre || "No especificada";
    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre_paso: "",
        descripcion_paso: "",
        unidades_seleccionadas: [],
        comentarios: "",
        archivos: []
    });

    // Construir eventos del timeline desde los datos de la gestión
    const timelineEvents = buildTimelineFromAPI(gestion);

    // Estados de validación
    const [errors, setErrors] = useState({});
    const [isDragging, setIsDragging] = useState(false);

    // Función para obtener el color del icono basado en el estado
    const getTimelineIconColor = (color) => {
        switch (color) {
            case 'success':
                return 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)';
            case 'info':
                return 'linear-gradient(45deg, #2196f3 30%, #42a5f5 90%)';
            case 'warning':
                return 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)';
            default:
                return 'linear-gradient(45deg, #9e9e9e 30%, #bdbdbd 90%)';
        }
    };

    // Función para obtener el icono basado en el tipo
    const getTimelineIcon = (iconType) => {
        switch (iconType) {
            case 'check_circle':
                return <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />;
            case 'schedule':
                return <TimelineIcon sx={{ fontSize: 16, color: 'white' }} />;
            default:
                return <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />;
        }
    };

    // Unidades disponibles (hardcoded por ahora)
    const unidadesDisponibles = [
        { id: 1, nombre: 'Gerencia administrativa' },
        { id: 2, nombre: 'Unidad de Ejecución de Gasto' },
        { id: 3, nombre: 'Unidad contabilidad' },
        { id: 4, nombre: 'Depto. De Aduanas' },
        { id: 5, nombre: 'Unidad de compra' },
        { id: 6, nombre: 'ULMIE' },
        { id: 7, nombre: 'Depto de Bienes Nacionales' }
    ];

    // Validación del formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre_paso.trim()) {
            newErrors.nombre_paso = "El nombre del paso es requerido";
        }

        if (!formData.descripcion_paso.trim()) {
            newErrors.descripcion_paso = "La descripción del paso es requerida";
        } else if (formData.descripcion_paso.trim().length < 10) {
            newErrors.descripcion_paso = "La descripción debe tener al menos 10 caracteres";
        }

        // Validación de unidades removida - es opcional llevar a fin sin unidad

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar guardado
    const handleSave = async () => {
        if (validateForm()) {
            try {
                console.log("Guardando cambio de etapa:", formData);

                // Llamar a la función de guardado
                await onSave(formData);

                // Mostrar mensaje de éxito
                console.log("✅ Cambio de etapa guardado exitosamente");

                // Cerrar el modal
                handleClose();

                // No recargar la página - el componente padre manejará la actualización
                console.log("✅ Cambio de etapa procesado - el componente padre actualizará los datos");

            } catch (error) {
                console.error("❌ Error al guardar cambio de etapa:", error);

                // Mostrar mensaje de error
                if (window.showNotification) {
                    window.showNotification({
                        type: 'error',
                        message: 'Error al guardar el cambio de etapa. Intente nuevamente.'
                    });
                }
            }
        }
    };

    // Manejar cierre del modal
    const handleClose = () => {
        // Resetear formulario
        setFormData({
            nombre_paso: "",
            descripcion_paso: "",
            unidades_seleccionadas: [],
            comentarios: "",
            archivos: []
        });
        setErrors({});
        onClose();
    };

    // Manejar archivos
    const handleFileDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files);
        handleFiles(files);
    };

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        handleFiles(files);
    };

    const handleFiles = (files) => {
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            file: file
        }));

        setFormData({ ...formData, archivos: [...formData.archivos, ...newFiles] });
    };

    const handleFileRemove = (fileId) => {
        setFormData({ ...formData, archivos: formData.archivos.filter(f => f.id !== fileId) });
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
                    <TimelineIcon sx={{ fontSize: 28 }} />
                    <SoftBox>
                        <SoftTypography variant="h5" fontWeight="bold" color="white">
                            Cambiar Etapa de Gestión
                        </SoftTypography>
                        <SoftTypography variant="body2" color="white" opacity={0.9}>
                            Gestión: {gestion?.nombre || "Nueva Gestión"}
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
                <IconButton
                    onClick={handleClose}
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
                <SoftBox display="flex" gap={3}>
                    {/* Contenido principal */}
                    <SoftBox flex={1} display="flex" flexDirection="column" gap={3}>
                        {/* 1. Información actual de la gestión */}
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
                                📋 Información Actual
                            </SoftTypography>
                            <SoftBox display="flex" flexDirection="column" gap={1.5}>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                                        Estado:
                                    </SoftTypography>
                                    <Chip
                                        label={gestion?.estado_nombre || "En Proceso"}
                                        color="primary"
                                        size="small"
                                        sx={{
                                            background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                            color: '#1565c0',
                                            fontWeight: '600'
                                        }}
                                    />
                                </SoftBox>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                                        Paso Actual:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" fontWeight="bold" color="dark">
                                        {gestion?.nombre_paso || "Paso 1"}
                                    </SoftTypography>
                                </SoftBox>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                                        Fecha de Llegada:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {gestion?.fecha_llegada_paso ? new Date(gestion.fecha_llegada_paso).toLocaleDateString('es-ES') : "N/A"}
                                    </SoftTypography>
                                </SoftBox>
                                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                                        Unidad Actual:
                                    </SoftTypography>
                                    <Chip
                                        label={unidadNombre}
                                        size="small"
                                        sx={{
                                            background: 'linear-gradient(45deg, #e8f5e9 30%, #c8e6c9 90%)',
                                            color: '#2e7d32',
                                            fontWeight: '600'
                                        }}
                                    />
                                </SoftBox>
                            </SoftBox>
                        </Paper>

                        {/* 2. Nueva etapa */}
                        <Paper
                            elevation={0}
                            sx={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                                🔄 Nueva Etapa
                            </SoftTypography>
                            <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                                Nombre del Nuevo Paso
                            </SoftTypography>
                            <SoftBox display="flex" flexDirection="column" gap={2}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={3}
                                    placeholder="Ej. Validación Final"
                                    value={formData.nombre_paso}
                                    onChange={(e) => setFormData({ ...formData, nombre_paso: e.target.value })}
                                    error={!!errors.nombre_paso}
                                    helperText={errors.nombre_paso}
                                    variant="outlined"
                                    required
                                    inputProps={{
                                        spellCheck: false,
                                        autoComplete: "off"
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '8px',
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main'
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'primary.main',
                                                borderWidth: '2px'
                                            }
                                        },
                                        '& .MuiInputBase-input': {
                                            overflow: 'auto',
                                            resize: 'none',
                                            wordBreak: 'break-all',
                                            whiteSpace: 'pre-wrap',
                                            width: '100%'
                                        },
                                        '& .MuiInputBase-inputMultiline': {
                                            width: '100% !important',
                                            minWidth: '100%'
                                        }
                                    }}
                                />
                                <SoftBox display="flex" flexDirection="column" gap={1}>
                                    <SoftTypography variant="h6" fontWeight="bold" color="dark">
                                        Descripción del paso
                                    </SoftTypography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        maxRows={8}
                                        placeholder="Describe el propósito o acciones esperadas en esta etapa..."
                                        value={formData.descripcion_paso}
                                        onChange={(e) => setFormData({ ...formData, descripcion_paso: e.target.value })}
                                        error={!!errors.descripcion_paso}
                                        helperText={errors.descripcion_paso}
                                        required
                                        variant="outlined"
                                        inputProps={{
                                            spellCheck: false,
                                            autoComplete: "off",
                                            maxLength: 500
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "8px",
                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "primary.main"
                                                },
                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: "primary.main",
                                                    borderWidth: "2px"
                                                }
                                            },
                                            "& .MuiInputBase-input": {
                                                overflow: "auto",
                                                resize: "none",
                                                wordBreak: "break-all",
                                                whiteSpace: "pre-wrap",
                                                width: "100%"
                                            },
                                            "& .MuiInputBase-inputMultiline": {
                                                width: "100% !important",
                                                minWidth: "100%"
                                            }
                                        }}
                                    />
                                    <SoftBox display="flex" justifyContent="flex-end">
                                        <SoftTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                                            {formData.descripcion_paso.length}/500 caracteres
                                        </SoftTypography>
                                    </SoftBox>
                                </SoftBox>
                            </SoftBox>
                        </Paper>

                        {/* 3. Asignación de unidades */}
                        <Paper
                            elevation={0}
                            sx={{
                                padding: '20px',
                                borderRadius: '12px',
                                border: '1px solid #e0e0e0'
                            }}
                        >
                            <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                                👥 Añadir Unidades
                            </SoftTypography>
                            <Autocomplete
                                multiple
                                options={unidadesDisponibles}
                                value={formData.unidades_seleccionadas}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, unidades_seleccionadas: newValue });
                                    if (errors.unidades_seleccionadas) {
                                        setErrors({ ...errors, unidades_seleccionadas: "" });
                                    }
                                }}
                                getOptionLabel={(option) => option?.nombre || ""}
                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option?.nombre}
                                            color="primary"
                                            size="small"
                                            {...getTagProps({ index })}
                                            key={option?.id}
                                            sx={{
                                                background: 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)',
                                                color: '#ffffff',
                                                fontWeight: '600',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #45a049 30%, #4caf50 90%)'
                                                }
                                            }}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Seleccione las unidades..."
                                        error={!!errors.unidades_seleccionadas}
                                        helperText={errors.unidades_seleccionadas || "Selecciona las unidades que participarán en la siguiente etapa"}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: '8px'
                                            }
                                        }}
                                    />
                                )}
                            />
                        </Paper>




                    </SoftBox>

                    {/* Timeline lateral (opcional) */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: '250px',
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                            maxHeight: '600px',
                            overflowY: 'auto'
                        }}
                    >
                        <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                            📅 Historial de Etapas
                        </SoftTypography>

                        {/* Timeline items - Datos reales del API */}
                        <SoftBox display="flex" flexDirection="column" gap={2}>
                            {timelineEvents.map((event, index) => (
                                <SoftBox key={index} display="flex" gap={1}>
                                    <SoftBox
                                        sx={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: getTimelineIconColor(event.color),
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0
                                        }}
                                    >
                                        {getTimelineIcon(event.icon)}
                                    </SoftBox>
                                    <SoftBox>
                                        <SoftTypography variant="caption" fontWeight="bold" color="dark">
                                            {event.title}
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="text" display="block">
                                            {event.dateTime}
                                        </SoftTypography>
                                        {event.badges && event.badges.length > 0 && (
                                            <SoftBox display="flex" flexDirection="column" gap={0.5} mt={0.5}>
                                                {/* Mostrar paso primero */}

                                                {/* Mostrar unidades debajo del paso */}
                                                <SoftBox display="flex" flexWrap="wrap" gap={0.5}>
                                                    {event.badges
                                                        .filter(badge => !badge.includes('Paso #'))
                                                        .map((badge, badgeIndex) => (
                                                            <Chip
                                                                key={badgeIndex}
                                                                label={badge}
                                                                size="small"
                                                                sx={{
                                                                    height: '18px',
                                                                    fontSize: '0.65rem',
                                                                    background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                                    color: '#1565c0'
                                                                }}
                                                            />
                                                        ))}
                                                </SoftBox>
                                            </SoftBox>
                                        )}
                                    </SoftBox>
                                </SoftBox>
                            ))}

                            {/* Etapa futura - Nueva Etapa */}
                            {formData.nombre_paso && (
                                <SoftBox display="flex" gap={1}>
                                    <SoftBox
                                        sx={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            border: '2px dashed #9e9e9e'
                                        }}
                                    >
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            ?
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox>
                                        <SoftTypography variant="caption" fontWeight="bold" color="text">
                                            {formData.nombre_paso}
                                        </SoftTypography>
                                        <SoftTypography variant="caption" color="text" display="block">
                                            Pendiente
                                        </SoftTypography>
                                    </SoftBox>
                                </SoftBox>
                            )}
                        </SoftBox>
                    </Paper>
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
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleClose}
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
                            }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={handleSave}
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
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Guardar Cambio de Etapa
                    </Button>
                </SoftBox>
            </DialogActions>
        </Dialog>
    );
}

ChangeStageModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    gestion: PropTypes.object,
    onSave: PropTypes.func.isRequired
};

export default ChangeStageModal;

