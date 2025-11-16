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

import { useState } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// @mui/icons-material
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCommentIcon from "@mui/icons-material/AddComment";

function DocumentsTable({ documents }) {
    const [expandedDocs, setExpandedDocs] = useState({});
    const [newComments, setNewComments] = useState({});

    const handleToggleExpanded = (docId) => {
        setExpandedDocs(prev => ({
            ...prev,
            [docId]: !prev[docId]
        }));
    };

    const handleAddComment = (docId) => {
        const commentText = newComments[docId];
        if (commentText && commentText.trim()) {
            // Aquí se podría implementar la lógica para agregar el comentario
            console.log(`Agregando comentario al documento ${docId}:`, commentText);
            setNewComments(prev => ({
                ...prev,
                [docId]: ""
            }));
        }
    };

    const handleCommentChange = (docId, value) => {
        setNewComments(prev => ({
            ...prev,
            [docId]: value
        }));
    };

    const getTypeColor = (type) => {
        switch (type) {
            case "PDF":
                return "error";
            case "Word":
                return "info";
            case "Excel":
                return "success";
            default:
                return "secondary";
        }
    };

    const getUnitColor = (unit) => {
        switch (unit) {
            case "Gerencia administrativa":
                return "info";
            case "Unidad de Ejecución de Gasto":
                return "warning";
            case "Unidad de compra":
                return "success";
            default:
                return "secondary";
        }
    };

    return (
        <SoftBox>
            {documents.map((doc) => (
                <SoftBox key={doc.id} mb={2}>
                    {/* Documento principal */}
                    <SoftBox
                        p={2}
                        bgcolor="grey.50"
                        borderRadius={1}
                        border="1px solid"
                        borderColor="grey.300"
                    >
                        <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                            {/* Información del documento */}
                            <SoftBox flex={1}>
                                <SoftBox display="flex" alignItems="center" gap={1} mb={1}>
                                    <Icon
                                        color={getTypeColor(doc.type)}
                                        sx={{ fontSize: "1.2rem" }}
                                    >
                                        {doc.typeIcon}
                                    </Icon>
                                    <SoftTypography variant="body2" fontWeight="medium" color="primary" sx={{ cursor: "pointer" }}>
                                        {doc.name}
                                    </SoftTypography>
                                </SoftBox>

                                <SoftBox display="flex" alignItems="center" gap={2}>
                                    {/* Tipo de documento */}
                                    <SoftBox display="flex" alignItems="center" gap={0.5}>
                                        <Icon color={getTypeColor(doc.type)} sx={{ fontSize: "1rem" }}>
                                            {doc.typeIcon}
                                        </Icon>
                                        <SoftTypography variant="caption" color="text.secondary">
                                            {doc.type}
                                        </SoftTypography>
                                    </SoftBox>

                                    {/* Fecha */}
                                    <SoftTypography variant="caption" color="text.secondary">
                                        {doc.date}
                                    </SoftTypography>

                                    {/* Unidad */}
                                    <SoftBox display="flex" alignItems="center" gap={0.5}>
                                        <Icon color={getUnitColor(doc.unit)} sx={{ fontSize: "1rem" }}>
                                            {doc.unitIcon}
                                        </Icon>
                                        <SoftTypography variant="caption" color="text.secondary">
                                            {doc.unit}
                                        </SoftTypography>
                                    </SoftBox>

                                    {/* Tamaño */}
                                    <SoftTypography variant="caption" color="text.secondary">
                                        {doc.size}
                                    </SoftTypography>
                                </SoftBox>
                            </SoftBox>

                            {/* Acciones */}
                            <SoftBox display="flex" alignItems="center" gap={1}>
                                <Tooltip title="Ver documento">
                                    <IconButton size="small" color="info">
                                        <VisibilityIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Descargar documento">
                                    <IconButton size="small" color="success">
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={expandedDocs[doc.id] ? "Ocultar comentarios" : "Ver comentarios"}>
                                    <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleToggleExpanded(doc.id)}
                                    >
                                        {expandedDocs[doc.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                </Tooltip>
                            </SoftBox>
                        </SoftBox>
                    </SoftBox>

                    {/* Comentarios expandibles */}
                    <Collapse in={expandedDocs[doc.id]}>
                        <SoftBox ml={2} pl={2} borderLeft="2px solid" borderColor="grey.300">
                            {/* Comentarios existentes */}
                            <SoftBox mb={2}>
                                <SoftTypography variant="caption" fontWeight="bold" color="text.secondary" mb={1}>
                                    Comentarios ({doc.comments.length})
                                </SoftTypography>

                                {doc.comments.map((comment) => (
                                    <SoftBox key={comment.id} mb={1.5} p={1.5} bgcolor="white" borderRadius={1} border="1px solid" borderColor="grey.200">
                                        <SoftBox display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                                            <SoftBox display="flex" alignItems="center" gap={1}>
                                                <Icon color="primary" sx={{ fontSize: "1rem" }}>
                                                    person
                                                </Icon>
                                                <SoftTypography variant="caption" fontWeight="medium">
                                                    {comment.user}
                                                </SoftTypography>
                                                <SoftTypography variant="caption" color="text.secondary">
                                                    ({comment.unit})
                                                </SoftTypography>
                                            </SoftBox>
                                            <SoftTypography variant="caption" color="text.secondary">
                                                {comment.date}
                                            </SoftTypography>
                                        </SoftBox>
                                        <SoftTypography variant="body2" color="text">
                                            {comment.text}
                                        </SoftTypography>
                                    </SoftBox>
                                ))}
                            </SoftBox>

                            {/* Agregar nuevo comentario */}
                            <SoftBox>
                                <SoftBox display="flex" alignItems="center" gap={1} mb={1}>
                                    <AddCommentIcon color="primary" sx={{ fontSize: "1rem" }} />
                                    <SoftTypography variant="caption" fontWeight="bold" color="text.secondary">
                                        Agregar comentario
                                    </SoftTypography>
                                </SoftBox>

                                <SoftBox display="flex" gap={1}>
                                    <TextField
                                        size="small"
                                        placeholder="Escribe tu comentario..."
                                        value={newComments[doc.id] || ""}
                                        onChange={(e) => handleCommentChange(doc.id, e.target.value)}
                                        multiline
                                        rows={2}
                                        sx={{ flex: 1 }}
                                    />
                                    <SoftButton
                                        variant="gradient"
                                        color="info"
                                        size="small"
                                        onClick={() => handleAddComment(doc.id)}
                                        disabled={!newComments[doc.id] || !newComments[doc.id].trim()}
                                    >
                                        Agregar
                                    </SoftButton>
                                </SoftBox>
                            </SoftBox>
                        </SoftBox>
                    </Collapse>
                </SoftBox>
            ))}
        </SoftBox>
    );
}

// Typechecking props for the DocumentsTable
DocumentsTable.propTypes = {
    documents: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            unitIcon: PropTypes.string.isRequired,
            date: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            typeIcon: PropTypes.string.isRequired,
            size: PropTypes.string.isRequired,
            comments: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    user: PropTypes.string.isRequired,
                    unit: PropTypes.string.isRequired,
                    date: PropTypes.string.isRequired,
                    text: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
};

export default DocumentsTable;
