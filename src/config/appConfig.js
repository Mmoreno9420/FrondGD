/**
=========================================================
* GestiaSoft - Global Configuration
=========================================================
* Centralized configuration for the application
*/

// Application Configuration
export const APP_CONFIG = {
  // Application Name
  name: "GD-SESAL",

  // Application Description
  description: "Sistema de Administración de Usuarios",

  // Application Version
  version: "4.0.2",

  // Application Author
  author: "Creative Tim",

  // Application Logo (if needed)
  logo: "/static/images/logo-ct.png",

  // Application Colors (if needed)
  colors: {
    primary: "#3B82F6",
    secondary: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
  },

  // System Header Colors - Configurable
  systemColors: {
    header: {
      primary: "#1976d2",        // Azul principal del header
      secondary: "#1565c0",      // Azul más oscuro para hover
      text: "#ffffff",           // Texto blanco
      accent: "#42a5f5",         // Azul claro para elementos
      border: "#0d47a1"          // Borde más oscuro
    },
    sidebar: {
      primary: "#f8f9fa",        // Fondo del sidebar
      secondary: "#e9ecef",      // Fondo secundario
      text: "#495057",           // Texto del sidebar
      active: "#007bff",         // Elemento activo
      hover: "#e3f2fd"           // Hover de elementos
    }
  },

  // Application Settings
  settings: {
    // Default page size for tables
    defaultPageSize: 10,

    // Maximum page size for tables
    maxPageSize: 100,

    // Default language
    defaultLanguage: "es",

    // Date format
    dateFormat: "DD/MM/YYYY",

    // Time format
    timeFormat: "HH:mm:ss",
  },

  // Navigation Configuration
  navigation: {
    // Default brand name for sidenav
    defaultBrandName: "GestiaSoft",

    // Default routes
    defaultRoutes: [
      {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        icon: "dashboard",
        route: "/dashboards/default",
      },
      {
        type: "collapse",
        name: "Usuarios",
        key: "users",
        icon: "people",
        route: "/pages/users",
      },
    ],
  },

  // User Management Configuration
  userManagement: {
    // Default user roles
    roles: [
      { value: "admin", label: "Administrador" },
      { value: "user", label: "Usuario" },
      { value: "manager", label: "Gerente" },
      { value: "viewer", label: "Visualizador" },
    ],

    // Default departments
    departments: [
      { value: "it", label: "Tecnología" },
      { value: "hr", label: "Recursos Humanos" },
      { value: "finance", label: "Finanzas" },
      { value: "marketing", label: "Marketing" },
    ],

    // User status options
    status: [
      { value: "active", label: "Activo" },
      { value: "inactive", label: "Inactivo" },
      { value: "suspended", label: "Suspendido" },
    ],
  },
};

// Export individual values for easy access
export const APP_NAME = APP_CONFIG.name;
export const APP_DESCRIPTION = APP_CONFIG.description;
export const APP_VERSION = APP_CONFIG.version;
export const APP_AUTHOR = APP_CONFIG.author;
export const APP_LOGO = APP_CONFIG.logo;

// Export configuration sections
export const APP_COLORS = APP_CONFIG.colors;
export const APP_SETTINGS = APP_CONFIG.settings;
export const APP_NAVIGATION = APP_CONFIG.navigation;
export const APP_USER_MANAGEMENT = APP_CONFIG.userManagement;
export const SYSTEM_COLORS = APP_CONFIG.systemColors;

// Default export for the entire configuration
export default APP_CONFIG;


