/**
=========================================================
* GestiaSoft - App Sidenav Layout
=========================================================
* Custom layout using AppSidenav for the application
*/

import { useState } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React context
import { useSoftUIController } from "context";

// Soft UI Dashboard PRO React themes
import theme from "assets/theme";

// Custom App Components
import AppNavbar from "../Navbars/AppNavbar";
import AppFooter from "../Footer/AppFooter";
import AppSidenav from "../Sidenav/AppSidenav";
import { APP_NAME } from "config/appConfig";

function AppSidenavLayout({ children, routes, brand, brandName, sidenavColor = "info" }) {
    const [controller] = useSoftUIController();
    const { sidenavColor: sidenavColorFromContext } = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);

    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav) {
            setOnMouseEnter(true);
        }
    };

    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setOnMouseEnter(false);
        }
    };

    const { miniSidenav } = controller;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SoftBox
                sx={{
                    display: "flex",
                    minHeight: "100vh",
                    backgroundColor: "background.default",
                }}
            >
                {/* AppSidenav */}
                <AppSidenav
                    color={sidenavColor || sidenavColorFromContext}
                    brand={brand}
                    brandName={APP_NAME}
                    routes={routes}
                    onMouseEnter={handleOnMouseEnter}
                    onMouseLeave={handleOnMouseLeave}
                />

                {/* Main Content */}
                <SoftBox
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        minHeight: "100vh",
                        backgroundColor: "background.default",
                    }}
                >
                    {/* AppNavbar */}
                    <AppNavbar />

                    {/* Page Content */}
                    <SoftBox
                        component="main"
                        sx={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            pt: { xs: 8, lg: 10 }, // Top padding to account for fixed navbar
                            px: { xs: 1, lg: 3 },
                            pb: 3,
                        }}
                    >
                        {children}
                    </SoftBox>

                    {/* AppFooter */}
                    <AppFooter />
                </SoftBox>
            </SoftBox>
        </ThemeProvider>
    );
}

// Typechecking props for the AppSidenavLayout
AppSidenavLayout.propTypes = {
    children: PropTypes.node.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    brand: PropTypes.string,
    brandName: PropTypes.string,
    sidenavColor: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
};

export default AppSidenavLayout;
