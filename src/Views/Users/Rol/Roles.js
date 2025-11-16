/**
=========================================================
* GestiaSoft - Roles Page
=========================================================
* Gestión de roles del sistema
*/

import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

// Global Configuration
import { APP_NAME } from "config/appConfig";

// @mui material components
import {
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    Icon
} from "@mui/material";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";

// Custom App Layout
import { AppPageLayout, ConfirmAlert, SidePanelRight } from "Views/componentsApp";

// Material React Table v1
import { MaterialReactTable } from "material-react-table";

// Role Detail Component
import RoleDetail from "./RoleDetail";

// Images 
import role_logo from "assets/images/users_logo.png";

function Roles() {
    // Estado para manejar la responsividad
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Estado para el alert de confirmación
    const [deleteAlert, setDeleteAlert] = useState({
        open: false,
        role: null
    });

    // Estado para el panel lateral de rol
    const [rolePanel, setRolePanel] = useState({
        open: false,
        mode: "create", // "create" o "edit"
        role: null,
        loading: false
    });

    // Estado para el término de búsqueda
    const [searchTerm, setSearchTerm] = useState("");
    // Estado para el filtro de estado
    const [statusFilter, setStatusFilter] = useState("all");
    // Estado para controlar la paginación de la tabla
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 5,
    });

    // Datos de ejemplo para la tabla según estructura de BD seg_Roles
    const [data, setData] = useState([
        {
            rol_id: 1,
            nombre: "Administrador",
            descripcion: "Rol con acceso completo al sistema",
            status: true,
            created_at: "2024-01-15T08:30:00",
            created_by: 1,
            updated_at: "2024-01-20T14:15:00",
            updated_by: 1
        },
        {
            rol_id: 2,
            nombre: "Usuario",
            descripcion: "Rol estándar para usuarios del sistema",
            status: true,
            created_at: "2024-01-20T09:45:00",
            created_by: 1,
            updated_at: "2024-01-25T16:20:00",
            updated_by: 1
        },
        {
            rol_id: 3,
            nombre: "Supervisor",
            descripcion: "Rol para supervisar equipos y proyectos",
            status: true,
            created_at: "2024-01-10T11:20:00",
            created_by: 1,
            updated_at: "2024-01-18T13:30:00",
            updated_by: 1
        },
        {
            rol_id: 4,
            nombre: "Auditor",
            descripcion: "Rol para auditar y revisar procesos",
            status: false,
            created_at: "2024-01-25T10:15:00",
            created_by: 1,
            updated_at: "2024-01-30T15:45:00",
            updated_by: 1
        },
        {
            rol_id: 5,
            nombre: "Gerente",
            descripcion: "Rol para gestión de departamentos",
            status: true,
            created_at: "2024-01-18T12:00:00",
            created_by: 1,
            updated_at: "2024-01-22T09:30:00",
            updated_by: 1
        }
    ]);

    // Hook para detectar cambios en el tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 600);
            setIsTablet(width <= 768);
        };

        // Configuración inicial
        handleResize();

        // Agregar event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Función para filtrar roles por búsqueda y filtros
    const filteredRoles = useMemo(() => {
        let filtered = data || [];

        // Filtro por búsqueda de texto
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(role =>
                role.nombre?.toLowerCase().includes(searchLower) ||
                role.descripcion?.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por estado
        if (statusFilter !== "all") {
            filtered = filtered.filter(role => role.status === (statusFilter === "true"));
        }

        return filtered;
    }, [data, searchTerm, statusFilter]);

    // Función para obtener solo los roles de la página actual
    const paginatedRoles = useMemo(() => {
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredRoles.slice(startIndex, endIndex);
    }, [filteredRoles, pagination.pageIndex, pagination.pageSize]);

    // Función para limpiar filtros
    const clearFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
    };

    // Funciones para manejar el alert de confirmación
    const handleDeleteClick = (role) => {
        setDeleteAlert({
            open: true,
            role: role
        });
    };

    const handleDeleteConfirm = () => {
        if (deleteAlert.role) {
            setData(data.filter(role => role.rol_id !== deleteAlert.role.rol_id));
            setDeleteAlert({ open: false, role: null });
        }
    };

    const handleDeleteCancel = () => {
        setDeleteAlert({ open: false, role: null });
    };

    // Funciones para manejar el panel lateral de rol
    const handleNewRole = () => {
        setRolePanel({
            open: true,
            mode: "create",
            role: null,
            loading: false
        });
    };

    const handleEditRole = (role) => {
        setRolePanel({
            open: true,
            mode: "edit",
            role: role,
            loading: false
        });
    };

    const handleRolePanelClose = () => {
        setRolePanel({
            open: false,
            mode: "create",
            role: null,
            loading: false
        });
    };

    const handleRoleSave = async (roleData) => {
        setRolePanel(prev => ({ ...prev, loading: true }));

        try {
            // Simular guardado (aquí iría la llamada a la API)
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (rolePanel.mode === "create") {
                // Crear nuevo rol
                const newRole = {
                    ...roleData,
                    rol_id: Math.max(...data.map(r => r.rol_id)) + 1,
                    created_at: new Date().toISOString(),
                    created_by: 1,
                    updated_at: new Date().toISOString(),
                    updated_by: 1
                };
                setData([...data, newRole]);
            } else {
                // Actualizar rol existente
                setData(data.map(role =>
                    role.rol_id === roleData.rol_id
                        ? { ...role, ...roleData, updated_at: new Date().toISOString(), updated_by: 1 }
                        : role
                ));
            }

            handleRolePanelClose();
        } catch (error) {
            console.error("Error al guardar rol:", error);
        } finally {
            setRolePanel(prev => ({ ...prev, loading: false }));
        }
    };

    // Funciones de renderizado personalizado con PropTypes
    const BooleanCell = ({ cell }) => (
        <span
            style={{
                backgroundColor: cell.getValue() ? "#4caf50" : "#f44336",
                color: "#ffffff",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                display: "inline-block",
                minWidth: "80px",
                textAlign: "center",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)"
            }}
        >
            {cell.getValue() ? "Activo" : "Inactivo"}
        </span>
    );

    BooleanCell.propTypes = {
        cell: PropTypes.shape({
            getValue: PropTypes.func.isRequired
        }).isRequired
    };

    const DateCell = ({ cell }) => {
        const date = new Date(cell.getValue());
        return (
            <span
                style={{
                    backgroundColor: "#f8f9fa",
                    color: "#2c3e50",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                    border: "1px solid #e9ecef",
                    display: "inline-block",
                    minWidth: "120px",
                    textAlign: "center"
                }}
            >
                📅 {date.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </span>
        );
    };

    DateCell.propTypes = {
        cell: PropTypes.shape({
            getValue: PropTypes.func.isRequired
        }).isRequired
    };

    const ActionsCell = ({ row }) => (
        <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <IconButton
                size="medium"
                color="primary"
                onClick={() => handleEditRole(row.original)}
                sx={{
                    backgroundColor: '#e3f2fd',
                    color: '#1976d2',
                    '&:hover': {
                        backgroundColor: '#bbdefb',
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
                }}
            >
                <EditIcon />
            </IconButton>
            <IconButton
                size="medium"
                color="error"
                onClick={() => handleDeleteClick(row.original)}
                sx={{
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    '&:hover': {
                        backgroundColor: '#ffcdd2',
                        transform: 'scale(1.1)',
                    },
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
                }}
            >
                <DeleteIcon />
            </IconButton>
        </div>
    );

    ActionsCell.propTypes = {
        row: PropTypes.shape({
            original: PropTypes.object.isRequired
        }).isRequired
    };

    // Configuración de columnas para Material React Table v1
    const columns = useMemo(
        () => [
            {
                accessorKey: "rol_id",
                header: "ID",
                size: 50,
                minSize: 40,
                maxSize: 60,
                enableColumnFilter: false,
                enableSorting: true,
                enableResizing: false,
                initialState: {
                    hidden: true
                }
            },
            {
                accessorKey: "nombre",
                header: "👤 Nombre del Rol",
                size: isTablet ? 120 : 150,
                minSize: isTablet ? 100 : 150,
                maxSize: isTablet ? 140 : 150,
                enableColumnFilter: true,
                enableSorting: true,
                enableResizing: false,
            },
            {
                accessorKey: "descripcion",
                header: "📝 Descripción",
                size: isTablet ? 200 : 250,
                minSize: isTablet ? 150 : 200,
                maxSize: isTablet ? 250 : 300,
                enableColumnFilter: true,
                enableSorting: true,
                enableResizing: false,
            },
            {
                accessorKey: "status",
                header: "Estado",
                size: isTablet ? 100 : 120,
                minSize: isTablet ? 80 : 120,
                maxSize: isTablet ? 120 : 120,
                enableColumnFilter: true,
                enableSorting: true,
                enableResizing: false,
                Cell: BooleanCell,
            },
            {
                accessorKey: "created_at",
                header: "📅 Fecha Creación",
                size: isTablet ? 140 : 160,
                minSize: isTablet ? 120 : 160,
                maxSize: isTablet ? 160 : 160,
                enableColumnFilter: false,
                enableSorting: true,
                enableResizing: false,
                Cell: DateCell,
                initialState: {
                    hidden: true
                }
            },
            {
                accessorKey: "created_by",
                header: "👨‍💼 Creado Por",
                size: isTablet ? 80 : 100,
                minSize: isTablet ? 60 : 80,
                maxSize: isTablet ? 100 : 120,
                enableColumnFilter: false,
                enableSorting: true,
                enableResizing: false,
                initialState: {
                    hidden: true
                }
            },
            {
                accessorKey: "updated_at",
                header: "🔄 Última Actualización",
                size: isTablet ? 120 : 140,
                minSize: isTablet ? 100 : 120,
                maxSize: isTablet ? 140 : 160,
                enableColumnFilter: false,
                enableSorting: true,
                enableResizing: false,
                Cell: DateCell,
                initialState: {
                    hidden: true
                }
            },
            {
                accessorKey: "updated_by",
                header: "👨‍💼 Actualizado Por",
                size: isTablet ? 80 : 100,
                minSize: isTablet ? 60 : 80,
                maxSize: isTablet ? 100 : 120,
                enableColumnFilter: false,
                enableSorting: true,
                enableResizing: false,
                initialState: {
                    hidden: true
                }
            },
            {
                accessorKey: "actions",
                header: "⚙️ Acciones",
                size: isTablet ? 80 : 120,
                minSize: isTablet ? 60 : 100,
                maxSize: isTablet ? 100 : 140,
                enableColumnFilter: false,
                enableSorting: false,
                enableResizing: false,
                enableGlobalFilter: false,
                Cell: ActionsCell,
            },
        ],
        [isTablet]
    );

    // Configuración de la tabla para Material React Table v1
    const tableOptions = {
        columns,
        data: paginatedRoles,
        enableColumnFilters: false,
        enableDensityToggle: true,
        enableFullScreenToggle: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableRowSelection: false,
        enablePagination: false,
        enableSorting: true,
        enableGlobalFilter: false,
        enableColumnPinning: true,
        enableRowActions: false,
        // Configuración de paginación controlada
        manualPagination: true,
        rowCount: filteredRoles.length,
        onPaginationChange: setPagination,
        state: { pagination },
        muiTableProps: {
            sx: {
                tableLayout: 'fixed',
                width: '100%',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e0e0e0',
                '& .MuiTable-root': {
                    borderCollapse: 'separate',
                    borderSpacing: 0,
                },
                '& .MuiTableBody-root': {
                    '& .MuiTableRow-root': {
                        height: 'auto',
                        minHeight: '56px',
                        transition: 'background-color 0.2s ease',
                        '&:hover': {
                            backgroundColor: '#f8f9fa',
                        },
                        '&:nth-of-type(even)': {
                            backgroundColor: '#fafbfc',
                        }
                    }
                }
            },
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'bold',
                backgroundColor: '#1976d2',
                color: '#ffffff',
                padding: { xs: '12px 8px', sm: '16px 12px', md: '20px 16px' },
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                borderBottom: '2px solid #1565c0',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                '&:first-of-type': {
                    borderTopLeftRadius: '12px',
                },
                '&:last-of-type': {
                    borderTopRightRadius: '12px',
                }
            },
        },
        muiTableBodyCellProps: {
            sx: {
                padding: { xs: '8px 6px', sm: '12px 8px', md: '16px 12px' },
                fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                borderBottom: '1px solid #f0f0f0',
                verticalAlign: 'middle',
                color: '#2c3e50',
                fontWeight: '500',
            },
        },
        initialState: {
            density: 'comfortable',
            pagination: {
                pageSize: 5,
                pageIndex: 0
            },
            columnVisibility: {
                rol_id: false,
                created_by: false,
                updated_at: false,
                updated_by: false,
            },
        },
    };

    return (
        <AppPageLayout>
            <Container
                maxWidth={false}
                sx={{
                    mx: 'auto',
                    px: { xs: 1, sm: 2, md: 3 },
                    width: '100%',
                    maxWidth: { xs: '100%', sm: '95%', md: '90%', lg: '85%' },
                }}
            >
                {/* Contenido principal */}
                <SoftBox mt={2} mb={3}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    borderRadius: { xs: '12px', sm: '16px', md: '20px' },
                                    boxShadow: { xs: '0 4px 16px rgba(0, 0, 0, 0.1)', sm: '0 8px 32px rgba(0, 0, 0, 0.1)' },
                                    border: '1px solid #f0f0f0',
                                    overflow: 'hidden',
                                    width: '100%',
                                    minHeight: { xs: 'auto', sm: '600px', md: '700px' },
                                }}
                            >
                                <CardContent sx={{ padding: 0 }}>
                                    <SoftBox p={{ xs: 2, sm: 3, md: 4 }}>
                                        {/* Header con Gestión de Roles y Nuevo Rol */}
                                        <SoftBox mb={{ xs: 3, sm: 4, md: 5 }} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={{ xs: 1, sm: 2 }}>
                                            {/* Lado izquierdo: Gestión de Roles */}
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftAvatar
                                                    src={role_logo}
                                                    alt="role-image"
                                                    variant="rounded"
                                                    size="xl"
                                                />
                                                <SoftBox>
                                                    <SoftTypography
                                                        variant="h5"
                                                        fontWeight="medium"
                                                        color="#2c3e50"
                                                        sx={{
                                                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                                            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                                                        }}
                                                    >
                                                        Gestión de Roles
                                                    </SoftTypography>
                                                    <SoftTypography variant="button" color="text" fontWeight="medium" opacity={0.8}>
                                                        Administración de roles del sistema {APP_NAME}
                                                    </SoftTypography>
                                                </SoftBox>
                                            </SoftBox>

                                            {/* Lado derecho: Nuevo Rol */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                startIcon={<AddIcon />}
                                                onClick={handleNewRole}
                                                sx={{
                                                    borderRadius: { xs: '6px', sm: '8px', md: '10px' },
                                                    padding: { xs: '8px 16px', sm: '10px 20px', md: '12px 24px' },
                                                    fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                                                    fontWeight: '600',
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: '#1565c0',
                                                        transform: 'translateY(-1px)',
                                                    },
                                                    transition: 'all 0.2s ease',
                                                    '& .MuiSvgIcon-root': {
                                                        fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                                                        width: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                                                        height: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                                                    },
                                                }}
                                            >
                                                Nuevo rol
                                            </Button>
                                        </SoftBox>

                                        {/* Botón Limpiar Filtros */}
                                        {(searchTerm || statusFilter !== "all") && (
                                            <SoftBox mb={3} display="flex" justifyContent="flex-end">
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={clearFilters}
                                                    size="small"
                                                    sx={{
                                                        borderColor: '#6c757d',
                                                        color: '#6c757d',
                                                        borderRadius: '6px',
                                                        padding: '6px 12px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '500',
                                                        '&:hover': {
                                                            borderColor: '#495057',
                                                            backgroundColor: '#f8f9fa',
                                                            transform: 'translateY(-1px)',
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
                                                backgroundColor: '#f8f9fa',
                                                padding: '12px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid #e9ecef'
                                            }}
                                        >
                                            <SoftTypography
                                                variant="body2"
                                                color="text"
                                                sx={{
                                                    fontWeight: '500',
                                                    color: '#495057',
                                                    fontSize: '13px'
                                                }}
                                            >
                                                📊 Mostrando <strong style={{ color: '#1976d2' }}>{filteredRoles.length}</strong> de <strong style={{ color: '#1976d2' }}>{data.length}</strong> roles
                                                {(searchTerm || statusFilter !== "all") && (
                                                    <span style={{ color: '#1976d2', fontWeight: '600' }}> (filtrados)</span>
                                                )}
                                            </SoftTypography>
                                        </SoftBox>

                                        {/* Sección de Búsqueda y Filtros */}
                                        <SoftBox mb={{ xs: 2, sm: 3, md: 4 }}>
                                            <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center">
                                                {/* Barra de Búsqueda */}
                                                <Grid item xs={12} md={8}>
                                                    <SoftBox
                                                        sx={{
                                                            position: "relative",
                                                            "& .MuiInputBase-root": {
                                                                borderRadius: "8px",
                                                                backgroundColor: "#f8f9fa",
                                                                "&:hover": {
                                                                    backgroundColor: "#e9ecef"
                                                                },
                                                                "&.Mui-focused": {
                                                                    backgroundColor: "white",
                                                                    boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Buscar por nombre o descripción del rol..."
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            style={{
                                                                width: "100%",
                                                                padding: "12px 16px",
                                                                border: "1px solid #e0e0e0",
                                                                borderRadius: "8px",
                                                                fontSize: "14px",
                                                                outline: "none",
                                                                backgroundColor: "white",
                                                                transition: "all 0.2s ease"
                                                            }}
                                                            onFocus={(e) => {
                                                                e.target.style.borderColor = "#1976d2";
                                                                e.target.style.boxShadow = "0 0 0 2px rgba(25, 118, 210, 0.1)";
                                                            }}
                                                            onBlur={(e) => {
                                                                e.target.style.borderColor = "#e0e0e0";
                                                                e.target.style.boxShadow = "none";
                                                            }}
                                                        />
                                                    </SoftBox>
                                                </Grid>

                                                {/* Filtro por Estado */}
                                                <Grid item xs={12} md={4}>
                                                    <select
                                                        value={statusFilter}
                                                        onChange={(e) => setStatusFilter(e.target.value)}
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px 14px",
                                                            border: "1px solid #e0e0e0",
                                                            borderRadius: "6px",
                                                            fontSize: "14px",
                                                            backgroundColor: "white",
                                                            cursor: "pointer",
                                                            transition: "all 0.2s ease",
                                                            outline: "none"
                                                        }}
                                                        onFocus={(e) => {
                                                            e.target.style.borderColor = "#1976d2";
                                                            e.target.style.boxShadow = "0 0 0 2px rgba(25, 118, 210, 0.1)";
                                                        }}
                                                        onBlur={(e) => {
                                                            e.target.style.borderColor = "#e0e0e0";
                                                            e.target.style.boxShadow = "none";
                                                        }}
                                                    >
                                                        <option value="all">Todos los estados</option>
                                                        <option value={true}>Activo</option>
                                                        <option value={false}>Inactivo</option>
                                                    </select>
                                                </Grid>
                                            </Grid>
                                        </SoftBox>

                                        {/* Tabla de Roles */}
                                        <MaterialReactTable {...tableOptions} />
                                    </SoftBox>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </SoftBox>
            </Container>

            {/* Panel lateral para crear/editar roles */}
            <SidePanelRight
                open={rolePanel.open}
                onClose={handleRolePanelClose}
                title={rolePanel.mode === "create" ? "Nuevo Rol" : "Editar Rol"}
                subtitle={rolePanel.mode === "create"
                    ? "Crear un nuevo rol en el sistema"
                    : `Editando rol: ${rolePanel.role?.nombre || ""}`
                }
            >
                <RoleDetail
                    role={rolePanel.role}
                    mode={rolePanel.mode}
                    onSave={handleRoleSave}
                    onCancel={handleRolePanelClose}
                    loading={rolePanel.loading}
                />
            </SidePanelRight>

            {/* Alert de confirmación para eliminar rol */}
            <ConfirmAlert
                open={deleteAlert.open}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                severity="error"
                itemName={deleteAlert.role?.nombre}
                showItemName={true}
                itemLabel="Rol"
            />
        </AppPageLayout>
    );
}

export default Roles;





