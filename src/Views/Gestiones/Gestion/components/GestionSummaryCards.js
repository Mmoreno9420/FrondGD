/**
=========================================================
* GestiaSoft - Gestion Summary Cards Component
=========================================================
* Summary cards that serve as filters for gestiones
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import { Card, CardContent, Box } from "@mui/material";

// @mui icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import PendingIcon from "@mui/icons-material/Pending";
import ScheduleIcon from "@mui/icons-material/Schedule";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function GestionSummaryCards({ gestiones, activeFilter, onFilterChange }) {
    // Calcular estadísticas
    const stats = {
        total: gestiones.length,
        pendientes: gestiones.filter(g =>
            g.estado_nombre?.toLowerCase() === 'pendiente'
        ).length,
        enProceso: gestiones.filter(g => {
            const estado = g.estado_nombre?.toLowerCase();
            return estado === 'en proceso' ||
                estado === 'en progreso' ||
                estado === 'activo';
        }).length
    };

    const cards = [
        {
            id: 'all',
            title: 'TOTAL DE GESTIONES',
            value: stats.total,
            subtitle: 'Todas las gestiones',
            icon: AssignmentIcon,
            color: '#4caf50',
            bgGradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        },
        {
            id: 'pendiente',
            title: 'GESTIONES PENDIENTES',
            value: stats.pendientes,
            subtitle: 'Por iniciar',
            icon: PendingIcon,
            color: '#ff9800',
            bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
        },
        {
            id: 'en proceso',
            title: 'EN PROCESO',
            value: stats.enProceso,
            subtitle: 'En curso actualmente',
            icon: ScheduleIcon,
            color: '#2196f3',
            bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
        }
    ];

    return (
        <SoftBox display="flex" gap={1.5} flexWrap="wrap">
            {cards.map((card) => {
                const Icon = card.icon;
                const isActive = activeFilter === card.id;

                return (
                    <Card
                        key={card.id}
                        onClick={() => onFilterChange(card.id)}
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 8px)', md: '1 1 calc(33.333% - 12px)' },
                            minWidth: { xs: '100%', sm: '180px' },
                            cursor: 'pointer',
                            background: isActive
                                ? card.bgGradient
                                : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            border: isActive
                                ? `2px solid ${card.color}`
                                : '1px solid #e0e0e0',
                            borderRadius: '12px',
                            boxShadow: isActive
                                ? `0 4px 12px ${card.color}40`
                                : '0 1px 4px rgba(0, 0, 0, 0.08)',
                            transition: 'all 0.3s ease',
                            transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                            '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: `0 6px 16px ${card.color}50`,
                                borderColor: card.color
                            }
                        }}
                    >
                        <CardContent sx={{ p: 1.5 }}>
                            <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                <SoftBox>
                                    <SoftTypography
                                        variant="caption"
                                        fontWeight="bold"
                                        sx={{
                                            color: isActive ? 'white' : 'text.secondary',
                                            fontSize: '0.55rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.3px',
                                            opacity: isActive ? 0.9 : 0.7
                                        }}
                                    >
                                        {card.title}
                                    </SoftTypography>
                                    <SoftTypography
                                        variant="h3"
                                        fontWeight="bold"
                                        sx={{
                                            color: isActive ? 'white' : 'dark',
                                            fontSize: { xs: '1.5rem', sm: '1.75rem' },
                                            mt: 0.3
                                        }}
                                    >
                                        {card.value}
                                    </SoftTypography>
                                </SoftBox>
                                <Box
                                    sx={{
                                        background: isActive
                                            ? 'rgba(255, 255, 255, 0.2)'
                                            : `${card.color}15`,
                                        borderRadius: '8px',
                                        p: 0.75,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Icon
                                        sx={{
                                            fontSize: { xs: 18, sm: 20 },
                                            color: isActive ? 'white' : card.color
                                        }}
                                    />
                                </Box>
                            </SoftBox>
                            <SoftTypography
                                variant="caption"
                                sx={{
                                    color: isActive ? 'white' : 'text.secondary',
                                    fontSize: '0.6rem',
                                    opacity: isActive ? 0.9 : 0.7
                                }}
                            >
                                {card.subtitle}
                            </SoftTypography>
                        </CardContent>
                    </Card>
                );
            })}
        </SoftBox>
    );
}

GestionSummaryCards.propTypes = {
    gestiones: PropTypes.array.isRequired,
    activeFilter: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired
};

export default GestionSummaryCards;

