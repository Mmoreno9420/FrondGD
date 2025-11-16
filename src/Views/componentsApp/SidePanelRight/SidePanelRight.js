/**
=========================================================
* GestiaSoft - Side Panel Right Component
=========================================================
* Reusable right side panel for forms and content
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Drawer,
    IconButton,
    Divider
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom styles for the panel - matching the GestionInfoPanel design
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

const SidePanelRight = ({
    open,
    onClose,
    title = "Panel",
    subtitle = "Crea una nueva gestión ingresando y validando la información requerida. ",
    children,
    showCloseButton = true,
    showDivider = true,
    size = "default", // "small", "default", "large", "xl"
    maxWidth = null
}) => {
    const handleClose = () => {
        onClose();
    };

    // Función para obtener el tamaño del panel basado en el prop size
    const getPanelWidth = () => {
        if (maxWidth) {
            return {
                xs: "100%",
                sm: Math.min(350, maxWidth),
                md: Math.min(400, maxWidth),
                lg: Math.min(450, maxWidth),
                xl: Math.min(500, maxWidth)
            };
        }

        switch (size) {
            case "small":
                return { xs: "100%", sm: 300, md: 350, lg: 400 };
            case "large":
                return { xs: "100%", sm: 450, md: 550, lg: 650, xl: 700 };
            case "xl":
                return { xs: "100%", sm: 500, md: 600, lg: 750, xl: 800 };
            case "default":
            default:
                return { xs: "100%", sm: 350, md: 400, lg: 450 };
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                ...panelStyles,
                "& .MuiDrawer-paper": {
                    ...panelStyles["& .MuiDrawer-paper"],
                    width: getPanelWidth(),
                },
            }}
            ModalProps={{
                keepMounted: true, // Better mobile performance
            }}
        >
            {/* Header */}
            <SoftBox
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                pt={{ xs: 2, sm: 3, md: 4 }}
                pb={1}
                px={{ xs: 1, sm: 1, md: 1 }}
            >
                <SoftBox>
                    <SoftTypography
                        variant="h5"
                        fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
                    >
                        {title}
                    </SoftTypography>
                    {subtitle && (
                        <SoftTypography
                            variant="body2"
                            color="text"
                            fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
                        >
                            {subtitle}
                        </SoftTypography>
                    )}
                </SoftBox>

                {/* Close button in header (always visible) */}
                {showCloseButton && (
                    <IconButton
                        onClick={handleClose}
                        size="large"
                        sx={{
                            color: "text.secondary",
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.08)",
                                color: "text.primary"
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </SoftBox>

            {/* Divider */}
            {showDivider && <Divider />}

            {/* Content */}
            <SoftBox pt={2} pb={1} px={1}>
                {children}
            </SoftBox>
        </Drawer>
    );
};

SidePanelRight.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node.isRequired,
    showCloseButton: PropTypes.bool,
    showDivider: PropTypes.bool,
    size: PropTypes.oneOf(["small", "default", "large", "xl"]),
    maxWidth: PropTypes.number
};

export default SidePanelRight;
