/* eslint-disable react/prop-types */
/**
=========================================================
* GestiaSoft - Permisos Component
=========================================================
* Página principal para gestionar permisos del sistema
*/

import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Container,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton,
    TextField,
    Chip
} from "@mui/material";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";

// Material React Table v1
import MaterialReactTable from "material-react-table";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import SoftAvatar from "components/SoftAvatar";

// Custom components
import AppPageLayout from "Views/componentsApp/Layouts/AppPageLayout";
import ConfirmAlert from "Views/componentsApp/Alert/ConfirmAlert";
import { SidePanelRight } from "Views/componentsApp/SidePanelRight";
import PermisoDetail from "./PermisoDetail";

// Assets
import permiso_logo from "assets/images/users_logo.png";

function Permisos() {
    // Estados principales
    const [permisos, setPermisos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");

    // Estado para paginación manual (igual que Users)
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // Estados para el panel lateral
    const [permisoPanel, setPermisoPanel] = useState({
        open: false,
        mode: "create",
        permiso: null
    });

    // Estados para alertas
    const [deleteAlert, setDeleteAlert] = useState({
        open: false,
        permiso: null
    });

    // Estados para responsive
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    // Datos de ejemplo (en producción vendrían de la API)
    const permisosData = [
        {
            permiso_id: 1,
            nombre: "Ver",
            descripcion: "Permite visualizar información sin modificarla",
            modulo: "General",
            accion: "leer",
            status: true,
            created_at: "2024-01-15T10:30:00Z",
            created_by: 1,
            updated_at: "2024-01-15T10:30:00Z",
            updated_by: 1
        },
        {
            permiso_id: 2,
            nombre: "Crear",
            descripcion: "Permite crear nuevos registros en el sistema",
            modulo: "General",
            accion: "escribir",
            status: true,
            created_at: "2024-01-15T10:30:00Z",
            created_by: 1,
            updated_at: "2024-01-15T10:30:00Z",
            updated_by: 1
        },
        {
            permiso_id: 3,
            nombre: "Editar",
            descripcion: "Permite modificar registros existentes",
            modulo: "General",
            accion: "editar",
            status: true,
            created_at: "2024-01-15T10:30:00Z",
            created_by: 1,
            updated_at: "2024-01-15T10:30:00Z",
            updated_by: 1
        },
        {
            permiso_id: 4,
            nombre: "Eliminar",
            descripcion: "Permite eliminar registros del sistema",
            modulo: "General",
            accion: "eliminar",
            status: false,
            created_at: "2024-01-15T10:30:00Z",
            created_by: 1,
            updated_at: "2024-01-15T10:30:00Z",
            updated_by: 1
        },
        {
            permiso_id: 5,
            nombre: "Exportar",
            descripcion: "Permite exportar datos a diferentes formatos",
            modulo: "Reportes",
            accion: "exportar",
            status: true,
            created_at: "2024-01-15T10:30:00Z",
            created_by: 1,
            updated_at: "2024-01-15T10:30:00Z",
            updated_by: 1
        }
    ];

    // Cargar datos al montar el componente
    useEffect(() => {
        setPermisos(permisosData);
    }, []);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Filtrar permisos basado en búsqueda y estado (igual que Users)
    const filteredPermisos = useMemo(() => {
        let filtered = permisos || [];

        // Filtro por búsqueda de texto
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(permiso =>
                permiso.nombre?.toLowerCase().includes(searchLower) ||
                permiso.descripcion?.toLowerCase().includes(searchLower) ||
                permiso.modulo?.toLowerCase().includes(searchLower) ||
                permiso.accion?.toLowerCase().includes(searchLower)
            );
        }

        // Filtro por estado
        if (filterStatus !== "all") {
            filtered = filtered.filter(permiso => permiso.status === (filterStatus === "active"));
        }

        return filtered;
    }, [permisos, searchTerm, filterStatus]);

    // Función para obtener solo los permisos de la página actual (igual que Users)
    const paginatedPermisos = useMemo(() => {
        const startIndex = pagination.pageIndex * pagination.pageSize;
        const endIndex = startIndex + pagination.pageSize;
        return filteredPermisos.slice(startIndex, endIndex);
    }, [filteredPermisos, pagination.pageIndex, pagination.pageSize]);

    // Función para limpiar filtros (igual que Users)
    const clearFilters = () => {
        setSearchTerm("");
        setFilterStatus("all");
    };

    // Handlers para CRUD
    const handleCreatePermiso = () => {
        setPermisoPanel({
            open: true,
            mode: "create",
            permiso: null
        });
    };

    const handleEditPermiso = (permiso) => {
        setPermisoPanel({
            open: true,
            mode: "edit",
            permiso: permiso
        });
    };

    const handleDeletePermiso = (permiso) => {
        setDeleteAlert({
            open: true,
            permiso: permiso
        });
    };

    const handleSavePermiso = async (permisoData) => {
        setLoading(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (permisoPanel.mode === "create") {
                // Crear nuevo permiso
                const newPermiso = {
                    ...permisoData,
                    permiso_id: Math.max(...permisos.map(p => p.permiso_id)) + 1,
                    created_at: new Date().toISOString(),
                    created_by: 1,
                    updated_at: new Date().toISOString(),
                    updated_by: 1
                };
                setPermisos(prev => [...prev, newPermiso]);
            } else {
                // Actualizar permiso existente
                setPermisos(prev => prev.map(p =>
                    p.permiso_id === permisoData.permiso_id
                        ? { ...p, ...permisoData, updated_at: new Date().toISOString(), updated_by: 1 }
                        : p
                ));
            }

            setPermisoPanel({ open: false, mode: "create", permiso: null });
        } catch (error) {
            console.error("Error al guardar permiso:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteAlert.permiso) return;

        setLoading(true);

        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));

            setPermisos(prev => prev.filter(p => p.permiso_id !== deleteAlert.permiso.permiso_id));
            setDeleteAlert({ open: false, permiso: null });
        } catch (error) {
            console.error("Error al eliminar permiso:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleClosePanel = () => {
        setPermisoPanel({ open: false, mode: "create", permiso: null });
    };

    // Columnas para la tabla con proporciones mejoradas
    const columns = [
        {
            accessorKey: "permiso_id",
            header: "ID",
            size: 80,
            Cell: ({ cell }) => (
                <SoftBadge
                    color="info"
                    variant="contained"
                    size="sm"
                    sx={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        border: "1px solid #bbdefb"
                    }}
                >
                    #{cell.getValue()}
                </SoftBadge>
            )
        },
        {
            accessorKey: "nombre",
            header: "Nombre",
            size: 180,
            Cell: ({ cell }) => (
                <SoftTypography variant="body2" fontWeight="medium" color="text">
                    {cell.getValue()}
                </SoftTypography>
            )
        },
        {
            accessorKey: "descripcion",
            header: "Descripción",
            size: 300,
            Cell: ({ cell }) => (
                <SoftTypography variant="body2" color="text.secondary" sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "280px"
                }}>
                    {cell.getValue()}
                </SoftTypography>
            )
        },
        {
            accessorKey: "modulo",
            header: "Módulo",
            size: 140,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue()}
                    size="small"
                    sx={{
                        backgroundColor: "#f3e5f5",
                        color: "#7b1fa2",
                        fontWeight: "medium",
                        fontSize: "0.75rem"
                    }}
                />
            )
        },
        {
            accessorKey: "accion",
            header: "Acción",
            size: 140,
            Cell: ({ cell }) => (
                <Chip
                    label={cell.getValue()}
                    size="small"
                    sx={{
                        backgroundColor: "#e8f5e8",
                        color: "#2e7d32",
                        fontWeight: "medium",
                        fontSize: "0.75rem"
                    }}
                />
            )
        },
        {
            accessorKey: "status",
            header: "Estado",
            size: 120,
            Cell: ({ cell }) => (
                <SoftBadge
                    color={cell.getValue() ? "success" : "error"}
                    variant="contained"
                    size="sm"
                    sx={{
                        backgroundColor: cell.getValue() ? "#e8f5e8" : "#ffebee",
                        color: cell.getValue() ? "#2e7d32" : "#c62828",
                        fontSize: "0.75rem",
                        fontWeight: "medium",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        border: `1px solid ${cell.getValue() ? "#c8e6c9" : "#ffcdd2"}`
                    }}
                >
                    {cell.getValue() ? "Activo" : "Inactivo"}
                </SoftBadge>
            )
        },
        {
            accessorKey: "created_at",
            header: "Creado",
            size: 140,
            Cell: ({ cell }) => (
                <SoftTypography variant="caption" color="text.secondary">
                    {new Date(cell.getValue()).toLocaleDateString('es-ES')}
                </SoftTypography>
            )
        },
        {
            accessorKey: "updated_at",
            header: "Actualizado",
            size: 140,
            Cell: ({ cell }) => (
                <SoftTypography variant="caption" color="text.secondary">
                    {cell.getValue() ? new Date(cell.getValue()).toLocaleDateString('es-ES') : "N/A"}
                </SoftTypography>
            )
        },
        {
            id: "actions",
            header: "Acciones",
            size: 120,
            Cell: ({ row }) => (
                <SoftBox display="flex" gap={1}>
                    <IconButton
                        size="small"
                        onClick={() => handleEditPermiso(row.original)}
                        sx={{
                            color: "#1976d2",
                            backgroundColor: "#e3f2fd",
                            "&:hover": {
                                backgroundColor: "#bbdefb",
                                transform: "scale(1.1)"
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={() => handleDeletePermiso(row.original)}
                        sx={{
                            color: "#d32f2f",
                            backgroundColor: "#ffebee",
                            "&:hover": {
                                backgroundColor: "#ffcdd2",
                                transform: "scale(1.1)"
                            },
                            transition: "all 0.2s ease"
                        }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </SoftBox>
            )
        }
    ];

    // Configuración de la tabla (igual que Users)
    const tableOptions = {
        columns,
        data: paginatedPermisos, // Usar permisos paginados en lugar de todos los permisos
        enableColumnFiltering: false, // Deshabilitar filtros de columna ya que tenemos filtros personalizados
        enableDensityToggle: true,
        enableFullScreenToggle: true,
        enableColumnResizing: true,
        enableColumnOrdering: true,
        enableRowSelection: false,
        enablePagination: false, // Deshabilitar paginación automática
        enableSorting: true,
        enableGlobalFilter: false, // Deshabilitar filtro global ya que tenemos búsqueda personalizada
        enableColumnPinning: true,
        enableRowActions: false,
        // Configuración de paginación controlada
        manualPagination: true,
        rowCount: filteredPermisos.length,
        onPaginationChange: setPagination,
        state: { pagination },
        muiTableProps: {
            sx: {
                tableLayout: "fixed",
                width: "100%",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                border: "1px solid #e0e0e0",
                "& .MuiTable-root": {
                    borderCollapse: "separate",
                    borderSpacing: 0,
                },
                "& .MuiTableBody-root": {
                    "& .MuiTableRow-root": {
                        height: "auto",
                        minHeight: "56px",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                            backgroundColor: "#f8f9fa",
                        },
                        "&:nth-of-type(even)": {
                            backgroundColor: "#fafbfc",
                        }
                    }
                }
            }
        },
        muiTableHeadCellProps: {
            sx: {
                fontWeight: "bold",
                backgroundColor: "#1976d2",
                color: "#ffffff",
                padding: { xs: "12px 8px", sm: "16px 12px", md: "20px 16px" },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                borderBottom: "2px solid #1565c0",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
                "&:first-of-type": {
                    borderTopLeftRadius: "12px",
                },
                "&:last-of-type": {
                    borderTopRightRadius: "12px",
                }
            }
        },
        muiTableBodyCellProps: {
            sx: {
                padding: { xs: "8px 6px", sm: "12px 8px", md: "16px 12px" },
                fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                borderBottom: "1px solid #f0f0f0",
                verticalAlign: "middle",
                color: "#2c3e50",
                fontWeight: "500",
            }
        },
        // Configuración completa de paginación (igual que Users)
        muiTablePaginationProps: {
            // Personalizar el texto "Rows per page"
            labelRowsPerPage: "Mostrar:",

            // Personalizar el texto de información de página
            labelDisplayedRows: ({ from, to, count }) =>
                `${from}-${to} de ${count}`,

            // Opciones de filas por página
            rowsPerPageOptions: [5, 10, 25, 50],

            // Estilos personalizados
            sx: {
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                padding: "6px 4px",
                "& .MuiTablePagination-selectLabel": {
                    fontSize: "0.875rem",
                    color: "#495057",
                    fontWeight: "500"
                },
                "& .MuiTablePagination-displayedRows": {
                    fontSize: "0.875rem",
                    color: "#495057",
                    fontWeight: "500"
                }
            }
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
                {/* Contenido principal */}
                <SoftBox mt={2} mb={3}>
                    <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}>
                        <Grid item xs={12}>
                            <Card
                                sx={{
                                    borderRadius: { xs: "12px", sm: "16px", md: "20px" },
                                    boxShadow: { xs: "0 4px 16px rgba(0, 0, 0, 0.1)", sm: "0 8px 32px rgba(0, 0, 0, 0.1)" },
                                    border: "1px solid #f0f0f0",
                                    overflow: "hidden",
                                    width: "100%",
                                    minHeight: { xs: "auto", sm: "600px", md: "700px" },
                                }}
                            >
                                <CardContent sx={{ padding: 0 }}>
                                    <SoftBox p={{ xs: 2, sm: 3, md: 4 }}>
                                        {/* Header con Gestión de Permisos y Nuevo Permiso */}
                                        <SoftBox mb={{ xs: 3, sm: 4, md: 5 }} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={{ xs: 1, sm: 2 }}>
                                            {/* Lado izquierdo: Gestión de Permisos */}
                                            <SoftBox display="flex" alignItems="center" gap={2}>
                                                <SoftAvatar
                                                    src={permiso_logo}
                                                    alt="permisos-image"
                                                    variant="rounded"
                                                    size="xl"
                                                />
                                                <SoftBox>
                                                    <SoftTypography
                                                        variant="h5"
                                                        fontWeight="medium"
                                                        color="#2c3e50"
                                                        sx={{
                                                            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                                                            lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                                                        }}
                                                    >
                                                        Gestión de Permisos
                                                    </SoftTypography>
                                                    <SoftTypography variant="button" color="text" fontWeight="medium" opacity={0.8}>
                                                        Administración de permisos del sistema
                                                    </SoftTypography>
                                                </SoftBox>
                                            </SoftBox>

                                            {/* Lado derecho: Nuevo Permiso */}
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                startIcon={<AddIcon />}
                                                onClick={handleCreatePermiso}
                                                sx={{
                                                    borderRadius: { xs: "6px", sm: "8px", md: "10px" },
                                                    padding: { xs: "8px 16px", sm: "10px 20px", md: "12px 24px" },
                                                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                                                    fontWeight: "600",
                                                    textTransform: "none",
                                                    "&:hover": {
                                                        backgroundColor: "#1565c0",
                                                        transform: "translateY(-1px)",
                                                    },
                                                    transition: "all 0.2s ease",
                                                    "& .MuiSvgIcon-root": {
                                                        fontSize: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                                                        width: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                                                        height: { xs: "1rem", sm: "1.2rem", md: "1.4rem" },
                                                    },
                                                }}
                                            >
                                                Nuevo Permiso
                                            </Button>
                                        </SoftBox>

                                        {/* Botón Limpiar Filtros */}
                                        {(searchTerm || filterStatus !== "all") && (
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
                                                📊 Mostrando <strong style={{ color: '#1976d2' }}>{filteredPermisos.length}</strong> de <strong style={{ color: '#1976d2' }}>{permisos.length}</strong> permisos
                                                {(searchTerm || filterStatus !== "all") && (
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
                                                            placeholder="Buscar por nombre, descripción, módulo o acción del permiso..."
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
                                                        value={filterStatus}
                                                        onChange={(e) => setFilterStatus(e.target.value)}
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
                                                        <option value="active">Activo</option>
                                                        <option value="inactive">Inactivo</option>
                                                    </select>
                                                </Grid>
                                            </Grid>
                                        </SoftBox>

                                        {/* Tabla de permisos */}
                                        <MaterialReactTable {...tableOptions} />
                                    </SoftBox>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </SoftBox>
            </Container>

            {/* Panel lateral para crear/editar */}
            <SidePanelRight
                open={permisoPanel.open}
                onClose={handleClosePanel}
                title={permisoPanel.mode === "create" ? "Crear Nuevo Permiso" : "Editar Permiso"}
                width={isMobile ? "100%" : isTablet ? "70%" : "50%"}
            >
                <PermisoDetail
                    permiso={permisoPanel.permiso}
                    mode={permisoPanel.mode}
                    onSave={handleSavePermiso}
                    onCancel={handleClosePanel}
                    loading={loading}
                />
            </SidePanelRight>

            {/* Alerta de confirmación para eliminar */}
            <ConfirmAlert
                open={deleteAlert.open}
                title="Eliminar Permiso"
                message={`¿Estás seguro de que quieres eliminar el permiso "${deleteAlert.permiso?.nombre}"? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteAlert({ open: false, permiso: null })}
                loading={loading}
            />
        </AppPageLayout>
    );
}

export default Permisos;
