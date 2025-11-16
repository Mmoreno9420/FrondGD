/**
=========================================================
* GestiaSoft - App Sidenav
=========================================================
* Custom simplified sidenav for the application with configurable colors
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Drawer from "@mui/material/Drawer";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React context
import { useSoftUIController, setMiniSidenav } from "context";

// Config
import { SYSTEM_COLORS } from "config/appConfig";

function AppSidenav({ color = "info", brand = "", brandName, routes, ...rest }) {
    const [openCollapse, setOpenCollapse] = useState("Configuración");
    const [controller, dispatch] = useSoftUIController();
    const { miniSidenav } = controller;
    const location = useLocation();
    const { pathname } = location;

    const closeSidenav = () => setMiniSidenav(dispatch, true);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            setMiniSidenav(dispatch, window.innerWidth < 1200);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [dispatch]);

    // Default routes for the custom sidebar
    const defaultRoutes = [
        {
            type: "collapse",
            name: "Configuración",
            icon: "settings",
            collapse: [
                {
                    name: "Usuarios",
                    route: "/pages/users/usuarios",
                    icon: "people",
                    key: "users"
                },
                {
                    name: "Roles Permisos",
                    route: "/pages/users/rolespermisos",
                    icon: "admin_panel_settings",
                    key: "rolespermisos"
                },
                {
                    name: "Pantallas",
                    route: "/pages/users/pantallas",
                    icon: "desktop_windows",
                    key: "pantallas"
                },
                {
                    name: "Pantallas Permisos",
                    route: "/pages/users/pantallaspermisos",
                    icon: "screen_share",
                    key: "pantallaspermisos"
                },
                {
                    name: "Grupos",
                    route: "/pages/users/grupos",
                    icon: "group_work",
                    key: "grupos"
                },
                {
                    name: "Permisos",
                    route: "/pages/users/permisos",
                    icon: "security",
                    key: "permisos"
                },
                {
                    name: "Inicio Sesión",
                    route: "/login",
                    icon: "login",
                    key: "login-custom"
                }
            ],
            key: "configuracion"
        },
        {
            type: "collapse",
            name: "Gestiones",
            icon: "dashboard",
            collapse: [
                {
                    name: "Dashboard",
                    route: "/dashboards/default",
                    icon: "dashboard",
                    key: "dashboard"
                },
                {
                    name: "Reportes",
                    route: "/pages/users/reports",
                    icon: "assessment",
                    key: "reports"
                },
                {
                    name: "Gestiones",
                    route: "/gestiones/gestion",
                    icon: "assignment",
                    key: "gestiones"
                }
            ],
            key: "gestiones"
        },
        {
            type: "collapse",
            name: "Ejemplos",
            icon: "code",
            collapse: [
                {
                    name: "App Actions",
                    route: "/examples/app-actions",
                    icon: "settings_applications",
                    key: "app-actions"
                },
                {
                    name: "API Examples",
                    route: "/examples/api",
                    icon: "api",
                    key: "api-examples"
                }
            ],
            key: "ejemplos"
        }
    ];

    // Render collapse items
    const renderCollapse = (collapse, parentKey) => {
        return collapse.map(({ name, route, icon, key }) => (
            <ListItem key={key} disablePadding sx={{ pl: 4 }}>
                <ListItemButton
                    component={NavLink}
                    to={route}
                    selected={pathname === route}
                    sx={{
                        minHeight: 48,
                        px: 2.5,
                        borderRadius: 1,
                        mx: 1,
                        "&.Mui-selected": {
                            backgroundColor: SYSTEM_COLORS.sidebar.active,
                            color: "white",
                            "&:hover": {
                                backgroundColor: SYSTEM_COLORS.sidebar.active,
                            }
                        },
                        "&:hover": {
                            backgroundColor: SYSTEM_COLORS.sidebar.hover,
                        }
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: 2,
                            justifyContent: "center",
                            color: pathname === route ? "white" : SYSTEM_COLORS.sidebar.text
                        }}
                    >
                        <Icon>{icon}</Icon>
                    </ListItemIcon>
                    <ListItemText
                        primary={name}
                        sx={{
                            "& .MuiTypography-root": {
                                fontSize: "0.875rem",
                                fontWeight: pathname === route ? "600" : "400"
                            }
                        }}
                    />
                </ListItemButton>
            </ListItem>
        ));
    };

    // Render main navigation items
    const renderNavItems = () => {
        return defaultRoutes.map(({ type, name, icon, collapse, key }) => {
            if (type === "collapse") {
                const isOpen = openCollapse === name;

                return (
                    <div key={key}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => setOpenCollapse(isOpen ? false : name)}
                                sx={{
                                    minHeight: 56,
                                    px: 2.5,
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    backgroundColor: isOpen ? SYSTEM_COLORS.sidebar.secondary : "transparent",
                                    "&:hover": {
                                        backgroundColor: SYSTEM_COLORS.sidebar.hover,
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: 2,
                                        justifyContent: "center",
                                        color: SYSTEM_COLORS.sidebar.text
                                    }}
                                >
                                    <Icon>{icon}</Icon>
                                </ListItemIcon>
                                <ListItemText
                                    primary={name}
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "0.9rem",
                                            fontWeight: "600"
                                        }
                                    }}
                                />
                                <Icon
                                    sx={{
                                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.3s ease",
                                        color: SYSTEM_COLORS.sidebar.text
                                    }}
                                >
                                    expand_more
                                </Icon>
                            </ListItemButton>
                        </ListItem>

                        <Collapse in={isOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {renderCollapse(collapse, key)}
                            </List>
                        </Collapse>
                    </div>
                );
            }
            return null;
        });
    };

    // Main drawer content
    const drawerContent = (
        <SoftBox sx={{ pt: 0, height: "100%" }}>
            {/* Header */}
            <SoftBox
                sx={{
                    p: 2,
                    borderBottom: `1px solid ${SYSTEM_COLORS.sidebar.secondary}`,
                    backgroundColor: SYSTEM_COLORS.sidebar.secondary
                }}
            >
                <SoftBox display="flex" alignItems="center" justifyContent="center">
                    <Icon
                        sx={{
                            fontSize: "2rem",
                            color: SYSTEM_COLORS.sidebar.active,
                            mr: 1
                        }}
                    >
                        shield
                    </Icon>
                    {!miniSidenav && (
                        <SoftTypography
                            variant="h6"
                            fontWeight="bold"
                            sx={{
                                color: SYSTEM_COLORS.sidebar.text,
                                fontSize: "1.1rem"
                            }}
                        >
                            {brandName}
                        </SoftTypography>
                    )}
                </SoftBox>
            </SoftBox>

            {/* Navigation Items */}
            <List sx={{ pt: 0.5 }}>
                {renderNavItems()}
            </List>

            {/* Footer removido para evitar duplicación con AppFooter */}
        </SoftBox>
    );

    return null; // Sidebar completamente oculto
}

// Typechecking props for the AppSidenav
AppSidenav.propTypes = {
    color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
    brand: PropTypes.string,
    brandName: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AppSidenav;


