/**
=========================================================
* GestiaSoft - Pacientes Page
=========================================================
* Formulario completo para gestión de pacientes
*/

import React, { useState, useEffect, useRef } from "react";

// Global Configuration
import { APP_NAME } from "config/appConfig";

// SweetAlert2
import Swal from "sweetalert2";

// @mui material components
import {
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Box,
    IconButton,
    Typography,
} from "@mui/material";

// @mui icons
// import AddIcon from "@mui/icons-material/Add"; // Comentado - no se usa
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import SaveIcon from "@mui/icons-material/Save";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftInput from "components/SoftInput";
import SoftDatePicker from "components/SoftDatePicker";

// Custom App Layout
import { AppPageLayout } from "Views/componentsApp";

// Images 
import user_logo from "assets/images/users_logo.png";

// Elementos personales disponibles
const ELEMENTOS_PERSONALES = [
    { id: "lentes", label: "Lentes" },
    { id: "audifono", label: "Audífono" },
    { id: "baston", label: "Bastón" },
    { id: "silla_ruedas", label: "Silla de ruedas" },
    { id: "marcapasos", label: "Marcapasos" },
    { id: "protesis", label: "Prótesis" },
    { id: "oxigeno_portatil", label: "Oxígeno portátil" },
    { id: "insulina", label: "Insulina" },
];

// Opciones de sexo
const OPCIONES_SEXO = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
    { value: "otro", label: "Otro" },
];

// Opciones de parentesco
const OPCIONES_PARENTESCO = [
    { value: "padre", label: "Padre" },
    { value: "madre", label: "Madre" },
    { value: "hijo", label: "Hijo" },
    { value: "hija", label: "Hija" },
    { value: "esposo", label: "Esposo" },
    { value: "esposa", label: "Esposa" },
    { value: "hermano", label: "Hermano" },
    { value: "hermana", label: "Hermana" },
    { value: "otro", label: "Otro" },
];

function Pacientes() {
    // Estado para manejar la responsividad
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Estados de los acordeones
    const [expandedFamilia, setExpandedFamilia] = useState(false);
    const [expandedElementos, setExpandedElementos] = useState(false);

    // Estado del formulario - Información Personal
    const [formData, setFormData] = useState({
        // Información Personal
        nombresCompletos: "",
        apellidos: "",
        fechaNacimiento: "",
        sexo: "",
        identificacion: "",
        direccionCompleta: "",
        telefono: "",
        correoElectronico: "",
        // Información Familiar
        nombrePadre: "",
        nombreMadre: "",
        contactoEmergencia: "",
        telefonoEmergencia: "",
        parentesco: "",
        // Elementos Personales
        elementosPersonales: [],
        otrosElementos: "",
        // Fotografía
        fotografia: null,
        fotoPreview: null,
    });

    // Estado de errores
    const [errors, setErrors] = useState({});

    // Referencia para el input de archivo
    const fileInputRef = useRef(null);

    // Hook para detectar cambios en el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 600);
            setIsTablet(width <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Manejar cambios en los campos
    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Manejar toggle de elementos personales
    const toggleElementoPersonal = (elementoId) => {
        setFormData((prev) => {
            const elementos = prev.elementosPersonales || [];
            if (elementos.includes(elementoId)) {
                return {
                    ...prev,
                    elementosPersonales: elementos.filter((id) => id !== elementoId),
                };
            } else {
                return {
                    ...prev,
                    elementosPersonales: [...elementos, elementoId],
                };
            }
        });
    };

    // Manejar upload de fotografía
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validar tipo de archivo
            if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Solo se permiten archivos JPG o PNG",
                    confirmButtonColor: "#1976d2",
                });
                return;
            }

            // Validar tamaño (5MB)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "El archivo no puede ser mayor a 5MB",
                    confirmButtonColor: "#1976d2",
                });
                return;
            }

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    fotografia: file,
                    fotoPreview: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Manejar click en área de upload
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};
        const camposRequeridos = {
            nombresCompletos: "Nombres completos",
            apellidos: "Apellidos",
            fechaNacimiento: "Fecha de nacimiento",
            sexo: "Sexo",
            identificacion: "Identificación",
            direccionCompleta: "Dirección completa",
            telefono: "Teléfono",
            correoElectronico: "Correo electrónico",
        };

        // Validar campos requeridos de información personal
        Object.keys(camposRequeridos).forEach((field) => {
            if (!formData[field] || formData[field].toString().trim() === "") {
                newErrors[field] = `${camposRequeridos[field]} es requerido`;
            }
        });

        // Validar formato de email
        if (formData.correoElectronico && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correoElectronico)) {
            newErrors.correoElectronico = "El correo electrónico no es válido";
        }

        // Validar formato de teléfono (opcional, pero si está lleno debe ser válido)
        if (formData.telefono && !/^\d{8,10}$/.test(formData.telefono.replace(/\s|-/g, ""))) {
            newErrors.telefono = "El teléfono debe tener entre 8 y 10 dígitos";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Función para limpiar formulario
    const handleLimpiar = () => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Se limpiarán todos los datos del formulario",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1976d2",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, limpiar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                setFormData({
                    nombresCompletos: "",
                    apellidos: "",
                    fechaNacimiento: "",
                    sexo: "",
                    identificacion: "",
                    direccionCompleta: "",
                    telefono: "",
                    correoElectronico: "",
                    nombrePadre: "",
                    nombreMadre: "",
                    contactoEmergencia: "",
                    telefonoEmergencia: "",
                    parentesco: "",
                    elementosPersonales: [],
                    otrosElementos: "",
                    fotografia: null,
                    fotoPreview: null,
                });
                setErrors({});
                setExpandedFamilia(false);
                setExpandedElementos(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
                Swal.fire({
                    icon: "success",
                    title: "Formulario limpiado",
                    text: "Todos los datos han sido eliminados",
                    confirmButtonColor: "#1976d2",
                });
            }
        });
    };

    // Función para validar formulario
    const handleValidar = () => {
        const isValid = validateForm();
        if (isValid) {
            Swal.fire({
                icon: "success",
                title: "Validación exitosa",
                text: "Todos los campos requeridos están correctamente completados",
                confirmButtonColor: "#1976d2",
            });
        } else {
            const camposConError = Object.keys(errors);
            const mensaje = camposConError.length > 0
                ? `Por favor, complete los siguientes campos:\n${camposConError.map((campo) => `• ${campo.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}`).join("\n")}`
                : "Por favor, complete todos los campos requeridos";

            Swal.fire({
                icon: "error",
                title: "Error de validación",
                html: mensaje.replace(/\n/g, "<br>"),
                confirmButtonColor: "#1976d2",
            });
        }
    };

    // Función para guardar formulario
    const handleGuardar = () => {
        const isValid = validateForm();
        if (!isValid) {
            const camposConError = Object.keys(errors);
            const mensaje = camposConError.length > 0
                ? `Por favor, complete los siguientes campos:\n${camposConError.map((campo) => `• ${campo.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}`).join("\n")}`
                : "Por favor, complete todos los campos requeridos";

            Swal.fire({
                icon: "error",
                title: "Error de validación",
                html: mensaje.replace(/\n/g, "<br>"),
                confirmButtonColor: "#1976d2",
            });
            return;
        }

        // Simular guardado (aquí iría la llamada al API)
        Swal.fire({
            title: "Guardando...",
            text: "Por favor espera",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        // Simular delay de guardado
        setTimeout(() => {
            Swal.fire({
                icon: "success",
                title: "Guardado exitoso",
                text: "Los datos del paciente han sido guardados correctamente",
                confirmButtonColor: "#1976d2",
            });
        }, 1500);
    };

    // Manejar cambio de acordeón
    const handleAccordionChange = (panel) => (event, isExpanded) => {
        if (panel === "familia") {
            setExpandedFamilia(isExpanded);
        } else if (panel === "elementos") {
            setExpandedElementos(isExpanded);
        }
    };

    return (
        <AppPageLayout>
            <Container
                maxWidth={false}
                sx={{
                    mx: "auto",
                    px: { xs: 1, sm: 2, md: 3 },
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "95%", md: "90%", lg: "85%" },
                }}
            >
                <SoftBox mt={2} mb={3}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    borderRadius: { xs: "12px", sm: "16px", md: "20px" },
                                    boxShadow: {
                                        xs: "0 4px 16px rgba(0, 0, 0, 0.1)",
                                        sm: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                    },
                                    border: "1px solid #f0f0f0",
                                    overflow: "hidden",
                                    width: "100%",
                                }}
                            >
                                <CardContent sx={{ padding: 0 }}>
                                    <SoftBox p={{ xs: 2, sm: 3, md: 4 }}>
                                        {/* Header - Sin botón "Nuevo usuario" */}
                                        <SoftBox
                                            mb={{ xs: 3, sm: 4, md: 5 }}
                                            display="flex"
                                            justifyContent="flex-start"
                                            alignItems="flex-start"
                                            flexWrap="wrap"
                                            gap={{ xs: 1, sm: 2 }}
                                        >
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftAvatar
                                                    src={user_logo}
                                                    alt="profile-image"
                                                    variant="rounded"
                                                    size="xl"
                                                />
                                                <SoftBox>
                                                    <SoftTypography
                                                        variant="h5"
                                                        fontWeight="medium"
                                                        color="dark"
                                                        sx={{
                                                            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                                            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 },
                                                        }}
                                                    >
                                                        Gestión de Pacientes
                                                    </SoftTypography>
                                                    <SoftTypography
                                                        variant="button"
                                                        color="text"
                                                        fontWeight="medium"
                                                        opacity={0.8}
                                                    >
                                                        Administración de pacientes {APP_NAME}
                                                    </SoftTypography>
                                                </SoftBox>
                                            </SoftBox>
                                        </SoftBox>

                                        {/* Información Personal */}
                                        <SoftBox mb={3}>
                                            <SoftTypography
                                                variant="h6"
                                                fontWeight="bold"
                                                color="dark"
                                                mb={2}
                                                sx={{
                                                    color: "#8B6914",
                                                    fontSize: "1.2rem",
                                                }}
                                            >
                                                Información Personal
                                            </SoftTypography>
                                            <Grid container spacing={2}>
                                                {/* Columna Izquierda */}
                                                <Grid item xs={12} md={6}>
                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Nombres completos
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.nombresCompletos}
                                                            onChange={(e) =>
                                                                handleChange("nombresCompletos", e.target.value)
                                                            }
                                                            error={!!errors.nombresCompletos}
                                                            helperText={errors.nombresCompletos}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Apellidos
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.apellidos}
                                                            onChange={(e) =>
                                                                handleChange("apellidos", e.target.value)
                                                            }
                                                            error={!!errors.apellidos}
                                                            helperText={errors.apellidos}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Fecha de nacimiento
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            type="date"
                                                            value={formData.fechaNacimiento}
                                                            onChange={(e) =>
                                                                handleChange("fechaNacimiento", e.target.value)
                                                            }
                                                            error={!!errors.fechaNacimiento}
                                                            helperText={errors.fechaNacimiento}
                                                            size="small"
                                                            InputLabelProps={{
                                                                shrink: true,
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <CalendarTodayIcon
                                                                        sx={{ color: "text.secondary", mr: 1 }}
                                                                    />
                                                                ),
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Sexo
                                                        </SoftTypography>
                                                        <FormControl
                                                            fullWidth
                                                            size="small"
                                                            error={!!errors.sexo}
                                                        >
                                                            <Select
                                                                value={formData.sexo}
                                                                onChange={(e) =>
                                                                    handleChange("sexo", e.target.value)
                                                                }
                                                                displayEmpty
                                                                sx={{
                                                                    borderRadius: "8px",
                                                                }}
                                                            >
                                                                <MenuItem value="">
                                                                    <em>Seleccione...</em>
                                                                </MenuItem>
                                                                {OPCIONES_SEXO.map((opcion) => (
                                                                    <MenuItem key={opcion.value} value={opcion.value}>
                                                                        {opcion.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            {errors.sexo && (
                                                                <SoftTypography
                                                                    variant="caption"
                                                                    color="error"
                                                                    sx={{ mt: 0.5, ml: 1.75 }}
                                                                >
                                                                    {errors.sexo}
                                                                </SoftTypography>
                                                            )}
                                                        </FormControl>
                                                    </SoftBox>
                                                </Grid>

                                                {/* Columna Derecha */}
                                                <Grid item xs={12} md={6}>
                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Identificación
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.identificacion}
                                                            onChange={(e) =>
                                                                handleChange("identificacion", e.target.value)
                                                            }
                                                            error={!!errors.identificacion}
                                                            helperText={errors.identificacion}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Dirección completa
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.direccionCompleta}
                                                            onChange={(e) =>
                                                                handleChange("direccionCompleta", e.target.value)
                                                            }
                                                            error={!!errors.direccionCompleta}
                                                            helperText={errors.direccionCompleta}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Teléfono
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            value={formData.telefono}
                                                            onChange={(e) =>
                                                                handleChange("telefono", e.target.value)
                                                            }
                                                            error={!!errors.telefono}
                                                            helperText={errors.telefono}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>

                                                    <SoftBox mb={2}>
                                                        <SoftTypography
                                                            component="label"
                                                            variant="caption"
                                                            fontWeight="bold"
                                                            mb={0.5}
                                                            display="block"
                                                        >
                                                            Correo electrónico
                                                        </SoftTypography>
                                                        <TextField
                                                            fullWidth
                                                            type="email"
                                                            value={formData.correoElectronico}
                                                            onChange={(e) =>
                                                                handleChange("correoElectronico", e.target.value)
                                                            }
                                                            error={!!errors.correoElectronico}
                                                            helperText={errors.correoElectronico}
                                                            size="small"
                                                            sx={{
                                                                "& .MuiOutlinedInput-root": {
                                                                    borderRadius: "8px",
                                                                },
                                                            }}
                                                        />
                                                    </SoftBox>
                                                </Grid>
                                            </Grid>
                                        </SoftBox>

                                        {/* Información Familiar - Accordion */}
                                        <Accordion
                                            expanded={expandedFamilia}
                                            onChange={handleAccordionChange("familia")}
                                            sx={{
                                                mb: 2,
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                                borderRadius: "8px",
                                                "&:before": {
                                                    display: "none",
                                                },
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: "#8B6914" }} />}
                                                sx={{
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "8px",
                                                    "&.Mui-expanded": {
                                                        borderBottomLeftRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                    },
                                                }}
                                            >
                                                <SoftBox display="flex" alignItems="center" gap={1}>
                                                    <FamilyRestroomIcon sx={{ color: "#8B6914" }} />
                                                    <SoftTypography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        sx={{
                                                            color: "#8B6914",
                                                            fontSize: "1.1rem",
                                                        }}
                                                    >
                                                        Información Familiar
                                                    </SoftTypography>
                                                </SoftBox>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={2}>
                                                    <Grid item xs={12} md={6}>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Nombre del padre
                                                            </SoftTypography>
                                                            <TextField
                                                                fullWidth
                                                                value={formData.nombrePadre}
                                                                onChange={(e) =>
                                                                    handleChange("nombrePadre", e.target.value)
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "8px",
                                                                    },
                                                                }}
                                                            />
                                                        </SoftBox>

                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Contacto de emergencia
                                                            </SoftTypography>
                                                            <TextField
                                                                fullWidth
                                                                value={formData.contactoEmergencia}
                                                                onChange={(e) =>
                                                                    handleChange("contactoEmergencia", e.target.value)
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "8px",
                                                                    },
                                                                }}
                                                            />
                                                        </SoftBox>
                                                    </Grid>

                                                    <Grid item xs={12} md={6}>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Nombre de la madre
                                                            </SoftTypography>
                                                            <TextField
                                                                fullWidth
                                                                value={formData.nombreMadre}
                                                                onChange={(e) =>
                                                                    handleChange("nombreMadre", e.target.value)
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "8px",
                                                                    },
                                                                }}
                                                            />
                                                        </SoftBox>

                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Teléfono de emergencia
                                                            </SoftTypography>
                                                            <TextField
                                                                fullWidth
                                                                value={formData.telefonoEmergencia}
                                                                onChange={(e) =>
                                                                    handleChange("telefonoEmergencia", e.target.value)
                                                                }
                                                                size="small"
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "8px",
                                                                    },
                                                                }}
                                                            />
                                                        </SoftBox>

                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Parentesco
                                                            </SoftTypography>
                                                            <FormControl fullWidth size="small">
                                                                <Select
                                                                    value={formData.parentesco}
                                                                    onChange={(e) =>
                                                                        handleChange("parentesco", e.target.value)
                                                                    }
                                                                    displayEmpty
                                                                    sx={{
                                                                        borderRadius: "8px",
                                                                    }}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>Seleccione...</em>
                                                                    </MenuItem>
                                                                    {OPCIONES_PARENTESCO.map((opcion) => (
                                                                        <MenuItem key={opcion.value} value={opcion.value}>
                                                                            {opcion.label}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </SoftBox>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>

                                        {/* Elementos Personales y Fotografía - Accordion */}
                                        <Accordion
                                            expanded={expandedElementos}
                                            onChange={handleAccordionChange("elementos")}
                                            sx={{
                                                mb: 3,
                                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                                borderRadius: "8px",
                                                "&:before": {
                                                    display: "none",
                                                },
                                            }}
                                        >
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon sx={{ color: "#8B6914" }} />}
                                                sx={{
                                                    backgroundColor: "#f8f9fa",
                                                    borderRadius: "8px",
                                                    "&.Mui-expanded": {
                                                        borderBottomLeftRadius: 0,
                                                        borderBottomRightRadius: 0,
                                                    },
                                                }}
                                            >
                                                <SoftBox display="flex" alignItems="center" gap={1}>
                                                    <AccessibilityIcon sx={{ color: "#8B6914" }} />
                                                    <SoftTypography
                                                        variant="h6"
                                                        fontWeight="bold"
                                                        sx={{
                                                            color: "#8B6914",
                                                            fontSize: "1.1rem",
                                                        }}
                                                    >
                                                        Elementos Personales y Fotografía del Paciente
                                                    </SoftTypography>
                                                </SoftBox>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container spacing={3}>
                                                    {/* Elementos Personales */}
                                                    <Grid item xs={12} md={6}>
                                                        <SoftTypography
                                                            variant="h6"
                                                            fontWeight="bold"
                                                            mb={2}
                                                            sx={{
                                                                color: "#8B6914",
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            Elementos Personales
                                                        </SoftTypography>
                                                        <SoftBox
                                                            display="flex"
                                                            flexWrap="wrap"
                                                            gap={1}
                                                            mb={3}
                                                        >
                                                            {ELEMENTOS_PERSONALES.map((elemento) => {
                                                                const isSelected =
                                                                    formData.elementosPersonales?.includes(elemento.id);
                                                                return (
                                                                    <Chip
                                                                        key={elemento.id}
                                                                        label={elemento.label}
                                                                        onClick={() =>
                                                                            toggleElementoPersonal(elemento.id)
                                                                        }
                                                                        sx={{
                                                                            backgroundColor: isSelected
                                                                                ? "#8B6914"
                                                                                : "white",
                                                                            color: isSelected ? "white" : "#666",
                                                                            border: `1px solid ${isSelected ? "#8B6914" : "#ccc"}`,
                                                                            cursor: "pointer",
                                                                            "&:hover": {
                                                                                backgroundColor: isSelected
                                                                                    ? "#6B5210"
                                                                                    : "#f5f5f5",
                                                                            },
                                                                        }}
                                                                    />
                                                                );
                                                            })}
                                                        </SoftBox>

                                                        <SoftBox mb={2}>
                                                            <SoftTypography
                                                                component="label"
                                                                variant="caption"
                                                                fontWeight="bold"
                                                                mb={0.5}
                                                                display="block"
                                                            >
                                                                Otros elementos
                                                            </SoftTypography>
                                                            <TextField
                                                                fullWidth
                                                                placeholder="Especifique otros elementos personales..."
                                                                value={formData.otrosElementos}
                                                                onChange={(e) =>
                                                                    handleChange("otrosElementos", e.target.value)
                                                                }
                                                                size="small"
                                                                multiline
                                                                rows={2}
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        borderRadius: "8px",
                                                                    },
                                                                }}
                                                            />
                                                        </SoftBox>
                                                    </Grid>

                                                    {/* Fotografía */}
                                                    <Grid item xs={12} md={6}>
                                                        <SoftTypography
                                                            variant="h6"
                                                            fontWeight="bold"
                                                            mb={2}
                                                            sx={{
                                                                color: "#8B6914",
                                                                fontSize: "1rem",
                                                            }}
                                                        >
                                                            Fotografía del Paciente
                                                        </SoftTypography>
                                                        <SoftBox
                                                            onClick={handleUploadClick}
                                                            sx={{
                                                                border: "2px dashed #ccc",
                                                                borderRadius: "8px",
                                                                p: 3,
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                backgroundColor: "#fafafa",
                                                                "&:hover": {
                                                                    borderColor: "#8B6914",
                                                                    backgroundColor: "#f5f5f5",
                                                                },
                                                            }}
                                                        >
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/jpeg,image/jpg,image/png"
                                                                onChange={handleFileChange}
                                                                style={{ display: "none" }}
                                                            />
                                                            {formData.fotoPreview ? (
                                                                <SoftBox>
                                                                    <img
                                                                        src={formData.fotoPreview}
                                                                        alt="Preview"
                                                                        style={{
                                                                            maxWidth: "100%",
                                                                            maxHeight: "200px",
                                                                            borderRadius: "8px",
                                                                            marginBottom: "10px",
                                                                        }}
                                                                    />
                                                                    <SoftTypography
                                                                        variant="caption"
                                                                        color="text"
                                                                        display="block"
                                                                    >
                                                                        Click para cambiar
                                                                    </SoftTypography>
                                                                </SoftBox>
                                                            ) : (
                                                                <SoftBox>
                                                                    <PhotoCameraIcon
                                                                        sx={{
                                                                            fontSize: "48px",
                                                                            color: "text.secondary",
                                                                            mb: 1,
                                                                        }}
                                                                    />
                                                                    <SoftTypography
                                                                        variant="body2"
                                                                        color="text"
                                                                        fontWeight="medium"
                                                                        display="block"
                                                                        mb={0.5}
                                                                    >
                                                                        Click para subir
                                                                    </SoftTypography>
                                                                    <SoftTypography
                                                                        variant="caption"
                                                                        color="text.secondary"
                                                                    >
                                                                        JPG o PNG (máx. 5MB)
                                                                    </SoftTypography>
                                                                </SoftBox>
                                                            )}
                                                        </SoftBox>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>

                                        {/* Botones de Acción */}
                                        <SoftBox
                                            display="flex"
                                            justifyContent="flex-end"
                                            gap={2}
                                            flexWrap="wrap"
                                            mt={3}
                                        >
                                            <Button
                                                variant="outlined"
                                                startIcon={<ClearIcon />}
                                                onClick={handleLimpiar}
                                                sx={{
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    px: 3,
                                                    py: 1,
                                                }}
                                            >
                                                Limpiar
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="warning"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={handleValidar}
                                                sx={{
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    px: 3,
                                                    py: 1,
                                                }}
                                            >
                                                Validar
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<SaveIcon />}
                                                onClick={handleGuardar}
                                                sx={{
                                                    borderRadius: "8px",
                                                    textTransform: "none",
                                                    px: 3,
                                                    py: 1,
                                                }}
                                            >
                                                Guardar
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </SoftBox>
            </Container>
        </AppPageLayout>
    );
}

export default Pacientes;
