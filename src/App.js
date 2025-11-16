
import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Soft UI Dashboard PRO React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Soft UI Dashboard PRO React routes
import routes from "routes";

// Soft UI Dashboard PRO React contexts
import { useSoftUIController, setMiniSidenav, setOpenConfigurator } from "context";

// App Actions Context
import { AppActionsProvider } from "./context/AppActionsContext";

// Custom App Layout
import { AppPageLayout } from "Views/componentsApp";

// Hooks
import { useUserSession } from "hooks/useUserSession";

// Images
import brand from "assets/images/logo-ct.png";


import { APP_NAME } from "config/appConfig";

// Componente interno que tiene acceso al contexto
function ProtectedApp() {
  const { pathname } = useLocation();
  const { isAuthenticated } = useUserSession();

  return <AppRoutes pathname={pathname} isAuthenticated={isAuthenticated} />;
}

// Componente de rutas con protección
function AppRoutes({ pathname, isAuthenticated }) {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  // Verificar si la ruta actual es de autenticación o login
  const isAuthRoute = pathname.startsWith('/authentication') || pathname === '/login';

  // Protección: Si no está autenticado y no es ruta de auth, redirigir a login
  if (!isAuthenticated && !isAuthRoute) {
    return <Navigate to="/login" replace />;
  }

  // Protección: Si está autenticado y está en login, redirigir a gestiones
  if (isAuthenticated && pathname === '/login') {
    return <Navigate to="/gestiones/gestion" replace />;
  }

  return (
    <>
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={themeRTL}>
            <CssBaseline />
            {isAuthRoute ? (
              // Rutas de autenticación sin layout
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/gestiones/gestion" : "/login"} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/gestiones/gestion" : "/login"} />} />
              </Routes>
            ) : (
              // Rutas normales con AppPageLayout
              <AppPageLayout>
                <Routes>
                  {getRoutes(routes)}
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
              </AppPageLayout>
            )}
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {isAuthRoute ? (
            // Rutas de autenticación sin layout
            <Routes>
              {getRoutes(routes)}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          ) : (
            // Rutas normales con AppPageLayout
            <AppPageLayout>
              <Routes>
                {getRoutes(routes)}
                <Route path="/" element={<Navigate to={isAuthenticated ? "/gestiones/gestion" : "/login"} />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/gestiones/gestion" : "/login"} />} />
              </Routes>
            </AppPageLayout>
          )}
        </ThemeProvider>
      )}
    </>
  );
}

// Componente principal
export default function App() {
  return (
    <AppActionsProvider>
      <ProtectedApp />
    </AppActionsProvider>
  );
}

// Validación de props
AppRoutes.propTypes = {
  pathname: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
};
