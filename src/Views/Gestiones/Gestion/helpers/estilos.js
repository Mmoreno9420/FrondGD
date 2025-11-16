/**
=========================================================
* GestiaSoft - Helper Functions for Styles
=========================================================
* Reusable style functions for gestion components
*/

// Función para obtener color según prioridad
export const getPrioridadColor = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
        case 'alta':
        case 'urgente':
            return 'error';
        case 'media':
            return 'warning';
        case 'baja':
            return 'info';
        default:
            return 'secondary';
    }
};

// Función para obtener color según estado
export const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
        case 'completado':
        case 'finalizado':
            return 'success';
        case 'en progreso':
        case 'activo':
            return 'primary';
        case 'pendiente':
            return 'warning';
        case 'cancelado':
        case 'rechazado':
            return 'error';
        default:
            return 'secondary';
    }
};

// Función para obtener estilo de estado
export const getEstadoStyle = (color) => {
    switch (color) {
        case 'success':
            return {
                background: 'linear-gradient(45deg, #e8f5e8 30%, #c8e6c9 90%)',
                color: '#2e7d32',
                border: '1px solid rgba(46, 125, 50, 0.3)',
                boxShadow: '0 2px 4px rgba(46, 125, 50, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #c8e6c9 30%, #a5d6a7 90%)',
                hoverBoxShadow: '0 4px 8px rgba(46, 125, 50, 0.2)'
            };
        case 'primary':
            return {
                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                color: '#1565c0',
                border: '1px solid rgba(21, 101, 192, 0.3)',
                boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                hoverBoxShadow: '0 4px 8px rgba(21, 101, 192, 0.2)'
            };
        case 'warning':
            return {
                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                color: '#e65100',
                border: '1px solid rgba(230, 81, 0, 0.3)',
                boxShadow: '0 2px 4px rgba(230, 81, 0, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                hoverBoxShadow: '0 4px 8px rgba(230, 81, 0, 0.2)'
            };
        case 'error':
            return {
                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                color: '#c62828',
                border: '1px solid rgba(198, 40, 40, 0.3)',
                boxShadow: '0 2px 4px rgba(198, 40, 40, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #ffcdd2 30%, #ef9a9a 90%)',
                hoverBoxShadow: '0 4px 8px rgba(198, 40, 40, 0.2)'
            };
        default:
            return {
                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                color: '#616161',
                border: '1px solid rgba(97, 97, 97, 0.3)',
                boxShadow: '0 2px 4px rgba(97, 97, 97, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                hoverBoxShadow: '0 4px 8px rgba(97, 97, 97, 0.2)'
            };
    }
};

// Función para obtener estilo de prioridad
export const getPrioridadStyle = (color) => {
    switch (color) {
        case 'error':
            return {
                background: 'linear-gradient(45deg, #ffebee 30%, #ffcdd2 90%)',
                color: '#c62828',
                border: '1px solid rgba(198, 40, 40, 0.3)',
                boxShadow: '0 2px 4px rgba(198, 40, 40, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #ffcdd2 30%, #ef9a9a 90%)',
                hoverBoxShadow: '0 4px 8px rgba(198, 40, 40, 0.2)'
            };
        case 'warning':
            return {
                background: 'linear-gradient(45deg, #fff3e0 30%, #ffe0b2 90%)',
                color: '#e65100',
                border: '1px solid rgba(230, 81, 0, 0.3)',
                boxShadow: '0 2px 4px rgba(230, 81, 0, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #ffe0b2 30%, #ffcc02 90%)',
                hoverBoxShadow: '0 4px 8px rgba(230, 81, 0, 0.2)'
            };
        case 'info':
            return {
                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                color: '#1565c0',
                border: '1px solid rgba(21, 101, 192, 0.3)',
                boxShadow: '0 2px 4px rgba(21, 101, 192, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                hoverBoxShadow: '0 4px 8px rgba(21, 101, 192, 0.2)'
            };
        default:
            return {
                background: 'linear-gradient(45deg, #f5f5f5 30%, #e0e0e0 90%)',
                color: '#616161',
                border: '1px solid rgba(97, 97, 97, 0.3)',
                boxShadow: '0 2px 4px rgba(97, 97, 97, 0.1)',
                hoverBackground: 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)',
                hoverBoxShadow: '0 4px 8px rgba(97, 97, 97, 0.2)'
            };
    }
};

// Función para formatear fecha
export const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

