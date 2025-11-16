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

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftSelect from "components/SoftSelect";
import SoftDatePicker from "components/SoftDatePicker";
import SoftEditor from "components/SoftEditor";
import SoftDropzone from "components/SoftDropzone";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Timeline component
import TimelineItem from "examples/Timeline/TimelineItem";

// Custom components
import DocumentsTable from "./components/DocumentsTable";
import UploadDocumentModal from "./components/UploadDocumentModal";

// Data
import { timelineData, documentsData, currentGestionData } from "./data/editProjectData";

function EditProject() {
    const [startDate, setStartDate] = useState(new Date(currentGestionData.startDate));
    const [editorValue, setEditorValue] = useState(
        currentGestionData.description
    );
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const handleSetStartDate = (newDate) => setStartDate(newDate);

    const handleUploadDocument = (documentData) => {
        // Aquí se implementaría la lógica para subir el documento
        console.log('Documento a subir:', documentData);
        // Por ahora solo simulamos la subida
        alert(`Documento "${documentData.file.name}" subido exitosamente`);
    };

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox mt={3} mb={4}>
                <Grid container spacing={3}>
                    {/* Recuadro izquierdo - Formulario de edición */}
                    <Grid item xs={12} lg={6}>
                        <Card sx={{ overflow: "visible" }}>
                            <SoftBox p={2} lineHeight={1}>
                                <SoftTypography variant="h6" fontWeight="medium">
                                    Editar gestión
                                </SoftTypography>
                                <SoftTypography variant="button" fontWeight="regular" color="text">
                                    Modificar gestión existente
                                </SoftTypography>

                                {/* Panel de información de la gestión */}
                                <SoftBox mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={3}>
                                            <SoftTypography variant="caption" fontWeight="bold" color="text">
                                                Estado actual:
                                            </SoftTypography>
                                            <SoftTypography variant="body2" color="info">
                                                {currentGestionData.status}
                                            </SoftTypography>
                                        </Grid>

                                        <Grid item xs={12} md={3}>
                                            <SoftTypography variant="caption" fontWeight="bold" color="text">
                                                Fecha de inicio:
                                            </SoftTypography>
                                            <SoftTypography variant="body2" color="text">
                                                {currentGestionData.startDate}
                                            </SoftTypography>
                                        </Grid>
                                    </Grid>
                                </SoftBox>

                                <Divider />

                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                                            Nombre de la gestión
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftInput placeholder="Nombre de la gestión" defaultValue={currentGestionData.name} />
                                </SoftBox>

                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                                            Descripción de la gestión
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox mb={1.5} ml={0.5} mt={0.5} lineHeight={0} display="inline-block">
                                        <SoftTypography
                                            component="label"
                                            variant="caption"
                                            fontWeight="regular"
                                            color="text"
                                        >
                                            Aquí se puede modificar la descripción de la gestión.
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftBox sx={{ height: "400px", mb: 3 }}>
                                        <SoftEditor
                                            value={editorValue}
                                            onChange={setEditorValue}
                                            style={{ height: "350px" }}
                                        />
                                    </SoftBox>
                                </SoftBox>

                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    justifyContent="flex-end"
                                    height="100%"
                                >
                                    <SoftBox mb={2} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                                        <SoftTypography component="label" variant="caption" fontWeight="bold">
                                            Unidades
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftSelect
                                        defaultValue={[
                                            { value: "unidad 1", label: "Gerencia administrativa" }
                                        ]}
                                        options={[
                                            { value: "unidad 1", label: "Gerencia administrativa" },
                                            { value: "unidad 2", label: "Unidad de Ejecución de Gasto" },
                                            { value: "unidad 3", label: "Unidad de compra" },
                                        ]}
                                        isMulti
                                    />
                                </SoftBox>

                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <SoftBox
                                            display="flex"
                                            flexDirection="column"
                                            justifyContent="flex-end"
                                            height="100%"
                                        >
                                            <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                                                <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                    Fecha de inicio
                                                </SoftTypography>
                                            </SoftBox>
                                            <SoftDatePicker value={startDate} onChange={handleSetStartDate} />
                                        </SoftBox>
                                    </Grid>
                                </Grid>

                                <SoftBox>
                                    <SoftBox
                                        display="flex"
                                        flexDirection="column"
                                        justifyContent="flex-end"
                                        height="100%"
                                    >
                                        <SoftBox mb={1} ml={0.5} mt={3} lineHeight={0} display="inline-block">
                                            <SoftTypography component="label" variant="caption" fontWeight="bold">
                                                Archivos
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftDropzone options={{ addRemoveLinks: true }} />
                                    </SoftBox>
                                </SoftBox>

                                <SoftBox display="flex" justifyContent="flex-end" mt={3}>
                                    <SoftBox mr={1}>
                                        <SoftButton color="light">Cancelar</SoftButton>
                                    </SoftBox>
                                    <SoftButton variant="gradient" color="info">
                                        Guardar cambios
                                    </SoftButton>
                                </SoftBox>
                            </SoftBox>
                        </Card>
                    </Grid>

                    {/* Recuadro derecho - Timeline y Tabla */}
                    <Grid item xs={12} lg={6}>
                        <Grid container spacing={3}>
                            {/* Recuadro derecho superior - Timeline */}
                            <Grid item xs={12}>
                                <Card>
                                    <SoftBox p={2}>
                                        <SoftTypography variant="h6" fontWeight="medium" mb={2}>
                                            Flujo de la gestión
                                        </SoftTypography>
                                        <SoftBox sx={{ maxHeight: "300px", overflowY: "auto" }}>
                                            {timelineData.map((item, index) => (
                                                <TimelineItem
                                                    key={index}
                                                    color={item.color}
                                                    icon="check"
                                                    title={item.title}
                                                    dateTime={`Inicio: ${item.startDate} | Fin: ${item.endDate ? item.endDate : "En proceso..."}`}
                                                    description=""
                                                />
                                            ))}
                                        </SoftBox>
                                    </SoftBox>
                                </Card>
                            </Grid>

                            {/* Recuadro derecho inferior - Tabla de documentos */}
                            <Grid item xs={12}>
                                <Card>
                                    <SoftBox p={2}>
                                        <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                            <SoftTypography variant="h6" fontWeight="medium">
                                                Documentos y Comentarios
                                            </SoftTypography>
                                            <SoftButton
                                                variant="gradient"
                                                color="info"
                                                size="small"
                                                onClick={() => setUploadModalOpen(true)}
                                            >
                                                + Documento
                                            </SoftButton>
                                        </SoftBox>

                                        <SoftBox sx={{ maxHeight: "600px", overflowY: "auto" }}>
                                            <DocumentsTable documents={documentsData} />
                                        </SoftBox>
                                    </SoftBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </SoftBox>

            {/* Modal para subir documentos */}
            <UploadDocumentModal
                open={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUpload={handleUploadDocument}
            />

            <Footer />
        </DashboardLayout>
    );
}

export default EditProject;
