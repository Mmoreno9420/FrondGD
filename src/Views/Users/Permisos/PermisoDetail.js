/**
=========================================================
* GestiaSoft - Permiso Detail Component
=========================================================
* Formulario para crear/editar permisos del sistema
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Grid,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    CircularProgress,
    Divider,
    Card,
    CardContent,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";

// @mui icons
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

function PermisoDetail({ permiso, mode, onSave, onCancel, loading }) {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        modulo: "",
        accion: "",
        status: true
    });

    // Estado para los errores de validación
    const [errors, setErrors] = useState({});
    // Estado para campos tocados
    const [touched, setTouched] = useState({});

    // Opciones predefinidas para módulos y acciones
    const modulos = [
        "General",
        "Usuarios",
        "Reportes",
        "Configuración",
        "Auditoría",
        "Seguridad",
        "Administración",
        "Finanzas",
        "Inventario",
        "Ventas"
    ];

    const acciones = [
        "leer",
        "escribir",
        "editar",
        "eliminar",
        "exportar",
        "importar",
        "aprobar",
        "rechazar",
        "asignar",
        "desasignar"
    ];

    // Función para reinicializar el formulario
    const resetForm = () => {
        setFormData({
            nombre: "",
            descripcion: "",
            modulo: "",
            accion: "",
            status: true
        });
        setErrors({});
        setTouched({});
    };

    // Inicializar formulario cuando cambie el permiso o mode
    useEffect(() => {
        // ✅ LIMPIAR ERRORES CADA VEZ QUE SE ENTRE A LA PANTALLA
        setErrors({});
        setTouched({});

        if (mode === "edit" && permiso) {
            setFormData({
                nombre: permiso.nombre || "",
                descripcion: permiso.descripcion || "",
                modulo: permiso.modulo || "",
                accion: permiso.accion || "",
                status: permiso.status !== undefined ? permiso.status : true
            });
        } else {
            // Reinicializar completamente para modo crear
            resetForm();
        }
    }, [permiso, mode]);

    // Validaciones mejoradas
    const validateField = (name, value) => {
        switch (name) {
            case "nombre":
                if (!value) return "El nombre del permiso es requerido";
                if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
                if (value.length > 50) return "El nombre no puede exceder 50 caracteres";
                return "";
            case "descripcion":
                if (value && value.length > 500) return "La descripción no puede exceder 500 caracteres";
                return "";
            case "modulo":
                if (!value) return "Debe seleccionar un módulo";
                return "";
            case "accion":
                if (!value) return "Debe seleccionar una acción";
                return "";
            default:
                return "";
        }
    };

    // Manejar cambios en los campos con validación inmediata
    const handleChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validar campo inmediatamente al cambiar
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Manejar blur de campos
    const handleBlur = (name) => {
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, formData[name]);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    // Validar todo el formulario
    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Marcar todos los campos como tocados
        const allTouched = {};
        Object.keys(formData).forEach(key => {
            allTouched[key] = true;
        });
        setTouched(allTouched);

        if (validateForm()) {
            const submitData = {
                ...formData,
                permiso_id: mode === "edit" ? permiso.permiso_id : undefined
            };
            onSave(submitData);
        }
    };

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).some(key => errors[key]);

    // Verificar si se ha introducido algún dato (para desbloquear el botón)
    const hasAnyInput = formData.nombre || formData.modulo || formData.accion;

    return (
        <SoftBox>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3} direction="column">
                    {/* Alertas de validación */}
                    {hasErrors && (
                        <Grid item xs={12}>
                            <Alert severity="error" sx={{ mb: 2 }}>
                                Por favor, validar los campos del formulario.
                            </Alert>
                        </Grid>
                    )}

                    {/* Formulario Unificado */}
                    <Grid item>
                        <Card
                            sx={{
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                borderRadius: "16px",
                                border: "1px solid #f0f0f0",
                                overflow: "hidden"
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Grid container spacing={3} direction="column">
                                    {/* ID (solo en modo edición) */}
                                    {mode === "edit" && permiso && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                    ID del Permiso:
                                                </SoftTypography>
                                                <SoftBadge
                                                    color="info"
                                                    variant="contained"
                                                    size="lg"
                                                    sx={{
                                                        backgroundColor: "#e3f2fd",
                                                        color: "#1976d2",
                                                        fontSize: "1rem",
                                                        fontWeight: "bold",
                                                        padding: "8px 16px",
                                                        borderRadius: "20px",
                                                        border: "1px solid #bbdefb"
                                                    }}
                                                >
                                                    #{permiso.permiso_id || ""}
                                                </SoftBadge>
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Nombre */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Nombre del Permiso:
                                            </SoftTypography>
                                            <TextField
                                                fullWidth
                                                value={formData.nombre}
                                                onChange={(e) => handleChange("nombre", e.target.value)}
                                                onBlur={() => handleBlur("nombre")}
                                                error={!!errors.nombre}
                                                helperText={errors.nombre}
                                                placeholder="Ej: Ver usuarios"
                                                variant="outlined"
                                                size="medium"
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
                                                    }
                                                }}
                                            />
                                        </SoftBox>
                                    </Grid>

                                    {/* Descripción */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Descripción:
                                            </SoftTypography>
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={formData.descripcion}
                                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                                onBlur={() => handleBlur("descripcion")}
                                                error={!!errors.descripcion}
                                                helperText={errors.descripcion || `${formData.descripcion.length}/500 caracteres`}
                                                placeholder="Describe qué permite hacer este permiso..."
                                                variant="outlined"
                                                size="medium"
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
                                                    }
                                                }}
                                            />
                                        </SoftBox>
                                    </Grid>

                                    {/* Módulo */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Módulo:
                                            </SoftTypography>
                                            <FormControl fullWidth error={!!errors.modulo}>
                                                <Select
                                                    value={formData.modulo}
                                                    onChange={(e) => handleChange("modulo", e.target.value)}
                                                    onBlur={() => handleBlur("modulo")}
                                                    displayEmpty
                                                    size="medium"
                                                    sx={{
                                                        borderRadius: "8px",
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "primary.main"
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "primary.main",
                                                            borderWidth: "2px"
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Seleccionar módulo</em>
                                                    </MenuItem>
                                                    {modulos.map((modulo) => (
                                                        <MenuItem key={modulo} value={modulo}>
                                                            {modulo}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.modulo && (
                                                    <SoftTypography variant="caption" color="error" mt={0.5}>
                                                        {errors.modulo}
                                                    </SoftTypography>
                                                )}
                                            </FormControl>
                                        </SoftBox>
                                    </Grid>

                                    {/* Acción */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Acción:
                                            </SoftTypography>
                                            <FormControl fullWidth error={!!errors.accion}>
                                                <Select
                                                    value={formData.accion}
                                                    onChange={(e) => handleChange("accion", e.target.value)}
                                                    onBlur={() => handleBlur("accion")}
                                                    displayEmpty
                                                    size="medium"
                                                    sx={{
                                                        borderRadius: "8px",
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "primary.main"
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: "primary.main",
                                                            borderWidth: "2px"
                                                        }
                                                    }}
                                                >
                                                    <MenuItem value="">
                                                        <em>Seleccionar acción</em>
                                                    </MenuItem>
                                                    {acciones.map((accion) => (
                                                        <MenuItem key={accion} value={accion}>
                                                            {accion}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.accion && (
                                                    <SoftTypography variant="caption" color="error" mt={0.5}>
                                                        {errors.accion}
                                                    </SoftTypography>
                                                )}
                                            </FormControl>
                                        </SoftBox>
                                    </Grid>

                                    {/* Estado */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" alignItems="center" justifyContent="space-between" py={2}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Estado del permiso:
                                            </SoftTypography>
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftTypography
                                                    variant="body1"
                                                    color={formData.status ? "success.main" : "text.secondary"}
                                                    fontWeight="medium"
                                                >
                                                    {formData.status ? "Activo" : "Inactivo"}
                                                </SoftTypography>
                                                <Switch
                                                    checked={formData.status}
                                                    onChange={(e) => handleChange("status", e.target.checked)}
                                                    color="primary"
                                                    size="large"
                                                    sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#1976d2',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                            },
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#1976d2',
                                                        },
                                                    }}
                                                />
                                            </SoftBox>
                                        </SoftBox>
                                    </Grid>

                                    {/* Información de auditoría (solo en modo edición) */}
                                    {mode === "edit" && permiso && (
                                        <>
                                            <Divider sx={{ my: 2 }} />
                                            <Grid item xs={12}>
                                                <SoftTypography variant="h6" fontWeight="bold" color="#2c3e50" mb={2}>
                                                    📋 Información de Auditoría
                                                </SoftTypography>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <SoftBox display="flex" flexDirection="column" gap={1}>
                                                    <SoftTypography variant="body2" fontWeight="medium" color="text.secondary">
                                                        Fecha de Creación:
                                                    </SoftTypography>
                                                    <TextField
                                                        fullWidth
                                                        value={permiso.created_at ? new Date(permiso.created_at).toLocaleString('es-ES') : "N/A"}
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "8px",
                                                            },
                                                        }}
                                                    />
                                                </SoftBox>
                                            </Grid>

                                            <Grid item xs={12} md={6}>
                                                <SoftBox display="flex" flexDirection="column" gap={1}>
                                                    <SoftTypography variant="body2" fontWeight="medium" color="text.secondary">
                                                        Última Actualización:
                                                    </SoftTypography>
                                                    <TextField
                                                        fullWidth
                                                        value={permiso.updated_at ? new Date(permiso.updated_at).toLocaleString('es-ES') : "N/A"}
                                                        variant="outlined"
                                                        size="small"
                                                        InputProps={{
                                                            readOnly: true,
                                                        }}
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                backgroundColor: "#f8f9fa",
                                                                borderRadius: "8px",
                                                            },
                                                        }}
                                                    />
                                                </SoftBox>
                                            </Grid>
                                        </>
                                    )}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Botones de acción */}
                    <Grid item>
                        <SoftBox
                            display="flex"
                            gap={2}
                            justifyContent="flex-end"
                            pt={3}
                        >
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onCancel}
                                disabled={loading}
                                sx={{
                                    minWidth: 140,
                                    height: 48,
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: "medium",
                                    borderColor: "#6c757d",
                                    color: "#6c757d",
                                    backgroundColor: "white",
                                    "&:hover": {
                                        borderColor: "#495057",
                                        backgroundColor: "#f8f9fa",
                                        transform: "translateY(-1px)",
                                    },
                                    transition: "all 0.2s ease"
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading || hasErrors || (mode === "create" && !hasAnyInput)}
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                sx={{
                                    minWidth: 140,
                                    height: 48,
                                    borderRadius: "8px",
                                    textTransform: "none",
                                    fontSize: "1rem",
                                    fontWeight: "medium",
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor: "#1565c0",
                                        transform: "translateY(-1px)",
                                    },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {loading ? "Guardando..." : (mode === "create" ? "Crear Permiso" : "Guardar cambios")}
                            </Button>
                        </SoftBox>
                    </Grid>
                </Grid>
            </form>

            {/* Información adicional */}
            <SoftBox mt={4}>
                <Alert severity="info" sx={{ borderRadius: '8px' }}>
                    <SoftTypography variant="body2" fontWeight="medium">
                        💡 <strong>Nota:</strong> Los permisos definen las acciones específicas que los usuarios pueden realizar
                        en el sistema. Asegúrate de que el nombre sea descriptivo y que la combinación módulo-acción sea clara
                        para facilitar la gestión de roles y permisos.
                    </SoftTypography>
                </Alert>
            </SoftBox>
        </SoftBox>
    );
}

// PropTypes para validación de props
PermisoDetail.propTypes = {
    permiso: PropTypes.shape({
        permiso_id: PropTypes.number,
        nombre: PropTypes.string,
        descripcion: PropTypes.string,
        modulo: PropTypes.string,
        accion: PropTypes.string,
        status: PropTypes.bool,
        created_at: PropTypes.string,
        created_by: PropTypes.number,
        updated_at: PropTypes.string,
        updated_by: PropTypes.number
    }),
    mode: PropTypes.oneOf(["create", "edit"]).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

// Valores por defecto
PermisoDetail.defaultProps = {
    permiso: null,
    loading: false
};

export default PermisoDetail;




