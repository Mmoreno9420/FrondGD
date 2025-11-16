/**
=========================================================
* GestiaSoft - Gestion Detail Info Component
=========================================================
* Detail information component for gestion view
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import { Grid, Card, CardContent, Divider, Chip } from "@mui/material";

// @mui icons
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Helpers
import { formatDate, getEstadoColor, getEstadoStyle, getPrioridadColor, getPrioridadStyle } from "../helpers/estilos";

// Función para eliminar etiquetas HTML
const stripHtmlTags = (html) => {
    if (!html) return "";
    // Crear un elemento temporal para extraer solo el texto
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
};

function GestionDetailInfo({ gestion, formData }) {
    return (
        <Grid container spacing={3}>
            {/* Información General */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <SoftBox mb={2}>
                            <SoftTypography variant="h5" fontWeight="bold" color="dark">
                                <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Información General
                            </SoftTypography>
                        </SoftBox>
                        <Divider />
                        <SoftBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        ID de Gestión:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        #{gestion?.gestion_id || "-"}
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={12}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Nombre:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {formData.nombre || "-"}
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={12}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Descripción:
                                    </SoftTypography>
                                    <SoftBox mt={1}>
                                        <SoftTypography 
                                            variant="body2" 
                                            color="dark"
                                            sx={{
                                                whiteSpace: 'pre-wrap', // Permite saltos de línea y espacios
                                                wordBreak: 'break-word', // Rompe palabras largas si es necesario
                                                overflowWrap: 'break-word', // Envuelve el texto largo
                                                maxHeight: 'none', // Sin límite de altura
                                                overflow: 'visible', // Mostrar todo el contenido sin scroll
                                                lineHeight: 1.6, // Mejor legibilidad con líneas múltiples
                                            }}
                                        >
                                            {stripHtmlTags(formData.descripcion) || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                </Grid>
                                <Grid item xs={6}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Estado:
                                    </SoftTypography>
                                    <SoftBox mt={0.5}>
                                        {(() => {
                                            const estado = formData.estado_nombre || "Sin estado";
                                            const estadoColor = getEstadoColor(estado);
                                            const style = getEstadoStyle(estadoColor);

                                            return (
                                                <Chip
                                                    label={estado}
                                                    size="small"
                                                    sx={{
                                                        background: style.background,
                                                        color: style.color,
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        borderRadius: '12px',
                                                        border: style.border,
                                                        boxShadow: style.boxShadow,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        '&:hover': {
                                                            background: style.hoverBackground,
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: style.hoverBoxShadow
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                />
                                            );
                                        })()}
                                    </SoftBox>
                                </Grid>
                                <Grid item xs={6}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Prioridad:
                                    </SoftTypography>
                                    <SoftBox mt={0.5}>
                                        {(() => {
                                            const prioridad = formData.prioridad_nombre || "Sin prioridad";
                                            const prioridadColor = getPrioridadColor(prioridad);
                                            const style = getPrioridadStyle(prioridadColor);

                                            return (
                                                <Chip
                                                    label={prioridad}
                                                    size="small"
                                                    sx={{
                                                        background: style.background,
                                                        color: style.color,
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        borderRadius: '12px',
                                                        border: style.border,
                                                        boxShadow: style.boxShadow,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px',
                                                        '&:hover': {
                                                            background: style.hoverBackground,
                                                            transform: 'translateY(-1px)',
                                                            boxShadow: style.hoverBoxShadow
                                                        },
                                                        transition: 'all 0.2s ease'
                                                    }}
                                                />
                                            );
                                        })()}
                                    </SoftBox>
                                </Grid>
                                <Grid item xs={6}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Creado Por:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {gestion?.creado_por || formData?.creado_por || "-"}
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={6}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Unidad Creadora:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {gestion?.unidad_creadora || formData?.unidad_creadora || "-"}
                                    </SoftTypography>
                                </Grid>
                            </Grid>
                        </SoftBox>
                    </CardContent>
                </Card>
            </Grid>

            {/* Información del Flujo */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <SoftBox mb={2}>
                            <SoftTypography variant="h5" fontWeight="bold" color="dark">
                                <AccountTreeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Flujo de Trabajo
                            </SoftTypography>
                        </SoftBox>
                        <Divider />
                        <SoftBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            ID de Flujo:
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="dark">
                                            #{formData.workflow_id || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            Paso Actual:
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="dark">
                                            Paso #{formData.paso_numero || gestion?.paso_numero || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            Nombre del Paso:
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="dark">
                                            {formData.nombre_paso || gestion?.nombre_paso || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            Descripción del Paso:
                                        </SoftTypography>
                                        <SoftTypography
                                            variant="body2"
                                            color="dark"
                                            sx={{
                                                wordBreak: 'break-word',
                                                overflowWrap: 'break-word',
                                                whiteSpace: 'normal'
                                            }}
                                        >
                                            {formData.descripcion_paso || gestion?.descripcion_paso || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                </Grid>
                                <Grid item xs={6}>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            Tipo de Flujo:
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="dark">
                                            {formData.tipo_flujo_id || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold">
                                            Estado del Flujo:
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="dark">
                                            {formData.estado_flujo || "-"}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={2}>
                                        <SoftTypography variant="caption" color="text" fontWeight="bold" mb={1} display="block">
                                            Unidades que ya atendieron:
                                        </SoftTypography>
                                        {gestion?.unidades_atendiendo && gestion.unidades_atendiendo.length > 0 ? (
                                            (() => {
                                                // Filtrar unidades que ya terminaron (estado === true)
                                                const unidadesCompletadas = gestion.unidades_atendiendo.filter(
                                                    unidad => unidad.estado === true
                                                );

                                                if (unidadesCompletadas.length === 0) {
                                                    return (
                                                        <SoftTypography
                                                            variant="body2"
                                                            color="text"
                                                            fontStyle="italic"
                                                            sx={{
                                                                wordBreak: 'break-word',
                                                                overflowWrap: 'break-word',
                                                                whiteSpace: 'normal'
                                                            }}
                                                        >
                                                            Ninguna unidad ha completado su trabajo en este paso
                                                        </SoftTypography>
                                                    );
                                                }

                                                return (
                                                    <SoftBox display="flex" flexDirection="column" gap={0.5}>
                                                        {unidadesCompletadas.map((unidad, index) => (
                                                            <Chip
                                                                key={`completada-${unidad.unidad_id || index}`}
                                                                label={unidad.nombre_unidad || `Unidad ${unidad.unidad_id}`}
                                                                size="small"
                                                                sx={{
                                                                    backgroundColor: "#e8f5e9",
                                                                    color: "#2e7d32",
                                                                    fontSize: "0.75rem",
                                                                    fontWeight: "600",
                                                                    border: "1px solid #66bb6a",
                                                                    width: "fit-content"
                                                                }}
                                                            />
                                                        ))}
                                                    </SoftBox>
                                                );
                                            })()
                                        ) : (
                                            <SoftTypography variant="body2" color="text" fontStyle="italic">
                                                No hay unidades asignadas
                                            </SoftTypography>
                                        )}
                                    </SoftBox>
                                </Grid>
                            </Grid>
                        </SoftBox>
                    </CardContent>
                </Card>
            </Grid>

            {/* Fechas */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <SoftBox mb={2}>
                            <SoftTypography variant="h5" fontWeight="bold" color="dark">
                                <CalendarTodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Fechas
                            </SoftTypography>
                        </SoftBox>
                        <Divider />
                        <SoftBox mt={2}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Fecha de Creación:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {formatDate(formData.fecha_creacion)}
                                    </SoftTypography>
                                </Grid>
                                <Grid item xs={12}>
                                    <SoftTypography variant="caption" color="text" fontWeight="bold">
                                        Fecha de Llegada al Paso:
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="dark">
                                        {formatDate(formData.fecha_llegada_paso)}
                                    </SoftTypography>
                                </Grid>
                            </Grid>
                        </SoftBox>
                    </CardContent>
                </Card>
            </Grid>

            {/* Unidades */}
            <Grid item xs={12}>
                <Card>
                    <CardContent>
                        <SoftBox mb={2}>
                            <SoftTypography variant="h5" fontWeight="bold" color="dark">
                                <BusinessIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Unidades Responsables
                            </SoftTypography>
                        </SoftBox>
                        <Divider />
                        <SoftBox mt={2}>
                            {formData.unidades_atendiendo && formData.unidades_atendiendo.length > 0 ? (
                                <SoftBox display="flex" gap={1} flexWrap="wrap">
                                    {formData.unidades_atendiendo.map((unidad, index) => (
                                        <Chip
                                            key={index}
                                            label={unidad.nombre_unidad}
                                            size="medium"
                                            sx={{
                                                backgroundColor: "#e3f2fd",
                                                color: "#1976d2",
                                                fontSize: "0.875rem",
                                                fontWeight: "600"
                                            }}
                                        />
                                    ))}
                                </SoftBox>
                            ) : (
                                <SoftTypography variant="body2" color="text">
                                    Sin unidades asignadas
                                </SoftTypography>
                            )}
                        </SoftBox>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

GestionDetailInfo.propTypes = {
    gestion: PropTypes.object,
    formData: PropTypes.object.isRequired
};

export default GestionDetailInfo;

