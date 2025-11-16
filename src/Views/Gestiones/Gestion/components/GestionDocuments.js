/**
=========================================================
* GestiaSoft - Gestion Documents Component
=========================================================
* Documents management component for gestion view
*/

import React from "react";
import PropTypes from "prop-types";

// @mui material components
import { Card, CardContent, IconButton, Chip } from "@mui/material";

// @mui icons
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import AttachFileIcon from "@mui/icons-material/AttachFile";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

function GestionDocuments({ gestion }) {
    // Datos de ejemplo - en producción vendrían del API
    const documents = [
        {
            id: 1,
            name: "Informe_Servidores_Q1.pdf",
            type: "PDF",
            size: "3.2 MB",
            department: "Recursos Humanos",
            uploadedBy: "Juan Pérez",
            uploadDate: "15 Ene 2024"
        },
        {
            id: 2,
            name: "Revision_Legal_Infraestructura.docx",
            type: "DOCX",
            size: "1.1 MB",
            department: "Departamento Legal",
            uploadedBy: "Ana Martínez",
            uploadDate: "18 Ene 2024"
        },
        {
            id: 3,
            name: "Analisis_Tecnico_Servidores.xlsx",
            type: "XLSX",
            size: "2.8 MB",
            department: "Departamento de TI",
            uploadedBy: "Carlos Rodríguez",
            uploadDate: "22 Ene 2024"
        },
        {
            id: 4,
            name: "Protocolo_Seguridad_v2.pdf",
            type: "PDF",
            size: "1.5 MB",
            department: "Departamento de TI",
            uploadedBy: "Carlos Rodríguez",
            uploadDate: "23 Ene 2024"
        }
    ];

    const handleDownload = (document) => {
        console.log("Descargando documento:", document.name);
        // Aquí iría la lógica de descarga
    };

    const handleUpload = () => {
        console.log("Subir nuevo documento");
        // Aquí iría la lógica de subida
    };

    const getFileTypeColor = (type) => {
        switch (type) {
            case 'PDF':
                return { bg: '#ffebee', color: '#c62828' };
            case 'DOCX':
                return { bg: '#e3f2fd', color: '#1565c0' };
            case 'XLSX':
                return { bg: '#e8f5e9', color: '#2e7d32' };
            default:
                return { bg: '#f5f5f5', color: '#616161' };
        }
    };

    return (
        <SoftBox>
            {/* Header */}
            <SoftBox mb={3}>
                <SoftTypography variant="h5" fontWeight="bold" color="dark">
                    Documentos Adjuntos
                </SoftTypography>
                <SoftTypography variant="body2" color="text" opacity={0.7}>
                    Archivos cargados por cada unidad participante en el proceso
                </SoftTypography>
            </SoftBox>

            {/* Botón de subir */}
            <SoftBox mb={3}>
                <SoftButton
                    variant="contained"
                    color="info"
                    startIcon={<AttachFileIcon />}
                    onClick={handleUpload}
                    sx={{
                        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                        borderRadius: '12px',
                        padding: '10px 24px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        textTransform: 'none',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                        },
                        transition: 'all 0.3s ease'
                    }}
                >
                    Adjuntar Documento
                </SoftButton>
            </SoftBox>

            {/* Lista de documentos */}
            <SoftBox display="flex" flexDirection="column" gap={2}>
                {documents.map((doc) => {
                    const typeColors = getFileTypeColor(doc.type);
                    return (
                        <Card
                            key={doc.id}
                            sx={{
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e0e0e0',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                    transform: 'translateY(-2px)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <SoftBox display="flex" alignItems="center" gap={2}>
                                    {/* Icono de documento */}
                                    <SoftBox
                                        sx={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '12px',
                                            p: 1.5,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <DescriptionIcon sx={{ color: 'white', fontSize: 28 }} />
                                    </SoftBox>

                                    {/* Información del documento */}
                                    <SoftBox flex={1}>
                                        <SoftBox display="flex" alignItems="center" gap={1} mb={0.5}>
                                            <SoftTypography variant="body1" fontWeight="bold" color="dark">
                                                {doc.name}
                                            </SoftTypography>
                                            <Chip
                                                label={doc.type}
                                                size="small"
                                                sx={{
                                                    background: typeColors.bg,
                                                    color: typeColors.color,
                                                    fontSize: '0.65rem',
                                                    fontWeight: '600',
                                                    height: '20px'
                                                }}
                                            />
                                        </SoftBox>
                                        <SoftTypography variant="caption" color="text" opacity={0.7}>
                                            {doc.size} • {doc.department}
                                        </SoftTypography>
                                    </SoftBox>

                                    {/* Información de subida y botón de descarga */}
                                    <SoftBox display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
                                        <SoftBox>
                                            <SoftTypography variant="caption" fontWeight="medium" color="dark">
                                                {doc.uploadedBy}
                                            </SoftTypography>
                                            <SoftTypography variant="caption" color="text" opacity={0.7}>
                                                {doc.uploadDate}
                                            </SoftTypography>
                                        </SoftBox>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDownload(doc)}
                                            sx={{
                                                background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                color: '#1565c0',
                                                '&:hover': {
                                                    background: 'linear-gradient(45deg, #bbdefb 30%, #90caf9 90%)',
                                                    transform: 'scale(1.1)',
                                                },
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                    </SoftBox>
                                </SoftBox>
                            </CardContent>
                        </Card>
                    );
                })}
            </SoftBox>

            {/* Mensaje si no hay documentos */}
            {documents.length === 0 && (
                <SoftBox
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 3
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                    <SoftTypography variant="h6" color="text" opacity={0.6} mb={1}>
                        No hay documentos adjuntos
                    </SoftTypography>
                    <SoftTypography variant="body2" color="text" opacity={0.5}>
                        Sube el primer documento usando el botón de arriba
                    </SoftTypography>
                </SoftBox>
            )}
        </SoftBox>
    );
}

GestionDocuments.propTypes = {
    gestion: PropTypes.object
};

export default GestionDocuments;

