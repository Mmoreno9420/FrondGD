/**
=========================================================
* GestiaSoft - Gestion Timeline Component
=========================================================
* Timeline component for displaying gestion progress
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import { LinearProgress } from "@mui/material";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import TimelineList from "examples/Timeline/TimelineList";
import TimelineItem from "examples/Timeline/TimelineItem";

function GestionTimeline({ gestion, timelineEvents, calculateProgress }) {
    // Usar la función calculateProgress pasada como prop, o usar la función local como fallback
    const getProgress = () => {
        if (calculateProgress) {
            return calculateProgress();
        }

        // Prioridad 1: Usar avance_calculado del API
        if (gestion && gestion.avance_calculado !== undefined && gestion.avance_calculado !== null) {
            return Math.min(Math.max(parseFloat(gestion.avance_calculado), 0), 100);
        }

        // Prioridad 2: Usar avance_promedio del API
        if (gestion && gestion.avance_promedio !== undefined && gestion.avance_promedio !== null) {
            return Math.min(Math.max(parseFloat(gestion.avance_promedio), 0), 100);
        }

        // Prioridad 3: Usar porcentaje_avance del API
        if (gestion && gestion.porcentaje_avance !== undefined && gestion.porcentaje_avance !== null) {
            return Math.min(Math.max(parseFloat(gestion.porcentaje_avance), 0), 100);
        }

        // Prioridad 4: Calcular basado en eventos completados del timeline
        const completedEvents = timelineEvents.filter(event => event.color === 'success').length;
        if (timelineEvents.length > 0) {
            return (completedEvents / timelineEvents.length) * 100;
        }

        // Fallback: 0%
        return 0;
    };

    // Obtener color de la barra de progreso según el porcentaje
    const getProgressColor = () => {
        const progress = getProgress();

        if (progress === 0) {
            return 'linear-gradient(45deg, #e0e0e0 30%, #bdbdbd 90%)'; // Gris
        } else if (progress < 30) {
            return 'linear-gradient(45deg, #f44336 30%, #ef5350 90%)'; // Rojo
        } else if (progress < 60) {
            return 'linear-gradient(45deg, #ff9800 30%, #ffa726 90%)'; // Naranja
        } else if (progress < 90) {
            return 'linear-gradient(45deg, #2196f3 30%, #42a5f5 90%)'; // Azul
        } else {
            return 'linear-gradient(45deg, #4caf50 30%, #66bb6a 90%)'; // Verde
        }
    };

    // Obtener color del texto según el porcentaje
    const getProgressTextColor = () => {
        const progress = getProgress();

        if (progress === 0) {
            return '#757575'; // Gris
        } else if (progress < 30) {
            return '#d32f2f'; // Rojo
        } else if (progress < 60) {
            return '#f57c00'; // Naranja
        } else if (progress < 90) {
            return '#1976d2'; // Azul
        } else {
            return '#2e7d32'; // Verde
        }
    };

    // Renderizar items del timeline (sin botón de documentos)
    const renderTimelineItems = timelineEvents.map(
        ({ color, icon, title, dateTime, description, badges, lastItem }) => (
            <TimelineItem
                key={title + color}
                color={color}
                icon={icon}
                title={title}
                dateTime={dateTime}
                description={description}
                badges={badges}
                lastItem={lastItem}
            />
        )
    );

    return (
        <SoftBox>
            {/* Barra de progreso */}
            <SoftBox mb={3}>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <SoftTypography variant="h6" fontWeight="medium" color="dark">
                        Progreso de la Gestión
                    </SoftTypography>
                    <SoftTypography variant="body2" fontWeight="bold" sx={{ color: getProgressTextColor() }}>
                        {getProgress().toFixed(0)}% Completado
                    </SoftTypography>
                </SoftBox>
                <LinearProgress
                    variant="determinate"
                    value={getProgress()}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            background: getProgressColor(),
                        }
                    }}
                />
            </SoftBox>

            {/* Timeline */}
            <TimelineList title={`Historial de: ${gestion?.nombre || "Nueva Gestión"}`}>
                {renderTimelineItems}
            </TimelineList>
        </SoftBox>
    );
}

GestionTimeline.propTypes = {
    gestion: PropTypes.object,
    timelineEvents: PropTypes.array.isRequired,
    calculateProgress: PropTypes.func
};

export default GestionTimeline;

