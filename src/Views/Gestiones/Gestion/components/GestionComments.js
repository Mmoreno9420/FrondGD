/**
=========================================================
* GestiaSoft - Gestion Comments Component
=========================================================
* Comments management component for gestion view
*/

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import { Card, CardContent, TextField, CircularProgress, Alert, IconButton, Tooltip, Backdrop } from "@mui/material";

// @mui icons
import SendIcon from "@mui/icons-material/Send";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";
import SoftAvatar from "components/SoftAvatar";

// Custom App Components
import { AppNotification, ConfirmAlert } from "Views/componentsApp";

// Hooks y servicios
import { useComentarios } from "hooks/useComentarios";

function GestionComments({ gestion, gestionId, workflowId, unidadId, userId, disabled = false, onCommentAdded }) {
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingOperation, setLoadingOperation] = useState(''); // 'saving' o 'deleting'
    const [notification, setNotification] = useState({
        open: false,
        type: 'success',
        message: ''
    });

    // Función para verificar si el comentario pertenece al usuario actual
    const canDeleteComment = (comment) => {
        if (disabled) return false;

        // Extraer el usuario_id del comentario (manejar diferentes formatos del API)
        const commentUserId = comment.usuario_id || comment.usuario?.id || comment.usuario?.usuario_id || comment.id_usuario;

        console.log('🔍 Verificando permisos de eliminación:', {
            commentUserId,
            userId,
            comment: comment,
            canDelete: commentUserId === userId
        });

        // Comparar el usuario_id del comentario con el userId de sesión
        return commentUserId === userId;
    };

    // Estado para el alert de confirmación de eliminación de comentario
    const [deleteCommentAlert, setDeleteCommentAlert] = useState({
        open: false,
        comment: null
    });

    // Hook para manejar comentarios
    const {
        comentarios,
        loading,
        error,
        loadComentarios,
        createComentario,
        deleteComentario
    } = useComentarios();

    // Cargar comentarios al montar el componente
    useEffect(() => {
        // Permitir workflowId === 0 (válido); solo validar que los demás existan
        if (gestionId && unidadId && userId) {
            console.log('📤 Cargando comentarios desde GestionComments:', {
                gestionId,
                workflowId: (workflowId ?? 0),
                unidadId,
                userId
            });
            loadComentarios(gestionId, (workflowId ?? 0), unidadId, userId);
        }
    }, [gestionId, workflowId, unidadId, userId, loadComentarios]);

    const handleSendComment = async () => {
        if (!newComment.trim() || isSubmitting) return;

        // Iniciar el proceso de guardado
        setIsSubmitting(true);
        setLoadingOperation('saving');

        try {
            console.log('📤 Enviando comentario:', {
                gestionId,
                workflowId,
                unidadId,
                newComment,
                userId
            });

            // Esperar a que se guarde el comentario
            await createComentario(gestionId, workflowId, unidadId, newComment, userId);

            // Solo después de guardar exitosamente, limpiar el campo y mostrar notificación
            setNewComment("");

            console.log('✅ Comentario enviado exitosamente');

            // Notificar al componente padre para actualizar el resumen
            if (onCommentAdded) {
                onCommentAdded();
            }

            // Mostrar notificación de éxito SOLO después de guardar
            setNotification({
                open: true,
                type: 'success',
                message: 'Comentario agregado exitosamente'
            });

        } catch (error) {
            console.error('❌ Error enviando comentario:', error);

            // Mostrar notificación de error SOLO si falla
            setNotification({
                open: true,
                type: 'error',
                message: 'Error al agregar comentario: ' + (error.message || 'Error desconocido')
            });
        } finally {
            // Finalizar el estado de carga
            setIsSubmitting(false);
            setLoadingOperation('');
        }
    };

    // Función para abrir el modal de confirmación de eliminación
    const handleDeleteComment = (comment) => {
        console.log("🗑️ Solicitando confirmación para eliminar comentario:", comment);
        setDeleteCommentAlert({
            open: true,
            comment: comment
        });
    };

    // Función para confirmar la eliminación del comentario
    const handleDeleteCommentConfirm = async () => {
        if (!deleteCommentAlert.comment) return;

        const comment = deleteCommentAlert.comment;
        console.log("🗑️ Confirmado, eliminando comentario:", comment);

        try {
            // Cerrar el modal de confirmación
            setDeleteCommentAlert({ open: false, comment: null });

            // Iniciar proceso de eliminación sin mostrar notificación aún
            setIsSubmitting(true);
            setLoadingOperation('deleting');

            // Esperar a que se elimine el comentario
            await deleteComentario(gestionId, comment.comentario_id || comment.id, unidadId, userId);

            console.log('✅ Comentario eliminado exitosamente');

            // Notificar al componente padre para actualizar el resumen
            if (onCommentAdded) {
                onCommentAdded();
            }

            // Mostrar notificación de éxito SOLO después de eliminar
            setNotification({
                open: true,
                type: 'success',
                message: 'Comentario eliminado exitosamente'
            });

        } catch (error) {
            console.error('❌ Error eliminando comentario:', error);

            // Mostrar notificación de error SOLO si falla
            setNotification({
                open: true,
                type: 'error',
                message: 'Error al eliminar comentario: ' + (error.message || 'Error desconocido')
            });
        } finally {
            // Finalizar el estado de carga
            setIsSubmitting(false);
            setLoadingOperation('');
        }
    };

    // Función para cancelar la eliminación del comentario
    const handleDeleteCommentCancel = () => {
        console.log("❌ Eliminación de comentario cancelada por el usuario");
        setDeleteCommentAlert({ open: false, comment: null });
    };

    const getAvatarColor = (userName) => {
        const colors = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
        ];
        const index = userName?.charCodeAt(0) % colors.length || 0;
        return colors[index];
    };

    const getInitials = (userName) => {
        if (!userName) return "U";
        return userName.split(' ').map(name => name.charAt(0)).join('').toUpperCase().substring(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return dateString;
        }
    };

    return (
        <SoftBox>
            {/* Header */}
            <SoftBox mb={3}>
                <SoftTypography variant="h5" fontWeight="bold" color="dark">
                    Historial de Comentarios
                </SoftTypography>
                <SoftTypography variant="body2" color="text" opacity={0.7}>
                    Conversación y seguimiento entre las unidades participantes
                </SoftTypography>
            </SoftBox>

            {/* Loading State */}
            {loading && (
                <SoftBox display="flex" justifyContent="center" alignItems="center" py={4}>
                    <CircularProgress size={40} />
                    <SoftTypography variant="body2" color="text" ml={2}>
                        Cargando comentarios...
                    </SoftTypography>
                </SoftBox>
            )}

            {/* Error State */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
                    Error al cargar comentarios: {error}
                </Alert>
            )}

            {/* Lista de comentarios - SCROLLABLE cuando hay más de 2 comentarios */}
            <SoftBox
                display="flex"
                flexDirection="column"
                gap={2}
                mb={3}
                sx={{
                    maxHeight: comentarios && comentarios.length > 2 ? '500px' : 'none', // Solo scroll si hay más de 2 comentarios
                    overflowY: comentarios && comentarios.length > 2 ? 'auto' : 'visible',
                    overflowX: 'hidden',
                    paddingRight: comentarios && comentarios.length > 2 ? '8px' : '0px', // Espacio para el scrollbar solo cuando es necesario
                    '&::-webkit-scrollbar': {
                        width: comentarios && comentarios.length > 2 ? '8px' : '0px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#c1c1c1',
                        borderRadius: '10px',
                        '&:hover': {
                            background: '#a8a8a8',
                        },
                    },
                }}
            >
                {comentarios && comentarios.length > 0 ? (
                    comentarios.map((comment) => (
                        <Card
                            key={comment.comentario_id || comment.id}
                            sx={{
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                                border: '1px solid #e0e0e0',
                                transition: 'all 0.2s ease',
                                width: '100%',
                                minHeight: 'auto',
                                flexShrink: 0,
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
                                }
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <SoftBox display="flex" gap={2}>
                                    {/* Avatar */}
                                    <SoftAvatar
                                        sx={{
                                            background: getAvatarColor(comment.nombre_usuario || comment.usuario),
                                            width: 40,
                                            height: 40,
                                            fontSize: '0.875rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {getInitials(comment.nombre_usuario || comment.usuario)}
                                    </SoftAvatar>

                                    {/* Contenido del comentario */}
                                    <SoftBox flex={1}>
                                        <SoftBox display="flex" alignItems="center" gap={1} mb={0.5}>
                                            <SoftTypography variant="body2" fontWeight="bold" color="dark">
                                                {comment.nombre_usuario || comment.usuario || 'Usuario'}
                                            </SoftTypography>
                                            <SoftTypography
                                                variant="caption"
                                                sx={{
                                                    background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)',
                                                    color: '#1565c0',
                                                    padding: '2px 8px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.65rem',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                {comment.nombre_unidad || comment.unidad || 'Unidad'}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftBox
                                            sx={{
                                                background: '#f5f5f5',
                                                borderRadius: '8px',
                                                padding: '12px',
                                                mb: 1,
                                                minHeight: 'auto',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'break-word'
                                            }}
                                        >
                                            <SoftTypography
                                                variant="body2"
                                                color="text"
                                                sx={{
                                                    lineHeight: 1.5,
                                                    wordBreak: 'break-word',
                                                    whiteSpace: 'pre-wrap',
                                                    overflowWrap: 'break-word'
                                                }}
                                            >
                                                {comment.comentario || comment.mensaje || 'Sin comentario'}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                                            <SoftBox display="flex" alignItems="center" gap={0.5}>
                                                <ChatBubbleOutlineIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                <SoftTypography variant="caption" color="text" opacity={0.7}>
                                                    {formatDate(comment.fecha_creacion || comment.fecha)}
                                                </SoftTypography>
                                            </SoftBox>
                                            {/* Botón de eliminar - Solo mostrar si el comentario pertenece al usuario actual */}
                                            {canDeleteComment(comment) && (
                                                <Tooltip title="Eliminar comentario" arrow placement="top">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDeleteComment(comment)}
                                                        sx={{
                                                            color: '#f44336',
                                                            '&:hover': {
                                                                backgroundColor: '#ffebee',
                                                                color: '#d32f2f'
                                                            },
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ fontSize: 18 }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </SoftBox>
                                    </SoftBox>
                                </SoftBox>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    !loading && (
                        <SoftBox
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 3
                            }}
                        >
                            <ChatBubbleOutlineIcon sx={{ fontSize: 64, color: '#e0e0e0', mb: 2 }} />
                            <SoftTypography variant="h6" color="text" opacity={0.6} mb={1}>
                                No hay comentarios aún
                            </SoftTypography>
                            <SoftTypography variant="body2" color="text" opacity={0.5}>
                                Sé el primero en comentar
                            </SoftTypography>
                        </SoftBox>
                    )
                )}
            </SoftBox>

            {/* Formulario para nuevo comentario */}
            <Card
                sx={{
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e0e0e0'
                }}
            >
                <CardContent sx={{ p: 2 }}>
                    <SoftBox mb={2}>
                        <SoftTypography variant="body2" fontWeight="bold" color="dark" mb={1}>
                            Agregar Comentario
                        </SoftTypography>
                        <TextField
                            fullWidth
                            multiline
                            minRows={3}
                            maxRows={8}
                            placeholder={disabled ? "No se pueden agregar comentarios: la gestión está completada, cancelada o la unidad ya completó su trabajo" : "Escribe un comentario o actualización..."}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            variant="outlined"
                            disabled={isSubmitting || disabled}
                            inputProps={{
                                spellCheck: false,
                                autoComplete: "off"
                            }}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    backgroundColor: isSubmitting ? '#f5f5f5' : 'white',
                                    width: "100%",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: isSubmitting ? "#e0e0e0" : "primary.main"
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "primary.main",
                                        borderWidth: "2px",
                                        width: "100%",
                                    },
                                    "&.Mui-disabled": {
                                        backgroundColor: '#f5f5f5',
                                        width: "100%",
                                    }
                                },
                                "& .MuiInputBase-input": {
                                    overflow: "auto",
                                    resize: "none",
                                    wordBreak: "break-all",
                                    whiteSpace: "pre-wrap",
                                    width: "100%",
                                    "&.Mui-disabled": {
                                        color: "#666666",
                                        WebkitTextFillColor: "#666666"
                                    }
                                },
                                "& .MuiInputBase-inputMultiline": {
                                    width: "100% !important",
                                    minWidth: "100%"
                                }
                            }}
                        />
                    </SoftBox>
                    <SoftBox display="flex" justifyContent="flex-end" alignItems="center">
                        <SoftButton
                            variant="contained"
                            color="info"
                            endIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                            onClick={handleSendComment}
                            disabled={!newComment.trim() || isSubmitting || disabled}
                            sx={{
                                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                                borderRadius: '8px',
                                padding: '8px 24px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                textTransform: 'none',
                                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 20px rgba(25, 118, 210, 0.4)',
                                },
                                '&:disabled': {
                                    background: 'linear-gradient(45deg, #bdbdbd 30%, #9e9e9e 90%)',
                                    color: '#757575',
                                },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
                        </SoftButton>
                    </SoftBox>
                </CardContent>
            </Card>

            {/* Notificaciones */}
            <AppNotification
                type={notification.type}
                message={notification.message}
                open={notification.open}
                onClose={() => setNotification(prev => ({ ...prev, open: false }))}
            />

            {/* Alert de confirmación para eliminar comentario */}
            <ConfirmAlert
                open={deleteCommentAlert.open}
                onClose={handleDeleteCommentCancel}
                onConfirm={handleDeleteCommentConfirm}
                title="Confirmar Eliminación"
                message="¿Estás seguro de que deseas eliminar este comentario? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                severity="error"
                itemName={deleteCommentAlert.comment?.comentario || deleteCommentAlert.comment?.mensaje}
                showItemName={true}
                itemLabel="Comentario"
            />

            {/* Panel de carga al guardar o eliminar comentario */}
            <Backdrop
                open={isSubmitting}
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <CircularProgress
                    size={60}
                    thickness={4}
                    sx={{
                        color: '#ffffff',
                    }}
                />
                <SoftTypography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                        color: '#ffffff',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                >
                    {loadingOperation === 'deleting' ? 'Eliminando comentario...' : 'Guardando comentario...'}
                </SoftTypography>
                <SoftTypography
                    variant="body2"
                    sx={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        textAlign: 'center'
                    }}
                >
                    Por favor espere mientras se procesa la operación
                </SoftTypography>
            </Backdrop>
        </SoftBox>
    );
}

GestionComments.propTypes = {
    gestion: PropTypes.object,
    gestionId: PropTypes.number.isRequired,
    workflowId: PropTypes.number.isRequired,
    unidadId: PropTypes.number.isRequired,
    userId: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onCommentAdded: PropTypes.func
};

export default GestionComments;

