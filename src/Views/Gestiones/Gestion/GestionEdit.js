/**
=========================================================
* GestiaSoft - Editar Gestión
=========================================================
* Pantalla completa para editar una gestión existente
*/

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Custom hooks
import { useGestiones } from "hooks/useGestiones";
import { useUserSession } from "hooks/useUserSession";
import { useComentarios } from "hooks/useComentarios";
import { useDocuments } from "hooks/useDocuments";

// Configuración de permisos
import { canPerformAction } from "config/rolePermissions";

// Services
import gestionService from "services/gestionService";

// @mui material components
import {
    Grid,
    Card,
    CardContent,
    IconButton,
    Tabs,
    Tab,
    Button,
    LinearProgress,
    Chip,
    Divider,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Backdrop,
    CircularProgress
} from "@mui/material";

// @mui icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TimelineIcon from "@mui/icons-material/Timeline";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import CommentIcon from "@mui/icons-material/Comment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FlagIcon from "@mui/icons-material/Flag";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import SoftEditor from "components/SoftEditor";

// Custom App Layout
import { AppNotification, ConfirmAlert } from "Views/componentsApp";
import ConfirmAcuseModal from "Views/componentsApp/Modals/ConfirmAcuseModal";

// Gestion Components
import GestionDetail from "./GestionDetail";
import GestionTimeline from "./components/GestionTimeline";
import GestionDetailInfo from "./components/GestionDetailInfo";
import GestionDocuments from "./components/GestionDocuments";
import GestionDocumentsTable from "./components/GestionDocumentsTable";
import GestionComments from "./components/GestionComments";
import ChangeStageModal from "./components/ChangeStageModal";
import AttachDocumentsModal from "./components/AttachDocumentsModal";

// Utils
import { buildTimelineFromAPI } from "./utils/timelineBuilder";

// Images
import AssignmentIcon from "@mui/icons-material/Assignment";

function GestionEdit() {
    const navigate = useNavigate();
    const { id } = useParams(); // Obtener el ID de la gestión de la URL

    // Estado para notificaciones
    const [notification, setNotification] = useState({
        open: false,
        type: 'info',
        message: ''
    });

    // Estado para el tab activo
    const [activeTab, setActiveTab] = useState(0);

    // Estado para el modal de cambio de etapa
    const [changeStageModalOpen, setChangeStageModalOpen] = useState(false);

    // Estado para el modal de adjuntar documentos
    const [attachDocumentsModalOpen, setAttachDocumentsModalOpen] = useState(false);

    // Estado para el alert de confirmación de eliminación de documento
    const [deleteDocumentAlert, setDeleteDocumentAlert] = useState({
        open: false,
        document: null
    });

    // Estado para el alert de confirmación de inactivar gestión
    const [inactivateGestionAlert, setInactivateGestionAlert] = useState({
        open: false
    });

    // Estado para el alert de confirmación de reactivar gestión
    const [reactivateGestionAlert, setReactivateGestionAlert] = useState({
        open: false
    });

    // Estado para controlar el proceso de guardado
    const [isSaving, setIsSaving] = useState(false);

    // Estado para controlar el proceso de cambio de etapa
    const [isChangingStage, setIsChangingStage] = useState(false);

    // Estado para controlar el proceso de inactivar gestión
    const [isInactivating, setIsInactivating] = useState(false);

    // Estado para controlar el proceso de reactivar gestión
    const [isReactivating, setIsReactivating] = useState(false);

    // Estado para el alert de confirmación de acuse de recibido
    const [acuseRecibidoAlert, setAcuseRecibidoAlert] = useState({ open: false });
    const [acuseModalOpen, setAcuseModalOpen] = useState(false);

    // Estado para controlar el proceso de acuse de recibido
    const [isProcessingAcuse, setIsProcessingAcuse] = useState(false);

    // Estados para controlar la apertura de los selects
    const [estadoSelectOpen, setEstadoSelectOpen] = useState(false);
    const [prioridadSelectOpen, setPrioridadSelectOpen] = useState(false);

    // Estado para controlar la carga de la gestión específica
    const [loadingGestionDetail, setLoadingGestionDetail] = useState(false);

    // Estado para controlar la subida de documentos
    const [isUploadingDocument, setIsUploadingDocument] = useState(false);

    // Estado para forzar actualización del grid de documentos
    const [documentsUpdateKey, setDocumentsUpdateKey] = useState(0);

    // Custom hook para gestiones
    const {
        gestiones,
        loading,
        updateGestion,
        fetchGestiones,
        cambiarEtapa,
        getGestionDetail
    } = useGestiones();

    // Custom hooks para obtener datos reales
    const { comentarios, loadComentarios } = useComentarios();
    const { documents: documentos, loadDocuments } = useDocuments();

    // Estado para la gestión a editar
    const [gestionToEdit, setGestionToEdit] = useState(null);

    // Estado del formulario de edición
    const [formData, setFormData] = useState({
        gestion_id: null,
        nombre: "",
        descripcion: "",
        estado_id: 1,
        prioridad_id: 2,
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
        unidades_atendiendo: [],
        fecha_inicio: "",
        archivos: [],
        unidad_actual_id: 1
    });

    // Estado para validaciones
    const [errors, setErrors] = useState({});

    // Obtener usuario autenticado y variables de sesión
    const { user, usuario_id: sessionUsuarioId, unidad_actual_id: sessionUnidadActualId, id_rol } = useUserSession();
    const userId = sessionUsuarioId || user?.usuario_id || user?.id;
    const unidad_actual_id = sessionUnidadActualId || user?.unidad_actual_id || user?.unidad?.unidad_id;

    // Normalizador y diagnóstico para unidades asignadas/atendiendo
    const getUnidadesParaMostrar = React.useCallback(() => {
        // Posibles fuentes
        const fuentesPosibles = [
            formData?.unidades_atendiendo,
            gestionToEdit?.unidades_asignadas,
            gestionToEdit?.unidades_atendiendo,
            // fallback por si el API usa otras variantes
            gestionToEdit?.unidades,
            gestionToEdit?.unidadesAsignadas,
        ].filter(Boolean);

        const primeraFuente = fuentesPosibles.find(arr => Array.isArray(arr) && arr.length > 0) || [];

        // Log de diagnóstico en desarrollo
        try {
            if (process?.env?.NODE_ENV !== 'production') {
                // Muestra las longitudes de cada fuente
                console.debug('[Unidades] fuentes:', {
                    formData_unidades_atendiendo: Array.isArray(formData?.unidades_atendiendo) ? formData.unidades_atendiendo.length : formData?.unidades_atendiendo,
                    gestionToEdit_unidades_asignadas: Array.isArray(gestionToEdit?.unidades_asignadas) ? gestionToEdit.unidades_asignadas.length : gestionToEdit?.unidades_asignadas,
                    gestionToEdit_unidades_atendiendo: Array.isArray(gestionToEdit?.unidades_atendiendo) ? gestionToEdit.unidades_atendiendo.length : gestionToEdit?.unidades_atendiendo,
                    gestionToEdit_unidades: Array.isArray(gestionToEdit?.unidades) ? gestionToEdit.unidades.length : gestionToEdit?.unidades,
                    gestionToEdit_unidadesAsignadas: Array.isArray(gestionToEdit?.unidadesAsignadas) ? gestionToEdit.unidadesAsignadas.length : gestionToEdit?.unidadesAsignadas,
                });
            }
        } catch (_) { }

        // Normalizar posibles nombres de campo para mostrar etiqueta
        return primeraFuente.map((u, idx) => {
            const nombre =
                u?.nombre_unidad ??
                u?.nombre ??
                u?.unidad_nombre ??
                u?.unidad?.nombre ??
                u?.unidad?.nombre_unidad ??
                `Unidad ${idx + 1}`;
            return { ...u, nombre_normalizado: nombre };
        });
    }, [formData?.unidades_atendiendo, gestionToEdit?.unidades_asignadas, gestionToEdit?.unidades_atendiendo, gestionToEdit?.unidades, gestionToEdit?.unidadesAsignadas]);

    // Logs puntuales cuando llegan datos del API
    React.useEffect(() => {
        try {
            if (gestionToEdit && process?.env?.NODE_ENV !== 'production') {
                console.debug('[GestionEdit] API gestionToEdit.unidades_asignadas:', gestionToEdit?.unidades_asignadas);
                console.debug('[GestionEdit] API gestionToEdit.unidades_atendiendo:', gestionToEdit?.unidades_atendiendo);
            }
        } catch (_) { }
    }, [gestionToEdit]);

    React.useEffect(() => {
        try {
            if (process?.env?.NODE_ENV !== 'production') {
                console.debug('[GestionEdit] formData.unidades_atendiendo:', formData?.unidades_atendiendo);
            }
        } catch (_) { }
    }, [formData?.unidades_atendiendo]);

    // Verificar permisos del usuario
    const canInactivate = canPerformAction(id_rol, 'canInactivate');
    const canReactivate = canPerformAction(id_rol, 'canReactivate');

    // Verificar si el acuse de recibido ya fue procesado
    const acuseRecibido = React.useMemo(() => {
        if (!gestionToEdit || !unidad_actual_id) return false;

        // Buscar la unidad actual en unidades_asignadas o unidades_atendiendo
        const unidades = gestionToEdit.unidades_asignadas || gestionToEdit.unidades_atendiendo || [];

        // Buscar la unidad actual
        const unidadActual = unidades.find(
            unidad => unidad.unidad_id === unidad_actual_id
        );

        return unidadActual?.acuse_recibido === true;
    }, [gestionToEdit, unidad_actual_id]);

    // Verificar si la gestión está finalizada, cancelada o completada
    const gestionFinalizada = React.useMemo(() => {
        if (!gestionToEdit) return false;

        const estadoNombre = (gestionToEdit.estado_nombre || "").toLowerCase();
        const estadoFlujo = (gestionToEdit.estado_flujo || "").toLowerCase();

        // Estados finalizados del estado_nombre
        const estadosFinalizados = ['finalizado', 'finalizada', 'completado', 'completada', 'cancelado', 'cancelada', 'cerrada'];

        // Verificar si el estado_nombre indica que está finalizada
        const esEstadoFinalizado = estadosFinalizados.some(estado =>
            estadoNombre.includes(estado)
        );

        // Verificar si el estado_flujo indica que está finalizada
        const esFlujoFinalizado = ['finalizado', 'finalizada', 'completado', 'completada'].some(estado =>
            estadoFlujo.includes(estado)
        );

        return esEstadoFinalizado || esFlujoFinalizado;
    }, [gestionToEdit]);

    // Verificar si la unidad del usuario ya completó su trabajo (estado === true)
    const unidadCompletoTrabajo = React.useMemo(() => {
        if (!gestionToEdit || !unidad_actual_id) return false;

        // Buscar la unidad actual en unidades_asignadas o unidades_atendiendo
        const unidades = gestionToEdit.unidades_asignadas || gestionToEdit.unidades_atendiendo || [];

        // Buscar la unidad actual
        const unidadActual = unidades.find(
            unidad => unidad.unidad_id === unidad_actual_id
        );

        // Si la unidad tiene estado === true, significa que ya completó su trabajo
        return unidadActual?.estado === true;
    }, [gestionToEdit, unidad_actual_id]);

    // Variable combinada para bloquear acciones cuando la unidad ya completó su trabajo
    const accionesBloqueadas = unidadCompletoTrabajo || gestionFinalizada;

    // Cargar la gestión específica usando el endpoint de detalle
    useEffect(() => {
        // Solo ejecutar si tenemos tanto el ID como el userId
        if (!id || !userId) {
            return;
        }

        const loadGestionDetail = async () => {
            setLoadingGestionDetail(true);
            try {
                console.log('📤 Cargando gestión específica:', {
                    gestionId: parseInt(id),
                    userId: userId,
                    endpoint: '/gestiones/manage',
                    payload: {
                        accion: 4,
                        user_id: userId,
                        data: {
                            gestion_id: parseInt(id)
                        }
                    }
                });

                // Llamar al endpoint específico para obtener detalles de la gestión
                const response = await getGestionDetail(parseInt(id));


                // Extraer y normalizar el dato de gestión (puede venir como objeto o array[0])
                let gestionRaw = null;
                if (response && response.data && response.data.data) {
                    gestionRaw = response.data.data;
                } else if (response && response.data) {
                    gestionRaw = response.data;
                } else {
                    gestionRaw = response;
                }
                const gestion = Array.isArray(gestionRaw) ? gestionRaw[0] : gestionRaw;
                console.log('📋 Gestión normalizada:', gestion);
                if (gestion) {
                    // Asegurar que unidades_asignadas esté disponible
                    const gestionConUnidades = {
                        ...gestion,
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || []
                    };

                    console.log('📋 gestionConUnidades:', gestionConUnidades);

                    setGestionToEdit(gestionConUnidades);

                    // Convertir estado_id y prioridad_id a números, y solo usar valores por defecto si no existen
                    const estadoId = gestion.estado_id !== null && gestion.estado_id !== undefined
                        ? parseInt(gestion.estado_id, 10)
                        : 1;
                    const prioridadId = gestion.prioridad_id !== null && gestion.prioridad_id !== undefined
                        ? parseInt(gestion.prioridad_id, 10)
                        : 2;

                    console.log("📥 Cargando datos de la gestión:", {
                        gestion_id: gestion.gestion_id,
                        estado_id_original: gestion.estado_id,
                        estado_id_convertido: estadoId,
                        prioridad_id_original: gestion.prioridad_id,
                        prioridad_id_convertido: prioridadId,
                        estado_nombre: gestion.estado_nombre,
                        prioridad_nombre: gestion.prioridad_nombre
                    });

                    // Inicializar el formulario con los datos de la gestión
                    setFormData({
                        gestion_id: gestion.gestion_id || parseInt(id),
                        avance_calculado: gestion.avance_promedio || gestion.avance_calculado || 0,
                        nombre: gestion.nombre || "",
                        descripcion: gestion.descripcion || "",
                        estado_id: estadoId,
                        prioridad_id: prioridadId,
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
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || [],
                        fecha_inicio: gestion.fecha_llegada_paso || "",
                        archivos: gestion.archivos || [],
                        unidad_actual_id: gestion.unidad_actual_id || unidad_actual_id,
                        // Campos adicionales del API
                        creado_por: gestion.creado_por || "",
                        tipo_flujo: gestion.tipo_flujo || ""
                    });
                } else {
                    // Si no se encuentra, mostrar error y volver
                    const errorMessage = 'Gestión no encontrada. Por favor, verifique que la gestión exista.';
                    showNotification('error', errorMessage);
                    setTimeout(() => {
                        navigate('/gestiones/gestion');
                    }, 3000);
                }
            } catch (error) {
                console.error('❌ Error al cargar gestión específica:', error);

                // Extraer mensaje de error específico
                let errorMessage = 'Error al cargar la información de la gestión';

                if (error?.response?.data?.mensaje) {
                    errorMessage = error.response.data.mensaje;
                } else if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.response?.status === 404) {
                    errorMessage = 'Gestión no encontrada. Por favor, verifique que la gestión exista.';
                } else if (error?.response?.status === 403) {
                    errorMessage = 'No tiene permisos para acceder a esta gestión.';
                } else if (error?.response?.status >= 500) {
                    errorMessage = 'Error en el servidor. Por favor, intente nuevamente más tarde.';
                } else if (error?.message) {
                    errorMessage = `Error: ${error.message}`;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                // Mostrar notificación de error
                showNotification('error', errorMessage);

                // Esperar a que se muestre la notificación y luego navegar hacia atrás
                setTimeout(() => {
                    navigate('/gestiones/gestion');
                }, 3000);
            } finally {
                setLoadingGestionDetail(false);
            }
        };

        loadGestionDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, userId, unidad_actual_id, navigate]);

    // Cargar comentarios y documentos cuando se cargue la gestión
    useEffect(() => {
        if (gestionToEdit && gestionToEdit.gestion_id) {
            // Cargar comentarios
            loadComentarios(
                gestionToEdit.gestion_id,
                gestionToEdit.workflow_id || 0,
                unidad_actual_id,
                userId
            );

            // Cargar documentos
            loadDocuments(
                gestionToEdit.gestion_id,
                gestionToEdit.workflow_id || 0,
                unidad_actual_id,
                userId
            );
        }
    }, [gestionToEdit?.gestion_id, unidad_actual_id, userId, loadComentarios, loadDocuments]);

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({
            open: true,
            type: type,
            message: message
        });
    };

    // Función para validar el formulario
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = "El nombre de la gestión es requerido";
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = "La descripción es requerida";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Función para manejar el guardado
    const handleSave = async () => {
        // Validar antes de iniciar el guardado
        if (!validateForm()) {
            showNotification('error', 'Por favor complete todos los campos requeridos');
            return;
        }

        // Prevenir múltiples guardados simultáneos
        if (isSaving) return;

        // Iniciar el proceso de guardado
        setIsSaving(true);

        try {
            console.log("💾 Iniciando guardado de gestión...");

            // Asegurar que el gestion_id esté presente y sea un número
            const gestionId = parseInt(id);
            if (!gestionId || isNaN(gestionId)) {
                throw new Error("ID de gestión inválido");
            }

            // Preparar los datos para enviar
            // IMPORTANTE: gestion_id debe estar en el objeto para que el backend lo reciba
            const dataToSave = {
                gestion_id: gestionId,  // Asegurar que gestion_id está primero
                ...formData,
                // Asegurar que estado_id y prioridad_id sean números
                estado_id: parseInt(formData.estado_id, 10) || formData.estado_id,
                prioridad_id: parseInt(formData.prioridad_id, 10) || formData.prioridad_id,
                usuario_id: userId,
                tipo_flujo_id: formData.tipo_flujo_id || 2,
                unidad_actual_id: unidad_actual_id || formData.unidad_actual_id
            };

            // Validar que gestion_id esté presente antes de enviar
            if (!dataToSave.gestion_id) {
                throw new Error("gestion_id es requerido para actualizar la gestión");
            }

            console.log("📤 Estado y Prioridad a guardar:", {
                estado_id: dataToSave.estado_id,
                estado_nombre: dataToSave.estado_nombre,
                prioridad_id: dataToSave.prioridad_id,
                prioridad_nombre: dataToSave.prioridad_nombre,
                tipo_estado_id: typeof dataToSave.estado_id,
                tipo_prioridad_id: typeof dataToSave.prioridad_id
            });

            console.log("📦 Datos a enviar:", JSON.stringify(dataToSave, null, 2));
            console.log("🔍 Validación - gestion_id:", dataToSave.gestion_id, "tipo:", typeof dataToSave.gestion_id);

            // Esperar a que se guarde la gestión
            // Endpoint: POST /api/gestiones/manage
            // Payload: { accion: 2, user_id: userId, data: dataToSave }
            const result = await updateGestion(id, dataToSave);

            console.log("✅ Gestión actualizada exitosamente");
            console.log("📤 Endpoint llamado: POST /api/gestiones/manage");
            console.log("📦 Payload enviado:", JSON.stringify({
                accion: 2, // API_OPERTATIONS.edit
                user_id: userId,
                data: dataToSave
            }, null, 2));

            // Mostrar notificación de éxito SOLO después de guardar
            // NO recargar pantalla, permanecer en la misma página
            showNotification('success', 'Gestión actualizada exitosamente');

            // Recargar los datos de la gestión actual sin cambiar de pantalla
            // Esto permite ver los cambios guardados en tiempo real
            if (gestionToEdit?.gestion_id) {
                try {
                    const response = await getGestionDetail(gestionToEdit.gestion_id);
                    let gestionRaw = null;
                    if (response && response.data && response.data.data) {
                        gestionRaw = response.data.data;
                    } else if (response && response.data) {
                        gestionRaw = response.data;
                    } else {
                        gestionRaw = response;
                    }
                    const gestionActualizada = Array.isArray(gestionRaw) ? gestionRaw[0] : gestionRaw;

                    if (gestionActualizada) {
                        // Actualizar el estado con los datos más recientes
                        const gestionConUnidades = {
                            ...gestionActualizada,
                            unidades_atendiendo: gestionActualizada.unidades_asignadas || gestionActualizada.unidades_atendiendo || []
                        };
                        setGestionToEdit(gestionConUnidades);

                        // Asegurar que estado_id y prioridad_id sean números
                        const estadoId = parseInt(gestionActualizada.estado_id, 10) || formData.estado_id || 1;
                        const prioridadId = parseInt(gestionActualizada.prioridad_id, 10) || formData.prioridad_id || 2;

                        console.log("🔄 Recargando datos después de guardar:", {
                            estado_id_backend: gestionActualizada.estado_id,
                            estado_id_convertido: estadoId,
                            prioridad_id_backend: gestionActualizada.prioridad_id,
                            prioridad_id_convertido: prioridadId,
                            estado_id_anterior: formData.estado_id,
                            prioridad_id_anterior: formData.prioridad_id
                        });

                        setFormData(prev => ({
                            ...prev,
                            gestion_id: gestionActualizada.gestion_id || parseInt(id),
                            avance_calculado: gestionActualizada.avance_promedio || gestionActualizada.avance_calculado || 0,
                            nombre: gestionActualizada.nombre || prev.nombre,
                            descripcion: gestionActualizada.descripcion || prev.descripcion,
                            estado_id: estadoId,
                            prioridad_id: prioridadId,
                            estado_nombre: gestionActualizada.estado_nombre || prev.estado_nombre,
                            prioridad_nombre: gestionActualizada.prioridad_nombre || prev.prioridad_nombre,
                            tipo_flujo_id: gestionActualizada.tipo_flujo_id || 2,
                            workflow_id: gestionActualizada.workflow_id || "",
                            paso_numero: gestionActualizada.paso_numero || "",
                            nombre_paso: gestionActualizada.nombre_paso || "",
                            descripcion_paso: gestionActualizada.descripcion_paso || "",
                            fecha_creacion: gestionActualizada.fecha_creacion || "",
                            fecha_llegada_paso: gestionActualizada.fecha_llegada_paso || "",
                            estado_flujo: gestionActualizada.estado_flujo || "",
                            unidades_atendiendo: gestionActualizada.unidades_asignadas || gestionActualizada.unidades_atendiendo || [],
                            fecha_inicio: gestionActualizada.fecha_llegada_paso || "",
                            archivos: gestionActualizada.archivos || [],
                            unidad_actual_id: gestionActualizada.unidad_actual_id || unidad_actual_id,
                            creado_por: gestionActualizada.creado_por || "",
                            tipo_flujo: gestionActualizada.tipo_flujo || ""
                        }));
                    }
                } catch (reloadError) {
                    console.error("⚠️ Error al recargar datos de la gestión:", reloadError);
                    // No mostrar error al usuario, solo loguear
                }
            }

        } catch (error) {
            console.error("❌ Error al guardar gestión:", error);

            // Extraer mensaje de error específico
            let errorMessage = 'Error al actualizar la gestión';

            if (error?.response?.data?.mensaje) {
                errorMessage = error.response.data.mensaje;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Mostrar notificación de error SOLO si falla
            showNotification('error', errorMessage);

        } finally {
            // Finalizar el estado de carga
            setIsSaving(false);
        }
    };

    // Función para manejar la cancelación
    const handleCancel = () => {
        navigate('/gestiones/gestion');
    };

    // Función para abrir el modal de cambio de etapa
    const handleOpenChangeStageModal = () => {
        setChangeStageModalOpen(true);
    };

    // Función para cerrar el modal de cambio de etapa
    const handleCloseChangeStageModal = () => {
        setChangeStageModalOpen(false);
    };

    // Función para guardar el cambio de etapa
    const handleSaveStageChange = async (stageData) => {
        // Iniciar el proceso de cambio de etapa
        setIsChangingStage(true);

        try {
            console.log("Guardando cambio de etapa:", stageData);

            // Preparar datos para el endpoint
            const etapaData = {
                gestion_id: gestionToEdit?.gestion_id || parseInt(id),
                workflow_id: gestionToEdit?.workflow_id || 0,
                unidad_id: unidad_actual_id,
                nombre_paso: stageData.nombre_paso,
                descripcion_paso: stageData.descripcion_paso,
                siguiente_unidades: stageData.unidades_seleccionadas.map(u => u.id)
            };

            console.log("📤 Datos enviados al endpoint:", etapaData);

            // Llamar al endpoint de cambio de etapa
            await cambiarEtapa(etapaData);

            // Mostrar notificación de éxito
            showNotification('success', '¡Cambio de etapa guardado exitosamente!');

            // Recargar los datos sin recargar la página (mismo comportamiento que acuse de recibido)
            console.log("🔄 Recargando datos después de cambio de etapa...");

            // Recargar la gestión
            if (gestionToEdit?.gestion_id) {
                const response = await getGestionDetail(gestionToEdit.gestion_id);
                let gestionRaw = null;
                if (response && response.data && response.data.data) {
                    gestionRaw = response.data.data;
                } else if (response && response.data) {
                    gestionRaw = response.data;
                } else {
                    gestionRaw = response;
                }
                const gestion = Array.isArray(gestionRaw) ? gestionRaw[0] : gestionRaw;

                if (gestion) {
                    // Asegurar que unidades_asignadas esté disponible
                    const gestionConUnidades = {
                        ...gestion,
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || []
                    };
                    setGestionToEdit(gestionConUnidades);
                    setFormData({
                        gestion_id: gestion.gestion_id || parseInt(id),
                        avance_calculado: gestion.avance_promedio || gestion.avance_calculado || 0,
                        nombre: gestion.nombre || "",
                        descripcion: gestion.descripcion || "",
                        estado_id: gestion.estado_id !== null && gestion.estado_id !== undefined
                            ? parseInt(gestion.estado_id, 10)
                            : 1,
                        prioridad_id: gestion.prioridad_id !== null && gestion.prioridad_id !== undefined
                            ? parseInt(gestion.prioridad_id, 10)
                            : 2,
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
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || [],
                        fecha_inicio: gestion.fecha_llegada_paso || "",
                        archivos: gestion.archivos || [],
                        unidad_actual_id: gestion.unidad_actual_id || unidad_actual_id,
                        creado_por: gestion.creado_por || "",
                        tipo_flujo: gestion.tipo_flujo || ""
                    });
                }
            }

            // Recargar comentarios y documentos después de actualizar la gestión
            const gestionIdActualizado = gestionToEdit?.gestion_id || parseInt(id);
            const workflowIdActualizado = gestionToEdit?.workflow_id || 0;

            if (gestionIdActualizado) {
                await Promise.all([
                    loadComentarios(
                        gestionIdActualizado,
                        workflowIdActualizado,
                        unidad_actual_id,
                        userId
                    ),
                    loadDocuments(
                        gestionIdActualizado,
                        workflowIdActualizado,
                        unidad_actual_id,
                        userId
                    )
                ]);

                // Forzar actualización del grid de documentos
                setDocumentsUpdateKey(prev => prev + 1);
            }

            console.log("✅ Datos actualizados exitosamente");

            // Cerrar el modal
            handleCloseChangeStageModal();

            // Retornar éxito
            return Promise.resolve();

        } catch (error) {
            console.error("Error al guardar cambio de etapa:", error);
            showNotification('error', 'Error al cambiar la etapa');
            throw error; // Re-lanzar el error para que el modal lo maneje
        } finally {
            // Finalizar el estado de carga
            setIsChangingStage(false);
        }
    };

    // Función para abrir el modal de adjuntar documentos
    const handleOpenAttachDocumentsModal = () => {
        setAttachDocumentsModalOpen(true);
    };

    // Función para cerrar el modal de adjuntar documentos
    const handleCloseAttachDocumentsModal = () => {
        setAttachDocumentsModalOpen(false);
    };

    // Función para guardar los documentos adjuntos
    const handleSaveAttachedDocuments = async (documentsData) => {
        // Iniciar el proceso de subida
        setIsUploadingDocument(true);

        try {
            console.log("📤 Guardando documentos adjuntos:", documentsData);

            // Importar el servicio de subida de archivos
            const { uploadFilesLocally } = await import("services/fileService");

            // Obtener datos necesarios
            const gestionId = gestionToEdit.gestion_id || parseInt(id);
            const workflowId = gestionToEdit.workflow_id || 0;

            console.log("📤 Datos para subida:", {
                gestionId,
                workflowId,
                userId,
                documentsCount: documentsData.length
            });

            // Subir archivos usando el servicio con unidad de sesión
            const uploadResult = await uploadFilesLocally(
                gestionId,
                documentsData,
                userId,
                workflowId,
                unidad_actual_id // Usar unidad_actual_id de la sesión
            );

            console.log("✅ Documentos subidos exitosamente:", uploadResult);

            // Mostrar notificación de éxito
            showNotification('success', `${documentsData.length} archivo(s) subido(s) correctamente`);

            // Cerrar el modal
            handleCloseAttachDocumentsModal();

            // Recargar solo los datos necesarios sin recargar la página
            console.log("🔄 Actualizando datos después de subida...");

            // Recargar documentos usando el hook
            await loadDocuments(gestionId, workflowId, unidad_actual_id, userId);

            // Recargar comentarios también para mantener consistencia
            await loadComentarios(gestionId, workflowId, unidad_actual_id, userId);

            // Forzar actualización del grid de documentos
            setDocumentsUpdateKey(prev => prev + 1);
            console.log("🔄 Grid de documentos actualizado");

            console.log("✅ Datos actualizados exitosamente");

        } catch (error) {
            console.error("❌ Error al subir documentos:", error);
            showNotification('error', error.message || 'Error al subir los documentos');
        } finally {
            // Finalizar el estado de carga
            setIsUploadingDocument(false);
        }
    };

    // Función para manejar agregar documento a un paso específico
    const handleAddDocumentToStep = (pasoNumero) => {
        console.log("Agregar documento al paso:", pasoNumero);
        // Aquí puedes implementar lógica específica para agregar documento a un paso
        handleOpenAttachDocumentsModal();
    };

    // Función para manejar descarga de documento
    const handleDownloadDocument = (adjunto) => {
        console.log("Descargar documento:", adjunto);
        // Aquí puedes implementar la lógica de descarga
        showNotification('info', `Descargando ${adjunto.nombre_archivo}...`);
    };

    // Función para abrir el modal de confirmación de eliminación
    const handleDeleteDocument = (adjunto) => {
        console.log("🗑️ Solicitando confirmación para eliminar documento:", adjunto);
        setDeleteDocumentAlert({
            open: true,
            document: adjunto
        });
    };

    // Función para confirmar la eliminación del documento
    const handleDeleteDocumentConfirm = async () => {
        if (!deleteDocumentAlert.document) return;

        const adjunto = deleteDocumentAlert.document;
        console.log("🗑️ Confirmado, eliminando documento:", adjunto);

        try {
            // Cerrar el modal de confirmación
            setDeleteDocumentAlert({ open: false, document: null });

            // Mostrar notificación de proceso
            showNotification('info', `Eliminando ${adjunto.nombre_archivo}...`);

            // Importar el servicio dinámicamente
            const { default: adjuntosService } = await import("services/adjuntosService");

            // Llamar al servicio para eliminar el adjunto
            await adjuntosService.eliminarAdjunto(
                gestionToEdit?.gestion_id || parseInt(id),
                adjunto.adjunto_id,
                unidad_actual_id,
                userId
            );

            // Mostrar notificación de éxito
            showNotification('success', `Documento "${adjunto.nombre_archivo}" eliminado exitosamente`);

            // Recargar solo los datos necesarios sin recargar la página
            console.log("🔄 Actualizando datos después de eliminación...");

            // Recargar documentos usando el hook
            await loadDocuments(
                gestionToEdit?.gestion_id || parseInt(id),
                gestionToEdit?.workflow_id || 0,
                unidad_actual_id,
                userId
            );

            // Recargar comentarios también para mantener consistencia
            await loadComentarios(
                gestionToEdit?.gestion_id || parseInt(id),
                gestionToEdit?.workflow_id || 0,
                unidad_actual_id,
                userId
            );

            // Forzar actualización del grid de documentos
            setDocumentsUpdateKey(prev => prev + 1);
            console.log("🔄 Grid de documentos actualizado después de eliminación");

            console.log("✅ Datos actualizados después de eliminación");

        } catch (error) {
            console.error("❌ Error al eliminar documento:", error);
            showNotification(
                'error',
                `Error al eliminar el documento: ${error.message || 'Error desconocido'}`
            );
        }
    };

    // Función para cancelar la eliminación del documento
    const handleDeleteDocumentCancel = () => {
        console.log("❌ Eliminación cancelada por el usuario");
        setDeleteDocumentAlert({ open: false, document: null });
    };

    // Función para abrir el modal de confirmación de inactivar gestión
    const handleInactivateGestion = () => {
        console.log("⏸️ Solicitando confirmación para inactivar gestión");
        setInactivateGestionAlert({ open: true });
    };

    // Función para confirmar la inactivación de la gestión
    const handleInactivateGestionConfirm = async () => {
        console.log("⏸️ Confirmado, inactivando gestión");

        // Iniciar el proceso de inactivación
        setIsInactivating(true);

        try {
            // Cerrar el modal de confirmación
            setInactivateGestionAlert({ open: false });

            // Obtener el ID de la gestión a inactivar
            const gestionId = gestionToEdit?.gestion_id || parseInt(id);

            console.log("📤 Inactivando gestión ID:", gestionId);

            // Llamar al endpoint de inactivación usando el método específico
            const response = await gestionService.inactivateGestion(userId, gestionId);

            console.log("✅ Gestión inactivada exitosamente:", response);

            // Mostrar notificación de éxito
            showNotification('success', 'Gestión inactivada exitosamente');

            // Esperar 3 segundos y luego recargar la página
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("❌ Error al inactivar gestión:", error);

            // Extraer mensaje de error específico
            let errorMessage = 'Error al inactivar la gestión';
            if (error?.response?.data?.mensaje) {
                errorMessage = error.response.data.mensaje;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            showNotification('error', errorMessage);
        } finally {
            // Finalizar el estado de carga
            setIsInactivating(false);
        }
    };

    // Función para cancelar la inactivación de la gestión
    const handleInactivateGestionCancel = () => {
        console.log("❌ Inactivación cancelada por el usuario");
        setInactivateGestionAlert({ open: false });
    };

    // Función para abrir el modal de confirmación de reactivar gestión
    const handleReactivateGestion = () => {
        console.log("▶️ Solicitando confirmación para reactivar gestión");
        setReactivateGestionAlert({ open: true });
    };

    // Función para confirmar la reactivación de la gestión
    const handleReactivateGestionConfirm = async () => {
        console.log("▶️ Confirmado, reactivando gestión");

        // Iniciar el proceso de reactivación
        setIsReactivating(true);

        try {
            // Cerrar el modal de confirmación
            setReactivateGestionAlert({ open: false });

            // Preparar datos para el endpoint de reactivación
            const reactivateData = {
                gestion_id: gestionToEdit?.gestion_id || parseInt(id)
            };

            console.log("📤 Datos para reactivar:", reactivateData);

            // Llamar al endpoint de reactivación usando gestionService
            const response = await gestionService.manageGestiones(6, userId, reactivateData);

            console.log("✅ Gestión reactivada exitosamente:", response);

            // Mostrar notificación de éxito
            showNotification('success', 'Gestión reactivada exitosamente');

            // Esperar 3 segundos y luego recargar la página
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("❌ Error al reactivar gestión:", error);

            // Extraer mensaje de error específico
            let errorMessage = 'Error al reactivar la gestión';
            if (error?.response?.data?.mensaje) {
                errorMessage = error.response.data.mensaje;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            showNotification('error', errorMessage);
        } finally {
            // Finalizar el estado de carga
            setIsReactivating(false);
        }
    };

    // Función para cancelar la reactivación de la gestión
    const handleReactivateGestionCancel = () => {
        console.log("❌ Reactivación cancelada por el usuario");
        setReactivateGestionAlert({ open: false });
    };

    // Función para abrir el modal de confirmación de acuse de recibido
    const handleAcuseRecibido = () => {
        console.log("📋 Solicitando confirmación para acuse de recibido");
        setAcuseModalOpen(true);
    };

    // Función para confirmar el acuse de recibido
    const handleAcuseRecibidoConfirm = async () => {
        console.log("📋 Confirmado, procesando acuse de recibido");

        // Iniciar el proceso de acuse de recibido
        setIsProcessingAcuse(true);

        try {
            // Cerrar modal
            setAcuseModalOpen(false);

            // Preparar datos para el endpoint de acuse de recibido
            const acuseData = {
                workflow_id: gestionToEdit?.workflow_id || 0,
                unidad_id: unidad_actual_id
            };

            console.log("📤 Datos para acuse de recibido:", acuseData);

            // Llamar al endpoint de acuse de recibido usando gestionService
            const response = await gestionService.procesarAcuseRecibido(userId, acuseData);

            console.log("✅ Acuse de recibido procesado exitosamente:", response);

            // Mostrar notificación de éxito
            showNotification('success', 'Acuse de recibido procesado exitosamente');

            // Recargar los datos sin recargar la página
            console.log("🔄 Recargando datos después de acuse de recibido...");

            // Recargar la gestión
            if (gestionToEdit?.gestion_id) {
                const response = await getGestionDetail(gestionToEdit.gestion_id);
                let gestionRaw = null;
                if (response && response.data && response.data.data) {
                    gestionRaw = response.data.data;
                } else if (response && response.data) {
                    gestionRaw = response.data;
                } else {
                    gestionRaw = response;
                }
                const gestion = Array.isArray(gestionRaw) ? gestionRaw[0] : gestionRaw;

                if (gestion) {
                    // Asegurar que unidades_asignadas esté disponible
                    const gestionConUnidades = {
                        ...gestion,
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || []
                    };
                    setGestionToEdit(gestionConUnidades);
                    setFormData({
                        gestion_id: gestion.gestion_id || parseInt(id),
                        avance_calculado: gestion.avance_promedio || gestion.avance_calculado || 0,
                        nombre: gestion.nombre || "",
                        descripcion: gestion.descripcion || "",
                        estado_id: gestion.estado_id !== null && gestion.estado_id !== undefined
                            ? parseInt(gestion.estado_id, 10)
                            : 1,
                        prioridad_id: gestion.prioridad_id !== null && gestion.prioridad_id !== undefined
                            ? parseInt(gestion.prioridad_id, 10)
                            : 2,
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
                        unidades_atendiendo: gestion.unidades_asignadas || gestion.unidades_atendiendo || [],
                        fecha_inicio: gestion.fecha_llegada_paso || "",
                        archivos: gestion.archivos || [],
                        unidad_actual_id: gestion.unidad_actual_id || unidad_actual_id,
                        creado_por: gestion.creado_por || "",
                        tipo_flujo: gestion.tipo_flujo || ""
                    });
                }
            }

            // Recargar comentarios y documentos
            if (gestionToEdit?.gestion_id) {
                await loadComentarios(
                    gestionToEdit.gestion_id,
                    gestionToEdit.workflow_id || 0,
                    unidad_actual_id,
                    userId
                );
                await loadDocuments(
                    gestionToEdit.gestion_id,
                    gestionToEdit.workflow_id || 0,
                    unidad_actual_id,
                    userId
                );
                setDocumentsUpdateKey(prev => prev + 1);
            }

            console.log("✅ Datos actualizados exitosamente");

        } catch (error) {
            console.error("❌ Error al procesar acuse de recibido:", error);

            // Extraer mensaje de error específico
            let errorMessage = 'Error al procesar acuse de recibido';
            if (error?.response?.data?.mensaje) {
                errorMessage = error.response.data.mensaje;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            showNotification('error', errorMessage);
        } finally {
            // Finalizar el estado de carga
            setIsProcessingAcuse(false);
        }
    };

    // Función para cancelar el acuse de recibido
    const handleAcuseRecibidoCancel = () => {
        console.log("❌ Acuse de recibido cancelado por el usuario");
        setAcuseModalOpen(false);
    };

    // Datos del timeline construidos desde el API usando la utilidad
    // Memoizar para evitar recalcular en cada render
    // Usar JSON.stringify de las propiedades relevantes como dependencia
    const timelineKey = JSON.stringify({
        gestionId: gestionToEdit?.gestion_id,
        timelineLength: gestionToEdit?.timeline?.length,
        nombre_paso: gestionToEdit?.nombre_paso,
        paso_numero: gestionToEdit?.paso_numero,
        estado_nombre: gestionToEdit?.estado_nombre,
        fecha_creacion: gestionToEdit?.fecha_creacion,
        fecha_llegada_paso: gestionToEdit?.fecha_llegada_paso
    });
    const timelineEvents = useMemo(() => buildTimelineFromAPI(gestionToEdit), [timelineKey]);

    // Función centralizada para calcular el progreso
    // Usar useCallback para evitar recrear la función en cada render
    const calculateProgress = useCallback(() => {
        // Prioridad 1: avance_calculado del API
        if (gestionToEdit?.avance_calculado !== undefined && gestionToEdit?.avance_calculado !== null) {
            return Math.min(Math.max(parseFloat(gestionToEdit.avance_calculado), 0), 100);
        }
        // Prioridad 2: avance_promedio del API
        if (gestionToEdit?.avance_promedio !== undefined && gestionToEdit?.avance_promedio !== null) {
            return Math.min(Math.max(parseFloat(gestionToEdit.avance_promedio), 0), 100);
        }
        // Prioridad 3: Fallback basado en eventos completados del timeline
        const completedEvents = timelineEvents.filter(event => event.color === 'success').length;
        return timelineEvents.length > 0 ? (completedEvents / timelineEvents.length) * 100 : 0;
    }, [gestionToEdit?.avance_calculado, gestionToEdit?.avance_promedio, timelineEvents]);

    // Calcular total de documentos de forma memoizada
    const totalDocumentos = useMemo(() => {
        // Prioridad 1: Si hay documentos cargados por el hook
        if (documentos && Array.isArray(documentos) && documentos.length > 0) {
            // Si documentos es un array de pasos con adjuntos
            if (documentos[0]?.paso_numero !== undefined) {
                return documentos.reduce((total, paso) => total + (paso.adjuntos?.length || 0), 0);
            }
            // Si documentos es un array directo de adjuntos
            return documentos.length;
        }

        // Prioridad 2: Si hay pasos en gestionToEdit
        if (gestionToEdit?.pasos && Array.isArray(gestionToEdit.pasos)) {
            return gestionToEdit.pasos.reduce((total, paso) => total + (paso.adjuntos?.length || 0), 0);
        }

        // Prioridad 3: Fallback a archivos directos
        return gestionToEdit?.archivos?.length || 0;
    }, [documentos, gestionToEdit?.pasos, gestionToEdit?.archivos]);

    // Si no hay gestión cargada, mostrar loading
    if (loadingGestionDetail || !gestionToEdit) {
        return (
            <>
                <SoftBox mt={4} display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <SoftTypography variant="h6" color="text">
                        Cargando gestión...
                    </SoftTypography>
                </SoftBox>
            </>
        );
    }

    // Estados unificados para pasos de gestión
    const estados = [
        { id: 1, nombre: "Pendiente", valor: "pendiente" },
        { id: 2, nombre: "En Proceso", valor: "en_proceso" },
        { id: 3, nombre: "Completado", valor: "completado" },
        { id: 4, nombre: "Cerrada", valor: "cerrada" },
        { id: 5, nombre: "Cancelada", valor: "cancelada" }
    ];

    const prioridades = [
        { id: 1, nombre: "Baja", valor: "baja" },
        { id: 2, nombre: "Media", valor: "media" },
        { id: 3, nombre: "Alta", valor: "alta" }
    ];

    return (
        <>
            {/* Contenido principal - Sin Container para aprovechar todo el espacio */}
            <SoftBox mt={2} mb={3} px={{ xs: 1, sm: 2, md: 2 }}>
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Card
                            sx={{
                                borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                                boxShadow: { xs: '0 4px 16px rgba(0, 0, 0, 0.1)', sm: '0 8px 32px rgba(0, 0, 0, 0.1)' },
                                border: '1px solid #f0f0f0',
                                overflow: 'hidden',
                                width: '100%',
                                minHeight: { xs: 'auto', sm: '700px', md: '800px', lg: '900px' },
                            }}
                        >
                            <CardContent sx={{ padding: 0 }}>
                                <SoftBox p={{ xs: 2, sm: 3, md: 4 }}>
                                    {/* Header con información completa de la gestión */}
                                    <SoftBox mb={{ xs: 3, sm: 4, md: 4 }}>
                                        {/* Fila superior: Título, Estado, Prioridad y Acciones */}
                                        <SoftBox
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                            flexWrap="wrap"
                                            gap={{ xs: 2, sm: 3 }}
                                            mb={2}
                                        >
                                            {/* Lado izquierdo: Título y tags de estado */}
                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                <SoftBox display="flex" alignItems="center" gap={2} flexWrap="wrap">
                                                    <IconButton
                                                        onClick={handleCancel}
                                                        sx={{
                                                            background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                                            color: '#616161',
                                                            borderRadius: '12px',
                                                            padding: '8px',
                                                            '&:hover': {
                                                                background: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                                                                transform: 'translateX(-2px)',
                                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <ArrowBackIcon />
                                                    </IconButton>
                                                    <SoftTypography
                                                        variant="h4"
                                                        fontWeight="bold"
                                                        color="dark"
                                                        sx={{
                                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                                            lineHeight: 1.2
                                                        }}
                                                    >
                                                        {gestionToEdit.nombre || "Revisión de Servidores"}
                                                    </SoftTypography>
                                                    {/* Tags de Estado y Prioridad */}
                                                    <SoftBox display="flex" gap={1} flexWrap="wrap">
                                                        <Chip
                                                            icon={<PlayArrowIcon sx={{ fontSize: 16 }} />}
                                                            label={gestionToEdit.estado_nombre || "En Proceso"}
                                                            size="medium"
                                                            sx={{
                                                                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                                color: '#1565c0',
                                                                fontWeight: '600',
                                                                fontSize: '0.875rem',
                                                                height: '32px',
                                                                '& .MuiChip-icon': {
                                                                    color: '#1565c0'
                                                                }
                                                            }}
                                                        />
                                                        <Chip
                                                            icon={<FlagIcon sx={{ fontSize: 16 }} />}
                                                            label={gestionToEdit.prioridad_nombre || "Alta Prioridad"}
                                                            size="medium"
                                                            sx={{
                                                                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                                                                color: '#c62828',
                                                                fontWeight: '600',
                                                                fontSize: '0.875rem',
                                                                height: '32px',
                                                                '& .MuiChip-icon': {
                                                                    color: '#c62828'
                                                                }
                                                            }}
                                                        />
                                                    </SoftBox>
                                                </SoftBox>
                                            </SoftBox>

                                        </SoftBox>

                                        {/* Fila de metadatos: Fecha de creación y creado por */}
                                        <SoftBox
                                            display="flex"
                                            alignItems="center"
                                            gap={{ xs: 2, sm: 3, md: 4 }}
                                            flexWrap="wrap"
                                            mb={2}
                                        >
                                            <SoftBox display="flex" alignItems="center" gap={0.5}>
                                                <CalendarTodayIcon sx={{ fontSize: 18, color: '#616161' }} />
                                                <SoftTypography variant="body2" color="text" fontWeight="medium">
                                                    Creado: {gestionToEdit.fecha_creacion ? new Date(gestionToEdit.fecha_creacion).toLocaleDateString('es-ES', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    }) : "15 Ene 2024"}
                                                </SoftTypography>
                                            </SoftBox>
                                            {gestionToEdit.creado_por && (
                                                <SoftBox display="flex" alignItems="center" gap={0.5}>
                                                    <SoftTypography variant="body2" color="text" fontWeight="medium">
                                                        Por: {gestionToEdit.creado_por}
                                                    </SoftTypography>
                                                </SoftBox>
                                            )}
                                            <SoftBox display="flex" alignItems="center" gap={0.5}>
                                                <SoftTypography variant="body2" color="text" fontWeight="medium">
                                                    {`ID gestión: GD-${new Date().getFullYear()}-${String(gestionToEdit?.gestion_id || id).padStart(3, '0')}`}
                                                </SoftTypography>
                                            </SoftBox>
                                        </SoftBox>

                                        {/* Progreso Paso Actual */}
                                        <SoftBox>
                                            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <SoftTypography variant="body1" fontWeight="bold" color="dark">
                                                    Progreso paso actual
                                                </SoftTypography>
                                                <SoftTypography variant="body1" fontWeight="bold" color="primary">
                                                    {Math.round(calculateProgress())}%
                                                </SoftTypography>
                                            </SoftBox>
                                            <LinearProgress
                                                variant="determinate"
                                                value={calculateProgress()}
                                                sx={{
                                                    height: 12,
                                                    borderRadius: 6,
                                                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                                                    '& .MuiLinearProgress-bar': {
                                                        borderRadius: 6,
                                                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                    }
                                                }}
                                            />
                                        </SoftBox>
                                    </SoftBox>

                                    {/* Contenido con tabs y sidebar */}
                                    <Grid container spacing={3}>
                                        {/* Columna principal - Tabs y contenido */}
                                        <Grid item xs={12} lg={8}>
                                            {/* Pestañas */}
                                            <SoftBox mb={2}>
                                                <Tabs
                                                    value={activeTab}
                                                    onChange={(event, newValue) => setActiveTab(newValue)}
                                                    sx={{
                                                        background: 'transparent',
                                                        borderRadius: '12px',
                                                        padding: '4px 8px',
                                                        '& .MuiTab-root': {
                                                            textTransform: 'none',
                                                            fontWeight: '600',
                                                            fontSize: '0.875rem',
                                                            minHeight: 44,
                                                            padding: '10px 18px',
                                                            borderRadius: 0,
                                                            marginRight: 4,
                                                            color: '#1f2937',
                                                            opacity: 0.9,
                                                            transition: 'color 0.2s ease',
                                                            '&.Mui-selected': {
                                                                color: '#4f83cc',
                                                                opacity: 1,
                                                                backgroundColor: 'rgba(79,131,204,0.10)',
                                                                borderRadius: '10px',
                                                                boxShadow: '0 0 0 2px rgba(79,131,204,0.12) inset'
                                                            },
                                                            '&:hover': {
                                                                opacity: 1
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: '1.25rem',
                                                                marginRight: '8px'
                                                            }
                                                        },
                                                        '& .MuiTabs-indicator': {
                                                            backgroundColor: '#4f83cc',
                                                            height: 3,
                                                            borderRadius: 2
                                                        }
                                                    }}
                                                >
                                                    <Tab
                                                        label="DETALLES"
                                                        icon={<InfoIcon />}
                                                        iconPosition="start"
                                                    />
                                                    <Tab
                                                        label="LÍNEA DE TIEMPO"
                                                        icon={<TimelineIcon />}
                                                        iconPosition="start"
                                                    />
                                                    <Tab
                                                        label="DOCUMENTOS "
                                                        icon={<DescriptionIcon />}
                                                        iconPosition="start"
                                                    />
                                                    <Tab
                                                        label="COMENTARIOS "
                                                        icon={<CommentIcon />}
                                                        iconPosition="start"
                                                    />
                                                </Tabs>
                                            </SoftBox>

                                            {/* Contenido de las pestañas */}
                                            {activeTab === 0 && (
                                                <SoftBox>
                                                    {/* Información General */}
                                                    <SoftTypography variant="h6" fontWeight="bold" color="dark" mb={2}>
                                                        Información General
                                                    </SoftTypography>

                                                    <Grid container spacing={3}>
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
                                                                    error={!!errors.nombre}
                                                                    helperText={errors.nombre}
                                                                    variant="outlined"
                                                                    required
                                                                    disabled={isSaving}
                                                                    inputProps={{
                                                                        spellCheck: false,
                                                                        autoComplete: "off"
                                                                    }}
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: "8px",
                                                                            backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                                borderColor: isSaving ? "#e0e0e0" : "primary.main"
                                                                            },
                                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                                borderColor: "primary.main",
                                                                                borderWidth: "2px"
                                                                            },
                                                                            "&.Mui-disabled": {
                                                                                backgroundColor: '#f5f5f5'
                                                                            }
                                                                        },
                                                                        "& .MuiInputBase-input": {
                                                                            overflow: "auto",
                                                                            resize: "none",
                                                                            wordBreak: "break-all",
                                                                            whiteSpace: "pre-wrap",
                                                                            width: "100%",
                                                                            "&.Mui-disabled": {
                                                                                color: "#666666",
                                                                                WebkitTextFillColor: "#666666"
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
                                                            <SoftBox
                                                                sx={{
                                                                    backgroundColor: 'white',
                                                                    '& .ql-snow': {
                                                                        border: '1px solid #dee2e6',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        backgroundColor: 'white'
                                                                    },
                                                                    '& .ql-toolbar': {
                                                                        backgroundColor: isSaving ? '#f5f5f5' : '#f8f9fa',
                                                                        border: 'none',
                                                                        borderBottom: '1px solid #dee2e6',
                                                                        padding: '12px',
                                                                        display: ' Ondisplay',
                                                                        alignItems: 'center',
                                                                        适时gap: '4px',
                                                                        pointerEvents: isSaving ? 'none' : 'auto',
                                                                        opacity: isSaving ? 0.6 : 1,
                                                                        '& .ql-formats': {
                                                                            margin: '0',
                                                                            marginRight: '12px'
                                                                        }
                                                                    },
                                                                    '& .ql-container': {
                                                                        backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                                                        border: 'none',
                                                                        fontFamily: 'inherit'
                                                                    },
                                                                    '& .ql-editor': {
                                                                        backgroundColor: isSaving ? '#f5f5f5' : 'white',
                                                                        minHeight: '120px',
                                                                        padding: '16px',
                                                                        fontSize: '14px',
                                                                        fontFamily: 'inherit',
                                                                        color: isSaving ? '#666666' : '#495057',
                                                                        cursor: isSaving ? 'not-allowed' : 'text',
                                                                        '&.ql-blank::before': {
                                                                            color: '#adb5bd',
                                                                            fontStyle: 'italic',
                                                                            fontSize: '14px'
                                                                        },
                                                                        '& p': {
                                                                            margin: '0',
                                                                            marginBottom: '8px'
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
                                                                    onChange={(value) => setFormData(prev => ({ ...prev, descripcion: value }))}
                                                                    placeholder="Aquí se ingresa la descripción de la gestión."
                                                                    readOnly={isSaving}
                                                                />
                                                            </SoftBox>
                                                            {errors.descripcion && (
                                                                <Alert severity="error" sx={{ mt: 1 }}>
                                                                    {errors.descripcion}
                                                                </Alert>
                                                            )}
                                                        </Grid>

                                                        {/* Fecha de Inicio (Bloqueada) */}
                                                        <Grid item xs={12} md={6}>
                                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                                <SoftTypography variant="body1" fontWeight="medium" color="text">
                                                                    Fecha de Inicio:
                                                                </SoftTypography>
                                                                <TextField
                                                                    fullWidth
                                                                    value={formData.fecha_inicio ? new Date(formData.fecha_inicio).toLocaleDateString('es-ES', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    }) : "No disponible"}
                                                                    variant="outlined"
                                                                    disabled
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: "8px",
                                                                            backgroundColor: "#f5f5f5",
                                                                            "& .MuiOutlinedInput-input": {
                                                                                color: "#666666"
                                                                            }
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "#e0e0e0"
                                                                        }
                                                                    }}
                                                                />
                                                            </SoftBox>
                                                        </Grid>

                                                        {/* ID de Gestión (Bloqueado) */}
                                                        <Grid item xs={12} md={6}>
                                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                                <SoftTypography variant="body1" fontWeight="medium" color="text">
                                                                    ID de Gestión:
                                                                </SoftTypography>
                                                                <TextField
                                                                    fullWidth
                                                                    value={`GES-${new Date().getFullYear()}-${String(formData.gestion_id || gestionToEdit?.gestion_id || id).padStart(3, '0')}`}
                                                                    variant="outlined"
                                                                    disabled
                                                                    sx={{
                                                                        "& .MuiOutlinedInput-root": {
                                                                            borderRadius: "8px",
                                                                            backgroundColor: "#f5f5f5",
                                                                            "& .MuiOutlinedInput-input": {
                                                                                color: "#666666"
                                                                            }
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "#e0e0e0"
                                                                        }
                                                                    }}
                                                                />
                                                            </SoftBox>
                                                        </Grid>

                                                        {/* Estado y Prioridad */}
                                                        <Grid item xs={12} md={6}>
                                                            <SoftTypography variant="body1" fontWeight="medium" color="text">
                                                                Estado:
                                                            </SoftTypography>
                                                            <FormControl fullWidth variant="outlined">
                                                                <Select
                                                                    open={estadoSelectOpen}
                                                                    onOpen={() => setEstadoSelectOpen(true)}
                                                                    onClose={() => setEstadoSelectOpen(false)}
                                                                    value={formData.estado_id || ""}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        // Convertir a número para asegurar compatibilidad
                                                                        const estadoIdNum = parseInt(e.target.value, 10);
                                                                        const selectedEstado = estados.find(est => est.id === estadoIdNum);
                                                                        console.log("🔄 Cambio de estado:", {
                                                                            valorSeleccionado: e.target.value,
                                                                            estadoIdNum: estadoIdNum,
                                                                            estadoEncontrado: selectedEstado,
                                                                            estadoAnterior: formData.estado_id
                                                                        });
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            estado_id: estadoIdNum,
                                                                            estado_nombre: selectedEstado?.valor || selectedEstado?.nombre || ""
                                                                        }));
                                                                        setEstadoSelectOpen(false);
                                                                    }}
                                                                    sx={{
                                                                        borderRadius: "8px",
                                                                        cursor: "pointer",
                                                                        "& .MuiSelect-select": {
                                                                            cursor: "pointer"
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "#dee2e6"
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "primary.main"
                                                                        }
                                                                    }}
                                                                >
                                                                    {estados.map((estado) => (
                                                                        <MenuItem key={estado.id} value={estado.id}>
                                                                            {estado.nombre}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                        <Grid item xs={12} md={6}>
                                                            <SoftTypography variant="body1" fontWeight="medium" color="text">
                                                                Prioridad:
                                                            </SoftTypography>
                                                            <FormControl fullWidth variant="outlined">
                                                                <Select
                                                                    open={prioridadSelectOpen}
                                                                    onOpen={() => setPrioridadSelectOpen(true)}
                                                                    onClose={() => setPrioridadSelectOpen(false)}
                                                                    value={formData.prioridad_id || ""}
                                                                    onChange={(e) => {
                                                                        e.stopPropagation();
                                                                        // Convertir a número para asegurar compatibilidad
                                                                        const prioridadIdNum = parseInt(e.target.value, 10);
                                                                        const selectedPrioridad = prioridades.find(pri => pri.id === prioridadIdNum);
                                                                        console.log("🔄 Cambio de prioridad:", {
                                                                            valorSeleccionado: e.target.value,
                                                                            prioridadIdNum: prioridadIdNum,
                                                                            prioridadEncontrada: selectedPrioridad,
                                                                            prioridadAnterior: formData.prioridad_id
                                                                        });
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            prioridad_id: prioridadIdNum,
                                                                            prioridad_nombre: selectedPrioridad?.valor || selectedPrioridad?.nombre || ""
                                                                        }));
                                                                        setPrioridadSelectOpen(false);
                                                                    }}
                                                                    sx={{
                                                                        borderRadius: "8px",
                                                                        cursor: "pointer",
                                                                        "& .MuiSelect-select": {
                                                                            cursor: "pointer"
                                                                        },
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "#dee2e6"
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: "primary.main"
                                                                        }
                                                                    }}
                                                                >
                                                                    {prioridades.map((prioridad) => (
                                                                        <MenuItem key={prioridad.id} value={prioridad.id}>
                                                                            {prioridad.nombre}
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>

                                                        {/* Unidades Asignadas */}
                                                        <Grid item xs={12}>
                                                            <SoftBox display="flex" flexDirection="column" gap={1}>
                                                                <SoftTypography variant="body1" fontWeight="medium" color="text">
                                                                    Unidades Asignadas:
                                                                </SoftTypography>
                                                                <SoftBox
                                                                    sx={{
                                                                        background: '#f5f5f5',
                                                                        borderRadius: '8px',
                                                                        padding: '12px',
                                                                        border: '1px solid #e0e0e0',
                                                                        minHeight: '60px',
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        gap: 1
                                                                    }}
                                                                >
                                                                    {(() => {
                                                                        const unidadesParaMostrar = getUnidadesParaMostrar();
                                                                        return (unidadesParaMostrar && unidadesParaMostrar.length > 0) ? (
                                                                            unidadesParaMostrar.map((unidad, index) => (
                                                                                <SoftBox key={index} display="flex" alignItems="center" gap={1}>
                                                                                    <Chip
                                                                                        label={unidad.nombre_normalizado}
                                                                                        size="small"
                                                                                        sx={{
                                                                                            background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                                                            color: '#1565c0',
                                                                                            fontWeight: '600',
                                                                                            fontSize: '0.75rem'
                                                                                        }}
                                                                                    />
                                                                                </SoftBox>
                                                                            ))
                                                                        ) : (
                                                                            <SoftTypography variant="body2" color="text" sx={{ fontStyle: 'italic', opacity: 0.7 }}>
                                                                                No hay unidades asignadas
                                                                            </SoftTypography>
                                                                        );
                                                                    })()}
                                                                </SoftBox>
                                                            </SoftBox>
                                                        </Grid>

                                                        {/* Botones de acción */}
                                                        <Grid item xs={12}>
                                                            <Divider sx={{ my: 2 }} />
                                                            <SoftBox display="flex" justifyContent="flex-end" gap={2}>
                                                                <Button
                                                                    variant="outlined"
                                                                    startIcon={<CancelIcon />}
                                                                    onClick={handleCancel}
                                                                    disabled={isSaving}
                                                                    sx={{
                                                                        background: isSaving
                                                                            ? 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)'
                                                                            : 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                                                        border: '2px solid #ff9800',
                                                                        color: '#e65100',
                                                                        borderRadius: '12px',
                                                                        padding: '10px 20px',
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: '600',
                                                                        textTransform: 'none',
                                                                        boxShadow: '0 2px 4px rgba(255, 152, 0, 0.2)',
                                                                        '&:hover': {
                                                                            background: isSaving
                                                                                ? 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)'
                                                                                : 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                                                            borderColor: '#f57c00',
                                                                            color: '#bf360c',
                                                                            transform: isSaving ? 'none' : 'translateY(-1px)',
                                                                            boxShadow: isSaving ? '0 2px 4px rgba(255, 152, 0, 0.2)' : '0 4px 8px rgba(255, 152, 0, 0.3)',
                                                                        },
                                                                        '&:disabled': {
                                                                            background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                                                            borderColor: '#bdbdbd',
                                                                            color: '#9e9e9e'
                                                                        },
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                >
                                                                    Cancelar
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                                                                    onClick={handleSave}
                                                                    disabled={accionesBloqueadas || isSaving}
                                                                    sx={{
                                                                        background: (accionesBloqueadas || isSaving)
                                                                            ? 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)'
                                                                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                                        borderRadius: '12px',
                                                                        padding: '10px 20px',
                                                                        fontSize: '0.9rem',
                                                                        fontWeight: '600',
                                                                        textTransform: 'none',
                                                                        color: '#ffffff',
                                                                        boxShadow: (accionesBloqueadas || isSaving)
                                                                            ? 'none'
                                                                            : '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                                        opacity: accionesBloqueadas ? 0.7 : 1,
                                                                        cursor: accionesBloqueadas ? 'not-allowed' : 'pointer',
                                                                        '&:hover': {
                                                                            background: (accionesBloqueadas || isSaving)
                                                                                ? 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)'
                                                                                : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                                                            color: '#ffffff',
                                                                            transform: (accionesBloqueadas || isSaving) ? 'none' : 'translateY(-1px)',
                                                                            boxShadow: (accionesBloqueadas || isSaving)
                                                                                ? 'none'
                                                                                : '0 8px 20px rgba(25, 118, 210, 0.4)',
                                                                        },
                                                                        '&:disabled': {
                                                                            background: 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
                                                                            color: '#ffffff',
                                                                            cursor: 'not-allowed'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    title={accionesBloqueadas ? (unidadCompletoTrabajo ? 'Su unidad ya completó su trabajo en este paso' : 'La gestión está finalizada, cancelada o completada') : 'Guardar los cambios realizados en la gestión'}
                                                                >
                                                                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                                                                </Button>
                                                            </SoftBox>
                                                        </Grid>
                                                    </Grid>
                                                </SoftBox>
                                            )}
                                            {activeTab === 1 && <GestionTimeline gestion={gestionToEdit} timelineEvents={timelineEvents} calculateProgress={calculateProgress} />}
                                            {activeTab === 2 && (
                                                <GestionDocumentsTable
                                                    key={documentsUpdateKey}
                                                    // Configuración para datos reales del API
                                                    useRealData={true}
                                                    gestionId={gestionToEdit?.gestion_id || parseInt(id)}
                                                    workflowId={gestionToEdit?.workflow_id || 0}
                                                    unidadId={unidad_actual_id}
                                                    userId={userId}
                                                    // Callbacks
                                                    onAddDocument={accionesBloqueadas ? () => { } : handleAddDocumentToStep}
                                                    onDownloadDocument={handleDownloadDocument}
                                                    onDeleteDocument={accionesBloqueadas ? undefined : handleDeleteDocument}
                                                    disabled={accionesBloqueadas}
                                                />
                                            )}
                                            {activeTab === 3 && (
                                                <GestionComments
                                                    gestion={gestionToEdit}
                                                    gestionId={gestionToEdit?.gestion_id || parseInt(id)}
                                                    workflowId={gestionToEdit?.workflow_id || 0}
                                                    unidadId={unidad_actual_id}
                                                    userId={userId}
                                                    disabled={accionesBloqueadas}
                                                    onCommentAdded={() => {
                                                        // Recargar comentarios para actualizar el resumen
                                                        loadComentarios(
                                                            gestionToEdit?.gestion_id || parseInt(id),
                                                            gestionToEdit?.workflow_id || 0,
                                                            unidad_actual_id,
                                                            userId
                                                        );
                                                    }}
                                                />
                                            )}
                                        </Grid>

                                        {/* Sidebar - Acciones Rápidas */}
                                        <Grid item xs={12} lg={4}>
                                            <SoftBox display="flex" flexDirection="column" gap={2}>
                                                {/* Paso Actual */}
                                                <Card
                                                    sx={{
                                                        borderRadius: '12px',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                        border: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2 }}>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography variant="h6" fontWeight="bold" color="dark">
                                                                Paso Actual
                                                            </SoftTypography>
                                                        </SoftBox>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography variant="caption" color="text" fontWeight="bold">
                                                                Unidad Asignada
                                                            </SoftTypography>
                                                            <SoftBox
                                                                sx={{
                                                                    background: '#f5f5f5',
                                                                    borderRadius: '8px',
                                                                    padding: '8px 12px',
                                                                    mt: 0.5
                                                                }}
                                                            >
                                                                <SoftTypography variant="body2" color="dark">
                                                                    {user?.unidad?.nombre || user?.unidad_actual?.nombre || user?.departamento || "No especificada"}
                                                                </SoftTypography>
                                                            </SoftBox>
                                                        </SoftBox>

                                                        <SoftBox>
                                                            <SoftTypography variant="caption" color="text" fontWeight="bold">
                                                                Fecha de Inicio
                                                            </SoftTypography>
                                                            <SoftTypography variant="body2" color="dark" mt={0.5}>
                                                                {gestionToEdit.fecha_llegada_paso ? new Date(gestionToEdit.fecha_llegada_paso).toLocaleDateString('es-ES') : "20 Ene 2024"}
                                                            </SoftTypography>
                                                        </SoftBox>
                                                    </CardContent>
                                                </Card>

                                                {/* Acciones Rápidas */}
                                                <Card
                                                    sx={{
                                                        borderRadius: '12px',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                        border: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2 }}>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography variant="h6" fontWeight="bold" color="dark">
                                                                Acciones Rápidas
                                                            </SoftTypography>
                                                        </SoftBox>
                                                        <SoftBox display="flex" flexDirection="column" gap={1.5}>
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<AttachFileIcon />}
                                                                onClick={handleOpenAttachDocumentsModal}
                                                                disabled={accionesBloqueadas || isUploadingDocument}
                                                                sx={{
                                                                    border: accionesBloqueadas ? '2px solid #9e9e9e' : '2px solid #1976d2',
                                                                    color: accionesBloqueadas ? '#9e9e9e' : '#1976d2',
                                                                    borderRadius: '8px',
                                                                    padding: '10px 16px',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    textTransform: 'none',
                                                                    opacity: accionesBloqueadas ? 0.7 : 1,
                                                                    cursor: accionesBloqueadas ? 'not-allowed' : 'pointer',
                                                                    '&:hover': {
                                                                        borderColor: accionesBloqueadas ? '#9e9e9e' : '#1565c0',
                                                                        background: accionesBloqueadas ? 'transparent' : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                                        transform: accionesBloqueadas ? 'none' : 'translateY(-2px)',
                                                                    },
                                                                    '&:disabled': {
                                                                        borderColor: '#9e9e9e',
                                                                        color: '#9e9e9e',
                                                                        cursor: 'not-allowed'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                title={accionesBloqueadas ? 'Su unidad ya completó su trabajo en este paso' : 'Adjuntar documentos a la gestión'}
                                                            >
                                                                Adjuntar Documento
                                                            </Button>
                                                            <Button
                                                                variant="outlined"
                                                                startIcon={<CommentIcon />}
                                                                onClick={() => setActiveTab(3)}
                                                                disabled={accionesBloqueadas}
                                                                sx={{
                                                                    border: accionesBloqueadas ? '2px solid #9e9e9e' : '2px solid #1976d2',
                                                                    color: accionesBloqueadas ? '#9e9e9e' : '#1976d2',
                                                                    borderRadius: '8px',
                                                                    padding: '10px 16px',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    textTransform: 'none',
                                                                    opacity: accionesBloqueadas ? 0.7 : 1,
                                                                    cursor: accionesBloqueadas ? 'not-allowed' : 'pointer',
                                                                    '&:hover': {
                                                                        borderColor: accionesBloqueadas ? '#9e9e9e' : '#1565c0',
                                                                        background: accionesBloqueadas ? 'transparent' : 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                                        transform: accionesBloqueadas ? 'none' : 'translateY(-2px)',
                                                                    },
                                                                    '&:disabled': {
                                                                        borderColor: '#9e9e9e',
                                                                        color: '#9e9e9e',
                                                                        cursor: 'not-allowed'
                                                                    },
                                                                    transition: 'all 0.2s ease'
                                                                }}
                                                                title={accionesBloqueadas ? 'Su unidad ya completó su trabajo en este paso' : 'Agregar comentarios a la gestión'}
                                                            >
                                                                Agregar Comentario
                                                            </Button>
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<CheckCircleIcon />}
                                                                onClick={handleOpenChangeStageModal}
                                                                disabled={accionesBloqueadas || isChangingStage}
                                                                sx={{
                                                                    background: accionesBloqueadas
                                                                        ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                        : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                                    borderRadius: '8px',
                                                                    padding: '10px 16px',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    textTransform: 'none',
                                                                    color: '#ffffff',
                                                                    boxShadow: accionesBloqueadas
                                                                        ? 'none'
                                                                        : '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                                    cursor: accionesBloqueadas ? 'not-allowed' : 'pointer',
                                                                    opacity: accionesBloqueadas ? 0.7 : 1,
                                                                    '&:hover': {
                                                                        background: accionesBloqueadas
                                                                            ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                            : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                                                        color: '#ffffff',
                                                                        transform: accionesBloqueadas ? 'none' : 'translateY(-2px)',
                                                                        boxShadow: accionesBloqueadas
                                                                            ? 'none'
                                                                            : '0 8px 20px rgba(25, 118, 210, 0.4)',
                                                                    },
                                                                    '&:disabled': {
                                                                        background: 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)',
                                                                        color: '#ffffff',
                                                                        cursor: 'not-allowed'
                                                                    },
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                title={accionesBloqueadas ? (unidadCompletoTrabajo ? 'Su unidad ya completó su trabajo en este paso' : 'La gestión está finalizada, cancelada o completada') : 'Finalizar el paso actual y avanzar al siguiente'}
                                                            >
                                                                Siguiente Paso
                                                            </Button>
                                                            {canInactivate && !gestionFinalizada && (
                                                                <Button
                                                                    variant="contained"
                                                                    startIcon={<PauseCircleIcon />}
                                                                    onClick={handleInactivateGestion}
                                                                    disabled={accionesBloqueadas || isInactivating}
                                                                    sx={{
                                                                        background: accionesBloqueadas
                                                                            ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                            : 'linear-gradient(45deg, #ff9800 30%, #ffb74d 90%)',
                                                                        borderRadius: '8px',
                                                                        padding: '10px 16px',
                                                                        fontSize: '0.875rem',
                                                                        fontWeight: '600',
                                                                        textTransform: 'none',
                                                                        color: '#ffffff',
                                                                        boxShadow: accionesBloqueadas
                                                                            ? 'none'
                                                                            : '0 4px 12px rgba(255, 152, 0, 0.3)',
                                                                        cursor: accionesBloqueadas ? 'not-allowed' : 'pointer',
                                                                        opacity: accionesBloqueadas ? 0.7 : 1,
                                                                        '&:hover': {
                                                                            background: accionesBloqueadas
                                                                                ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                                : 'linear-gradient(45deg, #f57c00 30%, #ff9800 90%)',
                                                                            color: '#ffffff',
                                                                            transform: accionesBloqueadas ? 'none' : 'translateY(-2px)',
                                                                            boxShadow: accionesBloqueadas
                                                                                ? 'none'
                                                                                : '0 8px 20px rgba(255, 152, 0, 0.4)',
                                                                        },
                                                                        '&:disabled': {
                                                                            background: 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)',
                                                                            color: '#ffffff',
                                                                            cursor: 'not-allowed'
                                                                        },
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                    title={accionesBloqueadas ? (gestionFinalizada ? 'La gestión está completada o cancelada' : 'Su unidad ya completó su trabajo en este paso') : 'Inactivar la gestión'}
                                                                >
                                                                    Inactivar Gestión
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="contained"
                                                                startIcon={<AssignmentTurnedInIcon />}
                                                                onClick={handleAcuseRecibido}
                                                                disabled={acuseRecibido || isProcessingAcuse || accionesBloqueadas}
                                                                sx={{
                                                                    background: (acuseRecibido || accionesBloqueadas)
                                                                        ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                        : 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                                                                    borderRadius: '8px',
                                                                    padding: '10px 16px',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '600',
                                                                    textTransform: 'none',
                                                                    color: '#ffffff',
                                                                    boxShadow: (acuseRecibido || accionesBloqueadas)
                                                                        ? 'none'
                                                                        : '0 4px 12px rgba(156, 39, 176, 0.3)',
                                                                    cursor: (acuseRecibido || accionesBloqueadas) ? 'not-allowed' : 'pointer',
                                                                    opacity: (acuseRecibido || accionesBloqueadas) ? 0.7 : 1,
                                                                    '&:hover': {
                                                                        background: (acuseRecibido || accionesBloqueadas)
                                                                            ? 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)'
                                                                            : 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
                                                                        color: '#ffffff',
                                                                        transform: (acuseRecibido || accionesBloqueadas) ? 'none' : 'translateY(-2px)',
                                                                        boxShadow: (acuseRecibido || accionesBloqueadas)
                                                                            ? 'none'
                                                                            : '0 8px 20px rgba(156, 39, 176, 0.4)',
                                                                    },
                                                                    '&:disabled': {
                                                                        background: 'linear-gradient(45deg, #9e9e9e 30%, #757575 90%)',
                                                                        color: '#ffffff',
                                                                        cursor: 'not-allowed'
                                                                    },
                                                                    transition: 'all 0.3s ease'
                                                                }}
                                                                title={
                                                                    accionesBloqueadas
                                                                        ? (gestionFinalizada ? 'La gestión está completada o cancelada' : 'Su unidad ya completó su trabajo en este paso')
                                                                        : acuseRecibido
                                                                            ? 'El acuse de recibido ya fue procesado'
                                                                            : 'Procesar acuse de recibido'
                                                                }
                                                            >
                                                                {acuseRecibido ? 'Acuse de Recibido (Procesado)' : 'Acuse de Recibido'}
                                                            </Button>
                                                        </SoftBox>
                                                    </CardContent>
                                                </Card>


                                                {/* Resumen de Actividad */}
                                                <Card
                                                    sx={{
                                                        borderRadius: '12px',
                                                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                                        border: '1px solid #e0e0e0'
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 2 }}>
                                                        <SoftBox mb={2}>
                                                            <SoftTypography variant="h6" fontWeight="bold" color="dark">
                                                                Resumen de Actividad
                                                            </SoftTypography>
                                                        </SoftBox>
                                                        <SoftBox display="flex" flexDirection="column" gap={1}>
                                                            <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                                                <SoftTypography variant="body2" color="text">
                                                                    Documentos
                                                                </SoftTypography>
                                                                <SoftTypography variant="body2" fontWeight="bold" color="dark">
                                                                    {totalDocumentos}
                                                                </SoftTypography>
                                                            </SoftBox>
                                                            <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                                                                <SoftTypography variant="body2" color="text">
                                                                    Comentarios
                                                                </SoftTypography>
                                                                <SoftTypography variant="body2" fontWeight="bold" color="dark">
                                                                    {comentarios?.length || gestionToEdit?.comentarios?.length || 0}
                                                                </SoftTypography>
                                                            </SoftBox>
                                                        </SoftBox>
                                                    </CardContent>
                                                </Card>
                                            </SoftBox>
                                        </Grid>
                                    </Grid>
                                </SoftBox>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SoftBox>

            {/* Notificaciones */}
            <AppNotification
                type={notification.type}
                message={notification.message}
                open={notification.open}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            />

            {/* Modal de Cambio de Etapa */}
            <ChangeStageModal
                open={changeStageModalOpen}
                onClose={handleCloseChangeStageModal}
                gestion={gestionToEdit}
                onSave={handleSaveStageChange}
            />

            {/* Modal de Adjuntar Documentos */}
            <AttachDocumentsModal
                open={attachDocumentsModalOpen}
                onClose={handleCloseAttachDocumentsModal}
                gestion={gestionToEdit}
                onSave={handleSaveAttachedDocuments}
                userId={userId}
                unidadActualId={unidad_actual_id}
                userName={user?.nombre || 'Usuario'}
            />

            {/* Alert de confirmación para eliminar documento */}
            <ConfirmAlert
                open={deleteDocumentAlert.open}
                onClose={handleDeleteDocumentCancel}
                onConfirm={handleDeleteDocumentConfirm}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este documento? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                severity="error"
                itemName={deleteDocumentAlert.document?.nombre_archivo}
                showItemName={true}
                itemLabel="Documento"
            />

            {/* Alert de confirmación para inactivar gestión */}
            <ConfirmAlert
                open={inactivateGestionAlert.open}
                onClose={handleInactivateGestionCancel}
                onConfirm={handleInactivateGestionConfirm}
                title="Confirmar Inactivación"
                message="¿Estás seguro de que deseas inactivar esta gestión? La gestión será pausada y no podrá continuar hasta que sea reactivada."
                confirmText="Inactivar"
                cancelText="Cancelar"
                severity="warning"
                itemName={gestionToEdit?.nombre}
                showItemName={true}
                itemLabel="Gestión"
            />

            {/* Alert de confirmación para reactivar gestión */}
            <ConfirmAlert
                open={reactivateGestionAlert.open}
                onClose={handleReactivateGestionCancel}
                onConfirm={handleReactivateGestionConfirm}
                title="Confirmar Reactivación"
                message="¿Estás seguro de que deseas reactivar esta gestión? La gestión volverá a estar activa y podrá continuar con su flujo normal."
                confirmText="Reactivar"
                cancelText="Cancelar"
                severity="info"
                itemName={gestionToEdit?.nombre}
                showItemName={true}
                itemLabel="Gestión"
            />

            {/* Modal Acuse de Recibido (diseño similar al mock) */}
            <ConfirmAcuseModal
                open={acuseModalOpen}
                onClose={handleAcuseRecibidoCancel}
                onConfirm={handleAcuseRecibidoConfirm}
                titulo={gestionToEdit?.nombre || ''}
                etapa={gestionToEdit?.nombre_paso || ''}
                fecha={gestionToEdit?.fecha_llegada_paso ? new Date(gestionToEdit.fecha_llegada_paso).toLocaleDateString('es-ES') : ''}
                unidad={user?.unidad?.nombre || user?.departamento || user?.unidad_actual?.nombre || ''}
                showDescripcion={Boolean(gestionToEdit?.descripcion_paso)}
                descripcion={gestionToEdit?.descripcion_paso || ''}
            />

            {/* Panel de carga al guardar gestión */}
            <Backdrop
                open={isSaving}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Guardando gestión...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesan los cambios
                </SoftTypography>
            </Backdrop>

            {/* Panel de carga al cambiar etapa */}
            <Backdrop
                open={isChangingStage}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 2,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Guardando cambio de etapa...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesa el avance de la gestión
                </SoftTypography>
            </Backdrop>

            {/* Panel de carga al inactivar gestión */}
            <Backdrop
                open={isInactivating}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 3,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Inactivando gestión...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesa la inactivación
                </SoftTypography>
            </Backdrop>

            {/* Panel de carga al reactivar gestión */}
            <Backdrop
                open={isReactivating}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 4,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Reactivando gestión...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesa la reactivación
                </SoftTypography>
            </Backdrop>

            {/* Panel de carga al procesar acuse de recibido */}
            <Backdrop
                open={isProcessingAcuse}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 5,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Procesando acuse de recibido...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesa el acuse de recibido
                </SoftTypography>
            </Backdrop>

            {/* Panel de carga al subir documentos */}
            <Backdrop
                open={isUploadingDocument}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 6,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    Subiendo documentos...
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesan los archivos
                </SoftTypography>
            </Backdrop>
        </>
    );
}

export default GestionEdit;

