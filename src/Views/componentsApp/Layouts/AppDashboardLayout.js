/**
=========================================================
* GestiaSoft - App Dashboard Layout
=========================================================
* Custom dashboard layout with AppNavbar and AppFooter
*/

import { useEffect } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React context
import { useSoftUIController, setLayout } from "context";

// Custom AppNavbar and AppFooter
import { AppNavbar } from "../Navbars";
import { AppFooter } from "../Footer";

function AppDashboardLayout({ children }) {
    const [controller, dispatch] = useSoftUIController();
    const { miniSidenav } = controller;
    const { pathname } = useLocation();

    useEffect(() => {
        setLayout(dispatch, "dashboard");
    }, [pathname]);

    return (
        <SoftBox
            sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
                position: "relative",
                minHeight: "100vh",
                backgroundColor: "background.default",
                display: "flex",
                flexDirection: "column",
            })}
        >
            {/* AppNavbar */}
            <AppNavbar />

            {/* Main Content */}
            <SoftBox
                sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
                    p: 3,
                    pt: 10, // Add top padding to account for fixed navbar
                    position: "relative",
                    flex: 1, // Take remaining space

                    [breakpoints.up("xl")]: {
                        marginLeft: miniSidenav ? pxToRem(120) : pxToRem(274),
                        transition: transitions.create(["margin-left", "margin-right"], {
                            easing: transitions.easing.easeInOut,
                            duration: transitions.duration.standard,
                        }),
                    },
                })}
            >
                {children}
            </SoftBox>

            {/* AppFooter */}
            <AppFooter />
        </SoftBox>
    );
}

// Typechecking props for the AppDashboardLayout
AppDashboardLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppDashboardLayout;
