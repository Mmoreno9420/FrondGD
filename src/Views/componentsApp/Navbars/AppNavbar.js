/**
=========================================================
* GestiaSoft - App Navbar
=========================================================
* Custom simplified navbar for the application
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useLocation, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";

// @mui icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { APP_NAME, SYSTEM_COLORS } from "config/appConfig";

// Hooks
import { useUserSession } from "hooks/useUserSession";

// Components
import SidePanelLeft from "Views/componentsApp/SidePanelLeft/SidePanelLeft";
import ConfirmAcuseModal from "Views/componentsApp/Modals/ConfirmAcuseModal";
import dataUtlService from "services/dataUtlService";
import gestionService from "services/gestionService";

// Custom logo - using shield icon instead of image
import ShieldIcon from "@mui/icons-material/Shield";

function AppNavbar({ transparent = false, light = false }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElNav, setAnchorElNav] = useState(null);

    // Cargar el filtro desde localStorage al iniciar
    const [gestionesFilter, setGestionesFilter] = useState(() => {
        return localStorage.getItem('gestionesFilter') || 'pendientes';
    });

    // Estado para panel de notificaciones
    const [notificationsPanel, setNotificationsPanel] = useState({
        open: false,
        filter: null // "pendientes", "en_proceso", "historia"
    });
    const [acuseModal, setAcuseModal] = useState({ open: false, item: null });
    const [processingAcuse, setProcessingAcuse] = useState(false);

    // Contadores de notificaciones
    const [notificationsCount, setNotificationsCount] = useState({
        pendientes: 0,
        en_proceso: 0,
        finalizadas: 0
    });

    const [notifications, setNotifications] = useState(() => {
        try {
            const cached = localStorage.getItem('app_notifications');
            const parsed = cached ? JSON.parse(cached) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });
    const [loadingNotifs, setLoadingNotifs] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user, id_rol } = useUserSession();
    const fetchNotifications = async () => {
        if (!user) return;
        setLoadingNotifs(true);
        try {
            const userId = user?.usuario_id || user?.id;
            const unidadActualId = user?.unidad_actual_id || user?.unidad?.unidad_id;
            const resp = await dataUtlService.listAsignaciones(userId, {});
            const raw = resp?.data?.data || resp?.data || resp || [];
            const items = Array.isArray(raw) ? raw : [];
            const mapped = items
                .filter(it => !unidadActualId || it.unidad_id === unidadActualId || it.unidad_actual_id === unidadActualId)
                .map((it, idx) => {
                    const fecha = it.fecha_asignacion || it.fecha || it.fecha_llegada_paso;
                    const titulo = it.titulo || it.nombre_gestion || it.gestion || it.nombre || `Asignación ${idx + 1}`;
                    const etapa = it.etapa || it.nombre_paso || it.paso || '';
                    const unidad = it.unidad || it.unidad_nombre || it.nombre_unidad || '';
                    let estadoDias = '';
                    if (fecha) {
                        const f = new Date(fecha);
                        const hoy = new Date();
                        const diff = Math.floor((hoy - f) / (1000 * 60 * 60 * 24));
                        if (diff <= 0) estadoDias = 'Asignada hoy';
                        else if (diff === 1) estadoDias = '1 día desde asignaciones';
                        else estadoDias = `${diff} días desde asignaciones`;
                    }
                    return {
                        id: it.id || it.gestion_id || idx,
                        titulo,
                        etapa,
                        fecha: fecha ? new Date(fecha).toISOString().slice(0, 10) : '',
                        unidad,
                        estadoDias,
                        descripcion_paso: it.descripcion_paso || it.descripcion || '',
                        workflow_id: it.workflow_id,
                        unidad_id: it.unidad_id || it.unidad_actual_id
                    };
                });
            setNotifications(mapped);
            setNotificationsCount(prev => ({ ...prev, pendientes: mapped.length }));
            try { localStorage.setItem('app_notifications', JSON.stringify(mapped)); } catch { }
        } catch (e) {
            console.error('Error cargando notificaciones:', e);
        } finally {
            setLoadingNotifs(false);
        }
    };

    useEffect(() => {
        if (notificationsPanel.open) fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [notificationsPanel.open]);

    const handleConfirmAcuseFromNotif = async () => {
        if (!acuseModal.item || !user) {
            setAcuseModal({ open: false, item: null });
            return;
        }
        try {
            setProcessingAcuse(true);
            const userId = user?.usuario_id || user?.id;
            const unidadActualId = user?.unidad_actual_id || user?.unidad?.unidad_id || acuseModal.item?.unidad_id || 0;
            const workflowId = acuseModal.item?.workflow_id || 0;
            await gestionService.procesarAcuseRecibido(userId, {
                workflow_id: workflowId,
                unidad_id: unidadActualId
            });
            // Cerrar modal y refrescar lista
            setAcuseModal({ open: false, item: null });
            await fetchNotifications();

            // Disparar evento personalizado para refrescar el grid de gestiones
            // Esto permite que el componente Gestiones escuche y actualice sus datos
            window.dispatchEvent(new CustomEvent('gestiones-updated', {
                detail: { action: 'acuse-recibido', workflow_id: workflowId }
            }));
        } catch (e) {
            console.error('Error al procesar acuse desde notificación:', e);
            setAcuseModal({ open: false, item: null });
        } finally {
            setProcessingAcuse(false);
        }
    };

    const openUserMenu = (event) => setAnchorEl(event.currentTarget);
    const closeUserMenu = () => setAnchorEl(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleNavClick = (route) => {
        navigate(route);
        handleCloseNavMenu();
    };

    // Función para cambiar el filtro de gestiones
    const handleGestionesFilterChange = (filter) => {
        setGestionesFilter(filter);
        localStorage.setItem('gestionesFilter', filter);
        navigate(`/gestiones/gestion?filter=${filter}`);
    };

    // Función para abrir panel de notificaciones
    const handleOpenNotifications = (filter) => {
        setNotificationsPanel({
            open: true,
            filter: filter
        });
    };

    // Función para cerrar panel de notificaciones
    const handleCloseNotifications = () => {
        setNotificationsPanel({
            open: false,
            filter: null
        });
    };


    // Función para cerrar sesión
    const handleLogout = () => {
        console.log("========================================");
        console.log("CERRANDO SESIÓN");
        console.log("========================================");
        console.log("Usuario actual:", user?.nombre || "No disponible");
        console.log("usuario_id:", user?.usuario_id || "No disponible");
        console.log("unidad_actual_id:", user?.unidad_actual_id || "No disponible");
        console.log("========================================");

        // Ejecutar logout (limpia localStorage y context)
        logout();

        // Cerrar menú
        closeUserMenu();

        // Redirigir a login
        navigate("/login");
    };

    // Check if current route is active
    const isActiveRoute = (route) => {
        return location.pathname === route;
    };


    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            // Solo mantener para futuras funcionalidades
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <AppBar
            position="fixed"
            sx={{
                backgroundColor: SYSTEM_COLORS.header.primary,
                color: SYSTEM_COLORS.header.text,
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                borderBottom: `1px solid ${SYSTEM_COLORS.header.border}`,
                zIndex: 1200
            }}
        >
            <Toolbar sx={{
                minHeight: "56px", // Aumentar de 48px a 56px para más espacio
                height: "56px", // Altura fija más espaciosa
                px: { xs: 2, sm: 3, lg: 4 }, // Aumentar padding horizontal
                py: 1, // Aumentar padding vertical
            }}>
                {/* Logo and Brand - Left Side */}
                <SoftBox
                    component={Link}
                    to="/"
                    display="flex"
                    alignItems="center"
                    sx={{
                        textDecoration: "none",
                        color: SYSTEM_COLORS.header.text,
                        "&:hover": {
                            color: SYSTEM_COLORS.header.accent
                        }
                    }}
                >
                    {/* Shield Icon */}
                    <ShieldIcon
                        sx={{
                            fontSize: "1.5rem", // Reducir de 2rem a 1.5rem
                            mr: 1, // Reducir margen derecho
                            color: SYSTEM_COLORS.header.accent
                        }}
                    />

                    {/* Brand Text */}
                    <SoftBox display="flex" flexDirection="column" lineHeight={1}>
                        <SoftTypography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                fontSize: { xs: "1rem", sm: "1.1rem" }, // Reducir tamaño de fuente
                                color: SYSTEM_COLORS.header.text
                            }}
                        >
                            {APP_NAME}
                        </SoftTypography>
                        <SoftTypography
                            variant="caption"
                            sx={{
                                fontSize: { xs: "0.6rem", sm: "0.7rem" }, // Reducir tamaño de fuente
                                fontWeight: "medium",
                                color: SYSTEM_COLORS.header.accent
                            }}
                        >
                            Sistema de Gestión
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>

                {/* Navigation Menu - Left */}
                <SoftBox sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-start", gap: 1, ml: 3 }}>
                    {/* Botón Gestiones con Dropdown */}
                    <SoftBox>
                        <SoftBox
                            onClick={() => handleGestionesFilterChange('pendientes')}
                            sx={{
                                textDecoration: "none",
                                color: "#ffffff",
                                '& *': { color: '#ffffff !important' },
                                fontWeight: "bold",
                                fontSize: "1rem",
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                backgroundColor: gestionesFilter === 'pendientes' && isActiveRoute("/gestiones/gestion")
                                    ? "rgba(255, 255, 255, 0.25)"
                                    : "rgba(255, 255, 255, 0.05)",
                                border: gestionesFilter === 'pendientes' && isActiveRoute("/gestiones/gestion")
                                    ? "2px solid rgba(255, 255, 255, 0.5)"
                                    : "2px solid transparent",
                                boxShadow: gestionesFilter === 'pendientes' && isActiveRoute("/gestiones/gestion")
                                    ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                    : "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            Pendientes
                        </SoftBox>
                    </SoftBox>

                    {/* Botón En Proceso */}
                    <SoftBox
                        onClick={() => handleGestionesFilterChange('en_proceso')}
                        sx={{
                            textDecoration: "none",
                            color: "#ffffff",
                            '& *': { color: '#ffffff !important' },
                            fontWeight: "bold",
                            fontSize: "1rem",
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: gestionesFilter === 'en_proceso' && isActiveRoute("/gestiones/gestion")
                                ? "rgba(255, 255, 255, 0.25)"
                                : "rgba(255, 255, 255, 0.05)",
                            border: gestionesFilter === 'en_proceso' && isActiveRoute("/gestiones/gestion")
                                ? "2px solid rgba(255, 255, 255, 0.5)"
                                : "2px solid transparent",
                            boxShadow: gestionesFilter === 'en_proceso' && isActiveRoute("/gestiones/gestion")
                                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                : "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        En Proceso
                    </SoftBox>

                    {/* Botón Historia */}
                    <SoftBox
                        onClick={() => handleGestionesFilterChange('historia')}
                        sx={{
                            textDecoration: "none",
                            color: "#ffffff",
                            '& *': { color: '#ffffff !important' },
                            fontWeight: "bold",
                            fontSize: "1rem",
                            px: 2,
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: gestionesFilter === 'historia' && isActiveRoute("/gestiones/gestion")
                                ? "rgba(255, 255, 255, 0.25)"
                                : "rgba(255, 255, 255, 0.05)",
                            border: gestionesFilter === 'historia' && isActiveRoute("/gestiones/gestion")
                                ? "2px solid rgba(255, 255, 255, 0.5)"
                                : "2px solid transparent",
                            boxShadow: gestionesFilter === 'historia' && isActiveRoute("/gestiones/gestion")
                                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                : "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        Historia
                    </SoftBox>

                    {/* Botón Usuarios - Solo visible para rol = 1 (Administrador) */}
                    {id_rol === 1 && (
                        <SoftBox
                            component={Link}
                            to="/pages/users/usuarios"
                            sx={{
                                textDecoration: "none",
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "1rem",
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                backgroundColor: isActiveRoute("/pages/users/usuarios")
                                    ? "rgba(255, 255, 255, 0.25)"
                                    : "rgba(255, 255, 255, 0.05)",
                                border: isActiveRoute("/pages/users/usuarios")
                                    ? "2px solid rgba(255, 255, 255, 0.5)"
                                    : "2px solid transparent",
                                boxShadow: isActiveRoute("/pages/users/usuarios")
                                    ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                    : "none",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderColor: "rgba(255, 255, 255, 0.5)",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                                },
                                transition: "all 0.3s ease"
                            }}
                        >
                            Usuarios
                        </SoftBox>
                    )}

                    {/* Botón Paciente - COMENTADO */}
                    {/* <SoftBox
                        component={Link}
                        to="/pages/pacientes/paciente"
                        sx={{
                            textDecoration: "none",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            backgroundColor: isActiveRoute("/pages/pacientes/paciente")
                                ? "rgba(255, 255, 255, 0.25)"
                                : "rgba(255, 255, 255, 0.05)",
                            border: isActiveRoute("/pages/pacientes/paciente")
                                ? "2px solid rgba(255, 255, 255, 0.5)"
                                : "2px solid transparent",
                            boxShadow: isActiveRoute("/pages/pacientes/paciente")
                                ? "0 4px 12px rgba(0, 0, 0, 0.2)"
                                : "none",
                            "&:hover": {
                                backgroundColor: "rgba(255, 255, 255, 0.2)",
                                borderColor: "rgba(255, 255, 255, 0.5)",
                                transform: "translateY(-2px)",
                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)"
                            },
                            transition: "all 0.3s ease"
                        }}
                    >
                        Paciente
                    </SoftBox> */}
                </SoftBox>

                {/* User Actions - Right Side */}
                <SoftBox display="flex" alignItems="center" gap={2}> {/* Gap aumentado entre iconos */}
                    {/* Icono de Notificaciones */}
                    <Tooltip title="Notificaciones">
                        <IconButton
                            size="small"
                            onClick={() => handleOpenNotifications(null)}
                            sx={{
                                color: SYSTEM_COLORS.header.text,
                                p: 0.5,
                                "&:hover": {
                                    backgroundColor: SYSTEM_COLORS.header.secondary
                                }
                            }}
                        >
                            <Badge badgeContent={notificationsCount.pendientes + notificationsCount.en_proceso + notificationsCount.finalizadas} color="error" max={99}>
                                <NotificationsIcon sx={{ fontSize: "1.2rem" }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* User Menu */}
                    <Tooltip title="Menú de usuario">
                        <IconButton
                            size="small" // Cambiar de medium a small
                            onClick={openUserMenu}
                            sx={{
                                color: SYSTEM_COLORS.header.text,
                                p: 0.5, // Reducir padding
                                "&:hover": {
                                    backgroundColor: SYSTEM_COLORS.header.secondary
                                }
                            }}
                        >
                            <Avatar
                                alt="Usuario"
                                sx={{
                                    width: 28,
                                    height: 28,
                                    border: `2px solid ${SYSTEM_COLORS.header.accent}`,
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    color: SYSTEM_COLORS.header.text,
                                    fontWeight: "bold",
                                    fontSize: "0.7rem"
                                }}
                            >
                                {user?.nombre ? user.nombre.split(' ').map(name => name.charAt(0)).join('').toUpperCase().substring(0, 2) : 'U'}
                            </Avatar>
                        </IconButton>
                    </Tooltip>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={closeUserMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                minWidth: 220,
                                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                background: "rgba(255, 255, 255, 0.95)",
                                backdropFilter: "blur(20px)",
                            },
                        }}
                    >
                        {/* User Header */}
                        <SoftBox
                            sx={{
                                p: 2,
                                borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
                                backgroundColor: "rgba(0, 0, 0, 0.02)",
                                borderTopLeftRadius: "16px",
                                borderTopRightRadius: "16px",
                            }}
                        >
                            <SoftBox display="flex" alignItems="center">
                                <Avatar
                                    alt="Usuario"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        mr: 1.5,
                                        backgroundColor: "grey.300",
                                        color: "grey.600"
                                    }}
                                >
                                    {user?.nombre ? user.nombre.split(' ').map(name => name.charAt(0)).join('').toUpperCase().substring(0, 2) : 'U'}
                                </Avatar>
                                <SoftBox>
                                    <SoftTypography variant="button" fontWeight="bold" color="dark">
                                        {user?.nombre || "Usuario GD-SESAL"}
                                    </SoftTypography>
                                    <SoftTypography variant="caption" color="text" opacity={0.7} display="block">
                                        {user?.email || "usuario@sesal.gob.sv"}
                                    </SoftTypography>
                                </SoftBox>
                            </SoftBox>
                        </SoftBox>

                        {/* Menu Items - ELEMENTOS COMENTADOS */}
                        {/* Mi Perfil
                        <MenuItem
                            component={Link}
                            to="/pages/profile/profile-overview"
                            onClick={closeUserMenu}
                            sx={{
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                mt: 1,
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                standpoint
                            }}
                        >
                            <Icon sx={{ mr: 1.5, fontSize: "1.1rem", color: "info.main" }}>person</Icon>
                            <SoftTypography variant="button" fontWeight="medium" color="dark">
                                Mi Perfil
                            </SoftTypography>
                        </MenuItem>
                        */}

                        {/* Configuración
                        <MenuItem
                            component={Link}
                            to="/pages/account/settings"
                            onClick={closeUserMenu}
                            sx={{
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}
                        >
                            <Icon sx={{ mr: 1.5, fontSize: "1.1rem", color: "info.main" }}>settings</Icon>
                            <SoftTypography variant="button" fontWeight="medium" color="dark">
                                Configuración
                            </SoftTypography>
                        </MenuItem>
                        */}

                        {/* Reportes
                        <MenuItem
                            component={Link}
                            to="/pages/account/reports"
                            onClick={closeUserMenu}
                            sx={{
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}
                        >
                            <Icon sx={{ mr: 1.5, fontSize: "1.1rem", color: "info.main" }}>assessment</Icon>
                            <SoftTypography variant="button" fontWeight="medium" color="dark">
                                Reportes
                            </SoftTypography>
                        </MenuItem>
                        */}

                        {/* Notificaciones
                        <MenuItem
                            component={Link}
                            to="/pages/account/notifications"
                            onClick={closeUserMenu}
                            sx={{
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                }
                            }}
                        >
                            <Icon sx={{ mr: 1.5, fontSize: "1.1rem", color: "info.main" }}>notifications</Icon>
                            <SoftTypography variant="button" fontWeight="medium" color="dark">
                                Notificaciones
                            </SoftTypography>
                        </MenuItem>
                        */}

                        {/* Divider - COMENTADO
                        <SoftBox sx={{ my: 0.5, mx: 2 }}>
                            <Divider />
                        </SoftBox>
                        */}

                        {/* Logout */}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{
                                py: 1.5,
                                px: 2,
                                mx: 1,
                                mb: 1,
                                borderRadius: "8px",
                                "&:hover": {
                                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                                }
                            }}
                        >
                            <Icon sx={{ mr: 1.5, fontSize: "1.1rem", color: "error.main" }}>logout</Icon>
                            <SoftTypography variant="button" fontWeight="medium" color="error">
                                Cerrar Sesión
                            </SoftTypography>
                        </MenuItem>
                    </Menu>
                </SoftBox>

            </Toolbar>

            {/* Panel de Notificaciones */}
            <SidePanelLeft
                open={notificationsPanel.open}
                onClose={handleCloseNotifications}
                title="Notificaciones"
                subtitle="Ver todas las notificaciones de tus gestiones"
            >
                <SoftBox p={3}>
                    {/* Encabezado: contador + botón actualizar al mismo nivel */}
                    <SoftBox display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '10px 16px',
                            background: '#e8f1ff',
                            color: '#1a73e8',
                            borderRadius: 20,
                            fontSize: 14,
                            fontWeight: 700,
                            lineHeight: 1
                        }}>
                            {notificationsCount.pendientes} notificaciones pendientes
                        </span>
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<RefreshIcon sx={{ fontSize: 18 }} />}
                            onClick={fetchNotifications}
                            sx={{
                                background: 'linear-gradient(45deg, #1a73e8 30%, #4285f4 90%)',
                                color: '#fff',
                                borderRadius: '20px',
                                px: 1.75,
                                py: 0.75,
                                boxShadow: '0 4px 12px rgba(26,115,232,0.25)',
                                '&:hover': { background: 'linear-gradient(45deg, #1558b3 30%, #1a73e8 90%)' }
                            }}
                        >
                            {loadingNotifs ? 'Actualizando...' : 'Actualizar'}
                        </Button>
                    </SoftBox>

                    {/* Lista de notificaciones o loader */}
                    {loadingNotifs && notifications.length === 0 ? (
                        <SoftBox display="flex" alignItems="center" justifyContent="center" minHeight="40vh">
                            <CircularProgress />
                        </SoftBox>
                    ) : (
                        <SoftBox display="flex" flexDirection="column" gap={2}>
                            {notifications.map((n) => (
                                <SoftBox key={n.id} sx={{
                                    border: '1px solid #f2e5d0',
                                    background: '#fffdf8',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}>
                                    <SoftBox p={2.25} sx={{ minWidth: 0 }}>
                                        {/* Título */}
                                        <SoftTypography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            color="dark"
                                            mb={1}
                                            sx={{
                                                display: 'block',
                                                fontSize: { xs: '0.95rem', sm: '1rem' },
                                                lineHeight: 1.3,
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'normal',
                                                maxWidth: '100%',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                displayPrint: 'block'
                                            }}
                                        >
                                            {n.titulo}
                                        </SoftTypography>


                                        {/* Etapa + ID */}
                                        <SoftBox mb={1} display="flex" alignItems="center" gap={1}>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '6px 10px',
                                                background: '#e8f1ff',
                                                color: '#1a73e8',
                                                borderRadius: 16,
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}>
                                                Etapa: {n.etapa}
                                            </span>
                                            <span style={{
                                                display: 'inline-block',
                                                padding: '4px 8px',
                                                background: '#eef3ff',
                                                color: '#3559c7',
                                                borderRadius: 12,
                                                fontSize: 11,
                                                fontWeight: 700
                                            }}>
                                                {`GD-${new Date().getFullYear()}-${String(n.id || 0).toString().padStart(3, '0')}`}
                                            </span>
                                        </SoftBox>

                                        {/* Metadatos */}
                                        <SoftBox display="flex" flexDirection="column" gap={0.75} mb={1.25}>
                                            <SoftBox display="flex" alignItems="center" gap={0.75}>
                                                <CalendarTodayIcon sx={{ fontSize: 16, color: '#5f6368' }} />
                                                <SoftTypography variant="caption" color="text">Asignada: {n.fecha}</SoftTypography>
                                            </SoftBox>
                                            <SoftBox display="flex" alignItems="center" gap={0.75}>
                                                <BusinessIcon sx={{ fontSize: 16, color: '#5f6368' }} />
                                                <SoftTypography variant="caption" color="text">Unidad: {n.unidad}</SoftTypography>
                                            </SoftBox>
                                        </SoftBox>

                                        {/* Estado de días */}
                                        <SoftBox mb={1.25}>
                                            <span style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 6,
                                                padding: '6px 10px',
                                                background: '#ffe9da',
                                                color: '#cc5a12',
                                                borderRadius: 16,
                                                fontSize: 12,
                                                fontWeight: 600
                                            }}>
                                                <AccessTimeIcon sx={{ fontSize: 14 }} /> {n.estadoDias}
                                            </span>
                                        </SoftBox>

                                        {/* Botones de acción */}
                                        <SoftBox display="flex" flexDirection="row" gap={1}>
                                            <Button
                                                variant="contained"
                                                startIcon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                                                onClick={() => setAcuseModal({ open: true, item: n })}
                                                sx={{
                                                    flex: 1,
                                                    minWidth: 0,
                                                    backgroundColor: '#1a73e8',
                                                    color: '#ffffff',
                                                    borderRadius: '8px',
                                                    py: 1,
                                                    textTransform: 'none',
                                                    fontWeight: 700,
                                                    '&:hover': { backgroundColor: '#1558b3' }
                                                }}
                                            >
                                                Acuse recibido
                                            </Button>
                                        </SoftBox>
                                    </SoftBox>
                                </SoftBox>
                            ))}
                        </SoftBox>
                    )}
                </SoftBox>
            </SidePanelLeft>
            <ConfirmAcuseModal
                open={acuseModal.open}
                onClose={() => setAcuseModal({ open: false, item: null })}
                onConfirm={handleConfirmAcuseFromNotif}
                titulo={acuseModal.item?.titulo}
                etapa={acuseModal.item?.etapa}
                fecha={acuseModal.item?.fecha}
                unidad={acuseModal.item?.unidad}
                showDescripcion={Boolean(acuseModal.item?.descripcion_paso || acuseModal.item?.descripcion)}
                descripcion={acuseModal.item?.descripcion_paso || acuseModal.item?.descripcion || ''}
            />
            {/* Backdrop de procesamiento de acuse desde notificaciones */}
            <Backdrop
                open={processingAcuse}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 5,
                    backgroundColor: 'rgba(0,0,0,0.6)'
                }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </AppBar>
    );
}

// Typechecking props for the AppNavbar
AppNavbar.propTypes = {
    transparent: PropTypes.bool,
    light: PropTypes.bool,
};

export default AppNavbar;
