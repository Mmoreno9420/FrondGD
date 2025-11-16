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
import Switch from "@mui/material/Switch";

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

function NewProject() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [editorValue, setEditorValue] = useState(
    "<p>Hello World!</p><p>Some initial <strong>bold</strong> text</p><br><br>"
  );

  const handleSetStartDate = (newDate) => setStartDate(newDate);
  const handleSetEndDate = (newDate) => setEndDate(newDate);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox mt={3} mb={4}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} lg={9}>
            <Card sx={{ overflow: "visible" }}>
              <SoftBox p={2} lineHeight={1}>
                <SoftTypography variant="h6" fontWeight="medium">
                  Nueva gestión
                </SoftTypography>
                <SoftTypography variant="button" fontWeight="regular" color="text">
                  Crear nueva gestión
                </SoftTypography>
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
                  <SoftInput placeholder="Nombre de la gestión" />
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
                      Aquí se ingresa la descripción de la gestión.
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
                    Crear gestión
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
}

export default NewProject;
