/**
=========================================================
* GestiaSoft - Users Page
=========================================================
* Simple users page for managing system users
*/

import React, { useState, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

// Custom hooks
import { useUsers } from "hooks/useUsers";
import useUtilityLists from "hooks/useUtilityLists";

// Global Configuration
import { APP_NAME, APP_DESCRIPTION } from "config/appConfig";

// @mui material components
import {
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  AppBar,
  Tabs,
  Tab,
  Icon
} from "@mui/material";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Soft UI Dashboard PRO React icons
import Cube from "examples/Icons/Cube";
import Document from "examples/Icons/Document";
import Settings from "examples/Icons/Settings";


// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftAvatar from "components/SoftAvatar";
import { AppNotification } from "Views/componentsApp/Alert";

// Soft UI Dashboard PRO React example components
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Soft UI Dashboard PRO React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Custom App Layout
import { AppPageLayout, ConfirmAlert, SidePanelRight } from "Views/componentsApp";

// Material React Table v1
import { MaterialReactTable } from "material-react-table";

// User Detail Component
import UserDetail from "./UserDetail";

// Images 
import user_logo from "assets/images/users_logo.png";
import curved0 from "assets/images/curved-images/curved0.jpg";

function Users() {


  // Estado para manejar la responsividad
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // Estado para el alert de confirmación
  const [deleteAlert, setDeleteAlert] = useState({
    open: false,
    user: null
  });

  // Estado para el panel lateral de usuario
  const [userPanel, setUserPanel] = useState({
    open: false,
    mode: "create", // "create" o "edit"
    user: null,
    loading: false
  });

  // Estado para las pestañas
  const [tabValue, setTabValue] = useState(0);
  const [tabsOrientation, setTabsOrientation] = useState("vertical");

  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el filtro de estado
  const [statusFilter, setStatusFilter] = useState("all");
  // Estado para el filtro de departamento
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Estado para el snackbar de error de timeout
  const [errorSnackbar, setErrorSnackbar] = useState({
    open: false,
    message: ""
  });

  // Estado para evitar mostrar el mismo error múltiples veces
  const [lastErrorShown, setLastErrorShown] = useState("");
  // Estado para el número de filas por página
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // Estado para controlar la paginación de la tabla
  const [pagination, setPagination] = useState({
    pageIndex: 0,  // ← Cambiar de 5 a 0 para empezar en la primera página
    pageSize: 5,   // ← Mantener en 5 para mostrar solo 5 usuarios inicialmente
  });

  // Hook para gestión de usuarios con la nueva API
  const {
    users: rawData,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserDetail
  } = useUsers();

  // Custom hook para listas utilitarias (roles, grupos, unidades)
  const {
    roles: rolesOptions,
    groups: groupsOptions,
    units: unitsOptions,
    listsLoading,
    listsError
  } = useUtilityLists();

  // Debug: verificar que las opciones se cargan correctamente
  console.log("Users - rolesOptions:", rolesOptions);
  console.log("Users - groupsOptions:", groupsOptions);
  console.log("Users - unitsOptions:", unitsOptions);
  console.log("Users - listsLoading:", listsLoading);
  console.log("Users - listsError:", listsError);
  console.log("Users - ¿groupsOptions es array?:", Array.isArray(groupsOptions));
  console.log("Users - ¿groupsOptions tiene datos?:", groupsOptions?.length > 0);

  // Estado de carga general - true si cualquier hook está cargando
  const isAnyLoading = listsLoading?.roles || listsLoading?.groups || listsLoading?.units;
  const isLoadingComplete = !isAnyLoading && rolesOptions.length > 0 && groupsOptions.length > 0 && unitsOptions.length > 0;


  // Funciones para mapear códigos a nombres
  const mapCodeToName = (code, options) => {
    if (!code || !options || options.length === 0) return code;

    const codeStr = code.toString();
    const option = options.find(opt =>
      opt.value === codeStr ||
      opt.value === code ||
      opt.label === codeStr
    );

    return option ? option.label : code;
  };

  const mapCodesToNames = (codes, options) => {
    if (!codes || !options || options.length === 0) return codes;

    if (Array.isArray(codes)) {
      return codes.map(code => mapCodeToName(code, options));
    }

    return mapCodeToName(codes, options);
  };

  // Asegurar que data sea siempre un array
  const data = Array.isArray(rawData) ? rawData : [];

  // Debug: ver qué datos llegan
  console.log("Raw data from API:", rawData);
  console.log("Processed data:", data);
  console.log("Sample user data:", data[0]); // Ver la estructura del primer usuario

  // Debug específico para grupos y roles
  if (data && data.length > 0) {
    console.log("Primer usuario completo:", data[0]);
    console.log("Grupos del primer usuario:", data[0].grupos);
    console.log("Roles del primer usuario:", data[0].roles);
    console.log("Tipo de grupos:", typeof data[0].grupos);
    console.log("Es array grupos:", Array.isArray(data[0].grupos));
    console.log("Tipo de roles:", typeof data[0].roles);
    console.log("Es array roles:", Array.isArray(data[0].roles));
  }

  // Debug específico para verificar el mapeo
  console.log("=== DEBUG MAPEO ===");
  console.log("rolesOptions.length:", rolesOptions?.length);
  console.log("groupsOptions.length:", groupsOptions?.length);
  console.log("unitsOptions.length:", unitsOptions?.length);
  if (data && data.length > 0) {
    console.log("Primer usuario grupos:", data[0].grupos);
    console.log("Primer usuario roles:", data[0].roles);
    console.log("Primer usuario unidades:", data[0].unidad || data[0].unidades);
  }

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 600);
      setIsTablet(width <= 768);
      // Usar breakpoints estándar de la plantilla
      setTabsOrientation(width < breakpoints.values.sm ? "vertical" : "horizontal");
    };

    // Configuración inicial
    handleResize();

    // Agregar event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    console.log("Cargando usuarios...");
    fetchUsers();
  }, [fetchUsers]);

  // Función para filtrar usuarios por búsqueda y filtros
  const filteredUsers = useMemo(() => {
    let filtered = data || [];

    // Filtro por búsqueda de texto
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.usuario?.nombre?.toLowerCase().includes(searchLower) ||
        user.usuario?.email?.toLowerCase().includes(searchLower) ||
        user.grupos?.some(grupo => grupo.toLowerCase().includes(searchLower)) ||
        user.roles?.some(rol => rol.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter(user => user.usuario?.status === (statusFilter === "true"));
    }

    // Filtro por departamento (ahora filtro por grupos)
    if (departmentFilter !== "all") {
      filtered = filtered.filter(user =>
        user.grupos?.some(grupo => grupo === departmentFilter)
      );
    }

    return filtered;
  }, [data, searchTerm, statusFilter, departmentFilter]);

  // Obtener grupos únicos para el filtro
  const uniqueDepartments = useMemo(() => {
    if (!data) return [];
    const allGroups = data.flatMap(user => user.grupos || []);
    const uniqueGroups = [...new Set(allGroups)];
    return uniqueGroups.filter(group => group); // Filtrar valores undefined/null
  }, [data]);

  // Función para obtener solo los usuarios de la página actual
  const paginatedUsers = useMemo(() => {
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, pagination.pageIndex, pagination.pageSize]);

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

  // Efecto para actualizar la paginación cuando cambie el número de filas por página
  useEffect(() => {
    setPagination({
      pageIndex: 0,
      pageSize: rowsPerPage,
    });
  }, [rowsPerPage]);

  // Función para manejar cambios en las pestañas
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  // Funciones para manejar el alert de confirmación
  const handleDeleteClick = (user) => {
    setDeleteAlert({
      open: true,
      user: user
    });
  };

  const handleDeleteConfirm = async () => {
    if (deleteAlert.user) {
      try {
        await deleteUser(deleteAlert.user.usuario.usuario_id);
        setDeleteAlert({ open: false, user: null });
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteAlert({ open: false, user: null });
  };

  // Funciones para manejar el snackbar de error
  const openErrorSnackbar = useCallback((message) => {
    setErrorSnackbar({
      open: true,
      message: message
    });
  }, []);

  const closeErrorSnackbar = useCallback(() => {
    setErrorSnackbar({
      open: false,
      message: ""
    });
    setLastErrorShown(""); // Limpiar el último error mostrado
  }, []);

  // Efecto para detectar errores de timeout y mostrar snackbar
  useEffect(() => {
    if (error && error.message !== lastErrorShown) {
      console.log("Users - Error detectado:", error);

      let errorMessage = "";

      // Verificar si es un error de timeout
      if (error.message && error.message.includes("timeout")) {
        errorMessage = "Error de conexión: Tiempo de espera agotado. Verifique su conexión a internet.";
      } else if (error.message && error.message.includes("Network Error")) {
        errorMessage = "Error de red: No se puede conectar al servidor. Verifique su conexión.";
      } else {
        errorMessage = `Error: ${error.message || "Ha ocurrido un error inesperado"}`;
      }

      // Solo mostrar el snackbar si es un error diferente
      if (errorMessage !== lastErrorShown) {
        openErrorSnackbar(errorMessage);
        setLastErrorShown(errorMessage);
      }
    }
  }, [error, openErrorSnackbar, lastErrorShown]);

  // Funciones para manejar el panel lateral de usuario
  const handleNewUser = () => {
    setUserPanel({
      open: true,
      mode: "create",
      user: null,
      loading: false
    });
  };

  const handleEditUser = (user) => {
    // Función para convertir códigos a objetos { value, label }
    const convertCodesToObjects = (codes, options) => {
      if (!codes || !Array.isArray(codes)) return [];

      return codes.map(code => {
        // Buscar el nombre correspondiente en las opciones
        const option = options.find(opt =>
          opt.value === code ||
          opt.value === code.toString() ||
          opt.label === code
        );

        return {
          value: code.toString(),
          label: option ? option.label : code.toString()
        };
      });
    };

    // Combinar datos del usuario con roles, grupos y unidades convertidos a objetos
    const userData = {
      ...user.usuario,
      roles: convertCodesToObjects(user.roles, rolesOptions),
      grupos: convertCodesToObjects(user.grupos, groupsOptions),
      unidades: convertCodesToObjects(user.Unidades || user.unidades || user.unidad, unitsOptions)
    };

    console.log("handleEditUser - Datos originales del usuario:", user);
    console.log("handleEditUser - Datos combinados:", userData);

    setUserPanel({
      open: true,
      mode: "edit",
      user: userData,
      loading: false
    });
  };

  const handleUserPanelClose = () => {
    setUserPanel({
      open: false,
      mode: "create",
      user: null,
      loading: false
    });
  };

  const handleUserSave = async (userData) => {
    setUserPanel(prev => ({ ...prev, loading: true }));

    try {
      if (userPanel.mode === "create") {
        // Crear nuevo usuario usando la nueva API
        await createUser(userData);
      } else {
        // Actualizar usuario existente usando la nueva API
        await updateUser(userData.usuario_id, userData);
      }

      handleUserPanelClose();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    } finally {
      setUserPanel(prev => ({ ...prev, loading: false }));
    }
  };

  // Funciones de renderizado personalizado con PropTypes
  const StatusCell = ({ cell }) => (
    <span
      style={{
        backgroundColor: cell.getValue() === "Activo" ? "#4caf50" : "#f44336",
        color: "white",
        padding: "4px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold"
      }}
    >
      {cell.getValue()}
    </span>
  );

  StatusCell.propTypes = {
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
          color: "dark",
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

  const BooleanCell = ({ cell }) => (
    <span
      style={{
        backgroundColor: cell.getValue() ? "#4caf50" : "#f44336",
        color: "white",
        padding: "2px 6px",
        borderRadius: "12px",
        fontSize: "10px",
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.3px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
        display: "inline-block",
        minWidth: "50px",
        textAlign: "center",
        textShadow: "0 1px 1px rgba(0, 0, 0, 0.3)"
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

  const ActionsCell = ({ row }) => (
    <div style={{
      display: 'flex',
      gap: '4px',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      <IconButton
        size="small"
        color="primary"
        onClick={() => handleEditUser(row.original)}
        sx={{
          backgroundColor: '#e3f2fd',
          color: 'primary.main',
          width: '24px',
          height: '24px',
          '&:hover': {
            backgroundColor: '#bbdefb',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(25, 118, 210, 0.2)',
          '& .MuiSvgIcon-root': {
            fontSize: '14px'
          }
        }}
      >
        <EditIcon />
      </IconButton>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDeleteClick(row.original)}
        sx={{
          backgroundColor: '#ffebee',
          color: 'error.main',
          width: '24px',
          height: '24px',
          '&:hover': {
            backgroundColor: '#ffcdd2',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(211, 47, 47, 0.2)',
          '& .MuiSvgIcon-root': {
            fontSize: '14px'
          }
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

  // Función para renderizar grupos como tags interactivos
  const GruposCell = ({ cell }) => {
    const grupos = cell.getValue();
    console.log("GruposCell - grupos:", grupos); // Debug
    console.log("GruposCell - tipo:", typeof grupos); // Debug
    console.log("GruposCell - es array:", Array.isArray(grupos)); // Debug

    // Manejar diferentes tipos de datos
    let gruposArray = [];
    if (Array.isArray(grupos)) {
      gruposArray = grupos;
    } else if (typeof grupos === 'string') {
      // Si es string, intentar parsear como JSON
      try {
        const parsed = JSON.parse(grupos);
        gruposArray = Array.isArray(parsed) ? parsed : [grupos];
      } catch {
        gruposArray = [grupos];
      }
    } else if (grupos) {
      gruposArray = [grupos];
    }

    if (!gruposArray || gruposArray.length === 0) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          border: '1px dashed #ccc'
        }}>
          <span style={{
            color: 'text.secondary',
            fontSize: '11px',
            fontStyle: 'italic',
            fontWeight: '400'
          }}>
            Sin grupos asignados
          </span>
        </div>
      );
    }

    // Mapear códigos a nombres usando las opciones disponibles
    const gruposConNombres = mapCodesToNames(gruposArray, groupsOptions);

    // Debug específico para diagnosticar el problema
    if (gruposArray.length > 0 && groupsOptions.length > 0) {
      console.log("🔍 DIAGNÓSTICO GRUPOS:");
      console.log("  - Códigos originales:", gruposArray);
      console.log("  - Opciones disponibles:", groupsOptions);
      console.log("  - Resultado mapeado:", gruposConNombres);
      console.log("  - ¿Son iguales?", gruposArray === gruposConNombres);
    }

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxWidth: '200px',
        alignItems: 'flex-start'
      }}>
        {gruposConNombres.map((grupo, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#e8f5e8',
              color: 'success.main',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600',
              border: '1px solid #c8e6c9',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '20px',
              maxWidth: '120px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d4edda';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#e8f5e8';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            }}
            title={`Grupo: ${String(grupo)}`} // Tooltip con el nombre completo
          >
            <span style={{
              fontSize: '10px',
              lineHeight: '1.2',
              textAlign: 'center'
            }}>
              {String(grupo)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  GruposCell.propTypes = {
    cell: PropTypes.shape({
      getValue: PropTypes.func.isRequired
    }).isRequired
  };

  // Función para renderizar roles como tags
  // Función para renderizar roles como tags interactivos
  const RolesCell = ({ cell }) => {
    const roles = cell.getValue();
    console.log("RolesCell - roles:", roles); // Debug
    console.log("RolesCell - tipo:", typeof roles); // Debug
    console.log("RolesCell - es array:", Array.isArray(roles)); // Debug

    // Manejar diferentes tipos de datos
    let rolesArray = [];
    if (Array.isArray(roles)) {
      rolesArray = roles;
    } else if (typeof roles === 'string') {
      // Si es string, intentar parsear como JSON
      try {
        const parsed = JSON.parse(roles);
        rolesArray = Array.isArray(parsed) ? parsed : [roles];
      } catch {
        rolesArray = [roles];
      }
    } else if (roles) {
      rolesArray = [roles];
    }

    if (!rolesArray || rolesArray.length === 0) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          border: '1px dashed #ccc'
        }}>
          <span style={{
            color: 'text.secondary',
            fontSize: '11px',
            fontStyle: 'italic',
            fontWeight: '400'
          }}>
            Sin roles asignados
          </span>
        </div>
      );
    }

    // Mapear códigos a nombres usando las opciones disponibles
    const rolesConNombres = mapCodesToNames(rolesArray, rolesOptions);

    // Debug específico para diagnosticar el problema
    if (rolesArray.length > 0 && rolesOptions.length > 0) {
      console.log("🔍 DIAGNÓSTICO ROLES:");
      console.log("  - Códigos originales:", rolesArray);
      console.log("  - Opciones disponibles:", rolesOptions);
      console.log("  - Resultado mapeado:", rolesConNombres);
      console.log("  - ¿Son iguales?", rolesArray === rolesConNombres);
    }

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxWidth: '200px',
        alignItems: 'flex-start'
      }}>
        {rolesConNombres.map((rol, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#fff3e0',
              color: 'warning.main',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '10px',
              fontWeight: '600',
              border: '1px solid #ffcc02',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '20px',
              maxWidth: '120px',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffe0b2';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fff3e0';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
            }}
            title={`Rol: ${String(rol)}`} // Tooltip con el nombre completo
          >
            <span style={{
              fontSize: '10px',
              lineHeight: '1.2',
              textAlign: 'center'
            }}>
              {String(rol)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  RolesCell.propTypes = {
    cell: PropTypes.shape({
      getValue: PropTypes.func.isRequired
    }).isRequired
  };

  // Función para renderizar unidades como tags
  // Función para renderizar unidades como tags interactivos
  const UnidadCell = ({ cell, row }) => {
    // Obtener unidades: primero intentar desde cell.getValue() (si usa accessorFn)
    // luego desde row.original (manejar diferentes formatos del API)
    const unidades = cell.getValue() || row.original.Unidades || row.original.unidades || row.original.unidad;
    console.log("UnidadCell - unidades:", unidades); // Debug
    console.log("UnidadCell - tipo:", typeof unidades); // Debug
    console.log("UnidadCell - es array:", Array.isArray(unidades)); // Debug
    console.log("UnidadCell - row.original completo:", row.original); // Debug

    // Manejar diferentes tipos de datos
    let unidadesArray = [];
    if (Array.isArray(unidades)) {
      unidadesArray = unidades;
    } else if (typeof unidades === 'string') {
      // Si es string, intentar parsear como JSON
      try {
        const parsed = JSON.parse(unidades);
        unidadesArray = Array.isArray(parsed) ? parsed : [unidades];
      } catch {
        unidadesArray = [unidades];
      }
    } else if (unidades) {
      unidadesArray = [unidades];
    }

    if (!unidadesArray || unidadesArray.length === 0) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '8px 12px',
          backgroundColor: '#f5f5f5',
          borderRadius: '16px',
          border: '1px dashed #ccc'
        }}>
          <span style={{
            color: 'text.secondary',
            fontSize: '11px',
            fontStyle: 'italic',
            fontWeight: '400'
          }}>
            Sin unidades asignadas
          </span>
        </div>
      );
    }

    // Mapear códigos a nombres usando las opciones disponibles
    const unidadesConNombres = mapCodesToNames(unidadesArray, unitsOptions);

    // Debug específico para diagnosticar el problema
    if (unidadesArray.length > 0 && unitsOptions.length > 0) {
      console.log("🔍 DIAGNÓSTICO UNIDADES:");
      console.log("  - Códigos originales:", unidadesArray);
      console.log("  - Opciones disponibles:", unitsOptions);
      console.log("  - Resultado mapeado:", unidadesConNombres);
      console.log("  - ¿Son iguales?", unidadesArray === unidadesConNombres);
    }

    return (
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px',
        maxWidth: '250px',
        alignItems: 'flex-start'
      }}>
        {unidadesConNombres.map((unidad, index) => {
          const unidadTexto = String(unidad);
          const esTextoLargo = unidadTexto.length > 25;

          return (
            <div
              key={index}
              style={{
                backgroundColor: '#e3f2fd',
                color: '#1565c0',
                padding: '6px 10px',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: '600',
                border: '1px solid #bbdefb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '24px',
                maxWidth: esTextoLargo ? '200px' : '150px',
                wordBreak: 'break-word',
                whiteSpace: esTextoLargo ? 'normal' : 'nowrap',
                overflow: esTextoLargo ? 'visible' : 'hidden',
                textOverflow: esTextoLargo ? 'clip' : 'ellipsis',
                position: 'relative',
                lineHeight: '1.3'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#bbdefb';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.15)';
                e.currentTarget.style.zIndex = '10';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#e3f2fd';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.1)';
                e.currentTarget.style.zIndex = '1';
              }}
              title={`Unidad: ${unidadTexto}`}
            >
              <span style={{
                fontSize: '10px',
                lineHeight: '1.3',
                textAlign: 'center',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {unidadTexto}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  UnidadCell.propTypes = {
    cell: PropTypes.shape({
      getValue: PropTypes.func
    }),
    row: PropTypes.shape({
      original: PropTypes.object.isRequired
    }).isRequired
  };

  // Configuración de columnas para Material React Table v1
  const columns = useMemo(
    () => [
      {
        accessorKey: "usuario.usuario_id",
        header: "ID",
        size: 30,
        minSize: 25,
        maxSize: 40,
        enableColumnFilter: false,
        enableSorting: true,
        enableResizing: false,
        initialState: {
          hidden: true
        }
      },
      {
        accessorKey: "usuario.nombre",
        header: "Nombre",
        size: 100,
        minSize: 80,
        maxSize: 120,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
      },
      {
        accessorKey: "usuario.email",
        header: "Email",
        size: 120,
        minSize: 100,
        maxSize: 140,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
      },
      {
        accessorKey: "grupos",
        header: "Grupos",
        size: 80,
        minSize: 70,
        maxSize: 100,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
        Cell: GruposCell
      },
      {
        accessorKey: "roles",
        header: "Roles",
        size: 80,
        minSize: 70,
        maxSize: 100,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
        Cell: RolesCell
      },
      {
        accessorFn: (row) => row.Unidades || row.unidades || row.unidad,
        header: "Unidades",
        id: "unidades",
        size: 100,
        minSize: 80,
        maxSize: 120,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
        Cell: UnidadCell
      },
      {
        accessorKey: "usuario.status",
        header: "Estado",
        size: 60,
        minSize: 50,
        maxSize: 70,
        enableColumnFilter: true,
        enableSorting: true,
        enableResizing: false,
        Cell: BooleanCell,
      },
      {
        accessorKey: "usuario.created_at",
        id: "created_at",
        header: "Fecha",
        size: 120,
        minSize: 100,
        maxSize: 140,
        enableColumnFilter: false,
        enableSorting: true,
        enableResizing: false,
        Cell: DateCell,
        initialState: {
          hidden: true
        },
        visible: false
      },
      {
        accessorKey: "usuario.created_by",
        id: "created_by",
        header: "Creado",
        size: 60,
        minSize: 50,
        maxSize: 70,
        enableColumnFilter: false,
        enableSorting: true,
        enableResizing: false,
        initialState: {
          hidden: true
        },
        visible: false
      },
      {
        accessorKey: "usuario.updated_at",
        id: "updated_at",
        header: "Actualizado",
        size: 100,
        minSize: 80,
        maxSize: 120,
        enableColumnFilter: false,
        enableSorting: true,
        enableResizing: false,
        Cell: DateCell,
        initialState: {
          hidden: true
        },
        visible: false
      },
      {
        accessorKey: "usuario.updated_by",
        id: "updated_by",
        header: "Actualizado",
        size: 60,
        minSize: 50,
        maxSize: 70,
        enableColumnFilter: false,
        enableSorting: true,
        enableResizing: false,
        visible: false,
        initialState: {
          hidden: true
        }
      },
      {
        accessorKey: "actions",
        header: "⚙️",
        size: 50,
        minSize: 40,
        maxSize: 60,
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
    data: paginatedUsers, // ← Usar usuarios paginados en lugar de todos los usuarios
    enableColumnFilters: false, // Deshabilitar filtros de columna ya que tenemos filtros personalizados
    enableDensityToggle: true,
    enableFullScreenToggle: true,
    enableColumnResizing: true,
    enableColumnOrdering: true,
    enableRowSelection: false,
    enablePagination: false,
    enableSorting: true,
    enableGlobalFilter: false, // Deshabilitar filtro global ya que tenemos búsqueda personalizada
    enableColumnPinning: true,
    enableRowActions: false,
    // Configuración de paginación controlada
    manualPagination: true,
    rowCount: filteredUsers.length,
    onPaginationChange: setPagination,
    state: { pagination },
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
        '& .MuiTable-root': {
          borderCollapse: 'separate',
          borderSpacing: 0,
        },
        '& .MuiTableBody-root': {
          '& .MuiTableRow-root': {
            height: 'auto',
            minHeight: '32px',
            transition: 'background-color 0.2s ease',
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
            '&:nth-of-type(even)': {
              backgroundColor: '#fafbfc',
            }
          }
        },
        // Hacer la tabla más compacta
        '& .MuiTable-root': {
          minWidth: 'auto',
          tableLayout: 'fixed'
        },
        // Ajustar el contenedor principal
        '& .MuiTableContainer-root': {
          maxWidth: '100%',
          overflowX: 'auto'
        }
      },
    },
    muiTableHeadCellProps: {
      sx: {
        fontWeight: '500',
        backgroundColor: '#f1f3f4',
        color: 'text.secondary',
        padding: { xs: '4px 2px', sm: '6px 4px', md: '8px 6px' },
        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderBottom: '1px solid #dadce0',
        textShadow: 'none',
        '&:first-of-type': {
          borderTopLeftRadius: '4px',
        },
        '&:last-of-type': {
          borderTopRightRadius: '4px',
        }
      },
    },
    muiTableBodyCellProps: {
      sx: {
        padding: { xs: '3px 2px', sm: '4px 3px', md: '6px 4px' },
        fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        borderBottom: '1px solid #f0f0f0',
        verticalAlign: 'middle',
        color: 'dark',
        fontWeight: '400',
      },
    },

    // ← CONFIGURACIÓN COMPLETA DE PAGINACIÓN
    muiTablePaginationProps: {
      // Personalizar el texto "Rows per page"
      labelRowsPerPage: "Mostrar:",

      // Personalizar el texto de información de página
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} de ${count}`,

      // Opciones de filas por página
      rowsPerPageOptions: [5, 25, 50, 100],

      // Estilos personalizados
      sx: {
        display: 'flex',                    // ← Cambiar de 'right' a 'flex'
        justifyContent: 'flex-end',         // ← Cambiar a 'flex-end' para alinear a la derecha
        alignItems: 'center',               // ← Mantener 'center' para alineación vertical
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '6px 4px',
        margin: '6px 0',                    // ← Cambiar a '6px 0' para margen derecho
        width: '100%',                      // ← Mantener 100% para adaptarse al contenedor
        maxWidth: '100%',                   // ← Mantener maxWidth
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',

        // Responsive para diferentes tamaños de pantalla
        '@media (max-width: 600px)': {
          flexDirection: 'column',
          padding: '8px 4px',
          gap: '8px',
          justifyContent: 'flex-end',       // ← Mantener alineación derecha en móvil
          '& .MuiTablePagination-toolbar': {
            flexDirection: 'column',
            alignItems: 'flex-end',         // ← Alinear a la derecha en móvil
            gap: '8px',
          },
          '& .MuiTablePagination-actions': {
            marginLeft: '0',
            marginTop: '8px',
          },
        },
        '@media (min-width: 601px) and (max-width: 960px)': {
          padding: '8px 6px',
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'flex-end',     // ← Alinear a la derecha en tablet
          },
        },
        '@media (min-width: 961px)': {
          padding: '6px 8px',
          '& .MuiTablePagination-toolbar': {
            justifyContent: 'flex-end',     // ← Alinear a la derecha en desktop
          },
        },

        // Estilo del selector de filas por página
        '& .MuiTablePagination-select': {
          backgroundColor: 'white',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          margin: '0 8px',
          // ← AGREGAR CONTROL DE TAMAÑO
          minWidth: '60px',              // Tamaño mínimo del selector
          maxWidth: '80px',              // Tamaño máximo del selector
          fontSize: '0.875rem',          // Tamaño de fuente más pequeño
          padding: '4px 8px',            // Padding reducido
        },

        // Espaciado de los botones de navegación
        '& .MuiTablePagination-actions': {
          marginLeft: '6px',
          // ← CONTROL OPTIMIZADO DE TAMAÑO DE ICONOS
          '& .MuiIconButton-root': {
            padding: '6px',              // ← Padding equilibrado para botones
            margin: '0 3px',             // ← Margen equilibrado entre botones
            width: '32px',               // ← Ancho fijo para consistencia
            height: '32px',              // ← Alto fijo para consistencia
            '& .MuiSvgIcon-root': {
              fontSize: '1.1rem',        // ← Tamaño de icono equilibrado
              width: '1.1rem',           // ← Ancho del icono
              height: '1.1rem',          // ← Alto del icono
            },
            // ← Hover y focus para mejor UX
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
            '&:focus': {
              backgroundColor: 'rgba(0, 0, 0, 0.08)',
            },
          },
        },

        // ← AGREGAR CONTROL DEL TOOLBAR COMPLETO
        '& .MuiTablePagination-toolbar': {
          minHeight: 'auto',             // Altura mínima automática
          padding: '4px 8px',            // Padding reducido del toolbar
          '& .MuiTablePagination-selectLabel': {
            fontSize: '0.875rem',        // Texto "Mostrar:" más pequeño
            marginRight: '8px',          // Margen derecho reducido
          },
          '& .MuiTablePagination-displayedRows': {
            fontSize: '0.875rem',        // Texto "1-5 de 8" más pequeño
            marginLeft: '8px',           // Margen izquierdo reducido
          },
        },
      },
    },
    initialState: {
      density: 'comfortable',
      pagination: {
        pageSize: 5,        // ← Solo mostrar 5 filas inicialmente
        pageIndex: 0        // ← Empezar en la primera página
      },
      columnVisibility: {
        // Ocultar columnas menos importantes en pantallas pequeñas
        usuario_id: false, // Siempre oculta 
        created_by: false,
        updated_at: false,
        updated_by: false,
        created_at: false,
        rol: false,
      },
    },
  };

  return (
    <AppPageLayout>
      <Container
        maxWidth={false}
        sx={{
          mx: 'auto', // Centrar horizontalmente
          px: { xs: 1, sm: 2, md: 3 }, // Padding responsivo
          width: '100%',
          maxWidth: { xs: '100%', sm: '95%', md: '90%', lg: '85%' }, // Ancho máximo responsivo
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
                  minHeight: { xs: 'auto', sm: '600px', md: '700px' }, // Altura mínima responsiva
                }}
              >
                <CardContent sx={{ padding: 0 }}>

                  <SoftBox p={{ xs: 2, sm: 3, md: 4 }}>
                    {/* Header con Gestión de Usuarios y Nuevo Usuario */}
                    <SoftBox mb={{ xs: 3, sm: 4, md: 5 }} display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={{ xs: 1, sm: 2 }}>
                      {/* Lado izquierdo: Gestión de Usuarios */}
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
                              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                              lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                            }}
                          >
                            Gestión de Usuarios
                          </SoftTypography>
                          <SoftTypography variant="button" color="text" fontWeight="medium" opacity={0.8}>
                            Administración de usuarios {APP_NAME}
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>

                      {/* Lado derecho: Nuevo Usuario */}
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddIcon />}
                        onClick={handleNewUser}
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
                        Nuevo usuario
                      </Button>
                    </SoftBox>

                    {/* Botón Limpiar Filtros */}
                    {(searchTerm || statusFilter !== "all" || departmentFilter !== "all") && (
                      <SoftBox mb={3} display="flex" justifyContent="flex-end">
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={clearFilters}
                          size="small"
                          sx={{
                            borderColor: 'grey.400',
                            color: 'text',
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
                          color: 'text.secondary',
                          fontSize: '13px'
                        }}
                      >
                        📊 Mostrando <strong style={{ color: 'primary.main' }}>{filteredUsers.length}</strong> de <strong style={{ color: 'primary.main' }}>{data.length}</strong> usuarios
                        {(searchTerm || statusFilter !== "all" || departmentFilter !== "all") && (
                          <span style={{ color: 'primary.main', fontWeight: '600' }}> (filtrados)</span>
                        )}
                      </SoftTypography>
                    </SoftBox>

                    {/* Sección de Búsqueda y Filtros */}
                    <SoftBox mb={{ xs: 2, sm: 3, md: 4 }}>
                      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} alignItems="center">
                        {/* Barra de Búsqueda */}
                        <Grid item xs={12} md={6}>
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
                              placeholder="Buscar por nombre, correo, grupos o roles..."
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
                        <Grid item xs={12} sm={6} md={2}>
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

                        {/* Filtro por Grupos */}
                        <Grid item xs={12} sm={6} md={2}>
                          <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
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
                            <option value="all">Todos los grupos</option>
                            {uniqueDepartments.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </Grid>

                        {/* Control de Filas por Página */}
                        <Grid item xs={12} sm={6} md={2}>
                          <SoftBox display="flex" alignItems="center" gap={1}>
                            <span style={{ fontSize: "14px", color: "text.secondary" }}>Filas:</span>
                            <select
                              value={pagination.pageSize}  // ← Usar pagination.pageSize en lugar de rowsPerPage
                              onChange={(e) => {
                                const newPageSize = Number(e.target.value);
                                setPagination({
                                  pageIndex: 0,           // ← Volver a la primera página
                                  pageSize: newPageSize   // ← Actualizar el tamaño de página
                                });
                              }}
                              style={{
                                padding: "8px 12px",
                                border: "1px solid #e0e0e0",
                                borderRadius: "6px",
                                fontSize: "14px",
                                backgroundColor: "white",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                outline: "none",
                                minWidth: "70px"
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
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                              <option value={25}>25</option>
                              <option value={50}>50</option>
                            </select>
                          </SoftBox>
                        </Grid>
                      </Grid>
                    </SoftBox>

                    {/* Indicador de carga para usuarios */}
                    {loading && (
                      <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={4}
                        sx={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <SoftTypography variant="body2" color="text">
                          🔄 Cargando usuarios...
                        </SoftTypography>
                      </SoftBox>
                    )}

                    {/* Indicador de carga para listas utilitarias */}
                    {isAnyLoading && !loading && (
                      <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={4}
                        sx={{
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <SoftBox display="flex" flexDirection="column" alignItems="center" gap={2}>
                          <SoftTypography variant="body1" color="text" fontWeight="medium">
                            📋 Cargando catálogos de roles, grupos y unidades...
                          </SoftTypography>
                          <SoftTypography variant="body2"  >
                            Preparando datos para mostrar correctamente en la tabla
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    )}

                    {/* Indicador de error */}
                    {error && (
                      <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={4}
                        sx={{
                          backgroundColor: '#ffebee',
                          borderRadius: '8px',
                          border: '1px solid #ffcdd2'
                        }}
                      >
                        <SoftTypography variant="body2" color="error">
                          ❌ Error al cargar usuarios: {error.message}
                        </SoftTypography>
                      </SoftBox>
                    )}

                    {/* Tabla de Usuarios - Solo mostrar cuando todos los datos estén listos */}
                    {!loading && !error && isLoadingComplete && <MaterialReactTable {...tableOptions} />}
                  </SoftBox>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </SoftBox>
      </Container>

      {/* Panel lateral para crear/editar usuarios */}
      <SidePanelRight
        open={userPanel.open}
        onClose={handleUserPanelClose}
        title={userPanel.mode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
        subtitle={userPanel.mode === "create"
          ? "Crear un nuevo usuario en el sistema"
          : `Editando usuario: ${userPanel.user?.nombre || ""}`
        }
      >
        <UserDetail
          user={userPanel.user}
          mode={userPanel.mode}
          onSave={handleUserSave}
          onCancel={handleUserPanelClose}
          loading={userPanel.loading}
          rolesOptions={rolesOptions}
          groupsOptions={groupsOptions}
          unitsOptions={unitsOptions}
        />
      </SidePanelRight>

      {/* Alert de confirmación para eliminar usuario */}
      <ConfirmAlert
        open={deleteAlert.open}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        severity="error"
        itemName={deleteAlert.user?.usuario?.nombre}
        showItemName={true}
        itemLabel="Usuario"
      />

      {/* Notificación para errores */}
      <AppNotification
        type="error"
        message={errorSnackbar.message}
        open={errorSnackbar.open}
        onClose={closeErrorSnackbar}
        duration={8000}
      />
    </AppPageLayout>
  );
}

export default Users;
