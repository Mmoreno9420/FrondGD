/**
=========================================================
* GestiaSoft - Side Panel Left Component
=========================================================
* Reusable left side panel for notifications and content
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Drawer,
    IconButton
} from "@mui/material";

// @mui icons
import CloseIcon from "@mui/icons-material/Close";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

const SidePanelLeft = ({
    open,
    onClose,
    title = "Panel",
    subtitle = "",
    children,
    showCloseButton = true
}) => {
    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                zIndex: 1300,
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: 350, md: 400, lg: 450 },
                    height: "100vh",
                    margin: 0,
                    padding: 0,
                    borderRadius: "0px",
                    boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.1)",
                    overflowY: "auto",
                    backgroundColor: "white"
                }
            }}
        >
            {/* Header */}
            <SoftBox
                sx={{
                    p: 3,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
                    backgroundColor: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 10
                }}
            >
                <SoftBox>
                    <SoftTypography
                        variant="h5"
                        fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
                        color="dark"
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

                {showCloseButton && (
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: "text.secondary",
                            "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.04)"
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                )}
            </SoftBox>

            {/* Content */}
            <SoftBox sx={{ flex: 1 }}>
                {children}
            </SoftBox>
        </Drawer>
    );
};

// Typechecking props for the SidePanelLeft
SidePanelLeft.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node.isRequired,
    showCloseButton: PropTypes.bool
};

export default SidePanelLeft;
