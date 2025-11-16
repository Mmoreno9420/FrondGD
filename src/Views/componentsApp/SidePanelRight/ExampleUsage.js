/**
=========================================================
* GestiaSoft - SidePanelRight Example Usage
=========================================================
* Example demonstrating the improved SidePanelRight component
*/

import React, { useState } from "react";

// @mui material components
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";

// @mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Custom components
import { SidePanelRight } from "Views/componentsApp";
import { APP_NAME } from "config/appConfig";

function SidePanelRightExample() {
    const [panels, setPanels] = useState({
        create: false,
        edit: false,
        info: false,
        config: false
    });

    const handleOpenPanel = (panelName) => {
        setPanels(prev => ({ ...prev, [panelName]: true }));
    };

    const handleClosePanel = (panelName) => {
        setPanels(prev => ({ ...prev, [panelName]: false }));
    };

    return (
        <SoftBox p={3}>
            <Grid container spacing={3}>
                {/* Header */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <SoftBox textAlign="center" py={3}>
                                <SoftTypography variant="h3" color="info" fontWeight="bold" mb={2}>
                                    🎯 SidePanelRight - Ejemplos de Uso
                                </SoftTypography>
                                <SoftTypography variant="h6" color="text" mb={3}>
                                    Componente de panel lateral mejorado con el mismo estilo que el panel de gestión
                                </SoftTypography>
                            </SoftBox>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Example Buttons */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SoftBox textAlign="center" py={3}>
                                <InfoIcon sx={{ fontSize: 48, color: "info.main", mb: 2 }} />
                                <SoftTypography variant="h5" fontWeight="bold" mb={2}>
                                    Panel de Información
                                </SoftTypography>
                                <SoftTypography variant="body2" color="text" mb={3}>
                                    Panel con botón de cerrar en la parte inferior (por defecto)
                                </SoftTypography>
                                <SoftButton
                                    variant="gradient"
                                    color="info"
                                    onClick={() => handleOpenPanel("info")}
                                    startIcon={<InfoIcon />}
                                >
                                    Abrir Panel
                                </SoftButton>
                            </SoftBox>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SoftBox textAlign="center" py={3}>
                                <AddIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
                                <SoftTypography variant="h5" fontWeight="bold" mb={2}>
                                    Panel de Creación
                                </SoftTypography>
                                <SoftTypography variant="body2" color="text" mb={3}>
                                    Panel para crear nuevos elementos con subtítulo descriptivo
                                </SoftTypography>
                                <SoftButton
                                    variant="gradient"
                                    color="success"
                                    onClick={() => handleOpenPanel("create")}
                                    startIcon={<AddIcon />}
                                >
                                    Crear Nuevo
                                </SoftButton>
                            </SoftBox>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SoftBox textAlign="center" py={3}>
                                <EditIcon sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
                                <SoftTypography variant="h5" fontWeight="bold" mb={2}>
                                    Panel de Edición
                                </SoftTypography>
                                <SoftTypography variant="body2" color="text" mb={3}>
                                    Panel para editar elementos existentes
                                </SoftTypography>
                                <SoftButton
                                    variant="gradient"
                                    color="warning"
                                    onClick={() => handleOpenPanel("edit")}
                                    startIcon={<EditIcon />}
                                >
                                    Editar Elemento
                                </SoftButton>
                            </SoftBox>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <SoftBox textAlign="center" py={3}>
                                <Typography sx={{ fontSize: 48, color: "primary.main", mb: 2 }}>⚙️</Typography>
                                <SoftTypography variant="h5" fontWeight="bold" mb={2}>
                                    Panel de Configuración
                                </SoftTypography>
                                <SoftTypography variant="body2" color="text" mb={3}>
                                    Panel con botón de cerrar en el header y sin divisor
                                </SoftTypography>
                                <SoftButton
                                    variant="gradient"
                                    color="primary"
                                    onClick={() => handleOpenPanel("config")}
                                >
                                    Configurar
                                </SoftButton>
                            </SoftBox>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Panel de Información */}
            <SidePanelRight
                open={panels.info}
                onClose={() => handleClosePanel("info")}
                title="Información del Sistema"
                subtitle="Detalles y estadísticas del sistema {APP_NAME}"
            >
                <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" mb={3}>
                        📊 Estadísticas del Sistema
                    </SoftTypography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: "info.light", color: "white" }}>
                                <CardContent sx={{ textAlign: "center", py: 2 }}>
                                    <Typography variant="h4" fontWeight="bold">1,247</Typography>
                                    <Typography variant="body2">Usuarios Activos</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card sx={{ bgcolor: "success.light", color: "white" }}>
                                <CardContent sx={{ textAlign: "center", py: 2 }}>
                                    <Typography variant="h4" fontWeight="bold">89</Typography>
                                    <Typography variant="body2">Gestiones Activas</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <SoftBox mt={3}>
                        <SoftTypography variant="body2" color="text" lineHeight={1.6}>
                            Este panel lateral demuestra las mejoras implementadas en el componente SidePanelRight,
                            incluyendo el mismo estilo y proporciones que el panel de gestión de la plantilla.
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SidePanelRight>

            {/* Panel de Creación */}
            <SidePanelRight
                open={panels.create}
                onClose={() => handleClosePanel("create")}
                title="Crear Nuevo Elemento"
                subtitle="Complete la información para crear un nuevo elemento en el sistema"
            >
                <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" mb={3}>
                        ✨ Formulario de Creación
                    </SoftTypography>

                    <SoftBox p={3} bgcolor="grey.50" borderRadius={2} mb={3}>
                        <SoftTypography variant="body2" color="text" textAlign="center">
                            Aquí iría el formulario de creación con todos los campos necesarios.
                            El panel se adapta automáticamente al contenido y mantiene las proporciones correctas.
                        </SoftTypography>
                    </SoftBox>

                    <SoftBox p={3} bgcolor="primary.light" borderRadius={2} color="white">
                        <SoftTypography variant="body2" textAlign="center">
                            💡 <strong>Característica:</strong> El botón de cerrar se posiciona automáticamente
                            en la parte inferior del panel para una mejor experiencia de usuario.
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SidePanelRight>

            {/* Panel de Edición */}
            <SidePanelRight
                open={panels.edit}
                onClose={() => handleClosePanel("edit")}
                title="Editar Elemento"
                subtitle="Modificar información del elemento seleccionado"
            >
                <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" mb={3}>
                        ✏️ Formulario de Edición
                    </SoftTypography>

                    <SoftBox p={3} bgcolor="warning.light" borderRadius={2} mb={3}>
                        <SoftTypography variant="body2" color="text" textAlign="center">
                            Este panel muestra cómo se vería un formulario de edición.
                            Los estilos son consistentes con el resto de la aplicación.
                        </SoftTypography>
                    </SoftBox>

                    <SoftBox p={3} bgcolor="info.light" borderRadius={2} color="white">
                        <SoftTypography variant="body2" textAlign="center">
                            🎨 <strong>Diseño:</strong> Mismas proporciones y estilos que el panel de gestión
                            de la plantilla Soft UI Dashboard PRO.
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SidePanelRight>

            {/* Panel de Configuración */}
            <SidePanelRight
                open={panels.config}
                onClose={() => handleClosePanel("config")}
                title="Configuración del Sistema"
                subtitle="Ajustes y parámetros del sistema GestiaSoft"
                showDivider={false}
                closeButtonPosition="header"
            >
                <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" mb={3}>
                        ⚙️ Configuración
                    </SoftTypography>

                    <SoftBox p={3} bgcolor="grey.50" borderRadius={2} mb={3}>
                        <SoftTypography variant="body2" color="text" textAlign="center">
                            Este panel muestra la opción de botón de cerrar en el header.
                            También se puede ocultar el divisor para un diseño más limpio.
                        </SoftTypography>
                    </SoftBox>

                    <SoftBox p={3} bgcolor="success.light" borderRadius={2} color="white">
                        <SoftTypography variant="body2" textAlign="center">
                            🔧 <strong>Flexibilidad:</strong> El componente permite personalizar la posición
                            del botón de cerrar y otros elementos según las necesidades del diseño.
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SidePanelRight>
        </SoftBox>
    );
}

export default SidePanelRightExample;

















