/**
=========================================================
* GestiaSoft - Protected Route Component
=========================================================
* Componente para proteger rutas y presenter acceso no autorizado
* 
* @description
* Este componente protege las rutas verificando:
* 1. Si el usuario está autenticado
* 2. Si el usuario tiene los permisos necesarios
* 3. Si la sesión no ha expirado
*/

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserSession } from '../hooks/useUserSession';
import SoftBox from './SoftBox';
import SoftTypography from './SoftTypography';
import SoftButton from './SoftButton';

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si tiene acceso
 * @param {Array} props.requiredPermissions - Permisos requeridos para acceder
 * @param {Boolean} props.requireAllPermissions - Si requiere TODOS los permisos o solo uno
 * @param {React.ReactNode} props.fallback - Componente a renderizar si no tiene acceso
 */
const ProtectedRoute = ({
    children,
    requiredPermissions = [],
    requireAllPermissions = false,
    fallback = null
}) => {
    const { isAuthenticated, hasPermission, hasAnyPermission, hasAllPermissions } = useUserSession();
    const location = useLocation();

    // Verificar autenticación
    if (!isAuthenticated) {
        // Redirigir a login guardando la ruta de destino
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificar permisos si se requieren
    if (requiredPermissions.length > 0) {
        let hasAccess = false;

        if (requireAllPermissions) {
            // Requiere TODOS los permisos
            hasAccess = hasAllPermissions(requiredPermissions);
        } else {
            // Requiere al menos UNO de los permisos
            hasAccess = hasAnyPermission(requiredPermissions);
        }

        if (!hasAccess) {
            // Renderizar fallback o mensaje de acceso denegado
            return fallback || <AccessDenied />;
        }
    }

    // Usuario autenticado y con permisos necesarios
    return children;
};

/**
 * Componente de Acceso Denegado
 */
const AccessDenied = () => {
    return (
        <SoftBox
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgColor="grey-100"
        >
            <SoftBox
                Vi={{}}
                borderRadius="lg"
                bgColor="white unaffected"
                boxShadow="sm"
                p={4}
                maxWidth="md"
                width="100%"
            >
                <SoftTypography variant="h3" color="error" textAlign="center" mb={2}>
                    ⚠️ Acceso Denegado
                </SoftTypography>

                <SoftTypography variant="body2" color="text" textAlign="center" mb={4}>
                    No tienes los permisos necesarios para acceder a esta página.
                </SoftTypography>

                <SoftBox display="flex" gap={2} justifyContent="center">
                    <SoftButton
                        variant="outlined"
                        color="primary"
                        onClick={() => window.history.back()}
                    >
                        Volver
                    </SoftButton>

                    <SoftButton
                        variant="gradient"
                        color="primary"
                        onClick={() => window.location.href = '/'}
                    >
                        Ir al Inicio
                    </SoftButton>
                </SoftBox>
            </SoftBox>
        </SoftBox>
    );
};

export default ProtectedRoute;
