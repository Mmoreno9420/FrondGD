/**
=========================================================
* GestiaSoft - App Table Component
=========================================================
* Reusable table component with configurable columns, actions, and data
*/

import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TextField,
    InputAdornment,
    Box,
    Chip,
    IconButton,
    Tooltip,
    Typography
} from "@mui/material";

// @mui icons
import SearchIcon from "@mui/icons-material/Search";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

function AppTable({
    columns = [],
    data = [],
    actions = [],
    searchable = true,
    pagination = true,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 10,
    searchPlaceholder = "Buscar...",
    title = "Tabla de Datos",
    subtitle = "",
    showTitle = true,
    elevation = 0,
    maxHeight = "auto",
    stickyHeader = false,
    dense = false,
    hover = true,
    striped = false,
    customStyles = {},
    onRowClick = null,
    loading = false,
    emptyMessage = "No hay datos disponibles",
    searchFields = null, // Array of field names to search in
    customSearch = null, // Custom search function
    onActionClick = null, // Callback for action clicks
    actionColumnWidth = "120px"
}) {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    // Filter data based on search term
    const filteredData = useMemo(() => {
        if (!searchTerm.trim()) return data;

        if (customSearch) {
            return customSearch(data, searchTerm);
        }

        const searchFieldsToUse = searchFields || columns.map(col => col.field).filter(Boolean);

        return data.filter((item) =>
            searchFieldsToUse.some(field => {
                const value = item[field];
                if (value === null || value === undefined) return false;
                return String(value).toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, searchFields, customSearch, columns]);

    // Get current page data
    const currentPageData = pagination
        ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : filteredData;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row);
        }
    };

    const handleActionClick = (action, row) => {
        if (onActionClick) {
            onActionClick(action, row);
        }
    };

    const renderCellValue = (column, value, row) => {
        // Handle custom cell renderer
        if (column.render) {
            return column.render(value, row);
        }

        // Handle status chips
        if (column.type === 'status') {
            const statusConfig = column.statusConfig || {};
            const color = statusConfig[value] || 'default';
            return (
                <Chip
                    label={value}
                    color={color}
                    size="small"
                    sx={{ fontWeight: "bold", ...column.chipStyles }}
                />
            );
        }

        // Handle boolean values
        if (column.type === 'boolean') {
            return (
                <Chip
                    label={value ? 'Sí' : 'No'}
                    color={value ? 'success' : 'error'}
                    size="small"
                />
            );
        }

        // Handle date values
        if (column.type === 'date') {
            return new Date(value).toLocaleDateString('es-ES');
        }

        // Default text rendering
        return value;
    };

    const getColumnWidth = (column) => {
        if (column.width) return column.width;
        if (column.type === 'actions') return actionColumnWidth;
        if (column.type === 'status' || column.type === 'boolean') return '100px';
        if (column.type === 'date') return '140px';
        if (column.field === 'id') return '80px';
        return 'auto';
    };

    const getColumnAlignment = (column) => {
        if (column.align) return column.align;
        if (column.type === 'actions' || column.type === 'status' || column.type === 'boolean') return 'center';
        if (column.type === 'date' || column.field === 'id') return 'center';
        return 'left';
    };

    return (
        <SoftBox>
            {/* Title Section */}
            {showTitle && (
                <SoftBox mb={3}>
                    {title && (
                        <SoftTypography variant="h5" color="info" fontWeight="bold" mb={1}>
                            {title}
                        </SoftTypography>
                    )}
                    {subtitle && (
                        <SoftTypography variant="body2" color="text" opacity={0.7}>
                            {subtitle}
                        </SoftTypography>
                    )}
                </SoftBox>
            )}

            {/* Search Bar */}
            {searchable && (
                <SoftBox mb={3}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: '40px',
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '14px',
                            }
                        }}
                    />
                </SoftBox>
            )}

            {/* Table */}
            <TableContainer
                component={Paper}
                elevation={elevation}
                sx={{
                    maxHeight,
                    overflowX: 'auto',
                    ...customStyles.container
                }}
            >
                <Table
                    sx={{
                        minWidth: 650,
                        tableLayout: 'fixed',
                        width: '100%',
                        ...customStyles.table
                    }}
                    stickyHeader={stickyHeader}
                    size={dense ? 'small' : 'medium'}
                >
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "background.paper" }}>
                            {columns.map((column, index) => (
                                <TableCell
                                    key={column.field || index}
                                    sx={{
                                        fontWeight: "bold",
                                        width: getColumnWidth(column),
                                        textAlign: getColumnAlignment(column),
                                        padding: dense ? '8px 4px' : '12px 8px',
                                        ...column.headerStyles
                                    }}
                                >
                                    {column.header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <Typography>Cargando...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : currentPageData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentPageData.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id || rowIndex}
                                    sx={{
                                        '&:last-child td, &:last-child th': { border: 0 },
                                        '&:hover': hover ? { backgroundColor: 'action.hover' } : {},
                                        backgroundColor: striped && rowIndex % 2 === 1 ? 'action.hover' : 'inherit',
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        ...customStyles.row
                                    }}
                                    onClick={() => handleRowClick(row)}
                                >
                                    {columns.map((column, colIndex) => (
                                        <TableCell
                                            key={column.field || colIndex}
                                            component={column.field === 'id' ? 'th' : 'td'}
                                            scope={column.field === 'id' ? 'row' : undefined}
                                            sx={{
                                                width: getColumnWidth(column),
                                                textAlign: getColumnAlignment(column),
                                                padding: dense ? '8px 4px' : '12px 8px',
                                                ...column.cellStyles
                                            }}
                                        >
                                            {column.type === 'actions' ? (
                                                <Box display="flex" gap={1} justifyContent="center">
                                                    {actions.map((action, actionIndex) => (
                                                        <Tooltip key={actionIndex} title={action.tooltip || action.label}>
                                                            <IconButton
                                                                size="small"
                                                                color={action.color || 'primary'}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleActionClick(action, row);
                                                                }}
                                                                disabled={action.disabled && action.disabled(row)}
                                                                sx={action.styles}
                                                            >
                                                                {action.icon}
                                                            </IconButton>
                                                        </Tooltip>
                                                    ))}
                                                </Box>
                                            ) : (
                                                renderCellValue(column, row[column.field], row)
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination && filteredData.length > 0 && (
                <SoftBox display="flex" justifyContent="center" >
                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={rowsPerPageOptions}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                        sx={{
                            '.MuiTablePagination-toolbar': {
                                padding: 0,
                            },
                            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                margin: 0,
                            }
                        }}
                    />
                </SoftBox>
            )}
        </SoftBox>
    );
}

// PropTypes for validation
AppTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        field: PropTypes.string.isRequired,
        header: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'status', 'boolean', 'date', 'actions']),
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        align: PropTypes.oneOf(['left', 'center', 'right']),
        render: PropTypes.func,
        statusConfig: PropTypes.object,
        chipStyles: PropTypes.object,
        headerStyles: PropTypes.object,
        cellStyles: PropTypes.object
    })).isRequired,
    data: PropTypes.array.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        icon: PropTypes.node.isRequired,
        color: PropTypes.string,
        tooltip: PropTypes.string,
        disabled: PropTypes.func,
        styles: PropTypes.object
    })),
    searchable: PropTypes.bool,
    pagination: PropTypes.bool,
    rowsPerPageOptions: PropTypes.array,
    defaultRowsPerPage: PropTypes.number,
    searchPlaceholder: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    showTitle: PropTypes.bool,
    elevation: PropTypes.number,
    maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stickyHeader: PropTypes.bool,
    dense: PropTypes.bool,
    hover: PropTypes.bool,
    striped: PropTypes.bool,
    customStyles: PropTypes.object,
    onRowClick: PropTypes.func,
    loading: PropTypes.bool,
    emptyMessage: PropTypes.string,
    searchFields: PropTypes.array,
    customSearch: PropTypes.func,
    onActionClick: PropTypes.func,
    actionColumnWidth: PropTypes.string
};

export default AppTable;
