/**
=========================================================
* ConfirmAcuseModal - Modal de confirmación de Acuse de Recibido
=========================================================
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from "@mui/material";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BusinessIcon from "@mui/icons-material/Business";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Soft components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

const ConfirmAcuseModal = ({
    open,
    onClose,
    onConfirm,
    titulo = "",
    etapa = "",
    fecha = "",
    unidad = "",
    showDescripcion = false,
    descripcion = ""
}) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" color="dark">
                        Confirmar acuse de recibo
                    </SoftTypography>
                    <SoftTypography variant="caption" color="text">
                        Revisa los detalles antes de confirmar
                    </SoftTypography>
                </SoftBox>
                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <SoftBox mb={1.5}>
                    <SoftTypography variant="subtitle1" fontWeight="bold" color="dark">
                        {titulo}
                    </SoftTypography>
                </SoftBox>

                {/* Etapa */}
                {etapa && (
                    <SoftBox mb={2}>
                        <span style={{
                            display: 'inline-block',
                            padding: '6px 10px',
                            background: '#e8f1ff',
                            color: '#1a73e8',
                            borderRadius: 16,
                            fontSize: 12,
                            fontWeight: 600
                        }}>
                            Etapa: {etapa}
                        </span>
                    </SoftBox>
                )}

                {/* Bloque de datos */}
                <SoftBox
                    sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: '12px',
                        background: '#fafafa'
                    }}
                >
                    <SoftBox p={2} display="flex" flexDirection="column" gap={1.5}>
                        <SoftBox>
                            <SoftTypography variant="caption" color="text" fontWeight="bold">
                                Fecha de asignación
                            </SoftTypography>
                            <SoftBox display="flex" alignItems="center" gap={0.75}>
                                <CalendarTodayIcon sx={{ fontSize: 16, color: '#5f6368' }} />
                                <SoftTypography variant="body2" color="dark">{fecha}</SoftTypography>
                            </SoftBox>
                        </SoftBox>

                        <SoftBox>
                            <SoftTypography variant="caption" color="text" fontWeight="bold">
                                Unidad responsable
                            </SoftTypography>
                            <SoftBox display="flex" alignItems="center" gap={0.75}>
                                <BusinessIcon sx={{ fontSize: 16, color: '#5f6368' }} />
                                <SoftTypography variant="body2" color="dark">{unidad}</SoftTypography>
                            </SoftBox>
                        </SoftBox>

                        {showDescripcion && descripcion && (
                            <SoftBox>
                                <SoftTypography variant="caption" color="text" fontWeight="bold">
                                    Descripción
                                </SoftTypography>
                                <SoftTypography variant="body2" color="dark">
                                    {descripcion}
                                </SoftTypography>
                            </SoftBox>
                        )}
                    </SoftBox>
                </SoftBox>

                {/* Aviso */}
                <SoftBox mt={2} p={2} sx={{ border: '1px solid #e0e0e0', borderRadius: '12px', background: '#f8fbff' }}>
                    <SoftTypography variant="body2" color="text">
                        Al confirmar el acuse de recibido, se registrará que has recibido esta asignación y la gestión pasará al estado &quot;En proceso&quot;.
                    </SoftTypography>
                </SoftBox>
            </DialogContent>

            <DialogActions
                sx={{
                    padding: '20px 24px',
                    borderTop: '1px solid #e0e0e0',
                    background: '#f8f9fa'
                }}
            >
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={onClose}
                        sx={{
                            border: '2px solid #9e9e9e',
                            color: '#616161',
                            borderRadius: '8px',
                            padding: '10px 24px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textTransform: 'none',
                            background: 'white',
                            '&:hover': {
                                borderColor: '#757575',
                                color: '#424242',
                                background: '#fafafa'
                            },
                            transition: 'all 0.2s ease'
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        onClick={onConfirm}
                        sx={{
                            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            textTransform: 'none',
                            color: '#ffffff',
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                color: '#ffffff',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)'
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Confirmar acuse
                    </Button>
                </SoftBox>
            </DialogActions>
        </Dialog>
    );
};

ConfirmAcuseModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    titulo: PropTypes.string,
    etapa: PropTypes.string,
    fecha: PropTypes.string,
    unidad: PropTypes.string,
    showDescripcion: PropTypes.bool,
    descripcion: PropTypes.string
};

export default ConfirmAcuseModal;


