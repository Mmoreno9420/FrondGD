/**
=========================================================
* GestiaSoft - Gestiones Page
=========================================================
* Pantalla para gestionar gestiones y flujos de trabajo
*/

/* eslint-disable react/prop-types */

import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Custom hooks
import { useGestiones } from "hooks/useGestiones";
import { useUserSession } from "hooks/useUserSession";

// Configuración de permisos
import { canViewAllGestiones, canPerformAction } from "config/rolePermissions";

// Services
import { uploadGestionFiles, createGestionFolder, validateFiles, uploadFilesLocally } from "services/fileService";
import gestionService from "services/gestionService";

// @mui material components
import {
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Chip,
    Box,
    Icon,
    Backdrop,
    CircularProgress
} from "@mui/material";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Soft UI Dashboard PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Custom App Layout
import { ConfirmAlert, SidePanelRight } from "Views/componentsApp";
import { AppNotification } from "Views/componentsApp/Alert";

// Material React Table v1
import { MaterialReactTable } from "material-react-table";

// Gestion Detail Component
import GestionDetail from "./GestionDetail";

// Gestion Components
import GestionSummaryCards from "./components/GestionSummaryCards";

// Images
import curved0 from "assets/images/curved-images/curved0.jpg";

function Gestiones() {
    const navigate = useNavigate();

    // Leer parámetros de la URL
    const [searchParams, setSearchParams] = useSearchParams();

    // Estado para manejar la responsividad
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Estado para el alert de confirmación de inactivar gestión
    const [inactivateAlert, setInactivateAlert] = useState({
        open: false,
        gestion: null
    });

    // Estado para controlar el proceso de inactivar gestión
    const [isInactivating, setIsInactivating] = useState(false);

    // Estado para el panel lateral de gestión
    const [gestionPanel, setGestionPanel] = useState({
        open: false,
        mode: "create", // "create", "edit", o "view"
        gestion: null,
        loading: false
    });

    // Estado para notificaciones
    const [notification, setNotification] = useState({
        open: false,
        type: 'info',
        message: ''
    });

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState("");

    // Estado para los filtros
    const [estadoFilter, setEstadoFilter] = useState("all");
    const [prioridadFilter, setPrioridadFilter] = useState("all");
    const [activeCardFilter, setActiveCardFilter] = useState("all");

    // Estado para paginación
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });

    // Estado para el filtro de gestiones desde el navbar o URL
    // Usar solo la URL como fuente de verdad para evitar ciclos
    const gestionesFilter = searchParams.get('filter') || localStorage.getItem('gestionesFilter') || 'pendientes';

    // Función para cambiar el filtro
    const setGestionesFilter = (filter) => {
        setSearchParams({ filter }, { replace: true });
        localStorage.setItem('gestionesFilter', filter);
    };

    // Custom hook para gestiones
    const {
        gestiones,
        loading,
        error,
        fetchGestiones,
        createGestion,
        updateGestion,
        deleteGestion,
        getGestionDetail
    } = useGestiones();

    // Obtener datos del usuario actual
    const { user, usuario_id: sessionUsuarioId, id_rol, unidad_actual_id } = useUserSession();
    const userId = sessionUsuarioId || user?.usuario_id || user?.id;

    // Verificar permisos del usuario
    const canInactivate = canPerformAction(id_rol, 'canInactivate');

    // Detectar tamaño de pantalla
    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < breakpoints.values.sm);
            setIsTablet(window.innerWidth < breakpoints.values.md && window.innerWidth >= breakpoints.values.sm);
        }

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Cargar gestiones cuando el userId esté disponible
    useEffect(() => {
        if (userId) {
            fetchGestiones();
        }
    }, [userId, fetchGestiones]);

    // Escuchar eventos personalizados para refrescar gestiones
    // Por ejemplo, cuando se procesa un acuse de recibido desde las notificaciones
    useEffect(() => {
        const handleGestionesUpdated = (event) => {
            console.log('🔄 Evento gestiones-updated recibido:', event.detail);
            // Refrescar el grid de gestiones cuando se actualiza una gestión externamente
            if (userId) {
                fetchGestiones();
            }
        };

        // Registrar el listener del evento personalizado
        window.addEventListener('gestiones-updated', handleGestionesUpdated);

        // Cleanup: remover el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('gestiones-updated', handleGestionesUpdated);
        };
    }, [userId, fetchGestiones]);

    // Ya no necesitamos detectar el ID en la URL para abrir el panel
    // La edición ahora se hace en una pantalla separada

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para obtener color según prioridad
    const getPrioridadColor = (prioridad) => {
        switch (prioridad?.toLowerCase()) {
            case 'alta':
            case 'urgente':
                return 'error';
            case 'media':
                return 'warning';
            case 'baja':
                return 'info';
            default:
                return 'secondary';
        }
    };

    // Función para obtener color según estado
    const getEstadoColor = (estado) => {
        switch (estado?.toLowerCase()) {
            case 'completado':
            case 'finalizado':
                return 'success';
            case 'en progreso':
            case 'activo':
                return 'primary';
            case 'pendiente':
                return 'warning';
            case 'cancelado':
            case 'rechazado':
                return 'error';
            default:
                return 'secondary';
        }
    };

    // Handlers para acciones - Definidos antes de las columnas para usarlos en el useMemo
    const handleCreateGestion = () => {
        setGestionPanel({
            open: true,
            mode: "create",
            gestion: null,
            loading: false
        });
    };

    const handleViewGestion = (gestion) => {
        setGestionPanel({
            open: true,
            mode: "view",
            gestion: gestion,
            loading: false
        });
    };

    const handleEditGestion = (gestion) => {
        // Navegar a la pantalla de edición con el ID de la gestión
        navigate(`/gestiones/editar/${gestion.gestion_id}`);
    };

    // Función para abrir el modal de confirmación de inactivar gestión
    const handleInactivateClick = (gestion) => {
        console.log("⏸️ Solicitando confirmación para inactivar gestión");
        setInactivateAlert({
            open: true,
            gestion: gestion
        });
    };

    // Definir columnas de la tabla
    const columns = useMemo(() => [
        {
            accessorKey: "gestion_id",
            header: "ID",
            size: 50,
            Cell: ({ cell }) => (
                <SoftTypography variant="caption" fontWeight="medium" color="dark" sx={{ fontSize: '0.65rem' }}>
                    #{cell.getValue() || 'N/A'}
                </SoftTypography>
            )
        },
        {
            accessorKey: "nombre",
            header: "Nombre de Gestión",
            size: 180,
            Cell: ({ cell, row }) => {
                // Usar el porcentaje de avance del API si existe, sino calcularlo
                let progreso = 0;

                // Debug: Mostrar los datos que vienen del API
                if (row.original.gestion_id === gestiones[0]?.gestion_id) {
                    console.log('📊 Datos de gestión del API:', row.original);
                    console.log('📊 Porcentaje disponible:', {
                        avance_calculado: row.original.avance_calculado,
                        avance_promedio: row.original.avance_promedio,
                        porcentaje_avance: row.original.porcentaje_avance,
                        porcentaje: row.original.porcentaje,
                        paso_numero: row.original.paso_numero,
                        total_pasos: row.original.total_pasos
                    });
                }

                // Prioridad 1: Usar avance_calculado del API
                if (row.original.avance_calculado !== undefined && row.original.avance_calculado !== null) {
                    progreso = Math.min(Math.max(parseFloat(row.original.avance_calculado), 0), 100);
                }
                // Prioridad 2: Usar avance_promedio del API
                else if (row.original.avance_promedio !== undefined && row.original.avance_promedio !== null) {
                    progreso = Math.min(Math.max(parseFloat(row.original.avance_promedio), 0), 100);
                }
                // Prioridad 3: Usar porcentaje_avance del API
                else if (row.original.porcentaje_avance !== undefined && row.original.porcentaje_avance !== null) {
                    progreso = Math.min(Math.max(parseFloat(row.original.porcentaje_avance), 0), 100);
                }
                // Prioridad 4: Usar campo porcentaje del API
                else if (row.original.porcentaje !== undefined && row.original.porcentaje !== null) {
                    progreso = Math.min(Math.max(parseFloat(row.original.porcentaje), 0), 100);
                }
                // Fallback: Calcular basado en el paso actual
                else {
                    const pasoNumero = row.original.paso_numero || 1;
                    const totalPasos = row.original.total_pasos || 10;
                    progreso = Math.min(Math.round((pasoNumero / totalPasos) * 100), 100);
                }

                return (
                    <SoftBox>
                        <SoftBox display="flex" alignItems="center" mb={0.5}>
                            <AssignmentIcon sx={{ mr: 0.5, fontSize: 14, color: 'primary.main' }} />
                            <SoftTypography variant="caption" fontWeight="medium" color="dark" sx={{ fontSize: '0.7rem' }}>
                                {cell.getValue() || 'Sin nombre'}
                            </SoftTypography>
                        </SoftBox>
                        <SoftBox
                            sx={{
                                width: '100%',
                                height: 6,
                                backgroundColor: '#e0e0e0',
                                borderRadius: '3px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            <SoftBox
                                sx={{
                                    width: `${progreso}%`,
                                    height: '100%',
                                    background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                                    borderRadius: '3px',
                                    transition: 'width 0.3s ease'
                                }}
                            />
                        </SoftBox>
                        <SoftTypography variant="caption" color="text" sx={{ mt: 0.3, display: 'block', fontSize: '0.65rem' }}>
                            {Math.round(progreso)}%
                        </SoftTypography>
                    </SoftBox>
                );
            }
        },
        {
            accessorKey: "estado_nombre",
            header: "Estado",
            size: 85,
            Cell: ({ cell }) => {
                const estado = cell.getValue() || "Sin estado";
                const estadoColor = getEstadoColor(estado);

                // Definir gradientes y colores según el estado
                const getEstadoStyle = (color) => {
                    switch (color) {
                        case 'success':
                            return {
                                background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
                                color: '#2e7d32',
                                border: '1px solid rgba(46, 125, 50, 0.3)',
                                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #c8e6c9 30%, #a5d6a7 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(46, 125, 50, 0.2)'
                            };
                        case 'primary':
                            return {
                                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                color: '#1565c0',
                                border: '1px solid rgba(21, 101, 192, 0.3)',
                                boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(21, 101, 192, 0.2)'
                            };
                        case 'warning':
                            return {
                                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                color: '#e65100',
                                border: '1px solid rgba(230, 81, 0, 0.3)',
                                boxShadow: '0 2px 4px rgba(230, 81, 0, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(230, 81, 0, 0.2)'
                            };
                        case 'error':
                            return {
                                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                                color: '#c62828',
                                border: '1px solid rgba(198, 40, 40, 0.3)',
                                boxShadow: '0 2px 4px rgba(198, 40, 40, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #ffcdd2 30%, #ef9a9a 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(198, 40, 40, 0.2)'
                            };
                        default:
                            return {
                                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                color: '#616161',
                                border: '1px solid rgba(97, 97, 97, 0.3)',
                                boxShadow: '0 2px 4px rgba(97, 97, 97, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(97, 97, 97, 0.2)'
                            };
                    }
                };

                const style = getEstadoStyle(estadoColor);

                return (
                    <Chip
                        label={estado}
                        size="small"
                        sx={{
                            background: style.background,
                            color: style.color,
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            borderRadius: '8px',
                            border: style.border,
                            boxShadow: style.boxShadow,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            height: '24px',
                            '&:hover': {
                                background: style.hoverBackground,
                                transform: 'translateY(-1px)',
                                boxShadow: style.hoverBoxShadow
                            },
                            transition: 'all 0.2s ease'
                        }}
                    />
                );
            }
        },
        {
            accessorKey: "prioridad_nombre",
            header: "Prioridad",
            size: 75,
            Cell: ({ cell }) => {
                const prioridad = cell.getValue() || "Sin prioridad";
                const prioridadColor = getPrioridadColor(prioridad);

                // Definir gradientes y colores según la prioridad
                const getPrioridadStyle = (color) => {
                    switch (color) {
                        case 'error':
                            return {
                                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                                color: '#c62828',
                                border: '1px solid rgba(198, 40, 40, 0.3)',
                                boxShadow: '0 2px 4px rgba(198, 40, 40, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #ffcdd2 30%, #ef9a9a 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(198, 40, 40, 0.2)'
                            };
                        case 'warning':
                            return {
                                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                color: '#e65100',
                                border: '1px solid rgba(230, 81, 0, 0.3)',
                                boxShadow: '0 2px 4px rgba(230, 81, 0, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(230, 81, 0, 0.2)'
                            };
                        case 'info':
                            return {
                                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                color: '#1565c0',
                                border: '1px solid rgba(21, 101, 192, 0.3)',
                                boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(21, 101, 192, 0.2)'
                            };
                        default:
                            return {
                                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                color: '#616161',
                                border: '1px solid rgba(97, 97, 97, 0.3)',
                                boxShadow: '0 2px 4px rgba(97, 97, 97, 0.1)',
                                hoverBackground: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                                hoverBoxShadow: '0 4px 8px rgba(97, 97, 97, 0.2)'
                            };
                    }
                };

                const style = getPrioridadStyle(prioridadColor);

                return (
                    <Chip
                        label={prioridad}
                        size="small"
                        sx={{
                            background: style.background,
                            color: style.color,
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            borderRadius: '8px',
                            border: style.border,
                            boxShadow: style.boxShadow,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            height: '24px',
                            '&:hover': {
                                background: style.hoverBackground,
                                transform: 'translateY(-1px)',
                                boxShadow: style.hoverBoxShadow
                            },
                            transition: 'all 0.2s ease'
                        }}
                    />
                );
            }
        },
        {
            accessorKey: "nombre_paso",
            header: "Paso Actual",
            size: 120,
            visible: false,
            Cell: ({ cell, row }) => (
                <SoftBox>
                    <SoftTypography variant="caption" fontWeight="medium" color="dark" sx={{ fontSize: '0.7rem' }}>
                        {cell.getValue() || "Sin paso"}
                    </SoftTypography>
                    <SoftTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                        Paso #{row.original.paso_numero || "-"}
                    </SoftTypography>
                </SoftBox>
            )
        },
        {
            accessorKey: "unidades_atendiendo",
            header: "Unidades",
            size: 130,
            Cell: ({ cell }) => {
                const unidades = cell.getValue() || [];
                // Filtrar solo las unidades en curso (estado === false, undefined o null)
                // Excluir las que ya completaron (estado === true)
                const unidadesEnCurso = unidades.filter(unidad =>
                    unidad.estado === false || unidad.estado === undefined || unidad.estado === null
                );

                if (unidadesEnCurso.length === 0) {
                    return (
                        <SoftTypography variant="caption" color="text" sx={{ fontSize: '0.65rem' }}>
                            Sin unidades en curso
                        </SoftTypography>
                    );
                }
                return (
                    <SoftBox display="flex" gap={0.3} flexWrap="wrap">
                        {unidadesEnCurso.map((unidad, index) => (
                            <Chip
                                key={index}
                                label={unidad.nombre_unidad}
                                size="small"
                                sx={{
                                    background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                    color: '#1565c0',
                                    fontSize: "0.65rem",
                                    fontWeight: "600",
                                    borderRadius: '8px',
                                    border: '1px solid rgba(25, 118, 210, 0.2)',
                                    boxShadow: '0 2px 4px rgba(25, 118, 210, 0.1)',
                                    height: '22px',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)'
                                    },
                                    transition: 'all 0.2s ease'
                                }}
                            />
                        ))}
                    </SoftBox>
                );
            }
        },
        {
            accessorKey: "fecha_llegada_paso",
            header: "Fecha",
            size: 100,
            Cell: ({ cell }) => (
                <SoftBox display="flex" alignItems="center" gap={0.3}>
                    <Icon sx={{ fontSize: 12, color: 'text.secondary' }}>calendar_today</Icon>
                    <SoftTypography variant="caption" color="dark" sx={{ fontSize: '0.7rem' }}>
                        {formatDate(cell.getValue())}
                    </SoftTypography>
                </SoftBox>
            )
        },
        {
            id: "estado_calculado",
            header: "Estado Calc.",
            size: 95,
            visible: false,
            Cell: ({ row }) => {
                const estado = row.original.estado_nombre || "Sin estado";
                const estadoColor = getEstadoColor(estado);

                const getEstadoStyle = (color) => {
                    switch (color) {
                        case 'success':
                            return {
                                background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
                                color: '#2e7d32',
                                border: '1px solid rgba(46, 125, 50, 0.3)',
                            };
                        case 'primary':
                            return {
                                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                color: '#1565c0',
                                border: '1px solid rgba(21, 101, 192, 0.3)',
                            };
                        case 'warning':
                            return {
                                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                color: '#e65100',
                                border: '1px solid rgba(230, 81, 0, 0.3)',
                            };
                        case 'error':
                            return {
                                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                                color: '#c62828',
                                border: '1px solid rgba(198, 40, 40, 0.3)',
                            };
                        default:
                            return {
                                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                                color: '#616161',
                                border: '1px solid rgba(97, 97, 97, 0.3)',
                            };
                    }
                };

                const style = getEstadoStyle(estadoColor);

                return (
                    <Chip
                        label={estado}
                        size="small"
                        icon={<Icon sx={{ fontSize: 12 }}>access_time</Icon>}
                        sx={{
                            background: style.background,
                            color: style.color,
                            fontSize: "0.65rem",
                            fontWeight: "600",
                            borderRadius: '8px',
                            border: style.border,
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                            height: '24px',
                            '& .MuiChip-icon': {
                                color: style.color,
                            }
                        }}
                    />
                );
            }
        },
        {
            accessorKey: "creado_por",
            header: "Creado Por",
            size: 120,
            Cell: ({ cell }) => (
                <SoftTypography variant="caption" color="dark" sx={{ fontSize: '0.7rem' }}>
                    {cell.getValue() || 'N/A'}
                </SoftTypography>
            )
        },
        {
            accessorKey: "unidad_creadora",
            header: "Unidad Creadora",
            size: 150,
            Cell: ({ cell }) => (
                <SoftBox display="flex" alignItems="center" gap={0.3}>
                    <Icon sx={{ fontSize: 12, color: 'text.secondary' }}>business</Icon>
                    <SoftTypography variant="caption" color="dark" sx={{ fontSize: '0.7rem' }}>
                        {cell.getValue() || 'N/A'}
                    </SoftTypography>
                </SoftBox>
            )
        },
        {
            id: "acciones",
            header: "Acciones",
            size: 90,
            enableSorting: false,
            enableColumnFilter: false,
            Cell: ({ row }) => (
                <SoftBox display="flex" gap={0.2}>
                    <IconButton
                        size="small"
                        onClick={() => handleEditGestion(row.original)}
                        title="Editar"
                        sx={{
                            background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                            color: '#1565c0',
                            borderRadius: '6px',
                            padding: '2px',
                            minWidth: '28px',
                            height: '28px',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 8px rgba(21, 101, 192, 0.3)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <EditIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleViewGestion(row.original)}
                        title="Ver detalles"
                        sx={{
                            background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
                            color: '#2e7d32',
                            borderRadius: '6px',
                            padding: '2px',
                            minWidth: '28px',
                            height: '28px',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #c8e6c9 30%, #a5d6a7 90%)',
                                transform: 'scale(1.05)',
                                boxShadow: '0 4px 8px rgba(46, 125, 50, 0.3)'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <VisibilityIcon sx={{ fontSize: '0.9rem' }} />
                    </IconButton>
                    {canInactivate && (
                        <IconButton
                            size="small"
                            onClick={() => handleInactivateClick(row.original)}
                            title="Inactivar gestión"
                            sx={{
                                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                color: '#e65100',
                                borderRadius: '6px',
                                padding: '2px',
                                minWidth: '28px',
                                height: '28px',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 4px 8px rgba(255, 152, 0, 0.3)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <PauseCircleIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                    )}
                </SoftBox>
            )
        }
    ], [canInactivate, handleViewGestion, handleEditGestion, handleInactivateClick]);

    // Función para cancelar la inactivación de la gestión
    const handleInactivateCancel = () => {
        console.log("❌ Inactivación cancelada por el usuario");
        setInactivateAlert({
            open: false,
            gestion: null
        });
    };

    // Función para confirmar la inactivación de la gestión
    const handleInactivateConfirm = async () => {
        if (!inactivateAlert.gestion) return;

        console.log("⏸️ Confirmado, inactivando gestión");

        // Iniciar el proceso de inactivación
        setIsInactivating(true);

        try {
            // Cerrar el modal de confirmación
            setInactivateAlert({ open: false, gestion: null });

            // Obtener el ID de la gestión a inactivar
            const gestionId = inactivateAlert.gestion.gestion_id;

            console.log("📤 Inactivando gestión ID:", gestionId);

            // Llamar al endpoint de inactivación usando el método específico
            const response = await gestionService.inactivateGestion(userId, gestionId);

            console.log("✅ Gestión inactivada exitosamente:", response);

            // Mostrar notificación de éxito
            showNotification('success', 'Gestión inactivada exitosamente');

            // Recargar el grid de gestiones
            await fetchGestiones();

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

    // Función para mostrar notificaciones
    const showNotification = (type, message) => {
        setNotification({
            open: true,
            type: type,
            message: message
        });
    };

    const handleGestionPanelClose = () => {
        setGestionPanel({
            open: false,
            mode: "create",
            gestion: null,
            loading: false
        });
    };

    const handleGestionSave = async (gestionData) => {
        setGestionPanel(prev => ({ ...prev, loading: true }));

        try {
            let result;
            let gestionId;

            if (gestionPanel.mode === "create") {
                // 1. Crear la gestión
                console.log("📤 Enviando petición de creación...");
                result = await createGestion(gestionData);
                console.log("📋 Respuesta completa del API:", JSON.stringify(result, null, 2));
                console.log("📋 Tipo de result:", typeof result);
                console.log("📋 Keys de result:", Object.keys(result || {}));

                // Extraer gestionId correctamente según la estructura de tu API
                // La respuesta tiene dos niveles de data: result.data.data.gestion_id
                gestionId = result?.data?.data?.gestion_id || result?.data?.gestion_id || result?.gestion_id || result?.id;
                console.log("✅ Gestión creada exitosamente con ID:", gestionId);

                if (!gestionId) {
                    console.error("❌ ERROR: No se pudo obtener el gestion_id de la respuesta");
                    console.error("Estructura completa de result:", result);
                    throw new Error("No se pudo obtener el ID de la gestión creada");
                }

                // Esperar 5 segundos para asegurar que el API termine de procesar
                console.log("⏳ Esperando 5 segundos para asegurar procesamiento completo del API...");
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log("✅ Tiempo de espera completado");

                // 2. Si hay archivos, subirlos físicamente a la carpeta local
                if (gestionData.archivos && gestionData.archivos.length > 0) {
                    console.log(`📁 Iniciando subida física de ${gestionData.archivos.length} archivo(s) a DocsGestiones/${gestionId}...`);

                    try {
                        // Validar archivos antes de subir
                        const validation = validateFiles(gestionData.archivos, {
                            maxSize: 10 * 1024 * 1024, // 10MB
                            allowedTypes: ['application/pdf'],
                            maxFiles: 10
                        });

                        if (!validation.valid) {
                            throw new Error(validation.errors.join('\n'));
                        }

                        // Obtener datos necesarios para la subida de archivos desde la sesión
                        const workflowId = result?.data?.data?.workflow_id || 0;

                        // Subir archivos usando el API de adjuntos con FormData
                        // Usar unidad_actual_id de la sesión
                        const uploadResult = await uploadFilesLocally(
                            gestionId,
                            gestionData.archivos,
                            gestionData.usuario_id || userId, // Usar usuario_id de los datos, con fallback
                            workflowId,
                            unidad_actual_id // Usar unidad_actual_id de la sesión
                        );

                        console.log("✅ Archivos subidos físicamente a DocsGestiones:", uploadResult);
                        showNotification('success', `Gestión creada con éxito`);
                    } catch (fileError) {
                        console.error("⚠️ Error al guardar archivos físicamente:", fileError);
                        showNotification('warning', `Gestión creada pero hubo un error al guardar los archivos: ${fileError.message}`);
                    }
                } else {
                    showNotification('success', 'Gestión creada exitosamente');
                }
            } else {
                // Modo edición
                result = await updateGestion(gestionPanel.gestion.gestion_id, gestionData);
                gestionId = gestionPanel.gestion.gestion_id;
                console.log("✅ Gestión actualizada exitosamente");

                // Los archivos ya están incluidos en el JSON principal
                if (gestionData.adjuntos && gestionData.adjuntos.length > 0) {
                    console.log(`📁 Gestión actualizada con ${gestionData.adjuntos.length} adjunto(s) incluido(s) en el JSON`);
                    showNotification('success', `Gestión actualizada exitosamente con ${gestionData.adjuntos.length} adjunto(s)`);
                } else {
                    showNotification('success', 'Gestión actualizada exitosamente');
                }
            }

            // 3. Recargar el grid después de que el servicio responda OK
            console.log("🔄 Recargando grid después de éxito...");
            await fetchGestiones(); // Recargar datos del grid

            // 4. Cerrar panel después de recargar
            handleGestionPanelClose();
        } catch (error) {
            // Extraer mensaje de error específico
            let errorMessage = 'Error al guardar la gestión';

            if (error?.response?.data?.mensaje) {
                errorMessage = error.response.data.mensaje;
            } else if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            // Log simplificado para debug
            console.log("❌ Error al guardar:", errorMessage);

            // Mostrar notificación al usuario
            showNotification('error', errorMessage);
        } finally {
            setGestionPanel(prev => ({ ...prev, loading: false }));
        }
    };

    // Filtrar gestiones por rol y unidad usando configuración de permisos
    const gestionesFiltradasPorUnidad = useMemo(() => {
        // Verificar si el rol puede ver todas las gestiones (Admin o Gestor)
        if (canViewAllGestiones(id_rol)) {
            return gestiones;
        }

        // Si NO puede ver todas, filtrar por unidad
        return gestiones.filter(gestion => {
            // Verificar si la gestión tiene unidades_atendiendo
            if (!gestion.unidades_atendiendo || gestion.unidades_atendiendo.length === 0) {
                return false; // No mostrar gestiones sin unidades
            }

            // Buscar si alguna unidad en el array coincide con la unidad del usuario
            return gestion.unidades_atendiendo.some(unidad =>
                unidad.unidad_id === unidad_actual_id
            );
        });
    }, [gestiones, id_rol, unidad_actual_id]);

    // Filtrar gestiones por búsqueda, estado, prioridad y filtro del navbar
    const filteredGestiones = useMemo(() => {
        return gestionesFiltradasPorUnidad.filter(gestion => {
            const matchesSearch = !searchTerm ||
                gestion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                gestion.gestion_id?.toString().includes(searchTerm);

            // Filtro por tarjeta activa
            const matchesCardFilter = activeCardFilter === "all" ||
                gestion.estado_nombre?.toLowerCase() === activeCardFilter.toLowerCase();

            const matchesEstado = estadoFilter === "all" ||
                gestion.estado_nombre?.toLowerCase() === estadoFilter.toLowerCase();

            const matchesPrioridad = prioridadFilter === "all" ||
                gestion.prioridad_nombre?.toLowerCase() === prioridadFilter.toLowerCase();

            // Verificar si la gestión está cancelada o completada
            const estadoNombre = gestion.estado_nombre?.toLowerCase() || '';
            const esCancelada = estadoNombre.includes('cancelada') || estadoNombre.includes('cancelado');
            const esCompletada = estadoNombre.includes('completado') || estadoNombre.includes('completada') ||
                estadoNombre.includes('finalizado') || estadoNombre.includes('finalizada') ||
                estadoNombre.includes('cerrada');

            // Excluir gestiones canceladas o completadas de los filtros "pendientes" y "en_proceso"
            if ((gestionesFilter === 'pendientes' || gestionesFilter === 'en_proceso') && (esCancelada || esCompletada)) {
                return false; // No mostrar gestiones canceladas o completadas en estos filtros
            }

            // Filtro del navbar (Pendientes, En proceso, Historia)
            let matchesNavFilter = true;

            if (gestionesFilter === 'pendientes') {
                // Pendientes: gestiones asignadas a esta unidad donde la unidad NO ha terminado (estado === false)
                const unidadDelUsuario = gestion.unidades_atendiendo?.find(
                    unidad => unidad.unidad_id === unidad_actual_id
                );

                // Si la unidad del usuario está en la lista y tiene trabajo pendiente (estado === false)
                // EXCLUIR si acuse_recibido === true y estado === true (ya completó)
                // Si estado es undefined o null, también lo consideramos pendiente
                matchesNavFilter = unidadDelUsuario &&
                    !(unidadDelUsuario.acuse_recibido === true && unidadDelUsuario.estado === true) &&
                    (unidadDelUsuario.estado === false || unidadDelUsuario.estado === undefined || unidadDelUsuario.estado === null);

            } else if (gestionesFilter === 'en_proceso') {
                // En proceso: gestiones asignadas a esta unidad donde la unidad YA terminó (estado === true)
                // O gestiones que están en proceso y asignadas a esta unidad
                const unidadDelUsuario = gestion.unidades_atendiendo?.find(
                    unidad => unidad.unidad_id === unidad_actual_id
                );

                // Verificar si la unidad del usuario ya terminó su trabajo
                const unidadTermino = unidadDelUsuario && unidadDelUsuario.estado === true;

                // Verificar si la gestión está en proceso
                const isEstadoEnProceso = gestion.estado_nombre?.toLowerCase() === 'en proceso' ||
                    gestion.estado_nombre?.toLowerCase() === 'en trámite' ||
                    gestion.estado_nombre?.toLowerCase() === 'activo';

                // Si la unidad del usuario terminó Y está asignada a esta unidad, o si está en proceso Y asignada
                matchesNavFilter = (unidadTermino && unidadDelUsuario) || (isEstadoEnProceso && unidadDelUsuario);

            } else if (gestionesFilter === 'historia') {
                // Historia: todas las gestiones finalizadas, cerradas o canceladas
                matchesNavFilter = esCompletada || esCancelada;
            }

            return matchesSearch && matchesCardFilter && matchesEstado && matchesPrioridad && matchesNavFilter;
        });
    }, [gestionesFiltradasPorUnidad, searchTerm, activeCardFilter, estadoFilter, prioridadFilter, gestionesFilter]);

    return (
        <>
            {/* Backdrop global mientras cargan las gestiones */}
            <Backdrop
                open={loading}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 10,
                    backgroundColor: 'rgba(0,0,0,0.35)'
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                    {/* Header con Gestión de Gestiones y Nueva Gestión */}
                                    <SoftBox mb={{ xs: 3, sm: 4, md: 5 }} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={{ xs: 1, sm: 2 }}>
                                        {/* Lado izquierdo: Gestión de Gestiones */}
                                        <SoftBox display="flex" alignItems="center" gap={2}>
                                            <SoftAvatar
                                                sx={{
                                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                    width: { xs: 48, sm: 56, md: 64 },
                                                    height: { xs: 48, sm: 56, md: 64 }
                                                }}
                                            >
                                                <AssignmentIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }} />
                                            </SoftAvatar>
                                            <SoftBox>
                                                <SoftTypography
                                                    variant="h5"
                                                    fontWeight="medium"
                                                    color="dark"
                                                    sx={{
                                                        fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                                        lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                                                    }}
                                                >
                                                    Gestiones SESAL
                                                </SoftTypography>
                                                <SoftTypography variant="button" color="text" fontWeight="medium" opacity={0.8}>
                                                    Administración de gestiones SESAL
                                                </SoftTypography>
                                            </SoftBox>
                                        </SoftBox>

                                        {/* Lado derecho: Nueva Gestión */}
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<AddIcon />}
                                            onClick={handleCreateGestion}
                                            sx={{
                                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                                                padding: { xs: '10px 18px', sm: '12px 24px', md: '14px 28px' },
                                                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                                fontWeight: '700',
                                                textTransform: 'none',
                                                color: '#ffffff !important',
                                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                                    color: '#ffffff !important',
                                                    transform: 'translateY(-2px)',
                                                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                                                },
                                                transition: 'all 0.3s ease',
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                                    width: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                                    height: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' },
                                                    color: '#ffffff !important',
                                                },
                                                '& .MuiButton-startIcon': {
                                                    color: '#ffffff !important',
                                                }
                                            }}
                                        >
                                            Nueva Gestión
                                        </Button>
                                    </SoftBox>

                                    {/* Tarjetas de Resumen con Filtros */}
                                    <SoftBox mb={4}>
                                        <GestionSummaryCards
                                            gestiones={filteredGestiones}
                                            activeFilter={activeCardFilter}
                                            onFilterChange={(filter) => {
                                                setActiveCardFilter(filter);
                                                // Si se selecciona una tarjeta específica, actualizar el filtro de estado
                                                if (filter !== "all") {
                                                    setEstadoFilter(filter);
                                                }
                                            }}
                                        />
                                    </SoftBox>

                                    {/* Botón Limpiar Filtros */}
                                    {(searchTerm || estadoFilter !== "all" || prioridadFilter !== "all" || activeCardFilter !== "all") && (
                                        <SoftBox mb={3} display="flex" justifyContent="flex-end">
                                            <Button
                                                variant="outlined"
                                                onClick={() => {
                                                    setSearchTerm("");
                                                    setEstadoFilter("all");
                                                    setPrioridadFilter("all");
                                                    setActiveCardFilter("all");
                                                }}
                                                size="small"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                                                    border: '2px solid #ff9800',
                                                    color: '#e65100',
                                                    borderRadius: '12px',
                                                    padding: '8px 16px',
                                                    fontSize: '0.8rem',
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
                                                    transition: 'all 0.2s ease'
                                                }}
                                            >
                                                Limpiar filtros
                                            </Button>
                                        </SoftBox>
                                    )}

                                    {/* Indicador de Resultados */}
                                    <SoftBox
                                        mb={3}
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                            background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
                                            padding: '12px 16px',
                                            borderRadius: '12px',
                                            border: '2px solid #4caf50',
                                            boxShadow: '0 2px 8px rgba(76, 175, 80, 0.2)'
                                        }}
                                    >
                                        <SoftTypography
                                            variant="body2"
                                            color="text"
                                            sx={{
                                                fontWeight: '500',
                                                color: 'text.secondary',
                                                fontSize: '13px'
                                            }}
                                        >
                                            📊 Mostrando <strong style={{ color: 'primary.main' }}>{filteredGestiones.length}</strong> de <strong style={{ color: 'primary.main' }}>{gestionesFiltradasPorUnidad.length}</strong> gestiones
                                            {(searchTerm || estadoFilter !== "all" || prioridadFilter !== "all") && (
                                                <span style={{ color: 'primary.main', fontWeight: '600' }}> (filtrados)</span>
                                            )}
                                        </SoftTypography>
                                    </SoftBox>

                                    {/* Sección de Búsqueda y Filtros */}
                                    <SoftBox mb={{ xs: 2, sm: 3, md: 4 }}>
                                        <SoftBox
                                            display="flex"
                                            gap={2}
                                            flexWrap="wrap"
                                            alignItems="center"
                                            sx={{
                                                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                                                padding: '16px 20px',
                                                borderRadius: '12px',
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                                            }}
                                        >
                                            {/* Barra de Búsqueda con Icono */}
                                            <SoftBox sx={{ flex: 1, minWidth: '250px' }}>
                                                <SoftBox
                                                    sx={{
                                                        position: "relative",
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}
                                                >
                                                    <Icon sx={{
                                                        position: 'absolute',
                                                        left: 12,
                                                        color: '#9e9e9e',
                                                        fontSize: 20
                                                    }}>
                                                        search
                                                    </Icon>
                                                    <input
                                                        type="text"
                                                        placeholder="Buscar por nombre o ID de gestión..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        style={{
                                                            width: "100%",
                                                            padding: "12px 16px 12px 44px",
                                                            border: "2px solid #e0e0e0",
                                                            borderRadius: "10px",
                                                            fontSize: "14px",
                                                            outline: "none",
                                                            backgroundColor: "white",
                                                            transition: "all 0.2s ease",
                                                            fontWeight: "500"
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#1976d2";
                                                            e.target.style.boxShadow = "0 0 0 3px rgba(25, 118, 210, 0.1)";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e0e0e0";
                                                            e.target.style.boxShadow = "none";
                                                        }}
                                                    />
                                                </SoftBox>
                                            </SoftBox>

                                            {/* Filtro por Estado */}
                                            <SoftBox sx={{ minWidth: '180px' }}>
                                                <select
                                                    value={estadoFilter}
                                                    onChange={(e) => setEstadoFilter(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "2px solid #e0e0e0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        backgroundColor: "white",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                        outline: "none",
                                                        fontWeight: "500"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#1976d2";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(25, 118, 210, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = "#e0e0e0";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    <option value="all">Todos los estados</option>
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="en progreso">En Progreso</option>
                                                    <option value="completado">Completado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
                                            </SoftBox>

                                            {/* Filtro por Prioridad */}
                                            <SoftBox sx={{ minWidth: '180px' }}>
                                                <select
                                                    value={prioridadFilter}
                                                    onChange={(e) => setPrioridadFilter(e.target.value)}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "2px solid #e0e0e0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        backgroundColor: "white",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                        outline: "none",
                                                        fontWeight: "500"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#1976d2";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(25, 118, 210, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = "#e0e0e0";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    <option value="all">Todas las prioridades</option>
                                                    <option value="alta">Alta</option>
                                                    <option value="media">Media</option>
                                                    <option value="baja">Baja</option>
                                                </select>
                                            </SoftBox>

                                            {/* Filtro de Paginación */}
                                            <SoftBox sx={{ minWidth: '150px' }}>
                                                <select
                                                    value={pagination.pageSize === filteredGestiones.length ? 'all' : pagination.pageSize}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setPagination(prev => ({
                                                            ...prev,
                                                            pageSize: value === 'all' ? filteredGestiones.length : parseInt(value),
                                                            pageIndex: 0
                                                        }));
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        padding: "12px 16px",
                                                        border: "2px solid #e0e0e0",
                                                        borderRadius: "10px",
                                                        fontSize: "14px",
                                                        backgroundColor: "white",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease",
                                                        outline: "none",
                                                        fontWeight: "500"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#1976d2";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(25, 118, 210, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = "#e0e0e0";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    <option value="5">5 </option>
                                                    <option value="10">10 </option>
                                                    <option value="30">30 </option>
                                                    <option value="50">50 </option>
                                                    <option value="all">Todas ({filteredGestiones.length})</option>
                                                </select>
                                            </SoftBox>

                                            {/* Botón de Exportar */}
                                            <SoftBox>
                                                <Button
                                                    variant="contained"
                                                    startIcon={<FileDownloadIcon />}
                                                    onClick={() => {
                                                        // Función para exportar a CSV
                                                        const headers = ['ID', 'Nombre', 'Estado', 'Prioridad', 'Unidades', 'Fecha', 'Creado Por', 'Unidad Creadora'];
                                                        const rows = filteredGestiones.map(gestion => [
                                                            gestion.gestion_id || '',
                                                            gestion.nombre || '',
                                                            gestion.estado_nombre || '',
                                                            gestion.prioridad_nombre || '',
                                                            (gestion.unidades_atendiendo || []).map(u => u.nombre_unidad).join(', ') || '',
                                                            gestion.fecha_llegada_paso ? formatDate(gestion.fecha_llegada_paso) : '',
                                                            gestion.creado_por || '',
                                                            gestion.unidad_creadora || ''
                                                        ]);

                                                        const csvContent = [
                                                            headers.join(','),
                                                            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                                                        ].join('\n');

                                                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                                                        const link = document.createElement('a');
                                                        const url = URL.createObjectURL(blob);
                                                        link.setAttribute('href', url);
                                                        link.setAttribute('download', `gestiones_${new Date().toISOString().split('T')[0]}.csv`);
                                                        link.style.visibility = 'hidden';
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        document.body.removeChild(link);
                                                    }}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                                        borderRadius: '10px',
                                                        padding: '12px 20px',
                                                        fontSize: '14px',
                                                        fontWeight: '600',
                                                        textTransform: 'none',
                                                        color: '#ffffff',
                                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                                            transform: 'translateY(-2px)',
                                                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                                                        },
                                                        transition: 'all 0.3s ease'
                                                    }}
                                                >
                                                    Exportar
                                                </Button>
                                            </SoftBox>
                                        </SoftBox>
                                    </SoftBox>

                                    {/* Mostrar error si existe */}
                                    {error && (
                                        <SoftBox
                                            mb={3}
                                            sx={{
                                                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                                                border: '2px solid #f44336',
                                                borderRadius: '12px',
                                                padding: '16px',
                                                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.2)'
                                            }}
                                        >
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <Box
                                                    sx={{
                                                        background: '#f44336',
                                                        borderRadius: '50%',
                                                        width: 24,
                                                        height: 24,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontSize: '16px',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    !
                                                </Box>
                                                <SoftBox>
                                                    <SoftTypography
                                                        variant="h6"
                                                        color="error"
                                                        fontWeight="bold"
                                                        sx={{ fontSize: '1rem', marginBottom: '4px' }}
                                                    >
                                                        Error al cargar gestiones
                                                    </SoftTypography>
                                                    <SoftTypography
                                                        variant="body2"
                                                        color="error"
                                                        sx={{ fontSize: '0.875rem', opacity: 0.9 }}
                                                    >
                                                        {error}
                                                    </SoftTypography>
                                                </SoftBox>
                                            </SoftBox>
                                        </SoftBox>
                                    )}

                                    {/* Tabla de gestiones */}
                                    <SoftBox>
                                        <MaterialReactTable
                                            columns={columns}
                                            data={filteredGestiones}
                                            enableColumnActions={true}
                                            enableColumnFilters={true}
                                            enablePagination={false}
                                            enableSorting={true}
                                            enableBottomToolbar={true}
                                            enableTopToolbar={true}
                                            enableGlobalFilter={true}
                                            enableRowSelection={false}
                                            enableFullScreenToggle={true}
                                            enableDensityToggle={true}
                                            enableExportToolbar={true}
                                            state={{
                                                isLoading: loading,
                                                showAlertBanner: false, // Desactivamos el banner de la tabla
                                                showProgressBars: loading,
                                                pagination: pagination
                                            }}
                                            onPaginationChange={setPagination}
                                            manualPagination={false}
                                            muiTablePaperProps={{
                                                elevation: 0,
                                                sx: {
                                                    borderRadius: "8px"
                                                }
                                            }}
                                            muiTableProps={{
                                                sx: {
                                                    tableLayout: "auto"
                                                }
                                            }}
                                            initialState={{
                                                density: "compact",
                                                pagination: {
                                                    pageSize: 10,
                                                    pageIndex: 0
                                                },
                                                columnVisibility: {
                                                    prioridad_nombre: true,
                                                    nombre_paso: false,
                                                    estado_calculado: false,
                                                }
                                            }}
                                            muiTablePaginationProps={{
                                                rowsPerPageOptions: (() => {
                                                    const options = [5, 10, 30, 50];
                                                    // Agregar "Todas" si hay más de 50 gestiones o siempre mostrar la opción
                                                    if (filteredGestiones.length > 50) {
                                                        options.push({ value: filteredGestiones.length, label: 'Todas' });
                                                    } else if (filteredGestiones.length > 0) {
                                                        // Si hay menos de 50, aún ofrecer "Todas" que mostrará todas las filas
                                                        options.push({ value: filteredGestiones.length, label: 'Todas' });
                                                    }
                                                    return options.filter(option => {
                                                        if (typeof option === 'number') {
                                                            return option <= filteredGestiones.length || filteredGestiones.length === 0;
                                                        }
                                                        return true;
                                                    });
                                                })(),
                                                labelRowsPerPage: 'Mostrar:',
                                                labelDisplayedRows: ({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                                            }}
                                        />
                                    </SoftBox>
                                </SoftBox>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SoftBox>

            {/* Panel lateral para crear/editar gestión */}
            <SidePanelRight
                open={gestionPanel.open}
                onClose={handleGestionPanelClose}
                title={
                    gestionPanel.mode === "create"
                        ? "Nueva Gestión"
                        : gestionPanel.mode === "edit"
                            ? "Detalle de Gestión"
                            : "Detalles de Gestión"
                }
                subtitle={
                    gestionPanel.mode === "edit" && gestionPanel.gestion?.gestion_id
                        ? `GES-${new Date().getFullYear()}-${String(gestionPanel.gestion.gestion_id).padStart(3, '0')}`
                        : gestionPanel.mode === "view" && gestionPanel.gestion?.gestion_id
                            ? `GES-${new Date().getFullYear()}-${String(gestionPanel.gestion.gestion_id).padStart(3, '0')}`
                            : undefined
                }
                size={gestionPanel.mode === "create" || gestionPanel.mode === "edit" ? "xl" : "large"}
            >
                <GestionDetail
                    gestion={gestionPanel.gestion}
                    mode={gestionPanel.mode}
                    onSave={handleGestionSave}
                    onCancel={handleGestionPanelClose}
                    loading={gestionPanel.loading}
                />
            </SidePanelRight>

            {/* Backdrop de carga de pantalla completa al crear/editar gestión */}
            <Backdrop
                open={gestionPanel.loading}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1000,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                <CircularProgress
                    size={80}
                    thickness={4.5}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h4"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 4px 8px rgba(0,0,0,0.5)',
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                    }}
                >
                    {gestionPanel.mode === "create" ? "Creando Gestión..." : "Guardando Gestión..."}
                </SoftTypography>
                <SoftTypography
                    variant="body1"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        textAlign: 'center',
                        maxWidth: '500px',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                >
                    {gestionPanel.mode === "create"
                        ? "Por favor espera mientras procesamos la información"
                        : "Por favor espera mientras guardamos los cambios"}
                </SoftTypography>
            </Backdrop>

            {/* Alert de confirmación para inactivar gestión */}
            <ConfirmAlert
                open={inactivateAlert.open}
                onClose={handleInactivateCancel}
                onConfirm={handleInactivateConfirm}
                title="Confirmar Inactivación"
                message="¿Estás seguro de que deseas inactivar esta gestión? La gestión será pausada y no podrá continuar hasta que sea reactivada."
                confirmText="Inactivar"
                cancelText="Cancelar"
                severity="warning"
                itemName={inactivateAlert.gestion?.nombre}
                showItemName={true}
                itemLabel="Gestión"
            />

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

            {/* Notificaciones */}
            <AppNotification
                type={notification.type}
                message={notification.message}
                open={notification.open}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            />
        </>
    );
}

export default Gestiones;

