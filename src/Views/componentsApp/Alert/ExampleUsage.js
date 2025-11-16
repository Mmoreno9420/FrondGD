/**
 * =========================================================
 * AppNotification - Example Usage
 * =========================================================
 * Examples of how to use the AppNotification component
 */

import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import AppNotification from './AppNotification';

const NotificationExample = () => {
    const [notifications, setNotifications] = useState({
        success: { open: false, message: '' },
        error: { open: false, message: '' },
        warning: { open: false, message: '' },
        info: { open: false, message: '' }
    });

    const showNotification = (type, message) => {
        setNotifications(prev => ({
            ...prev,
            [type]: { open: true, message }
        }));
    };

    const closeNotification = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: { open: false, message: '' }
        }));
    };

    return (
        <SoftBox p={3}>
            <SoftTypography variant="h4" mb={3}>
                AppNotification - Ejemplos de Uso
            </SoftTypography>

            <Grid container spacing={2} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={() => showNotification('success', 'Usuario creado exitosamente')}
                    >
                        Mostrar Éxito
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        onClick={() => showNotification('error', 'Error de conexión: Tiempo de espera agotado')}
                    >
                        Mostrar Error
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="warning"
                        fullWidth
                        onClick={() => showNotification('warning', 'Advertencia: Datos no guardados')}
                    >
                        Mostrar Advertencia
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Button
                        variant="contained"
                        color="info"
                        fullWidth
                        onClick={() => showNotification('info', 'Información: Sistema actualizado')}
                    >
                        Mostrar Info
                    </Button>
                </Grid>
            </Grid>

            <SoftBox mb={3}>
                <SoftTypography variant="h6" mb={2}>
                    Código de Ejemplo:
                </SoftTypography>
                <pre style={{
                    backgroundColor: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    overflow: 'auto'
                }}>
                    {`// Importar el componente
import { AppNotification } from "Views/componentsApp/Alert";

// En tu componente
const [notification, setNotification] = useState({
  open: false,
  type: 'info',
  message: ''
});

// Mostrar notificación
const showNotification = (type, message) => {
  setNotification({
    open: true,
    type,
    message
  });
};

// Cerrar notificación
const closeNotification = () => {
  setNotification(prev => ({
    ...prev,
    open: false
  }));
};

// En el JSX
<AppNotification
  type={notification.type}
  message={notification.message}
  open={notification.open}
  onClose={closeNotification}
  duration={5000} // opcional, default 5000ms
/>`}
                </pre>
            </SoftBox>

            <SoftBox mb={3}>
                <SoftTypography variant="h6" mb={2}>
                    Props del Componente:
                </SoftTypography>
                <ul>
                    <li><strong>type:</strong> 'success' | 'error' | 'warning' | 'info' (default: 'info')</li>
                    <li><strong>message:</strong> string (requerido) - El mensaje a mostrar</li>
                    <li><strong>title:</strong> string (opcional) - Título personalizado</li>
                    <li><strong>duration:</strong> number (opcional) - Duración en ms (default: 5000)</li>
                    <li><strong>open:</strong> boolean (opcional) - Si está abierto (default: false)</li>
                    <li><strong>onClose:</strong> function (requerido) - Función para cerrar</li>
                </ul>
            </SoftBox>

            {/* Notificaciones */}
            <AppNotification
                type="success"
                message={notifications.success.message}
                open={notifications.success.open}
                onClose={() => closeNotification('success')}
            />

            <AppNotification
                type="error"
                message={notifications.error.message}
                open={notifications.error.open}
                onClose={() => closeNotification('error')}
                duration={8000}
            />

            <AppNotification
                type="warning"
                message={notifications.warning.message}
                open={notifications.warning.open}
                onClose={() => closeNotification('warning')}
            />

            <AppNotification
                type="info"
                message={notifications.info.message}
                open={notifications.info.open}
                onClose={() => closeNotification('info')}
            />
        </SoftBox>
    );
};

export default NotificationExample;










