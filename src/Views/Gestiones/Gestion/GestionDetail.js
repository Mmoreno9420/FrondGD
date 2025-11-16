import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    TextField,
    Button,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Paper,
    Autocomplete,
    Backdrop,
    CircularProgress,
    Tabs,
    Tab,
    Chip,
    Typography,
    IconButton
} from "@mui/material";

// @mui icons
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoIcon from "@mui/icons-material/Info";
import BusinessIcon from "@mui/icons-material/Business";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftEditor from "components/SoftEditor";
import SoftSnackbar from "components/SoftSnackbar";

// Hooks
import { useUserSession } from "hooks/useUserSession";

// Custom Components
import GestionTimeline from "./components/GestionTimeline";
import GestionDetailInfo from "./components/GestionDetailInfo";

// Utils
import { buildTimelineFromAPI } from "./utils/timelineBuilder";

const GestionDetail = ({
    gestion = null,
    mode = "view", // "create", "edit", or "view"
    onSave,
    onCancel,
    loading = false
}) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: "",
        descripcion: "",
        estado_id: "", // Sin valor por defecto - debe ser seleccionado
        prioridad_id: "", // Sin valor por defecto - debe ser seleccionado
        estado_nombre: "",
        prioridad_nombre: "",
        tipo_flujo_id: 2,
        workflow_id: "",
        paso_numero: "",
        nombre_paso: "",
        descripcion_paso: "",
        fecha_creacion: "",
        fecha_llegada_paso: "",
        estado_flujo: "",
        unidades_atendiendo: [],
        fecha_inicio: "",
        archivos: [],
        unidad_actual_id: ""
    });


    // Estado para validaciones y UI
    const [errors, setErrors] = useState({});
    const [selectedAsignado, setSelectedAsignado] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [saving, setSaving] = useState(false);
    const [successSnackbar, setSuccessSnackbar] = useState(false);
    const [activeTab, setActiveTab] = useState(0);


    // Variables globales
    const tipo_flujo_id = 2;

    // Obtener usuario autenticado y variables de sesión
    const { user, usuario_id: sessionUsuarioId, unidad_actual_id: sessionUnidadActualId } = useUserSession();
    const userId = sessionUsuarioId || user?.usuario_id || user?.id;
    const unidad_actual_id = sessionUnidadActualId || user?.unidad_actual_id || user?.unidad?.unidad_id;

    // Datos del timeline construidos desde el API usando la utilidad
    const timelineEvents = buildTimelineFromAPI(gestion);

    // Debug: Mostrar eventos del timeline
    console.log('📊 Eventos del timeline generados:', timelineEvents.length);
    console.log('📊 Contenido de eventos:', timelineEvents);

    // Función para manejar cambio de pestañas
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Estados unificados para pasos de gestión
    const estadosDisponibles = [
        { id: 1, nombre: 'Pendiente' },
        { id: 2, nombre: 'En Proceso' },
        { id: 3, nombre: 'Completado' },
        { id: 4, nombre: 'Cerrada' },
        { id: 5, nombre: 'Cancelada' }
    ];

    // Prioridades hardcodeadas
    const prioridadesDisponibles = [
        { id: 1, nombre: 'Baja' },
        { id: 2, nombre: 'Media' },
        { id: 3, nombre: 'Alta' }
    ];

    // Unidades hardcodeadas
    const unidadesDisponibles = [
        { id: 1, nombre: 'Gerencia administrativa' },
        { id: 2, nombre: 'Unidad de Ejecución de Gasto' },
        { id: 3, nombre: 'Unidad contabilidad' },
        { id: 4, nombre: 'Depto. De Aduanas' },
        { id: 5, nombre: 'Unidad de compra' },
        { id: 6, nombre: 'ULMIE' },
        { id: 7, nombre: 'Depto de Bienes Nacionales' },
        { id: 8, nombre: 'Subgerencia de recursos materiales ' }
    ];
    const loadingUnidades = false;

    // Inicializar formulario cuando cambie la gestión o modo
    useEffect(() => {
        if (gestion && (mode === "edit" || mode === "view")) {
            setFormData({
                nombre: gestion.nombre || "",
                descripcion: gestion.descripcion || "",
                estado_id: gestion.estado_id || 1,
                prioridad_id: gestion.prioridad_id || 2,
                estado_nombre: gestion.estado_nombre || "",
                prioridad_nombre: gestion.prioridad_nombre || "",
                tipo_flujo_id: gestion.tipo_flujo_id || 2,
                workflow_id: gestion.workflow_id || "",
                paso_numero: gestion.paso_numero || "",
                nombre_paso: gestion.nombre_paso || "",
                descripcion_paso: gestion.descripcion_paso || "",
                fecha_creacion: gestion.fecha_creacion || "",
                fecha_llegada_paso: gestion.fecha_llegada_paso || "",
                estado_flujo: gestion.estado_flujo || "",
                unidades_atendiendo: gestion.unidades_atendiendo || [],
                asignado_a: gestion.asignado_a || [],
                fecha_inicio: gestion.fecha_llegada_paso || "",
                archivos: gestion.archivos || []
            });

            // Sincronizar unidades asignadas con selectedAsignado
            console.log("Gestion unidades_atendiendo:", gestion.unidades_atendiendo);
            console.log("Unidades disponibles:", unidadesDisponibles);

            if (gestion.unidades_atendiendo && Array.isArray(gestion.unidades_atendiendo)) {
                // Mapear las unidades del backend al formato del Autocomplete
                const unidadesSeleccionadas = gestion.unidades_atendiendo
                    .map(unidad => {
                        // Buscar la unidad en unidadesDisponibles
                        const found = unidadesDisponibles.find(u => u.id === unidad.unidad_id);
                        console.log(`Buscando unidad_id ${unidad.unidad_id}:`, found);
                        return found;
                    })
                    .filter(Boolean); // Eliminar undefined

                console.log("Unidades seleccionadas mapeadas:", unidadesSeleccionadas);
                setSelectedAsignado(unidadesSeleccionadas);
            } else {
                setSelectedAsignado([]);
            }
        } else {
            // Resetear formulario para modo crear
            setFormData({
                nombre: "",
                descripcion: "",
                estado_id: 1, // Pendiente por defecto
                prioridad_id: 2, // Media por defecto
                estado_nombre: "pendiente",
                prioridad_nombre: "media",
                tipo_flujo_id: 2,
                workflow_id: "",
                paso_numero: "",
                nombre_paso: "",
                descripcion_paso: "",
                fecha_creacion: "",
                fecha_llegada_paso: "",
                estado_flujo: "",
                asignado_a: [],
                fecha_inicio: "",
                archivos: []
            });
            setSelectedAsignado([]);
        }
    }, [gestion, mode]);


    // Función de validación
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre de la gestión es requerido";
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es requerida";
        }

        if (!formData.estado_id) {
            newErrors.estado_id = "Debe seleccionar un estado";
        }

        if (!formData.prioridad_id) {
            newErrors.prioridad_id = "Debe seleccionar una prioridad";
        }

        // Validación de unidades removida - es opcional

        if (!formData.fecha_inicio) {
            newErrors.fecha_inicio = "La fecha de inicio es requerida";
        }

        if (!formData.archivos || formData.archivos.length === 0) {
            newErrors.archivos = "Debe cargar al menos un archivo PDF";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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
        const validFiles = files.filter(file => file.type === 'application/pdf');

        if (validFiles.length !== files.length) {
            setErrors({ ...errors, archivos: "Solo se permiten archivos PDF" });
            return;
        }

        const newFiles = validFiles.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            type: file.type,
            size: file.size,
            file: file
        }));

        setFormData({ ...formData, archivos: [...(formData.archivos || []), ...newFiles] });
        setErrors({ ...errors, archivos: "" });
    };

    const handleFileRemove = (fileId) => {
        setFormData({ ...formData, archivos: (formData.archivos || []).filter(f => f.id !== fileId) });
    };

    // Handler optimizado para el editor de descripción (previene problemas con espacios)
    const handleDescriptionChange = useCallback((value) => {
        // Actualizar inmediatamente sin verificación previa para mejor respuesta
        setFormData(prev => ({ ...prev, descripcion: value }));
    }, []);

    // Manejar guardado
    const handleSave = async () => {
        console.log("========================================");
        console.log("SIMULACION DE CREACION DE GESTION");
        console.log("========================================");
        console.log("");

        if (validateForm()) {
            // Preparar datos para enviar (excluir campos que no se envían al backend)
            const {
                workflow_id,
                paso_numero,
                nombre_paso,
                descripcion_paso,
                fecha_creacion,
                fecha_llegada_paso,
                estado_flujo,
                unidades_atendiendo,
                ...dataToSend
            } = formData;

            const dataToSave = {
                ...dataToSend,
                archivos: formData.archivos, // Incluir archivos para subida física posterior
                asignado_a: selectedAsignado.map(item => item.id),
                tipo_flujo_id: tipo_flujo_id,
                unidad_actual_id: unidad_actual_id,
                usuario_id: userId, // AGREGAR usuario_id desde la sesión
                ...(mode === "edit" && { gestion_id: gestion.gestion_id })
            };

            // Agregar unidad_actual_id al array de asignado_a si es modo create
            if (mode === "create" && unidad_actual_id) {
                if (!dataToSave.asignado_a.includes(unidad_actual_id)) {
                    dataToSave.asignado_a = [unidad_actual_id, ...dataToSave.asignado_a];
                    console.log(`✅ Unidad actual (${unidad_actual_id}) agregada automáticamente a asignado_a`);
                } else {
                    console.log(`ℹ️ Unidad actual (${unidad_actual_id}) ya estaba en asignado_a`);
                }
            }

            console.log("VALIDACION: Todos los campos son validos");
            console.log("");
            console.log("DATOS DEL FORMULARIO:");
            console.log("========================================");
            console.log("Nombre de Gestion:", dataToSave.nombre);
            console.log("Descripcion:", dataToSave.descripcion);
            console.log("Estado:", `${dataToSave.estado_nombre} (ID: ${dataToSave.estado_id})`);
            console.log("Prioridad:", `${dataToSave.prioridad_nombre} (ID: ${dataToSave.prioridad_id})`);
            console.log("Fecha de Inicio:", dataToSave.fecha_inicio);
            console.log("Unidad Actual (sesion):", unidad_actual_id);
            console.log("Archivos a subir físicamente:", dataToSave.archivos?.length || 0);
            console.log("");

            console.log("UNIDADES ASIGNADAS:");
            console.log("========================================");
            console.log(`Total de unidades: ${selectedAsignado.map(item => item.id)}`);
            selectedAsignado.forEach((unidad, index) => {
                console.log(`  ${index + 1}. ${unidad.nombre} (ID: ${unidad.id})`);
            });
            console.log("");

            console.log("ARCHIVOS ADJUNTOS:");
            console.log("========================================");
            console.log(`Total de archivos: ${formData.archivos.length}`);
            formData.archivos.forEach((file, index) => {
                console.log(`  ${index + 1}. ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
            });
            console.log("");

            console.log("OBJETO COMPLETO A ENVIAR:");
            console.log("========================================");
            console.log(JSON.stringify(dataToSave, null, 2));
            console.log("");

            console.log("RESUMEN:");
            console.log("========================================");
            console.log(`Modo: ${mode === "create" ? "CREAR" : "EDITAR"}`);
            console.log(`Campos completos: ${Object.keys(dataToSave).length}`);
            console.log(`Unidades: ${selectedAsignado.length}`);
            console.log(`Archivos: ${formData.archivos.length}`);
            console.log("");

            console.log("ACCION: Guardando gestion...");
            console.log("========================================");
            console.log("");

            // Activar indicador de carga
            setSaving(true);

            // Llamar a onSave que ejecutará el hook useGestiones
            try {
                const result = await onSave(dataToSave);

                // Obtener el ID de la gestión creada/actualizada
                const gestionId = result?.gestion_id || result?.id || result?.data?.gestion_id || result?.data?.id;

                if (gestionId) {
                    console.log("========================================");
                    console.log(`🎉 GESTIÓN ${mode === "create" ? "CREADA" : "ACTUALIZADA"} EXITOSAMENTE`);
                    console.log(`📋 ID DE LA GESTIÓN: ${gestionId}`);
                    console.log("========================================");

                    // Mostrar snackbar de éxito
                    setSuccessSnackbar(true);
                } else {
                    console.log("⚠️ Gestión guardada pero no se pudo obtener el ID");
                    console.log("Respuesta completa:", result);
                }
            } catch (error) {
                console.error("❌ Error al guardar la gestión:", error);
            } finally {
                // Desactivar indicador de carga
                setSaving(false);
            }
        } else {
            console.log("VALIDACION FALLIDA");
            console.log("========================================");
            console.log("Errores encontrados:");
            Object.entries(errors).forEach(([field, error]) => {
                console.log(`  - ${field}: ${error} `);
            });
            console.log("");
            console.log("Estado actual del formulario:");
            console.log({
                nombre: formData.nombre || "(vacío)",
                descripcion: formData.descripcion || "(vacío)",
                fecha_inicio: formData.fecha_inicio || "(vacío)",
                asignado: selectedAsignado.length,
                archivos: formData.archivos.length
            });
            console.log("========================================");
            console.log("");
        }
    };

    // Si es modo vista, mostrar información con Timeline
    if (mode === "view") {
        return (
            <SoftBox>
                {/* Header con información de gestión */}
                <SoftBox mb={2}>
                    {/* Pestañas - Compactas */}
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        sx={{
                            background: 'transparent',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: '700',
                                fontSize: '0.8rem',
                                minHeight: 32,
                                padding: '8px 18px',
                                borderRadius: '10px',
                                marginRight: 1,
                                color: '#51617a',
                                opacity: 0.9,
                                '&.Mui-selected': {
                                    background: 'rgba(79,131,204,0.10)',
                                    color: '#4f83cc',
                                    opacity: 1,
                                    boxShadow: 'inset 0 0 0 1px rgba(79,131,204,0.5)'
                                },
                                '&:hover': {
                                    background: 'rgba(79,131,204,0.05)',
                                    opacity: 1
                                },
                                '& .MuiSvgIcon-root': {
                                    fontSize: '1rem',
                                    marginRight: '6px'
                                }
                            },
                            '& .MuiTabs-indicator': {
                                display: 'block',
                                height: '3px',
                                borderRadius: '3px 3px 0 0',
                                backgroundColor: '#4f83cc'
                            }
                        }}
                    >
                        <Tab
                            label="LÍNEA DE TIEMPO"
                            icon={<TimelineIcon />}
                            iconPosition="start"
                        />
                        <Tab
                            label="DETALLES"
                            icon={<InfoIcon />}
                            iconPosition="start"
                        />
                    </Tabs>
                </SoftBox>

                {/* Contenido de las pestañas */}
                {activeTab === 0 ? (
                    <GestionTimeline gestion={gestion} timelineEvents={timelineEvents} />
                ) : (
                    <>
                        <GestionDetailInfo gestion={gestion} formData={formData} />

                        {/* Botón cerrar */}
                        <Grid container spacing={3} sx={{ mt: 0 }}>
                            <Grid item xs={12}>
                                <SoftBox display="flex" justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={onCancel}
                                        disabled={loading}
                                        sx={{
                                            background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                            border: '2px solid #ff9800',
                                            color: '#e65100',
                                            borderRadius: '12px',
                                            padding: '10px 20px',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            textTransform: 'none',
                                            boxShadow: '0 2px 4px rgba(255, 152, 0, 0.2)',
                                            '&:hover': {
                                                background: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                                borderColor: '#f57c00',
                                                color: '#bf360c',
                                                transform: 'translateY(-1px)',
                                                boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)',
                                            },
                                            '&:disabled': {
                                                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                                borderColor: '#bdbdbd',
                                                color: '#9e9e9e',
                                                transform: 'none',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                            },
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        Cerrar
                                    </Button>
                                </SoftBox>
                            </Grid>
                        </Grid>
                    </>
                )}
            </SoftBox>
        );
    }

    // Modo crear/editar (formulario moderno)
    return (
        <SoftBox>
            <Grid container spacing={3}>
                {/* Header */}
                <Grid item xs={12}>
                    <SoftBox mb={2}>
                        <SoftTypography variant="body2" color="text" opacity={0.8}>
                            {mode === "create"
                                ? "Complete los datos para crear una nueva gestión en el sistema"
                                : "Modifique los datos de la gestión existente"}
                        </SoftTypography>
                    </SoftBox>
                </Grid>

                {/* Nombre de la gestión */}
                <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                        <SoftTypography variant="body1" fontWeight="medium" color="text">
                            Nombre de la gestión:
                        </SoftTypography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={1}
                            maxRows={3}
                            placeholder="Ingrese el nombre completo de la gestión"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            disabled={loading}
                            error={!!errors.nombre}
                            helperText={errors.nombre}
                            variant="outlined"
                            required
                            inputProps={{
                                spellCheck: false,
                                autoComplete: "off"
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    "& fieldset": {
                                        borderColor: "#dee2e6"
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#adb5bd"
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: "white",
                                        "& fieldset": {
                                            borderColor: "primary.main",
                                            borderWidth: "1px"
                                        }
                                    }
                                },
                                "& .MuiInputBase-input": {
                                    backgroundColor: "white",
                                    overflow: "auto",
                                    resize: "none",
                                    wordBreak: "break-all",
                                    whiteSpace: "pre-wrap",
                                    width: "100%",
                                    "&::placeholder": {
                                        color: "#adb5bd",
                                        opacity: 1,
                                        fontStyle: "italic"
                                    }
                                },
                                "& .MuiInputBase-inputMultiline": {
                                    width: "100% !important",
                                    minWidth: "100%"
                                }
                            }}
                        />
                    </SoftBox>
                </Grid>

                {/* Descripción de la gestión */}
                <Grid item xs={12}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        Descripción de la gestión
                    </SoftTypography>

                    {/* Editor de texto enriquecido del template */}
                    <SoftBox
                        sx={{
                            backgroundColor: 'white !important',
                            '& > div': {
                                backgroundColor: 'white !important'
                            },
                            '& .ql-snow': {
                                border: '1px solid #dee2e6',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                backgroundColor: 'white !important'
                            },
                            '& .ql-toolbar': {
                                backgroundColor: 'white !important',
                                border: 'none',
                                borderBottom: '1px solid #dee2e6',
                                padding: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                borderRadius: '24px 24px 0 0',
                                '& .ql-formats': {
                                    margin: '0',
                                    marginRight: '12px'
                                },
                                '& button': {
                                    borderRadius: '12px',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                        backgroundColor: '#f8f9fa'
                                    }
                                }
                            },
                            '& .ql-container': {
                                backgroundColor: 'white !important',
                                border: 'none',
                                fontFamily: 'inherit',
                                borderRadius: '0 0 24px 24px'
                            },
                            '& .ql-editor': {
                                backgroundColor: 'white !important',
                                minHeight: '120px',
                                padding: '16px',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                color: '#000000 !important',
                                '&.ql-blank::before': {
                                    color: '#adb5bd',
                                    fontStyle: 'italic',
                                    fontSize: '14px'
                                },
                                '& p': {
                                    margin: '0',
                                    marginBottom: '8px',
                                    color: '#000000 !important'
                                },
                                '& *': {
                                    color: '#000000 !important'
                                }
                            },
                            '& .ql-stroke': {
                                stroke: '#6c757d'
                            },
                            '& .ql-fill': {
                                fill: '#6c757d'
                            },
                            '& button:hover .ql-stroke': {
                                stroke: '#495057'
                            },
                            '& button:hover .ql-fill': {
                                fill: '#495057'
                            },
                            '& button.ql-active .ql-stroke': {
                                stroke: '#0d6efd'
                            },
                            '& button.ql-active .ql-fill': {
                                fill: '#0d6efd'
                            }
                        }}
                    >
                        <SoftEditor
                            value={formData.descripcion}
                            onChange={handleDescriptionChange}
                            placeholder="Aquí se ingresa la descripción de la gestión."
                            preserveWhitespace={true}
                        />
                    </SoftBox>
                    {errors.descripcion && (
                        <SoftBox mt={1}>
                            <Typography variant="caption" color="error">
                                {errors.descripcion}
                            </Typography>
                        </SoftBox>
                    )}
                </Grid>

                {/* Estado y Prioridad */}
                <Grid item xs={12} sm={6}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        Estado
                    </SoftTypography>
                    <Autocomplete
                        options={estadosDisponibles}
                        value={estadosDisponibles.find(est => est.id === formData.estado_id) || null}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                estado_id: newValue?.id || '',
                                estado_nombre: newValue?.nombre.toLowerCase() || ''
                            });
                            // Limpiar error si existe
                            if (errors.estado_id) {
                                setErrors({ ...errors, estado_id: "" });
                            }
                        }}
                        getOptionLabel={(option) => option?.nombre || ""}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        disabled={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Seleccionar estado"
                                error={!!errors.estado_id}
                                helperText={errors.estado_id}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "#f8f9fa",
                                        "&:hover": {
                                            backgroundColor: "#e9ecef"
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "white"
                                        },
                                        "& input": {
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        Prioridad
                    </SoftTypography>
                    <Autocomplete
                        options={prioridadesDisponibles}
                        value={prioridadesDisponibles.find(pri => pri.id === formData.prioridad_id) || null}
                        onChange={(event, newValue) => {
                            setFormData({
                                ...formData,
                                prioridad_id: newValue?.id || '',
                                prioridad_nombre: newValue?.nombre.toLowerCase() || ''
                            });
                            // Limpiar error si existe
                            if (errors.prioridad_id) {
                                setErrors({ ...errors, prioridad_id: "" });
                            }
                        }}
                        getOptionLabel={(option) => option?.nombre || ""}
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        disabled={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Seleccionar prioridad"
                                error={!!errors.prioridad_id}
                                helperText={errors.prioridad_id}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "12px",
                                        backgroundColor: "#f8f9fa",
                                        "&:hover": {
                                            backgroundColor: "#e9ecef"
                                        },
                                        "&.Mui-focused": {
                                            backgroundColor: "white"
                                        },
                                        "& input": {
                                            cursor: loading ? 'not-allowed' : 'pointer'
                                        }
                                    }
                                }}
                            />
                        )}
                    />
                </Grid>

                {/* Unidades */}
                <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                        <SoftTypography variant="h6" fontWeight="medium" color="dark">
                            <BusinessIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                            Unidades
                        </SoftTypography>

                        <Autocomplete
                            multiple
                            options={unidadesDisponibles}
                            value={selectedAsignado}
                            onChange={(event, newValue) => {
                                setSelectedAsignado(newValue || []);
                                if (errors.asignado) {
                                    setErrors({ ...errors, asignado: "" });
                                }
                            }}
                            getOptionLabel={(option) => option?.nombre || option || ""}
                            isOptionEqualToValue={(option, value) =>
                                option?.id === value?.id || option?.nombre === value?.nombre
                            }
                            disabled={loading}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        variant="filled"
                                        label={option?.nombre || option || ""}
                                        color="primary"
                                        size="small"
                                        {...getTagProps({ index })}
                                        key={`unidad - ${option?.id || option?.nombre || 'undefined'} -${index} `}
                                        sx={{
                                            backgroundColor: "#e3f2fd",
                                            color: "#1976d2",
                                            fontWeight: "600",
                                            "& .MuiChip-deleteIcon": {
                                                color: "#1976d2",
                                                "&:hover": {
                                                    color: "#1565c0"
                                                }
                                            }
                                        }}
                                    />
                                ))
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Seleccione las unidades..."
                                    error={!!errors.asignado}
                                    helperText={errors.asignado}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "12px",
                                            backgroundColor: "#f8f9fa",
                                            "&:hover": {
                                                backgroundColor: "#e9ecef"
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "white"
                                            }
                                        }
                                    }}
                                />
                            )}
                            sx={{
                                "& .MuiAutocomplete-tag": {
                                    margin: "2px"
                                }
                            }}
                        />
                    </SoftBox>
                </Grid>

                {/* Fecha de inicio */}
                <Grid item xs={12}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        Fecha de inicio
                    </SoftTypography>
                    <TextField
                        fullWidth
                        type="date"
                        value={formData.fecha_inicio}
                        onChange={(e) => {
                            setFormData({ ...formData, fecha_inicio: e.target.value });
                            if (errors.fecha_inicio) {
                                setErrors({ ...errors, fecha_inicio: "" });
                            }
                        }}
                        disabled={loading}
                        variant="outlined"
                        error={!!errors.fecha_inicio}
                        helperText={errors.fecha_inicio}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onClick={(e) => {
                            // Abrir el selector de fecha al hacer clic en cualquier parte del campo
                            if (!loading) {
                                const input = e.currentTarget.querySelector('input[type="date"]');
                                if (input) {
                                    // Usar showPicker() si está disponible (Chrome, Edge, Safari)
                                    if (input.showPicker && typeof input.showPicker === 'function') {
                                        try {
                                            const pickerResult = input.showPicker();
                                            // Verificar si devuelve una Promise antes de usar .catch()
                                            if (pickerResult && typeof pickerResult.catch === 'function') {
                                                pickerResult.catch(() => {
                                                    // Si showPicker falla, simplemente hacer focus
                                                    input.focus();
                                                    input.click();
                                                });
                                            } else {
                                                // Si no devuelve Promise, hacer focus directamente
                                                input.focus();
                                                input.click();
                                            }
                                        } catch (error) {
                                            // Si showPicker lanza un error, usar fallback
                                            input.focus();
                                            input.click();
                                        }
                                    } else {
                                        // Fallback para navegadores que no soportan showPicker
                                        input.focus();
                                        input.click();
                                    }
                                }
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '12px',
                                backgroundColor: '#f8f9fa',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                '&:hover': {
                                    backgroundColor: '#e9ecef'
                                },
                                '&.Mui-focused': {
                                    backgroundColor: 'white',
                                    boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                                },
                                '& input': {
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                    pointerEvents: 'auto'
                                },
                                '& input[type="date"]': {
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    '&::-webkit-calendar-picker-indicator': {
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        padding: '4px',
                                        marginRight: '4px'
                                    }
                                }
                            }
                        }}
                    />
                </Grid>

                {/* Archivos */}
                <Grid item xs={12}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                        Archivos
                    </SoftTypography>

                    {/* Lista de archivos */}
                    {formData.archivos && formData.archivos.length > 0 && (
                        <SoftBox mb={2}>
                            {formData.archivos.map((file) => (
                                <Paper
                                    key={file.id}
                                    sx={{
                                        p: 2,
                                        mb: 1,
                                        borderRadius: '12px',
                                        backgroundColor: '#f8f9fa',
                                        border: '1px solid #e9ecef',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between'
                                    }}
                                >
                                    <SoftBox display="flex" alignItems="center" gap={2}>
                                        <DescriptionIcon color="error" />
                                        <SoftBox>
                                            <SoftTypography variant="body2" fontWeight="medium">
                                                {file.name}
                                            </SoftTypography>
                                            <SoftTypography variant="caption" color="text">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </SoftTypography>
                                        </SoftBox>
                                    </SoftBox>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleFileRemove(file.id)}
                                        sx={{
                                            color: '#dc3545',
                                            '&:hover': {
                                                backgroundColor: '#f8d7da'
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Paper>
                            ))}
                        </SoftBox>
                    )}

                    {/* Área de drag & drop */}
                    <Paper
                        sx={{
                            p: 4,
                            textAlign: 'center',
                            borderRadius: '12px',
                            border: `2px dashed ${isDragging ? '#1976d2' : '#dee2e6'} `,
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
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".pdf"
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                        />
                        <CloudUploadIcon
                            sx={{
                                fontSize: 48,
                                color: isDragging ? '#1976d2' : '#6c757d',
                                mb: 2
                            }}
                        />
                        <SoftTypography variant="h6" fontWeight="medium" color="dark" mb={1}>
                            Drop files here to upload
                        </SoftTypography>
                        <SoftTypography variant="body2" color="text">
                            Solo archivos PDF permitidos
                        </SoftTypography>
                    </Paper>

                    {errors.archivos && (
                        <SoftBox mt={1}>
                            <Alert severity="error" sx={{ borderRadius: '8px' }}>
                                {errors.archivos}
                            </Alert>
                        </SoftBox>
                    )}
                </Grid>

                {/* Botones de acción */}
                <Grid item xs={12}>
                    <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={onCancel}
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                border: '2px solid #ff9800',
                                color: '#e65100',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 4px rgba(255, 152, 0, 0.2)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                    borderColor: '#f57c00',
                                    color: '#bf360c',
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                    borderColor: '#bdbdbd',
                                    color: '#9e9e9e',
                                    transform: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={loading}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                color: '#ffffff !important',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    color: '#ffffff !important',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
                                    color: '#757575',
                                    transform: 'none',
                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {mode === "create" ? "Crear gestión" : "Guardar cambios"}
                        </Button>
                    </SoftBox>
                </Grid>
            </Grid>

            {/* Indicador de carga durante guardado - Fullscreen */}
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 999,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    backdropFilter: 'blur(6px)',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                open={saving}
            >
                <SoftBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 4,
                        padding: '40px 56px',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                        border: 'none',
                        minWidth: 380,
                        maxWidth: 480,
                        textAlign: 'center'
                    }}
                >
                    <CircularProgress
                        size={56}
                        thickness={3.6}
                        sx={{
                            color: 'info.main'
                        }}
                    />
                    <SoftTypography variant="h5" color="dark" fontWeight="bold">
                        {mode === "create" ? "Creando Gestión..." : "Guardando Cambios..."}
                    </SoftTypography>
                    <SoftTypography variant="body1" color="white" sx={{ maxWidth: 320, lineHeight: 1.6 }}>
                        Por favor espera mientras procesamos la información
                    </SoftTypography>
                </SoftBox>
            </Backdrop>

            {/* Snackbar de éxito */}
            <SoftSnackbar
                color="success"
                icon="check"
                title="Gestión Guardada"
                content={`Gestión ${mode === "create" ? "creada" : "actualizada"} exitosamente`}
                dateTime="ahora"
                open={successSnackbar}
                onClose={() => setSuccessSnackbar(false)}
                close={() => setSuccessSnackbar(false)}
                bgWhite
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </SoftBox>
    );
};

GestionDetail.propTypes = {
    gestion: PropTypes.object,
    mode: PropTypes.oneOf(["create", "edit", "view"]),
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    loading: PropTypes.bool
};

export default GestionDetail;


