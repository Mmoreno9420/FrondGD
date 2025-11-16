/**
=========================================================
* GestiaSoft - App Routes
=========================================================
* Custom routes for the application
*/

// Custom App Dashboard
import AppDefaultDashboard from "./Dashboards/AppDefaultDashboard";

// Custom App Pages
import UsersPage from "./Pages/UsersPage";

// Custom Gestiones Page
import Gestiones from "Views/Gestiones/Gestion/Gestiones";

// App Routes
const appRoutes = [
    {
        type: "route",
        name: "Dashboard",
        key: "app-dashboard",
        route: "/app-dashboard",
        component: <AppDefaultDashboard />,
        icon: "dashboard",
    },
    {
        type: "route",
        name: "Usuarios con Sidenav",
        key: "users-sidenav",
        route: "/users-sidenav",
        component: <UsersPage />,
        icon: "people",
    },
    {
        type: "route",
        name: "Gestiones",
        key: "gestiones",
        route: "/gestiones/gestion",
        component: <Gestiones />,
        icon: "assignment",
    },
    {
        type: "route",
        name: "Perfil",
        key: "profile",
        route: "/pages/profile/profile-overview",
        component: null, // Will use existing component
        icon: "person",
    },
    {
        type: "route",
        name: "Reportes",
        key: "reports",
        route: "/pages/users/reports",
        component: null, // Will use existing component
        icon: "assessment",
    },
    {
        type: "route",
        name: "Configuración",
        key: "settings",
        route: "/pages/account/settings",
        component: null, // Will use existing component
        icon: "settings",
    },
];

export default appRoutes;
