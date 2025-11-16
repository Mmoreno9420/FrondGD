/**
 * Componente simple de prueba para Gestiones
 */

import React from "react";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { Card, CardContent, Container, Grid } from "@mui/material";
import { AppPageLayout } from "Views/componentsApp";
import curved0 from "assets/images/curved-images/curved0.jpg";

function GestionesSimple() {
    return (
        <AppPageLayout
            title="Gestiones"
            description="Gestión de flujos de trabajo"
            backgroundImage={curved0}
            showBackground={false}
        >
            <SoftBox py={3}>
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <SoftTypography variant="h3" fontWeight="bold" color="dark" mb={2}>
                                        🎉 ¡Pantalla de Gestiones Funcionando!
                                    </SoftTypography>
                                    <SoftTypography variant="body1" color="text">
                                        Si puedes ver este mensaje, significa que la ruta está configurada correctamente.
                                    </SoftTypography>
                                    <SoftBox mt={3}>
                                        <SoftTypography variant="body2" color="text">
                                            <strong>Ruta:</strong> /gestiones/gestion
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="text">
                                            <strong>Componente:</strong> GestionesSimple.js
                                        </SoftTypography>
                                        <SoftTypography variant="body2" color="text">
                                            <strong>Estado:</strong> ✅ Funcionando correctamente
                                        </SoftTypography>
                                    </SoftBox>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </SoftBox>
        </AppPageLayout>
    );
}

export default GestionesSimple;











