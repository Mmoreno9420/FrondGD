/**
=========================================================
* GestiaSoft - Grupo Detail Component
=========================================================
* Componente para crear y editar grupos del sistema
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    TextField,
    Button,
    Grid,
    Card,
    CardContent,
    Alert,
    CircularProgress,
    Switch,
    Divider,
    Box,
    Checkbox,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";

// @mui icons
import SaveIcon from "@mui/icons-material/Save";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

const GrupoDetail = ({
    grupo = null,
    mode = "create", // "create" or "edit"
    onSave,
    onCancel,
    loading = false
}) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        descripcion: "",
        status: true
    });

    // Estado de validación
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Estado para restablecer permisos
    const [resetPermissions, setResetPermissions] = useState(false);
    const [showResetDialog, setShowResetDialog] = useState(false);

    // Función para reinicializar el formulario
    const resetForm = () => {
        setFormData({
            codigo: "",
            nombre: "",
            descripcion: "",
            status: true
        });
        setErrors({});
        setTouched({});
        setResetPermissions(false);
    };

    // Inicializar formulario cuando cambie el grupo o modo
    useEffect(() => {
        // ✅ LIMPIAR ERRORES CADA VEZ QUE SE ENTRE A LA PANTALLA
        setErrors({});
        setTouched({});

        if (mode === "edit" && grupo) {
            setFormData({
                codigo: grupo.codigo || "",
                nombre: grupo.nombre || "",
                descripcion: grupo.descripcion || "",
                status: grupo.status !== undefined ? grupo.status : true
            });
        } else {
            // Reinicializar completamente para modo crear
            resetForm();
        }
    }, [grupo, mode]);

    useEffect(() => {
        console.log("mode", mode);
        if (mode === "create") {
            resetForm();
        }
    }, [mode]);

    // Validaciones mejoradas
    const validateField = (name, value) => {
        switch (name) {
            case "codigo":
                if (!value.trim()) return "El código del grupo es requerido";
                if (value.trim().length < 2) return "El código debe tener al menos 2 caracteres";
                if (value.trim().length > 50) return "El código no puede exceder 50 caracteres";
                // Validar que solo contenga letras, números y guiones bajos
                if (!/^[A-Za-z0-9_]+$/.test(value.trim())) return "El código solo puede contener letras, números y guiones bajos";
                return "";

            case "nombre":
                if (!value.trim()) return "El nombre del grupo es requerido";
                if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
                if (value.trim().length > 100) return "El nombre no puede exceder 100 caracteres";
                return "";

            case "descripcion":
                if (value && value.trim().length > 500) return "La descripción no puede exceder 500 caracteres";
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
            const grupoData = {
                ...formData,
                ...(mode === "edit" && { grupo_id: grupo.grupo_id }),
                resetPermissions: resetPermissions
            };
            onSave(grupoData);
        }
    };

    // Manejar cambio del checkbox de restablecer permisos
    const handleResetPermissionsChange = (event) => {
        if (event.target.checked) {
            setShowResetDialog(true);
        } else {
            setResetPermissions(false);
        }
    };

    // Confirmar restablecimiento de permisos
    const confirmResetPermissions = () => {
        setResetPermissions(true);
        setShowResetDialog(false);
    };

    // Cancelar restablecimiento de permisos
    const cancelResetPermissions = () => {
        setShowResetDialog(false);
    };

    // Verificar si hay errores
    const hasErrors = Object.keys(errors).some(key => errors[key]);

    // Verificar si se ha introducido algún texto (para desbloquear el botón)
    const hasAnyInput = Object.values(formData).some(value => {
        if (typeof value === 'string') {
            return value.trim() !== '';
        }
        return value !== undefined && value !== null;
    });

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
                                    {mode === "edit" && grupo && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                    ID del Grupo:
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
                                                    #{grupo.grupo_id || ""}
                                                </SoftBadge>
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Código del Grupo */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Código del grupo:
                                            </SoftTypography>
                                            <TextField
                                                fullWidth
                                                placeholder="Ej: ADMIN, USERS, GUEST"
                                                value={formData.codigo}
                                                onChange={(e) => handleChange("codigo", e.target.value.toUpperCase())}
                                                onBlur={() => handleBlur("codigo")}
                                                error={!!errors.codigo}
                                                helperText={errors.codigo || "Código único del grupo (máx. 50 caracteres, solo letras, números y guiones bajos)"}
                                                variant="outlined"
                                                size="medium"
                                                required
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

                                    {/* Nombre del Grupo */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Nombre del grupo:
                                            </SoftTypography>
                                            <TextField
                                                fullWidth
                                                placeholder="Ingrese el nombre del grupo"
                                                value={formData.nombre}
                                                onChange={(e) => handleChange("nombre", e.target.value)}
                                                onBlur={() => handleBlur("nombre")}
                                                error={!!errors.nombre}
                                                helperText={errors.nombre}
                                                variant="outlined"
                                                size="medium"
                                                required
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

                                    {/* Descripción del Grupo */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Descripción del grupo:
                                            </SoftTypography>
                                            <TextField
                                                fullWidth
                                                placeholder="Describa el propósito y funcionalidad de este grupo..."
                                                value={formData.descripcion}
                                                onChange={(e) => handleChange("descripcion", e.target.value)}
                                                onBlur={() => handleBlur("descripcion")}
                                                error={!!errors.descripcion}
                                                helperText={errors.descripcion || "Descripción opcional del grupo (máx. 500 caracteres)"}
                                                variant="outlined"
                                                multiline
                                                rows={4}
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

                                    {/* Estado del Grupo */}
                                    <Grid item xs={12}>
                                        <SoftBox display="flex" alignItems="center" justifyContent="space-between" py={2}>
                                            <SoftTypography variant="body1" fontWeight="medium" color="text.secondary">
                                                Estado del grupo:
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

                                    {/* Restablecer Permisos (solo en modo edición) */}
                                    {mode === "edit" && (
                                        <Grid item xs={12}>
                                            <SoftBox display="flex" alignItems="center" gap={2} py={2}>
                                                <Checkbox
                                                    checked={resetPermissions}
                                                    onChange={handleResetPermissionsChange}
                                                    color="warning"
                                                    size="large"
                                                    sx={{
                                                        color: '#ff9800',
                                                        '&.Mui-checked': {
                                                            color: '#ff9800',
                                                        },
                                                    }}
                                                />
                                                <SoftBox display="flex" alignItems="center" gap={1}>
                                                    <Box
                                                        sx={{
                                                            color: '#ff9800',
                                                            fontSize: '1.2rem',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        🔐
                                                    </Box>
                                                    <SoftTypography variant="body1" fontWeight="medium" color="warning.main">
                                                        Restablecer permisos del grupo
                                                    </SoftTypography>
                                                </SoftBox>
                                            </SoftBox>
                                        </Grid>
                                    )}

                                    {/* Información de auditoría (solo en modo edición) */}
                                    {mode === "edit" && grupo && (
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
                                                        value={grupo.created_at ? new Date(grupo.created_at).toLocaleString('es-ES') : "N/A"}
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
                                                        value={grupo.updated_at ? new Date(grupo.updated_at).toLocaleString('es-ES') : "N/A"}
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
                                {loading ? "Guardando..." : (mode === "create" ? "Crear Grupo" : "Guardar cambios")}
                            </Button>
                        </SoftBox>
                    </Grid>
                </Grid>
            </form>

            {/* Dialog de confirmación para restablecer permisos */}
            <Dialog
                open={showResetDialog}
                onClose={cancelResetPermissions}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                        border: "1px solid #f0f0f0",
                        overflow: "hidden"
                    }
                }}
            >
                {/* Header con icono y título */}
                <DialogTitle sx={{ pb: 1 }}>
                    <SoftBox display="flex" alignItems="center" gap={2}>
                        <Box
                            sx={{
                                fontSize: "2rem",
                                color: "#ff9800",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            🔐
                        </Box>
                        <SoftTypography
                            variant="h6"
                            fontWeight="bold"
                            color="#2c3e50"
                            sx={{ fontSize: "1.25rem" }}
                        >
                            Confirmar Restablecimiento de Permisos
                        </SoftTypography>
                    </SoftBox>
                </DialogTitle>

                {/* Contenido del mensaje */}
                <DialogContent sx={{ px: 3, pb: 2 }}>
                    <SoftBox display="flex" flexDirection="column" gap={2}>
                        <SoftTypography variant="body1" color="#2c3e50" fontSize="1rem">
                            ¿Estás seguro de que deseas restablecer los permisos de este grupo?
                        </SoftTypography>

                        <SoftTypography variant="body1" color="#2c3e50" fontSize="1rem">
                            Se eliminarán todos los permisos personalizados y se aplicarán los permisos por defecto del sistema.
                        </SoftTypography>

                        <SoftTypography
                            variant="body2"
                            color="#6c757d"
                            fontSize="0.9rem"
                            sx={{ fontStyle: "italic" }}
                        >
                            Esta acción no se puede deshacer y afectará a todos los usuarios con acceso a este grupo.
                        </SoftTypography>
                    </SoftBox>
                </DialogContent>

                {/* Botones de acción */}
                <DialogActions sx={{ p: 3, gap: 2, justifyContent: "center" }}>
                    <Button
                        onClick={cancelResetPermissions}
                        variant="outlined"
                        sx={{
                            minWidth: 120,
                            height: 44,
                            textTransform: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "medium",
                            borderColor: "#6c757d",
                            color: "#6c757d",
                            backgroundColor: "#f8f9fa",
                            "&:hover": {
                                borderColor: "#495057",
                                backgroundColor: "#e9ecef",
                                transform: "translateY(-1px)",
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        Cancelar
                    </Button>

                    <Button
                        onClick={confirmResetPermissions}
                        variant="contained"
                        sx={{
                            minWidth: 120,
                            height: 44,
                            textTransform: "none",
                            borderRadius: "8px",
                            fontSize: "1rem",
                            fontWeight: "medium",
                            color: "white",
                            boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                            "&:hover": {
                                backgroundColor: "#1565c0",
                                transform: "translateY(-1px)",
                                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        Restablecer
                    </Button>
                </DialogActions>
            </Dialog>
        </SoftBox>
    );
};

// PropTypes para validación de props
GrupoDetail.propTypes = {
    grupo: PropTypes.shape({
        grupo_id: PropTypes.number,
        codigo: PropTypes.string,
        nombre: PropTypes.string,
        descripcion: PropTypes.string,
        status: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    mode: PropTypes.oneOf(["create", "edit"]),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool,
};

// Valores por defecto
GrupoDetail.defaultProps = {
    grupo: null,
    loading: false,
};

export default GrupoDetail;




