/**
 * =========================================================
 * AppNotification Component
 * =========================================================
 * Reusable notification component for the application
 * Uses existing SoftSnackbar component from the template
 */

import React from 'react';
import PropTypes from 'prop-types';
import SoftSnackbar from 'components/SoftSnackbar';

const AppNotification = ({
    type = 'info',
    message,
    title,
    duration = 5000,
    open = false,
    onClose
}) => {
    const getNotificationConfig = (notificationType) => {
        const configs = {
            success: {
                color: 'success',
                icon: 'check',
                title: title || 'Éxito'
            },
            error: {
                color: 'error',
                icon: 'warning',
                title: title || 'Error'
            },
            warning: {
                color: 'warning',
                icon: 'warning',
                title: title || 'Advertencia'
            },
            info: {
                color: 'info',
                icon: 'info',
                title: title || 'Información'
            }
        };

        return configs[notificationType] || configs.info;
    };

    const config = getNotificationConfig(type);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <SoftSnackbar
            color={config.color}
            icon={config.icon}
            title={config.title}
            content={message}
            dateTime="Ahora"
            open={open}
            onClose={handleClose}
            close={handleClose}
            bgWhite
            autoHideDuration={duration}
        />
    );
};

// Typechecking props
AppNotification.propTypes = {
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    message: PropTypes.string.isRequired,
    title: PropTypes.string,
    duration: PropTypes.number,
    open: PropTypes.bool,
    onClose: PropTypes.func.isRequired
};

export default AppNotification;





