/**
=========================================================
* GestiaSoft - Require Permission Component
=========================================================
* HOC para proteger componentes individuales por permisos
*/

import React from 'react';
import { useUserSession } from '../hooks/useUserSession';
import SoftBox from './SoftBox';
import SoftTypography from './SoftTypography';
import PropTypes from 'prop-types';

/**
 * RequirePermission Component
 * Wrapper que muestra un componente solo si el usuario tiene los permisos necesarios
 * 
 * @param {Object} props
 * @param {String|Array} props.permission - Permiso(s) adoprimiífico requerido(s)
 * @param {Boolean} props.requireAll - Si requiere todos los permisos
 * @param {React.ReactNode} props.children - Contenido a proteger
 * @param {React.ReactNode} props.fallback - Contenido alternativo si no tiene permiso
 */
const RequirePermission = ({
    permission,
    requireAll = false,
    children,
    fallback = null
}) => {
    const { hasPermission, hasAnyPermission, hasAllPermissions } = useUserSession();

    // Convertir permission a array si es string
    const permissions = Array.isArray(permission) ? permission : [permission];

    // Verificar permisos
    let hasAccess = false;

    if (requireAll) {
        hasAccess = hasAllPermissions(permissions);
    } else if (permissions.length === 1) {
        hasAccess = hasPermission(permissions[0]);
    } else {
        hasAccess = hasAnyPermission(permissions);
    }

    // Si tiene acceso, renderizar children
    if (hasAccess) {
        return children;
    }

    // Si no tiene acceso, renderizar fallback
    return fallback || (
        <SoftBox p={2} bgColor="grey-100" borderRadius="lg">
            <SoftTypography variant="caption" color="text">
                No tienes permisos para ver este contenido
            </SoftTypography>
        </SoftBox>
    );
};

RequirePermission.propTypes = {
    permission: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ]).isRequired,
    requireAll: PropTypes.bool,
    children: PropTypes.node.isRequired,
    fallback: PropTypes.node,
};

export default RequirePermission;
