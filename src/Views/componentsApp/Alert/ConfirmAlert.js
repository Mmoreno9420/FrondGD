/**
=========================================================
* GestiaSoft - Confirm Alert Component
=========================================================
* Generic confirmation alert component for delete operations
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton
} from "@mui/material";

// @mui icons
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

const ConfirmAlert = ({
    open,
    onClose,
    onConfirm,
    title = "Confirmar Acción",
    message = "¿Estás seguro de que deseas continuar con esta acción?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    severity = "warning", // warning, error, info
    itemName = "",
    showItemName = false,
    itemLabel = "Elemento" // Nueva prop para personalizar la etiqueta
}) => {
    // Colores según la severidad
    const getSeverityColor = () => {
        switch (severity) {
            case "error":
                return "#f44336";
            case "warning":
                return "#ff9800";
            case "info":
                return "#2196f3";
            default:
                return "#ff9800";
        }
    };

    // Icono según la severidad
    const getSeverityIcon = () => {
        switch (severity) {
            case "error":
                return <WarningIcon sx={{ color: "#f44336" }} />;
            case "warning":
                return <WarningIcon sx={{ color: "#ff9800" }} />;
            case "info":
                return <WarningIcon sx={{ color: "#2196f3" }} />;
            default:
                return <WarningIcon sx={{ color: "#ff9800" }} />;
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
                    border: "1px solid #f0f0f0",
                    overflow: "hidden"
                }
            }}
        >
            {/* Header */}
            <DialogTitle sx={{
                p: 3,
                pb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Box display="flex" alignItems="center" gap={2}>
                    <Box
                        sx={{
                            fontSize: "2rem",
                            color: getSeverityColor(),
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        {severity === "error" ? "⚠️" : severity === "warning" ? "⚠️" : "ℹ️"}
                    </Box>
                    <SoftTypography
                        variant="h6"
                        fontWeight="bold"
                        color="dark"
                        sx={{ fontSize: "1.25rem" }}
                    >
                        {title}
                    </SoftTypography>
                </Box>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    sx={{
                        color: "text.secondary",
                        "&:hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.04)",
                            transform: "scale(1.1)"
                        },
                        transition: "all 0.2s ease"
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* Content */}
            <DialogContent sx={{ px: 3, pb: 2 }}>
                <SoftBox display="flex" flexDirection="column" gap={2}>
                    <SoftTypography variant="body1" color="dark" fontSize="1rem">
                        {message}
                    </SoftTypography>

                    {showItemName && itemName && (
                        <SoftBox
                            p={2.5}
                            bgcolor="#f8f9fa"
                            borderRadius="8px"
                            border={`1px solid ${getSeverityColor()}30`}
                            sx={{
                                backgroundColor: `${getSeverityColor()}08`,
                                borderColor: `${getSeverityColor()}20`
                            }}
                        >
                            <SoftTypography
                                variant="body2"
                                color="dark"
                                fontWeight="medium"
                                fontSize="0.95rem"
                            >
                                {itemLabel}: <span style={{
                                    color: getSeverityColor(),
                                    fontWeight: "bold"
                                }}>{itemName}</span>
                            </SoftTypography>
                        </SoftBox>
                    )}
                </SoftBox>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 3, gap: 2, justifyContent: "center" }}>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    sx={{
                        minWidth: 120,
                        height: 44,
                        textTransform: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "medium",
                        borderColor: "#6c757d",
                        color: "#6c757d",
                        backgroundColor: "#f8f9fa",
                        "&:hover": {
                            borderColor: "#495057",
                            backgroundColor: "#e9ecef",
                            transform: "translateY(-1px)",
                        },
                        transition: "all 0.2s ease"
                    }}
                >
                    {cancelText}
                </Button>

                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    sx={{
                        minWidth: 120,
                        height: 44,
                        textTransform: "none",
                        borderRadius: "8px",
                        fontSize: "1rem",
                        fontWeight: "medium",
                        backgroundColor: getSeverityColor(),
                        color: "white",
                        boxShadow: `0 4px 16px ${getSeverityColor()}40`,
                        "&:hover": {
                            backgroundColor: getSeverityColor(),
                            transform: "translateY(-1px)",
                            boxShadow: `0 6px 20px ${getSeverityColor()}50`,
                        },
                        transition: "all 0.3s ease"
                    }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmAlert.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    severity: PropTypes.oneOf(["warning", "error", "info"]),
    itemName: PropTypes.string,
    showItemName: PropTypes.bool,
    itemLabel: PropTypes.string
};

export default ConfirmAlert;
