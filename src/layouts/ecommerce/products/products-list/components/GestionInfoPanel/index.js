/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.2
=========================================================

* Product Page: https://material-ui.com/store/items/soft-ui-pro-dashboard/
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Drawer from "@mui/material/Drawer";
import Icon from "@mui/material/Icon";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftPagination from "components/SoftPagination";

// Timeline components
import TimelineList from "examples/Timeline/TimelineList";
import TimelineItem from "examples/Timeline/TimelineItem";

// Custom styles for the panel
const panelStyles = {
    "& .MuiDrawer-paper": {
        width: { xs: "100%", sm: 350, md: 400, lg: 450 },
        height: "100vh",
        margin: 0,
        padding: { xs: "0 8px", sm: "0 12px", md: "0 16px" },
        borderRadius: "0px",
        boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
        overflowY: "auto",
    },
};

function GestionInfoPanel({ open, onClose, gestionData }) {
    const [selectedTab, setSelectedTab] = useState("timeline");
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const documentsPerPage = 3;

    const handleClose = () => {
        onClose();
    };

    const handleOpenDocuments = () => {
        setShowDocumentsModal(true);
    };

    const handleCloseDocuments = () => {
        setShowDocumentsModal(false);
        setCurrentPage(0);
    };

    // Datos de ejemplo para los documentos
    const documents = [
        { id: 1, name: "Solicitud de Compra", type: "PDF", size: "2.5 MB", date: "12/03/2025" },
        { id: 2, name: "Cotización Proveedor A", type: "DOCX", size: "1.8 MB", date: "13/03/2025" },
        { id: 3, name: "Cotización Proveedor B", type: "PDF", size: "3.2 MB", date: "13/03/2025" },
        { id: 4, name: "Análisis Técnico", type: "PDF", size: "4.1 MB", date: "14/03/2025" },
        { id: 5, name: "Orden de Compra", type: "XLSX", size: "1.2 MB", date: "15/03/2025" }
    ];

    const totalPages = Math.ceil(documents.length / documentsPerPage);
    const startIndex = currentPage * documentsPerPage;
    const endIndex = startIndex + documentsPerPage;
    const currentDocuments = documents.slice(startIndex, endIndex);

    const renderTimelineContent = () => {
        const gestionName = gestionData?.product?.[0] || "Licitación de Equipos Médicos";
        const unidad = gestionData?.category || "Vigilancia Epidemiológica";
        const status = gestionData?.status;

        // Determinar el estado actual basado en el status de la gestión
        let currentStep = 0;
        if (status === "in stock") currentStep = 4; // Completado
        else if (status === "out of stock") currentStep = 1; // Atrasado
        else currentStep = 2; // En proceso

        return (
            <SoftBox sx={{
                maxWidth: "100%",
                overflow: "hidden",
                "& .MuiTimelineItem-root": {
                    "& .MuiTimelineContent-root": {
                        maxWidth: "100%",
                        wordWrap: "break-word",
                        overflowWrap: "break-word"
                    }
                },
                "& .MuiTypography-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                }
            }}>
                <TimelineList title={`Historial de: ${gestionName}`} dark={false}>
                    <TimelineItem
                        color={currentStep >= 0 ? "info" : "secondary"}
                        icon="notifications"
                        title="Gestión Creada Unidad 1"
                        dateTime="12/03/2025 - 09:00 AM"
                        description={`Se ha creado la gestión "${gestionName}" en la unidad de ${unidad}.`}
                        badges={["Nuevo"]}
                        handleOpenDocuments={handleOpenDocuments}
                    />


                    <TimelineItem
                        color={currentStep >= 1 ? "success" : "secondary"}
                        icon="schedule"
                        title="Paso por Unidad 123"
                        dateTime="13/03/2025 - 02:30 PM"
                        description="Se han completado todos los documentos requeridos para la gestión."
                        badges={["Completado"]}
                        handleOpenDocuments={handleOpenDocuments}
                    />


                    <TimelineItem
                        color={currentStep >= 1 ? "success" : "secondary"}
                        icon="schedule"
                        title="Paso por Unidad 456"
                        dateTime="14/03/2025 - 11:15 AM"
                        description="La gestión se encuentra en proceso de revisión por el departamento de compras."
                        badges={["Completado"]}
                        handleOpenDocuments={handleOpenDocuments}
                    />


                    <TimelineItem
                        color={currentStep >= 1 ? "success" : "secondary"}
                        icon="schedule"
                        title="Paso por Unidad 1234"
                        dateTime="15/03/2025 - 04:45 PM"
                        description="Se aprueba y sube documentaciòn pendiente."
                        badges={["Completado"]}
                        handleOpenDocuments={handleOpenDocuments}
                    />


                    <TimelineItem
                        color={currentStep >= 1 ? "secondary" : "secondary"}
                        icon="assignment"
                        title="Unidad 1"
                        dateTime="16/03/2025 - 10:00 AM"
                        description="Gestion cerrada."
                        badges={["Programado"]}
                        lastItem={true}
                        handleOpenDocuments={handleOpenDocuments}
                    />

                </TimelineList>
            </SoftBox>
        );
    };

    const renderDetailsContent = () => (
        <SoftBox sx={{ maxWidth: "100%", overflow: "hidden" }}>
            <SoftBox mb={3}>
                <SoftTypography
                    variant="h6"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "1rem", sm: "1.125rem", md: "1.25rem" }}
                >
                    Detalles de la Gestión
                </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Expediente:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {gestionData?.product?.[0] || "Licitación de Equipos Médicos"}
                </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Unidad:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {gestionData?.category || "Vigilancia Epidemiológica"}
                </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Fecha de Creación:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {gestionData?.price || "12/03/2025"}
                </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Fecha de Llegada:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {gestionData?.sku || "15/03/2025"}
                </SoftTypography>
            </SoftBox>

            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Estado:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal"
                    }}
                >
                    {gestionData?.status === "in stock" ? "Recibido" :
                        gestionData?.status === "out of stock" ? "Atrasado" : "En Proceso"}
                </SoftTypography>
            </SoftBox>


            <SoftBox mb={2}>
                <SoftTypography
                    variant="button"
                    fontWeight="medium"
                    color="dark"
                    mb={1}
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                >
                    Información Adicional:
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    color="text"
                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                    sx={{
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        whiteSpace: "normal",
                        lineHeight: 1.5,
                        maxWidth: "100%"
                    }}
                >
                    Esta gestión se encuentra en el sistema de seguimiento y será monitoreada hasta su finalización.
                </SoftTypography>
            </SoftBox>


        </SoftBox>
    );

    return (
        <SoftBox>
            <Drawer
                anchor="right"
                open={open}
                onClose={handleClose}
                sx={panelStyles}
            >
                <SoftBox
                    display="flex"
                    justifyContent="space-between"
                    alignItems="baseline"
                    pt={{ xs: 2, sm: 3, md: 4 }}
                    pb={1}
                    px={{ xs: 1, sm: 1, md: 1 }}
                >
                    <SoftBox>
                        <SoftTypography
                            variant="h5"
                            fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
                        >
                            Información de Gestión
                        </SoftTypography>
                        <SoftTypography
                            variant="body2"
                            color="text"
                            fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                        >
                            Detalles y seguimiento de la gestión seleccionada
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>

                <Divider />

                <SoftBox pt={2} pb={1} px={1}>
                    {/* Indicador de progreso */}
                    {gestionData && (
                        <SoftBox mb={3}>
                            <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                <SoftTypography
                                    variant="button"
                                    fontWeight="medium"
                                    color="dark"
                                    fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                                >
                                    Progreso de la Gestión
                                </SoftTypography>
                                <SoftTypography
                                    variant="caption"
                                    color="dark"
                                    fontSize={{ xs: "0.625rem", sm: "0.75rem", md: "0.875rem" }}
                                >
                                    {(() => {
                                        const status = gestionData.status;
                                        if (status === "in stock") return "  Completado";
                                        if (status === "out of stock") return "  Atrasado";
                                        return " En Proceso";
                                    })()}
                                </SoftTypography>
                            </SoftBox>
                            <SoftBox
                                sx={{
                                    width: "100%",
                                    height: { xs: "6px", sm: "8px" },
                                    bgcolor: "grey.200",
                                    borderRadius: "4px",
                                    overflow: "hidden",
                                }}
                            >
                                <SoftBox
                                    sx={{
                                        width: (() => {
                                            const status = gestionData.status;
                                            if (status === "in stock") return "100%";
                                            if (status === "out of stock") return "25%";
                                            return "50%";
                                        })(),
                                        height: "100%",
                                        bgcolor: (() => {
                                            const status = gestionData.status;
                                            if (status === "in stock") return "success.main";
                                            if (status === "out of stock") return "error.main";
                                            return "warning.main";
                                        })(),
                                        transition: "width 0.5s ease-in-out",
                                    }}
                                />
                            </SoftBox>
                        </SoftBox>
                    )}

                    <SoftBox display="flex" mb={2}>
                        <SoftButton
                            color="info"
                            variant={selectedTab === "timeline" ? "gradient" : "outlined"}
                            onClick={() => setSelectedTab("timeline")}
                            size="small"
                            sx={{
                                mr: 1,
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                            }}
                        >
                            Timeline
                        </SoftButton>
                        <SoftButton
                            color="info"
                            variant={selectedTab === "details" ? "gradient" : "outlined"}
                            onClick={() => setSelectedTab("details")}
                            size="small"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                            }}
                        >
                            Detalles
                        </SoftButton>
                    </SoftBox>

                    {selectedTab === "timeline" && renderTimelineContent()}
                    {selectedTab === "details" && renderDetailsContent()}

                    {!gestionData && (
                        <SoftBox textAlign="center" py={4}>
                            <Icon sx={{
                                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                                color: "text",
                                mb: 2
                            }}>
                                info
                            </Icon>
                            <SoftTypography
                                variant="h6"
                                color="text"
                                mb={1}
                                fontSize={{ xs: "1rem", sm: "1.125rem", md: "1.25rem" }}
                            >
                                No hay gestión seleccionada
                            </SoftTypography>
                            <SoftTypography
                                variant="body2"
                                color="text"
                                mb={1}
                                fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                            >
                                Selecciona una gestión de la tabla para ver su información detallada
                            </SoftTypography>
                        </SoftBox>
                    )}

                    {/* Botón de cerrar en la parte inferior */}
                    <SoftBox mt={3} textAlign="center">
                        <SoftButton
                            color="dark"
                            variant="outlined"
                            onClick={handleClose}
                            fullWidth
                            size="small"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                            }}
                        >
                            Cerrar Panel
                        </SoftButton>
                    </SoftBox>
                </SoftBox>
            </Drawer>

            {/* Modal de Documentos */}
            {showDocumentsModal && (
                <Dialog
                    open={showDocumentsModal}
                    onClose={handleCloseDocuments}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                            <SoftBox display="flex" alignItems="center" gap={1}>
                                <Icon sx={{ color: "info.main", fontSize: "1.5rem" }}>folder</Icon>
                                <SoftTypography
                                    variant="h5"
                                    fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
                                >
                                    Documentos de la Gestión
                                </SoftTypography>
                            </SoftBox>
                            <SoftButton
                                color="dark"
                                variant="outlined"
                                size="small"
                                onClick={handleCloseDocuments}
                                sx={{
                                    minWidth: "auto",
                                    borderRadius: "50%",
                                    width: "32px",
                                    height: "32px",
                                    p: 0
                                }}
                            >
                                ✕
                            </SoftButton>
                        </SoftBox>
                    </DialogTitle>

                    <DialogContent>
                        <SoftBox>
                            {currentDocuments.map((doc) => (
                                <SoftBox
                                    key={doc.id}
                                    p={2}
                                    mb={2}
                                    bgcolor="grey.50"
                                    borderRadius="12px"
                                    border="1px solid"
                                    borderColor="grey.200"
                                    sx={{
                                        transition: "all 0.2s ease-in-out",
                                        "&:hover": {
                                            bgcolor: "grey.100",
                                            borderColor: "info.main",
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                        }
                                    }}
                                >
                                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <Icon sx={{ color: "info.main", fontSize: "1.25rem" }}>
                                                {doc.type === "PDF" ? "picture_as_pdf" :
                                                    doc.type === "DOCX" ? "description" :
                                                        doc.type === "XLSX" ? "table_chart" : "insert_drive_file"}
                                            </Icon>
                                            <SoftTypography
                                                variant="subtitle2"
                                                fontWeight="medium"
                                                fontSize={{ xs: "0.875rem", sm: "1rem" }}
                                            >
                                                {doc.name}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftButton
                                            color="info"
                                            variant="contained"
                                            size="small"
                                            onClick={() => console.log(`Ver documento: ${doc.name}`)}
                                            startIcon={<Icon>visibility</Icon>}
                                            sx={{
                                                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                                                borderRadius: "8px",
                                                textTransform: "none",
                                                fontWeight: "500",
                                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                                "&:hover": {
                                                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
                                                }
                                            }}
                                        >
                                            Ver
                                        </SoftButton>
                                    </SoftBox>

                                    <SoftBox display="flex" gap={2} flexWrap="wrap" mt={1}>
                                        <SoftBox display="flex" alignItems="center" gap={0.5}>
                                            <Icon sx={{ fontSize: "0.875rem", color: "text.secondary" }}>category</Icon>
                                            <SoftTypography
                                                variant="caption"
                                                color="text.secondary"
                                                fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                                            >
                                                {doc.type}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftBox display="flex" alignItems="center" gap={0.5}>
                                            <Icon sx={{ fontSize: "0.875rem", color: "text.secondary" }}>storage</Icon>
                                            <SoftTypography
                                                variant="caption"
                                                color="text.secondary"
                                                fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                                            >
                                                {doc.size}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftBox display="flex" alignItems="center" gap={0.5}>
                                            <Icon sx={{ fontSize: "0.875rem", color: "text.secondary" }}>event</Icon>
                                            <SoftTypography
                                                variant="caption"
                                                color="text.secondary"
                                                fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                                            >
                                                {doc.date}
                                            </SoftTypography>
                                        </SoftBox>
                                    </SoftBox>
                                </SoftBox>
                            ))}
                        </SoftBox>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <SoftBox
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap={2}
                                mt={3}
                                p={2}
                                bgcolor="grey.50"
                                borderRadius="12px"
                            >
                                <SoftPagination
                                    variant="gradient"
                                    color="info"
                                    size="medium"
                                >
                                    <SoftPagination
                                        item
                                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                                        disabled={currentPage === 0}
                                    >
                                        <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                                    </SoftPagination>
                                </SoftPagination>

                                <SoftBox
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                    px={2}
                                    py={1}
                                    bgcolor="white"
                                    borderRadius="8px"
                                    border="1px solid"
                                    borderColor="grey.200"
                                >
                                    <Icon sx={{ fontSize: "1rem", color: "info.main" }}>pageview</Icon>
                                    <SoftTypography
                                        variant="body2"
                                        color="text"
                                        fontSize={{ xs: "0.75rem", sm: "0.875rem" }}
                                        fontWeight="500"
                                    >
                                        Página {currentPage + 1} de {totalPages}
                                    </SoftTypography>
                                </SoftBox>

                                <SoftPagination
                                    variant="gradient"
                                    color="info"
                                    size="medium"
                                >
                                    <SoftPagination
                                        item
                                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                                        disabled={currentPage === totalPages - 1}
                                    >
                                        <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                                    </SoftPagination>
                                </SoftPagination>
                            </SoftBox>
                        )}
                    </DialogContent>

                    <DialogActions>
                        <SoftButton
                            color="dark"
                            variant="outlined"
                            onClick={handleCloseDocuments}
                            fullWidth
                            size="small"
                            sx={{
                                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }
                            }}
                        >
                            Cerrar
                        </SoftButton>
                    </DialogActions>
                </Dialog>
            )}
        </SoftBox>
    );
}

export default GestionInfoPanel;

// Typechecking props for the GestionInfoPanel
GestionInfoPanel.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    gestionData: PropTypes.object,
};
