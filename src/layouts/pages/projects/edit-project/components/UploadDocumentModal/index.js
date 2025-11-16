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

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";

// @mui/icons-material
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftInput from "components/SoftInput";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ScheduleIcon from '@mui/icons-material/Schedule';


function UploadDocumentModal({ open, onClose, onUpload }) {
    const [comment, setComment] = useState("");
    const [isPublic, setIsPublic] = useState(true);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [uploadError, setUploadError] = useState("");

    // Configuración de validación de archivos
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    // Información del usuario logueado (simulada)
    const currentUser = {
        name: "Dr. Carlos Méndez",
        unit: "Gerencia administrativa",
        role: "Administrador de gestión"
    };

    // Fecha actual
    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Manejo de archivos con react-dropzone
    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        setUploadError("");

        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            if (rejection.errors[0].code === 'file-too-large') {
                setUploadError(`El archivo es demasiado grande. Tamaño máximo: ${maxFileSize / (1024 * 1024)}MB`);
            } else if (rejection.errors[0].code === 'file-invalid-type') {
                setUploadError('Tipo de archivo no permitido. Formatos válidos: PDF, Word, Excel, TXT, JPG, PNG');
            } else {
                setUploadError('Error al cargar el archivo. Verifica el formato y tamaño.');
            }
            setUploadedFile(null);
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);
            setUploadError("");
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-excel': ['.xls'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'text/plain': ['.txt'],
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
        },
        maxSize: maxFileSize,
        multiple: false
    });

    const handleUpload = () => {
        if (uploadedFile) {
            const documentData = {
                file: uploadedFile,
                comment: comment,
                isPublic: isPublic,
                uploadDate: new Date(),
                uploadedBy: currentUser
            };

            onUpload(documentData);
            handleClose();
        }
    };

    const handleClose = () => {
        setComment("");
        setIsPublic(true);
        setUploadedFile(null);
        setUploadError("");
        onClose();
    };

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <InsertDriveFileIcon color="error" />;
            case 'doc':
            case 'docx':
                return <InsertDriveFileIcon color="info" />;
            case 'xls':
            case 'xlsx':
                return <InsertDriveFileIcon color="success" />;
            case 'txt':
                return <InsertDriveFileIcon color="secondary" />;
            case 'jpg':
            case 'jpeg':
            case 'png':
                return <InsertDriveFileIcon color="warning" />;
            default:
                return <InsertDriveFileIcon color="default" />;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle>
                <SoftBox display="flex" alignItems="center" gap={1}>
                    <CloudUploadIcon color="primary" />
                    <SoftTypography variant="h6" fontWeight="medium">
                        Subir Nuevo Documento
                    </SoftTypography>
                </SoftBox>
            </DialogTitle>

            <DialogContent>
                <SoftBox display="flex" flexDirection="column" gap={2}>

                    {/* Información del usuario y fecha */}
                    <SoftTypography variant="subtitle2" fontWeight="bold" mb={0.5} color="info">
                        Información del usuario
                    </SoftTypography>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{
                                p: 1.5,
                                border: '2px solid #4caf50',
                                borderRadius: 2,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)'
                            }}>
                                <SoftBox display="flex" alignItems="center" gap={1} mb={1}>
                                    <PersonIcon sx={{ color: 'info.main', fontSize: 18 }} />
                                    <SoftTypography variant="body2" fontWeight="bold" color="info">
                                        Usuario
                                    </SoftTypography>
                                </SoftBox>
                                <SoftTypography variant="caption" color="text.primary" sx={{ fontSize: '0.75rem' }}>
                                    {currentUser.name}
                                </SoftTypography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{
                                p: 1.5,
                                border: '2px solid #4caf50',
                                borderRadius: 2,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)'
                            }}>
                                <SoftBox display="flex" alignItems="center" gap={1} mb={1}>
                                    <BusinessIcon sx={{ color: 'info.main', fontSize: 18 }} />
                                    <SoftTypography variant="body2" fontWeight="bold" color="info">
                                        Unidad
                                    </SoftTypography>
                                </SoftBox>
                                <SoftTypography variant="caption" color="text.primary" sx={{ fontSize: '0.75rem' }}>
                                    {currentUser.unit}
                                </SoftTypography>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Paper elevation={2} sx={{
                                p: 1.5,
                                border: '2px solid #4caf50',
                                borderRadius: 2,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)'
                            }}>
                                <SoftBox display="flex" alignItems="center" gap={1} mb={1}>
                                    <ScheduleIcon sx={{ color: 'info.main', fontSize: 18 }} />
                                    <SoftTypography variant="body2" fontWeight="bold" color="info">
                                        Fecha
                                    </SoftTypography>
                                </SoftBox>
                                <SoftTypography variant="caption" color="text.primary" sx={{ fontSize: '0.75rem' }}>
                                    {currentDate}
                                </SoftTypography>
                            </Paper>
                        </Grid>
                    </Grid>


                    {/* Comentario inicial y configuración de visibilidad */}
                    <Paper elevation={2} sx={{
                        p: 1.5,
                        border: '2px solid #4caf50',
                        borderRadius: 2,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(76, 175, 80, 0.15)'
                    }}>
                        <SoftBox>
                            <SoftTypography variant="subtitle2" fontWeight="bold" mb={1} color="info">
                                Comentario y Configuración
                            </SoftTypography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={8}>
                                    <SoftInput
                                        placeholder="Describe brevemente el contenido o propósito del documento..."
                                        multiline
                                        rows={5}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <FormControl component="fieldset" fullWidth>
                                        <FormGroup>
                                            <FormControlLabel
                                                sx={{
                                                    alignItems: 'flex-start',
                                                    margin: 0,
                                                    width: '100%'
                                                }}
                                                control={
                                                    <Switch
                                                        checked={isPublic}
                                                        onChange={(e) => setIsPublic(e.target.checked)}
                                                        color="info"

                                                    />
                                                }
                                                label={
                                                    <SoftBox sx={{ minWidth: 0, flex: 1 }}>
                                                        <SoftTypography
                                                            variant="body2"
                                                            fontWeight="medium"
                                                            fontSize="0.875rem"
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {isPublic ? "Documento público" : "Documento privado"}
                                                        </SoftTypography>
                                                        <SoftTypography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontSize="0.75rem"
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: 'block'
                                                            }}
                                                        >
                                                            {isPublic
                                                                ? "Visible para todas las unidades"
                                                                : "Solo visible para el dueño"
                                                            }
                                                        </SoftTypography>
                                                    </SoftBox>
                                                }
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </SoftBox>
                    </Paper>
                    {/* Área de carga de archivo */}
                    <SoftBox>
                        <SoftTypography variant="subtitle2" fontWeight="bold" mb={1} color="info">
                            Cargar Archivo
                        </SoftTypography>

                        <SoftBox
                            {...getRootProps()}
                            sx={{
                                border: '2px dashed',
                                borderColor: isDragActive ? 'primary.main' : 'grey.300',
                                borderRadius: 2,
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: isDragActive ? 'primary.50' : 'grey.50',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    backgroundColor: 'primary.50'
                                }
                            }}
                        >
                            <input {...getInputProps()} />

                            {uploadedFile ? (
                                <SoftBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                                    <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
                                    <SoftTypography variant="h6" fontWeight="medium" color="success">
                                        Archivo cargado exitosamente
                                    </SoftTypography>
                                    <SoftBox display="flex" alignItems="center" gap={1}>
                                        {getFileIcon(uploadedFile.name)}
                                        <SoftTypography variant="body2" fontWeight="medium">
                                            {uploadedFile.name}
                                        </SoftTypography>
                                    </SoftBox>
                                    <SoftTypography variant="caption" color="text.secondary">
                                        Tamaño: {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </SoftTypography>
                                </SoftBox>
                            ) : (
                                <SoftBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                                    <CloudUploadIcon color="info" sx={{ fontSize: 48 }} />
                                    <SoftTypography variant="h6" fontWeight="medium" color="info">
                                        {isDragActive ? 'Suelta el archivo aquí' : 'Arrastra y suelta el archivo aquí'}
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="text.secondary">
                                        o haz clic para seleccionar desde tu computadora
                                    </SoftTypography>
                                    <SoftTypography variant="caption" color="text.secondary">
                                        Formatos permitido: PDF  (máx. 50MB)
                                    </SoftTypography>
                                </SoftBox>
                            )}
                        </SoftBox>

                        {/* Mostrar errores de validación */}
                        {uploadError && (
                            <Alert severity="error" sx={{ mt: 1 }}>
                                {uploadError}
                            </Alert>
                        )}
                    </SoftBox>
                </SoftBox>
            </DialogContent>

            <DialogActions sx={{ p: 2, gap: 1 }}>
                <SoftButton color="light" onClick={handleClose}>
                    Cancelar
                </SoftButton>
                <SoftButton
                    variant="gradient"
                    color="info"
                    onClick={handleUpload}
                    disabled={!uploadedFile}
                    startIcon={<CloudUploadIcon />}
                >
                    Subir Documento
                </SoftButton>
            </DialogActions>
        </Dialog>
    );
}

// Typechecking props for the UploadDocumentModal
UploadDocumentModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onUpload: PropTypes.func.isRequired,
};

export default UploadDocumentModal;
