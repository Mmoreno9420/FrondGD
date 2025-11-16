/**
=========================================================
* GestiaSoft - PantallaPermiso Detail Component
=========================================================
* Formulario para crear/editar asignaciones de permisos a pantallas
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

function PantallaPermisoDetail({ pantallaPermiso, mode, onSave, onCancel, loading }) {
    // Estado del formulario
    const [formData, setFormData] = useState({
        pantalla_id: "",
        pantalla_nombre: "",
        permiso_id: "",
        permiso_nombre: "",
        status: true
    });

    // Estado para los errores de validación
    const [errors, setErrors] = useState({});
    // Estado para campos tocados
    const [touched, setTouched] = useState({});

    // Datos de ejemplo para pantallas y permisos (en producción vendrían de la API)
    const pantallas = [
        { id: 1, nombre: "Dashboard" },
        { id: 2, nombre: "Usuarios" },
        { id: 3, nombre: "Reportes" },
        { id: 4, nombre: "Configuración" },
        { id: 5, nombre: "Auditoría" }
    ];

    const permisos = [
        { id: 1, nombre: "Ver" },
        { id: 2, nombre: "Crear" },
        { id: 3, nombre: "Editar" },
        { id: 4, nombre: "Eliminar" },
        { id: 5, nombre: "Exportar" },
        { id: 6, nombre: "Importar" }
    ];

    // Función para reinicializar el formulario
    const resetForm = () => {
        setFormData({
            pantalla_id: "",
            pantalla_nombre: "",
            permiso_id: "",
            permiso_nombre: "",
            status: true
        });
        setErrors({});
        setTouched({});
    };

    // Inicializar formulario cuando cambie el pantallaPermiso o mode
    useEffect(() => {
        // ✅ LIMPIAR ERRORES CADA VEZ QUE SE ENTRE A LA PANTALLA
        setErrors({});
        setTouched({});

        if (mode === "edit" && pantallaPermiso) {
            setFormData({
                pantalla_id: pantallaPermiso.pantalla_id || "",
                pantalla_nombre: pantallaPermiso.pantalla_nombre || "",
                permiso_id: pantallaPermiso.permiso_id || "",
                permiso_nombre: pantallaPermiso.permiso_nombre || "",
                status: pantallaPermiso.status !== undefined ? pantallaPermiso.status : true
            });
        } else {
            // Reinicializar completamente para modo crear
            resetForm();
        }
    }, [pantallaPermiso, mode]);

    // Validaciones mejoradas
    const validateField = (name, value) => {
        switch (name) {
            case "pantalla_id":
                if (!value) return "Debe seleccionar una pantalla";
                return "";
            case "permiso_id":
                if (!value) return "Debe seleccionar un permiso";
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
            if (key !== "pantalla_nombre" && key !== "permiso_nombre") { // Solo validar campos editables
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
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
            if (key !== "pantalla_nombre" && key !== "permiso_nombre") {
                allTouched[key] = true;
            }
        });
        setTouched(allTouched);

        if (validateForm()) {
            const submitData = {
                ...formData,
                pantalla_permiso_id: mode === "edit" ? pantallaPermiso.pantalla_permiso_id : undefined
            };
            onSave(submitData);
        }
    };

    // Función para manejar cambio de pantalla
    const handlePantallaChange = (pantallaId) => {
        const pantalla = pantallas.find(p => p.id === parseInt(pantallaId));
        setFormData(prev => ({
            ...prev,
            pantalla_id: pantallaId,
            pantalla_nombre: pantalla ? pantalla.nombre : ""
        }));

        // Limpiar error del campo
        if (errors.pantalla_id) {
            setErrors(prev => ({ ...prev, pantalla_id: "" }));
        }

        setTouched(prev => ({ ...prev, pantalla_id: true }));
    };

    // Función para manejar cambio de permiso
    const handlePermisoChange = (permisoId) => {
        const permiso = permisos.find(p => p.id === parseInt(permisoId));
        setFormData(prev => ({
            ...prev,
            permiso_id: permisoId,
            permiso_nombre: permiso ? permiso.nombre : ""
        }));

        // Limpiar error del campo
        if (errors.permiso_id) {
            setErrors(prev => ({ ...prev, permiso_id: "" }));
        }

        setTouched(prev => ({ ...prev, permiso_id: true }));
    };

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).some(key => errors[key]);

    // Verificar si se ha introducido algún dato (para desbloquear el botón)
    const hasAnyInput = formData.pantalla_id || formData.permiso_id;

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
                                    {mode === "edit" && pantallaPermiso && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                    ID de la Asignación:
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
                                                    #{pantallaPermiso.pantalla_permiso_id || ""}
                                                </SoftBadge>
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Selección de Pantalla */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Pantalla:
                                            </SoftTypography>
                                            <FormControl fullWidth error={!!errors.pantalla_id}>
                                                <Select
                                                    value={formData.pantalla_id}
                                                    onChange={(e) => handlePantallaChange(e.target.value)}
                                                    onBlur={() => handleBlur("pantalla_id")}
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
                                                        <em>Seleccionar pantalla</em>
                                                    </MenuItem>
                                                    {pantallas.map((pantalla) => (
                                                        <MenuItem key={pantalla.id} value={pantalla.id}>
                                                            {pantalla.nombre}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.pantalla_id && (
                                                    <SoftTypography variant="caption" color="error" mt={0.5}>
                                                        {errors.pantalla_id}
                                                    </SoftTypography>
                                                )}
                                            </FormControl>
                                        </SoftBox>
                                    </Grid>

                                    {/* Selección de Permiso */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Permiso:
                                            </SoftTypography>
                                            <FormControl fullWidth error={!!errors.permiso_id}>
                                                <Select
                                                    value={formData.permiso_id}
                                                    onChange={(e) => handlePermisoChange(e.target.value)}
                                                    onBlur={() => handleBlur("permiso_id")}
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
                                                        <em>Seleccionar permiso</em>
                                                    </MenuItem>
                                                    {permisos.map((permiso) => (
                                                        <MenuItem key={permiso.id} value={permiso.id}>
                                                            {permiso.nombre}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.permiso_id && (
                                                    <SoftTypography variant="caption" color="error" mt={0.5}>
                                                        {errors.permiso_id}
                                                    </SoftTypography>
                                                )}
                                            </FormControl>
                                        </SoftBox>
                                    </Grid>

                                    {/* Nombre de Pantalla (solo lectura) */}
                                    {formData.pantalla_nombre && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                    Nombre de Pantalla:
                                                </SoftTypography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.pantalla_nombre}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled={true}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                        },
                                                    }}
                                                />
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Nombre de Permiso (solo lectura) */}
                                    {formData.permiso_nombre && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                    Nombre de Permiso:
                                                </SoftTypography>
                                                <TextField
                                                    fullWidth
                                                    value={formData.permiso_nombre}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    disabled={true}
                                                    variant="outlined"
                                                    size="medium"
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                        },
                                                    }}
                                                />
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Estado */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" alignItems="center" justifyContent="space-between" py={2}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Estado de la asignación:
                                            </SoftTypography>
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftTypography
                                                    variant="body1"
                                                    color={formData.status ? "success.main" : "text.secondary"}
                                                    fontWeight="medium"
                                                >
                                                    {formData.status ? "Activa" : "Inactiva"}
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
                                    {mode === "edit" && pantallaPermiso && (
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
                                                        value={pantallaPermiso.created_at ? new Date(pantallaPermiso.created_at).toLocaleString('es-ES') : "N/A"}
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
                                                        value={pantallaPermiso.updated_at ? new Date(pantallaPermiso.updated_at).toLocaleString('es-ES') : "N/A"}
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
                                {loading ? "Guardando..." : (mode === "create" ? "Crear Asignación" : "Guardar cambios")}
                            </Button>
                        </SoftBox>
                    </Grid>
                </Grid>
            </form>

            {/* Información adicional */}
            <SoftBox mt={4}>
                <Alert severity="info" sx={{ borderRadius: '8px' }}>
                    <SoftTypography variant="body2" fontWeight="medium">
                        💡 <strong>Nota:</strong> Esta asignación permite que los usuarios con el rol correspondiente
                        tengan acceso al permiso especificado en la pantalla seleccionada.
                        Asegúrate de que la combinación pantalla-permiso sea única en el sistema.
                    </SoftTypography>
                </Alert>
            </SoftBox>
        </SoftBox>
    );
}

// PropTypes para validación de props
PantallaPermisoDetail.propTypes = {
    pantallaPermiso: PropTypes.shape({
        pantalla_permiso_id: PropTypes.number,
        pantalla_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        pantalla_nombre: PropTypes.string,
        permiso_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        permiso_nombre: PropTypes.string,
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
PantallaPermisoDetail.defaultProps = {
    pantallaPermiso: null,
    loading: false
};

export default PantallaPermisoDetail;
