/**
=========================================================
* GestiaSoft - Gestion Documents Table Component
=========================================================
* Tabla expandible para mostrar documentos organizados por paso
*/

/* eslint-disable react/prop-types */
import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

// Custom hooks
import { useDocuments } from "hooks/useDocuments";

// Config
import { API_CONFIG } from "config/apiConfig";

// Material React Table
import {
    MaterialReactTable,
} from 'material-react-table';

// @mui material components
import {
    Chip,
    Avatar,
    Tooltip,
    Button,
    IconButton,
    CircularProgress,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Backdrop
} from "@mui/material";

// @mui icons
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function GestionDocumentsTable({
    pasos = [],
    onAddDocument,
    onDownloadDocument,
    onDeleteDocument,
    gestionId,
    workflowId,
    unidadId,
    userId,
    useRealData
}) {
    // Función para verificar si el adjunto pertenece al usuario actual
    const canDeleteAdjunto = (adjunto) => {
        if (!onDeleteDocument) return false;

        // Extraer el usuario_id del adjunto (manejar diferentes formatos del API)
        const adjuntoUserId = adjunto.usuario_id || adjunto.subido_por_id || adjunto.usuario?.id || adjunto.id_usuario || adjunto.user_id;

        console.log('🔍 Verificando permisos de eliminación de adjunto:', {
            adjuntoUserId,
            userId,
            adjunto: adjunto,
            canDelete: adjuntoUserId === userId
        });

        // Comparar el usuario_id del adjunto con el userId de sesión
        return adjuntoUserId === userId;
    };

    console.log('🎯 GestionDocumentsTable se está renderizando con props:', {
        useRealData,
        gestionId,
        workflowId,
        unidadId,
        userId,
        pasosLength: pasos?.length
    });

    // Estado para el modal de visualización
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewingFile, setViewingFile] = useState(null);
    const [fileLoading, setFileLoading] = useState(false);
    const [fileError, setFileError] = useState(null);

    // Función para obtener adjunto en base64
    const obtenerAdjuntoBase64 = async (gestionId, adjuntoId, userId) => {
        try {
            const url = `${API_CONFIG.baseURL}/adjuntos/base64/${gestionId}/${adjuntoId}?user_id=${userId}`;
            console.log('🔗 URL base64:', url);
            console.log('🌐 URL completa:', url);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // Analizar el consumo del API
            analizarConsumoAPI(response, url, 'BASE64');

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            // Estructuras soportadas:
            // { status: 0|200, data: { base64, nombre_archivo, ... } }
            // { ok: true, data: {...} }
            // { base64, nombre_archivo, ... }
            // { data: { data: {...} } }  // axios-like doble data
            const payload = result?.data?.data || result?.data || result;
            if (payload?.base64 || payload?.data_url) {
                console.log('✅ Archivo base64/data_url obtenido:', payload?.nombre_archivo || '(sin nombre)');
                return payload;
            }
            // Si vino con bandera de status pero sin base64, reportar detalle
            throw new Error(result?.mensaje || 'El servidor no retornó base64 ni data_url');

        } catch (error) {
            console.error('❌ Error obteniendo archivo en base64:', error);
            throw error;
        }
    };

    // Función mejorada para descargar adjunto desde base64
    const descargarAdjunto = async (gestionId, adjuntoId, userId, event) => {
        try {
            console.log('📥 Descargando adjunto desde base64:', { gestionId, adjuntoId, userId });

            // Mostrar indicador de carga en el botón
            const button = event.target.closest('button');
            const icon = button.querySelector('svg');

            // Cambiar icono a loading
            icon.style.display = 'none';
            const loadingText = document.createElement('span');
            loadingText.textContent = '...';
            loadingText.style.fontSize = '12px';
            button.appendChild(loadingText);
            button.disabled = true;

            // Obtener archivo en base64
            const archivo = await obtenerAdjuntoBase64(gestionId, adjuntoId, userId);

            // Convertir base64 a blob (siempre será PDF)
            const byteCharacters = atob(archivo.base64);
            const byteNumbers = new Array(byteCharacters.length);

            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Crear URL temporal y descargar
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = archivo.nombre_archivo;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();

            // Limpiar
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            console.log(`✅ Archivo ${archivo.nombre_archivo} descargado exitosamente`);

            // Restaurar botón
            button.removeChild(loadingText);
            icon.style.display = 'block';
            button.disabled = false;

        } catch (error) {
            console.error('❌ Error descargando archivo:', error);
            alert('Error al descargar el archivo: ' + error.message);

            // Restaurar botón en caso de error
            const button = event.target.closest('button');
            const loadingText = button.querySelector('span');
            if (loadingText) {
                button.removeChild(loadingText);
            }
            const icon = button.querySelector('svg');
            if (icon) {
                icon.style.display = 'block';
            }
            button.disabled = false;
        }
    };

    // Función para ver adjunto en modal usando base64
    const verAdjunto = async (gestionId, adjuntoId, userId, fileName) => {
        try {
            setFileLoading(true);
            setFileError(null);
            setViewModalOpen(true);

            console.log('👁️ Abriendo archivo en modal:', { gestionId, adjuntoId, userId, fileName });

            // Obtener archivo en base64
            const archivo = await obtenerAdjuntoBase64(gestionId, adjuntoId, userId);

            console.log('📄 Datos del archivo recibidos:', {
                nombre_archivo: archivo.nombre_archivo,
                tiene_base64: !!archivo.base64,
                tiene_data_url: !!archivo.data_url,
                base64_length: archivo.base64?.length || 0
            });

            // Construir data_url si no viene del API
            // El formato correcto es: data:application/pdf;base64,{base64_string}
            let dataUrl = archivo.data_url;
            
            if (!dataUrl && archivo.base64) {
                // Si no viene data_url pero sí base64, construirlo
                const tipoMime = archivo.tipo_mime || 'application/pdf';
                dataUrl = `data:${tipoMime};base64,${archivo.base64}`;
                console.log('🔧 Data URL construido desde base64');
            } else if (!dataUrl && !archivo.base64) {
                throw new Error('No se recibió ni data_url ni base64 del servidor');
            }

            console.log('📋 Data URL final:', dataUrl ? `${dataUrl.substring(0, 50)}...` : 'No disponible');

            // Configurar archivo para visualización
            setViewingFile({
                gestionId,
                adjuntoId,
                userId,
                fileName: archivo.nombre_archivo || fileName,
                tipo_mime: archivo.tipo_mime || 'application/pdf',
                data_url: dataUrl,
                base64: archivo.base64,
                tamaño_bytes: archivo.tamaño_bytes,
                subido_por: archivo.subido_por,
                unidad: archivo.unidad,
                fecha_subida: archivo.fecha_subida
            });

            setFileLoading(false);
            console.log('✅ Archivo cargado para visualización:', archivo.nombre_archivo || fileName);

        } catch (error) {
            console.error('❌ Error visualizando archivo:', error);
            setFileError('Error al abrir el archivo: ' + error.message);
            setFileLoading(false);
        }
    };

    // Función para cerrar el modal
    const closeViewModal = () => {
        setViewModalOpen(false);
        setViewingFile(null);
        setFileLoading(false);
        setFileError(null);
    };

    // Función para analizar el consumo del API
    const analizarConsumoAPI = (response, endpoint, operation) => {
        console.group(`🔍 ANÁLISIS API - ${operation.toUpperCase()}`);
        console.log('📍 Endpoint:', endpoint);
        console.log('📊 Status:', response.status);
        console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
        console.log('⏱️ Timestamp:', new Date().toISOString());

        if (response.ok) {
            console.log('✅ Respuesta exitosa');
        } else {
            console.log('❌ Error en respuesta:', response.statusText);
        }

        console.groupEnd();
    };
    // Hook para cargar documentos reales
    const {
        documents: realDocuments,
        loading,
        error,
        loadDocuments,
        refreshDocuments
    } = useDocuments();

    // Determinar qué datos usar (reales o de ejemplo) - asegurar que siempre sea un array
    const documentsToShow = useRealData ?
        (Array.isArray(realDocuments) ? realDocuments : []) :
        (Array.isArray(pasos) ? pasos : []);

    // Cargar documentos reales solo una vez cuando se habilite useRealData
    useEffect(() => {
        console.log('🔍 GestionDocumentsTable useEffect ejecutado con:', {
            useRealData,
            gestionId,
            workflowId,
            unidadId,
            userId,
            condition: useRealData && gestionId
        });

        if (useRealData && gestionId) {
            console.log('📤 Cargando documentos UNA SOLA VEZ para gestión:', gestionId);
            loadDocuments(gestionId, workflowId, unidadId, userId);
        } else {
            console.log('❌ No se cargan documentos porque:', {
                useRealData,
                gestionId,
                reason: !useRealData ? 'useRealData es false' : 'gestionId no existe'
            });
        }
    }, [useRealData, gestionId]); // Solo dependencias esenciales

    // Función para formatear fecha
    const formatDate = (dateString) => {
        if (!dateString) return "No disponible";
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función para obtener tipo de archivo
    const getFileType = (tipoMime) => {
        if (!tipoMime) return "N/A";
        if (tipoMime.includes('pdf')) return "PDF";
        if (tipoMime.includes('image')) return "Imagen";
        if (tipoMime.includes('word')) return "Word";
        if (tipoMime.includes('excel') || tipoMime.includes('sheet')) return "Excel";
        return "Otro";
    };

    // Función para obtener color del tipo de archivo
    const getFileTypeColor = (tipoMime) => {
        if (!tipoMime) return "default";
        if (tipoMime.includes('pdf')) return "error";
        if (tipoMime.includes('image')) return "info";
        if (tipoMime.includes('word')) return "primary";
        if (tipoMime.includes('excel') || tipoMime.includes('sheet')) return "success";
        return "secondary";
    };

    // Preparar datos para la tabla principal
    const tableData = useMemo(() => {
        console.log('🔍 GestionDocumentsTable useMemo ejecutado:', {
            documentsToShow,
            isArray: Array.isArray(documentsToShow),
            length: documentsToShow?.length,
            type: typeof documentsToShow
        });

        if (!Array.isArray(documentsToShow)) {
            console.warn('⚠️ documentsToShow no es un array:', documentsToShow);
            return [];
        }

        return documentsToShow.map(paso => ({
            paso_numero: paso.paso_numero,
            nombre_paso: paso.nombre_paso,
            descripcion_paso: paso.descripcion_paso,
            fecha_inicio_paso: paso.fecha_inicio_paso,
            adjuntos: paso.adjuntos || [],
            adjuntos_count: (paso.adjuntos || []).length
        }));
    }, [documentsToShow]);

    // Definir columnas de la tabla principal
    const columns = useMemo(() => [
        {
            accessorKey: 'paso_numero',
            header: 'Nombre del Paso',
            size: 200,
            Cell: ({ row }) => (
                // eslint-disable-next-line react/prop-types
                <SoftBox display="flex" alignItems="center" gap={1}>
                    <SoftTypography variant="body2" fontWeight="medium" color="dark">
                        #{row.original.paso_numero} {row.original.nombre_paso}
                    </SoftTypography>
                </SoftBox>
            )
        },
        {
            accessorKey: 'descripcion_paso',
            header: 'Descripción',
            size: 250,
            Cell: ({ cell }) => (
                // eslint-disable-next-line react/prop-types
                <SoftTypography variant="body2" color="text">
                    {cell.getValue() || "N/A"}
                </SoftTypography>
            )
        },
        {
            accessorKey: 'fecha_inicio_paso',
            header: 'Fecha de Inicio',
            size: 150,
            Cell: ({ cell }) => (
                // eslint-disable-next-line react/prop-types
                <SoftTypography variant="body2" color="text">
                    {formatDate(cell.getValue())}
                </SoftTypography>
            )
        },
        {
            accessorKey: 'adjuntos_count',
            header: 'Adjuntos',
            size: 120,
            // eslint-disable-next-line react/prop-types
            Cell: ({ row }) => {
                const count = row.original.adjuntos_count;
                return (
                    <SoftBox display="flex" alignItems="center" gap={1}>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<AttachFileIcon />}
                            onClick={() => onAddDocument && onAddDocument(row.original.paso_numero)}
                            sx={{
                                borderColor: count > 0 ? 'primary.main' : 'grey.300',
                                color: count > 0 ? 'primary.main' : 'grey.500',
                                fontSize: '0.75rem',
                                padding: '4px 8px',
                                minWidth: 'auto'
                            }}
                        >
                            {count} archivo{count !== 1 ? 's' : ''}
                        </Button>
                    </SoftBox>
                );
            }
        }
    ], [onAddDocument]);

    // Configuración de la tabla principal
    const tableConfig = {
        columns,
        data: tableData,
        enableColumnFilters: false,
        enableGlobalFilter: false,
        enableSorting: false,
        enableColumnActions: false,
        enableTopToolbar: false,
        enableBottomToolbar: false,
        enableRowSelection: false,
        enableExpandAll: false,
        muiTableBodyRowProps: ({ row }) => ({ // eslint-disable-line react/prop-types
            sx: {
                '&:hover': {
                    backgroundColor: 'rgba(33, 150, 243, 0.04)',
                },
            },
        }),
        renderDetailPanel: ({ row }) => { // eslint-disable-line react/prop-types
            const paso = row.original;
            const adjuntos = paso.adjuntos;

            if (!adjuntos || adjuntos.length === 0) {
                return (
                    <SoftBox p={3} sx={{ backgroundColor: '#f8f9fa' }}>
                        <SoftTypography variant="body2" color="text" sx={{ fontStyle: 'italic' }}>
                            No hay documentos adjuntos para este paso
                        </SoftTypography>
                    </SoftBox>
                );
            }

            return (
                <SoftBox p={3} sx={{ backgroundColor: '#f8f9fa' }}>
                    {/* Header de documentos adjuntos */}
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <SoftBox display="flex" alignItems="center" gap={1}>
                            <DescriptionIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                            <SoftTypography variant="h6" fontWeight="bold" color="dark">
                                Documentos Adjuntos del Paso {paso.paso_numero}
                            </SoftTypography>
                        </SoftBox>
                    </SoftBox>

                    {/* Tabla de adjuntos */}
                    <SoftBox>
                        <MaterialReactTable
                            columns={[
                                {
                                    accessorKey: 'adjunto_id',
                                    header: 'ID',
                                    size: 80,
                                    Cell: ({ cell }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <Chip
                                                label={`#${cell.getValue()}`}
                                                size="small"
                                                sx={{
                                                    backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                                    color: '#1976d2',
                                                    fontWeight: 'bold',
                                                    fontSize: '0.7rem',
                                                    height: '20px',
                                                    '& .MuiChip-label': {
                                                        padding: '0 6px'
                                                    }
                                                }}
                                            />
                                        </SoftBox>
                                    )
                                },
                                {
                                    accessorKey: 'nombre_archivo',
                                    header: 'Archivo',
                                    size: 250,
                                    Cell: ({ cell }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <DescriptionIcon sx={{ color: 'primary.main', fontSize: 18 }} />
                                            <SoftTypography variant="body2" fontWeight="medium" color="dark">
                                                {cell.getValue()}
                                            </SoftTypography>
                                        </SoftBox>
                                    )
                                },
                                {
                                    accessorKey: 'subido_por',
                                    header: 'Subido Por',
                                    size: 150,
                                    Cell: ({ cell }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <SoftBox display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                                                <PersonIcon sx={{ fontSize: 14 }} />
                                            </Avatar>
                                            <SoftTypography variant="body2" color="text">
                                                {cell.getValue() || "N/A"}
                                            </SoftTypography>
                                        </SoftBox>
                                    )
                                },
                                {
                                    accessorKey: 'unidad',
                                    header: 'Unidad',
                                    size: 150,
                                    Cell: ({ cell }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <Chip
                                            label={cell.getValue()}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                fontSize: '0.7rem',
                                                borderColor: 'primary.main',
                                                color: 'primary.main'
                                            }}
                                        />
                                    )
                                },
                                {
                                    accessorKey: 'fecha_subida',
                                    header: 'Fecha de Subida',
                                    size: 150,
                                    Cell: ({ cell }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <SoftTypography variant="body2" color="text">
                                            {formatDate(cell.getValue())}
                                        </SoftTypography>
                                    )
                                },
                                {
                                    id: 'actions',
                                    header: 'Acciones',
                                    size: 120,
                                    Cell: ({ row }) => (
                                        // eslint-disable-next-line react/prop-types
                                        <SoftBox display="flex" gap={0.5}>
                                            <Tooltip title="Ver">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => verAdjunto(gestionId, row.original.adjunto_id, userId, row.original.nombre_archivo)}
                                                    sx={{ color: 'info.main' }}
                                                >
                                                    <VisibilityIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Descargar">
                                                <IconButton
                                                    size="small"
                                                    onClick={(event) => descargarAdjunto(gestionId, row.original.adjunto_id, userId, event)}
                                                    sx={{ color: 'primary.main' }}
                                                >
                                                    <DownloadIcon sx={{ fontSize: 16 }} />
                                                </IconButton>
                                            </Tooltip>
                                            {/* Botón de eliminar - Solo mostrar si el adjunto pertenece al usuario actual */}
                                            {canDeleteAdjunto(row.original) && (
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDeleteDocument(row.original)}
                                                        sx={{ color: 'error.main' }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 16 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </SoftBox>
                                    )
                                }
                            ]}
                            data={adjuntos}
                            enableColumnFilters={false}
                            enableGlobalFilter={false}
                            enableSorting={false}
                            enableColumnActions={false}
                            enableTopToolbar={false}
                            enableBottomToolbar={false}
                            enableRowSelection={false}
                            muiTableContainerProps={{
                                sx: {
                                    maxHeight: '400px',
                                    '& .MuiTable-root': {
                                        fontSize: '0.875rem'
                                    }
                                }
                            }}
                            muiTableHeadCellProps={{
                                sx: {
                                    backgroundColor: '#e3f2fd',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem'
                                }
                            }}
                            muiTableBodyRowProps={{
                                sx: {
                                    '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.04)',
                                    },
                                }
                            }}
                        />
                    </SoftBox>
                </SoftBox>
            );
        }
    };

    // Mostrar loading si está cargando datos reales
    if (loading) {
        return (
            <SoftBox>
                {/* Header */}
                <SoftBox display="flex" alignItems="center" gap={1} mb={3}>
                    <DescriptionIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <SoftTypography variant="h5" fontWeight="bold" color="dark">
                        Documentos por Paso
                    </SoftTypography>
                </SoftBox>

                <SoftTypography variant="body2" color="text" mb={3} sx={{ fontStyle: 'italic' }}>
                    Gestión de archivos organizados por cada etapa del proceso
                </SoftTypography>

                {/* Panel de carga */}
                <SoftBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    gap={3}
                    sx={{
                        backgroundColor: '#f8f9fa',
                        borderRadius: '12px',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    <CircularProgress
                        size={48}
                        sx={{ color: 'primary.main' }}
                    />
                    <SoftBox textAlign="center">
                        <SoftTypography variant="h6" color="text" fontWeight="medium" mb={1}>
                            Cargando documentos...
                        </SoftTypography>
                        <SoftTypography variant="body2" color="text" sx={{ opacity: 0.7 }}>
                            Obteniendo información de archivos adjuntos
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
        );
    }

    // Mostrar error si hay un problema
    if (error) {
        return (
            <SoftBox>
                {/* Header */}
                <SoftBox display="flex" alignItems="center" gap={1} mb={3}>
                    <DescriptionIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    <SoftTypography variant="h5" fontWeight="bold" color="dark">
                        Documentos por Paso
                    </SoftTypography>
                </SoftBox>

                <SoftTypography variant="body2" color="text" mb={3} sx={{ fontStyle: 'italic' }}>
                    Gestión de archivos organizados por cada etapa del proceso
                </SoftTypography>

                {/* Panel de error */}
                <SoftBox
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="400px"
                    gap={3}
                    sx={{
                        backgroundColor: '#ffebee',
                        borderRadius: '12px',
                        border: '1px solid #f44336'
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 48, color: '#f44336' }} />
                    <SoftBox textAlign="center">
                        <SoftTypography variant="h6" color="error" fontWeight="medium" mb={1}>
                            Error al cargar documentos
                        </SoftTypography>
                        <SoftTypography variant="body2" color="error" sx={{ opacity: 0.8 }}>
                            {error}
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
            </SoftBox>
        );
    }

    return (
        <SoftBox>
            {/* Header */}
            <SoftBox display="flex" alignItems="center" gap={1} mb={3}>
                <DescriptionIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                <SoftTypography variant="h5" fontWeight="bold" color="dark">
                    Documentos por Paso
                </SoftTypography>
            </SoftBox>

            <SoftTypography variant="body2" color="text" mb={3} sx={{ fontStyle: 'italic' }}>
                Gestión de archivos organizados por cada etapa del proceso
            </SoftTypography>

            {/* Tabla principal */}
            <MaterialReactTable {...tableConfig} />

            {/* Modal para visualizar archivos */}
            <Dialog
                open={viewModalOpen}
                onClose={closeViewModal}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        minHeight: '70vh',
                        maxHeight: '90vh'
                    }
                }}
            >
                <DialogTitle sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1,
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <SoftBox display="flex" alignItems="center" gap={1}>
                        <DescriptionIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                        <SoftTypography variant="h6" fontWeight="bold" color="dark">
                            Visualizar PDF
                        </SoftTypography>
                    </SoftBox>
                    <IconButton
                        onClick={closeViewModal}
                        sx={{
                            color: 'text',
                            '&:hover': { color: 'error.main' }
                        }}
                    >
                        ×
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {fileLoading && (
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            minHeight="400px"
                            gap={2}
                        >
                            <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                            <SoftTypography variant="body1" color="text">
                                Cargando PDF...
                            </SoftTypography>
                        </SoftBox>
                    )}

                    {fileError && (
                        <SoftBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            minHeight="400px"
                            gap={2}
                            p={3}
                        >
                            <Typography color="error" variant="h6">
                                Error al cargar el PDF
                            </Typography>
                            <Typography color="text">
                                {fileError}
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    if (viewingFile) {
                                        verAdjunto(viewingFile.gestionId, viewingFile.adjuntoId, viewingFile.userId, viewingFile.fileName);
                                    }
                                }}
                            >
                                Reintentar
                            </Button>
                        </SoftBox>
                    )}

                    {viewingFile && !fileLoading && !fileError && (
                        <SoftBox sx={{ height: '100%', minHeight: '60vh' }}>
                            {/* Mostrar PDF en iframe - siempre será PDF */}
                            {viewingFile.data_url ? (
                                <iframe
                                    key={`pdf-${viewingFile.adjuntoId}`}
                                    src={viewingFile.data_url}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        minHeight: '60vh',
                                        border: 'none',
                                        borderRadius: '0 0 16px 16px'
                                    }}
                                    title={`Visualizando PDF: ${viewingFile.fileName}`}
                                    onLoad={() => {
                                        console.log('✅ PDF cargado en modal:', viewingFile.fileName);
                                        console.log('📊 Tamaño del data_url:', viewingFile.data_url?.length || 0);
                                    }}
                                    onError={(e) => {
                                        console.error('❌ Error cargando PDF en modal:', viewingFile.fileName);
                                        console.error('❌ Error details:', e);
                                        setFileError('No se pudo cargar el PDF. El archivo podría estar corrupto o el formato no es válido.');
                                    }}
                                />
                            ) : (
                                <SoftBox
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    minHeight="400px"
                                    gap={2}
                                    p={3}
                                >
                                    <DescriptionIcon sx={{ fontSize: 48, color: 'error.main' }} />
                                    <SoftTypography variant="h6" color="error">
                                        No se pudo obtener la URL del PDF
                                    </SoftTypography>
                                    <SoftTypography variant="body2" color="text">
                                        El archivo no está disponible para visualización
                                    </SoftTypography>
                                </SoftBox>
                            )}
                        </SoftBox>
                    )}
                </DialogContent>

                <DialogActions sx={{
                    p: 2,
                    borderTop: '1px solid #e0e0e0',
                    justifyContent: 'space-between'
                }}>
                    <SoftBox>
                        <SoftTypography variant="body2" color="text">
                            {viewingFile?.fileName ? `Archivo: ${viewingFile.fileName}` : "Archivo no disponible"}
                        </SoftTypography>
                        {viewingFile && (
                            <SoftBox display="flex" gap={2} mt={0.5}>
                                <SoftTypography variant="caption" color="text">
                                    PDF • {viewingFile.tamaño_bytes ? (viewingFile.tamaño_bytes / 1024 / 1024).toFixed(2) : "0.00"} MB
                                </SoftTypography>
                                <SoftTypography variant="caption" color="text">
                                    Subido por: {viewingFile.subido_por || "N/A"}
                                </SoftTypography>
                            </SoftBox>
                        )}
                    </SoftBox>
                    <SoftBox display="flex" gap={1}>
                        <Button
                            variant="outlined"
                            onClick={closeViewModal}
                            sx={{
                                borderRadius: '8px',
                                color: '#000000',
                                borderColor: '#000000',
                                '&:hover': {
                                    borderColor: '#000000',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                }
                            }}
                        >
                            Cerrar
                        </Button>
                        {viewingFile && (
                            <Button
                                variant="contained"
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                    console.log('📥 Descargando desde modal:', viewingFile.fileName);

                                    try {
                                        // Convertir base64 a blob (ya tenemos el base64 en memoria)
                                        const byteCharacters = atob(viewingFile.base64);
                                        const byteNumbers = new Array(byteCharacters.length);

                                        for (let i = 0; i < byteCharacters.length; i++) {
                                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                                        }

                                        const byteArray = new Uint8Array(byteNumbers);
                                        const blob = new Blob([byteArray], { type: 'application/pdf' });

                                        // Crear URL temporal y descargar
                                        const url = window.URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = viewingFile.fileName;
                                        link.style.display = 'none';

                                        document.body.appendChild(link);
                                        link.click();

                                        // Limpiar
                                        document.body.removeChild(link);
                                        window.URL.revokeObjectURL(url);

                                        console.log(`✅ Archivo ${viewingFile.fileName} descargado exitosamente desde modal`);
                                    } catch (error) {
                                        console.error('❌ Error descargando desde modal:', error);
                                        alert('Error al descargar el archivo: ' + error.message);
                                    }
                                }}
                                sx={{
                                    borderRadius: '8px',
                                    background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                    color: '#FFFFFF !important',
                                    '&:hover': {
                                        background: 'linear-gradient(45deg, #1565c0 30%, #2196f3 90%)',
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
                                        color: '#FFFFFF !important'
                                    },
                                    transition: 'all 0.3s ease',
                                    '& .MuiButton-startIcon': {
                                        color: '#FFFFFF !important'
                                    }
                                }}
                            >
                                Descargar
                            </Button>
                        )}
                    </SoftBox>
                </DialogActions>
            </Dialog>
        </SoftBox>
    );
}

GestionDocumentsTable.propTypes = {
    pasos: PropTypes.arrayOf(PropTypes.shape({
        paso_numero: PropTypes.number.isRequired,
        nombre_paso: PropTypes.string.isRequired,
        descripcion_paso: PropTypes.string,
        fecha_inicio_paso: PropTypes.string,
        adjuntos: PropTypes.arrayOf(PropTypes.shape({
            adjunto_id: PropTypes.number,
            nombre_archivo: PropTypes.string,
            ruta_archivo: PropTypes.string,
            tipo_mime: PropTypes.string,
            subido_por: PropTypes.string,
            unidad: PropTypes.string,
            fecha_subida: PropTypes.string
        }))
    })), // Opcional cuando useRealData=true
    onAddDocument: PropTypes.func,
    onDownloadDocument: PropTypes.func,
    onDeleteDocument: PropTypes.func,
    gestionId: PropTypes.number.isRequired, // Requerido cuando useRealData=true
    workflowId: PropTypes.number,
    unidadId: PropTypes.number,
    userId: PropTypes.number,
    useRealData: PropTypes.bool
};

// PropTypes para componentes Cell de Material React Table
const CellPropTypes = {
    cell: PropTypes.shape({
        getValue: PropTypes.func.isRequired
    }).isRequired,
    row: PropTypes.shape({
        original: PropTypes.object.isRequired
    }).isRequired
};

export default GestionDocumentsTable;
