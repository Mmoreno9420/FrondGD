/**
=========================================================
* GestiaSoft - App Page Layout
=========================================================
* Custom layout for pages that includes navbar, sidebar and footer
*/

import React, { useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import { Box } from "@mui/material";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React context
import { useSoftUIController, setLayout } from "context";

// Custom App Components
import { AppFooter } from "Views/componentsApp";
import AppNavbar from "../Navbars/AppNavbar";
import AppSidenav from "../Sidenav/AppSidenav";

// Global Configuration
import { APP_NAME } from "config/appConfig";

// Routes
import routes3 from "routes";

function AppPageLayout({ children, transparent = false, light = false }) {
    const [controller, dispatch] = useSoftUIController();
    const { miniSidenav } = controller;

    // Set layout to dashboard to ensure sidebar is visible
    useEffect(() => {
        setLayout(dispatch, "dashboard");
    }, [dispatch]);

    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
                backgroundColor: "background.default",
            }}
        >
            {/* AppSidenav - Custom sidebar */}
            <AppSidenav brandName={APP_NAME} routes={routes3} />

            {/* Main Content Area - Full width */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    backgroundColor: "background.default",
                    width: "100%", // Ocupa el 100% del espacio disponible
                    maxWidth: "100%", // Asegurar que no exceda el 100%
                }}
            >
                {/* AppNavbar - Custom navbar with configurable colors */}
                <AppNavbar />

                {/* Page Content - Full width */}
                <SoftBox
                    component="main"
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "28px",
                        alignItems: "stretch", // Estirar horizontalmente
                        justifyContent: "flex-start", // Alinear arriba
                        pb: 2,
                        width: "100%", // Ocupar todo el ancho disponible 
                    }}
                >
                    {children}
                </SoftBox>

                {/* AppFooter */}
                <AppFooter />
            </Box>
        </Box>
    );
}

// Typechecking props for the AppPageLayout
AppPageLayout.propTypes = {
    children: PropTypes.node.isRequired,
    transparent: PropTypes.bool,
    light: PropTypes.bool,
};

export default AppPageLayout;
