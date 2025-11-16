import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Divider,
  Box,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Chip
} from "@mui/material";

// @mui icons
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import WarningIcon from "@mui/icons-material/Warning";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";

const UserDetail = ({
  user = null,
  mode = "create", // "create" or "edit"
  onSave,
  onCancel,
  loading = false,
  // Props para los datos precargados desde el grid
  rolesOptions = [],
  groupsOptions = [],
  unitsOptions = []
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    roles: [], // Array de objetos {value, label} para roles
    unidades: [], // Array de objetos {value, label} para unidades
    grupos: [], // Array de objetos {value, label} para grupos
    status: true
  });

  // Debug: verificar qué datos llegan
  console.log("🔍 UserDetail - rolesOptions:", rolesOptions?.length, "elementos", rolesOptions);
  console.log("🔍 UserDetail - groupsOptions:", groupsOptions?.length, "elementos", groupsOptions);
  console.log("🔍 UserDetail - unitsOptions:", unitsOptions?.length, "elementos", unitsOptions);

  // Debug: verificar formData
  console.log("🔍 UserDetail - formData.roles:", formData.roles);
  console.log("🔍 UserDetail - formData.unidades:", formData.unidades);
  console.log("🔍 UserDetail - formData.grupos:", formData.grupos);

  // Estado de validación
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Estado para restablecer contraseña
  const [resetPassword, setResetPassword] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Ya no necesitamos funciones de conversión porque Autocomplete maneja directamente los objetos {value, label}

  // Función para reinicializar el formulario
  const resetForm = () => {
    setFormData({
      nombre: "",
      email: "",
      roles: [], // Array vacío para roles
      unidades: [], // Array vacío para unidades
      grupos: [], // Array vacío para grupos
      status: true
    });
    setErrors({});
    setTouched({});
    setResetPassword(false);
  };

  // Inicializar formulario cuando cambie el usuario o modo
  useEffect(() => {
    // ✅ LIMPIAR ERRORES CADA VEZ QUE SE ENTRE A LA PANTALLA
    setErrors({});
    setTouched({});

    if (mode === "edit" && user) {
      // Los datos ya vienen convertidos desde Users.js, solo mapearlos directamente
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        roles: user.roles || [],
        unidades: user.unidades || [],
        grupos: user.grupos || [],
        status: user.status !== undefined ? user.status : true
      });
    } else {
      // Reinicializar completamente para modo crear
      resetForm();
    }
  }, [user, mode]);

  // Ya no necesitamos opciones estáticas, usamos las que vienen de los hooks

  // Validaciones mejoradas
  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        if (!value.trim()) return "El nombre es requerido";
        if (value.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (value.trim().length > 100) return "El nombre no puede exceder 100 caracteres";
        return "";

      case "email":
        if (!value.trim()) return "El email es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "El email no es válido";
        if (value.length > 100) return "El email no puede exceder 100 caracteres";
        return "";

      case "roles":
        if (!value || !Array.isArray(value) || value.length === 0) {
          console.log("🔍 Validación roles - valor inválido:", value);
          return "Al menos un rol es requerido";
        }
        console.log("🔍 Validación roles - OK:", value);
        return "";

      case "unidades":
        if (!value || !Array.isArray(value) || value.length === 0) {
          console.log("🔍 Validación unidades - valor inválido:", value);
          return "Al menos una unidad es requerida";
        }
        console.log("🔍 Validación unidades - OK:", value);
        return "";

      case "grupos":
        if (!value || !Array.isArray(value) || value.length === 0) {
          console.log("🔍 Validación grupos - valor inválido:", value);
          return "Al menos un grupo es requerido";
        }
        console.log("🔍 Validación grupos - OK:", value);
        return "";

      default:
        return "";
    }
  };

  // Manejar cambios en los campos con validación inmediata
  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar campo inmediatamente al cambiar
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Manejar blur de campos
  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, formData[name]);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validar todo el formulario
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (validateForm()) {
      // Convertir objetos {value, label} a arrays de nombres para el API
      const convertObjectsToNames = (objectsArray) => {
        if (!Array.isArray(objectsArray)) return [];
        return objectsArray.map(obj => {
          if (typeof obj === 'object' && obj.label) {
            return obj.label; // Enviar solo el nombre
          }
          return obj.toString();
        });
      };

      const userData = {
        ...formData,
        // Convertir arrays de objetos a arrays de nombres
        roles: convertObjectsToNames(formData.roles),
        unidades: convertObjectsToNames(formData.unidades),
        grupos: convertObjectsToNames(formData.grupos),
        ...(mode === "edit" && { usuario_id: user.usuario_id }),
        resetPassword: resetPassword
      };

      console.log("🔍 UserDetail - enviando datos al API:", {
        original: formData,
        converted: userData
      });

      onSave(userData);
    }
  };

  // Manejar cambio del checkbox de restablecer contraseña
  const handleResetPasswordChange = (event) => {
    if (event.target.checked) {
      setShowResetDialog(true);
    } else {
      setResetPassword(false);
    }
  };

  // Confirmar restablecimiento de contraseña
  const confirmResetPassword = () => {
    setResetPassword(true);
    setShowResetDialog(false);
  };

  // Cancelar restablecimiento de contraseña
  const cancelResetPassword = () => {
    setShowResetDialog(false);
  };

  // Verificar si hay errores
  const hasErrors = Object.keys(errors).some(key => errors[key]);

  // Verificar si se ha introducido algún texto (para desbloquear el botón)
  const hasAnyInput = Object.entries(formData).some(([key, value]) => {
    if (key === 'roles' || key === 'unidades' || key === 'grupos') {
      return Array.isArray(value) && value.length > 0;
    }
    if (typeof value === 'string') {
      return value.trim() !== '';
    }
    return value !== undefined && value !== null;
  });

  return (
    <SoftBox>
      {/* Header del formulario */}


      <form onSubmit={handleSubmit}>
        <Grid container spacing={3} direction="column">
          {/* Alertas de validación */}
          {hasErrors && (
            <Grid item xs={12}>
              <Alert severity="error" sx={{ mb: 2 }}>
                Por favor, validar los campos del formulario.
              </Alert>
            </Grid>
          )}

          {/* Formulario Unificado */}
          <Grid item>
            <Card
              sx={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                overflow: "hidden"
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} direction="column">
                  {/* ID (solo en modo edición) */}
                  {mode === "edit" && user && (
                    <Grid item xs={12}>
                      <SoftBox display="flex" alignItems="center" gap={2}>
                        <SoftTypography variant="body1" fontWeight="medium" color="text">
                          ID de Usuario:
                        </SoftTypography>
                        <SoftBadge
                          color="info"
                          variant="contained"
                          size="lg"
                          sx={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            fontSize: "1rem",
                            fontWeight: "bold",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: "1px solid #bbdefb"
                          }}
                        >
                          #{user.usuario_id || ""}
                        </SoftBadge>
                      </SoftBox>
                    </Grid>
                  )}

                  {/* Nombre */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        Nombre completo:
                      </SoftTypography>
                      <TextField
                        fullWidth
                        placeholder="Ingrese el nombre completo"
                        value={formData.nombre}
                        onChange={(e) => handleChange("nombre", e.target.value)}
                        onBlur={() => handleBlur("nombre")}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                        variant="outlined"
                        size="medium"
                        disabled={mode === "edit"}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main"
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                              borderWidth: "2px"
                            }
                          }
                        }}
                      />
                    </SoftBox>
                  </Grid>

                  {/* Email */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        Correo electrónico:
                      </SoftTypography>
                      <TextField
                        fullWidth
                        type="email"
                        placeholder="Ingrese el correo electrónico"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        error={!!errors.email}
                        helperText={errors.email}
                        variant="outlined"
                        size="medium"
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "8px",
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main"
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: "primary.main",
                              borderWidth: "2px"
                            }
                          }
                        }}
                      />
                    </SoftBox>
                  </Grid>

                  {/* Roles */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        <BusinessIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        Roles
                      </SoftTypography>

                      <Autocomplete
                        multiple
                        options={(() => {
                          console.log("🔍 Autocomplete Roles - options recibidas:", {
                            cantidad: rolesOptions?.length || 0,
                            datos: rolesOptions,
                            tipo: typeof rolesOptions,
                            esArray: Array.isArray(rolesOptions)
                          });
                          return rolesOptions || [];
                        })()}
                        value={(() => {
                          const currentValue = Array.isArray(formData.roles) ? formData.roles : [];
                          console.log("🔍 Autocomplete Roles - value actual:", {
                            cantidad: currentValue.length,
                            datos: currentValue
                          });
                          return currentValue;
                        })()}
                        onChange={(event, newValue) => {
                          console.log("🔍 Autocomplete Roles - onChange:", {
                            evento: event.type,
                            nuevoValor: newValue,
                            cantidad: newValue?.length || 0
                          });
                          handleChange("roles", newValue || []);
                        }}
                        onBlur={() => handleBlur("roles")}
                        getOptionLabel={(option) => option?.label || option || ""}
                        isOptionEqualToValue={(option, value) => {
                          const isEqual = option?.value === value?.value || option?.label === value?.label;
                          console.log("🔍 isOptionEqualToValue Roles:", { option, value, isEqual });
                          return isEqual;
                        }}
                        loading={false}
                        disabled={false}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="filled"
                              label={option?.label || option || ""}
                              color="warning"
                              size="small"
                              {...getTagProps({ index })}
                              key={`role-${option?.value || option?.label || 'undefined'}-${index}`}
                              sx={{
                                backgroundColor: "#fff3e0",
                                color: "#f57c00",
                                fontWeight: "600",
                                "& .MuiChip-deleteIcon": {
                                  color: "#f57c00",
                                  "&:hover": {
                                    color: "#ef6c00"
                                  }
                                }
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Seleccione los roles del usuario..."
                            error={!!errors.roles}
                            helperText={errors.roles}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                minHeight: "56px",
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main"
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                  borderWidth: "2px"
                                }
                              }
                            }}
                          />
                        )}
                        noOptionsText="No hay roles disponibles"
                        sx={{
                          "& .MuiAutocomplete-tag": {
                            margin: "2px"
                          }
                        }}
                      />

                      {errors.roles && (
                        <SoftTypography variant="caption" color="error" mt={1} display="block">
                          {errors.roles}
                        </SoftTypography>
                      )}
                    </SoftBox>
                  </Grid>

                  {/* Unidades */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        <BusinessIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        Unidades
                      </SoftTypography>

                      <Autocomplete
                        multiple
                        options={(() => {
                          console.log("🔍 Autocomplete Unidades - options recibidas:", unitsOptions);
                          return unitsOptions || [];
                        })()}
                        value={Array.isArray(formData.unidades) ? formData.unidades : []}
                        onChange={(event, newValue) => {
                          console.log("🔍 Autocomplete Unidades - onChange:", newValue);
                          handleChange("unidades", newValue || []);
                        }}
                        onBlur={() => handleBlur("unidades")}
                        getOptionLabel={(option) => option?.label || option || ""}
                        isOptionEqualToValue={(option, value) => {
                          const isEqual = option?.value === value?.value || option?.label === value?.label;
                          console.log("🔍 isOptionEqualToValue Unidades:", { option, value, isEqual });
                          return isEqual;
                        }}
                        loading={false}
                        disabled={false}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="filled"
                              label={option?.label || option || ""}
                              color="secondary"
                              size="small"
                              {...getTagProps({ index })}
                              key={`unidad-${option?.value || option?.label || 'undefined'}-${index}`}
                              sx={{
                                backgroundColor: "#f3e5f5",
                                color: "#7b1fa2",
                                fontWeight: "600",
                                "& .MuiChip-deleteIcon": {
                                  color: "#7b1fa2",
                                  "&:hover": {
                                    color: "#6a1b9a"
                                  }
                                }
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Seleccione las unidades del usuario..."
                            error={!!errors.unidades}
                            helperText={errors.unidades}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                minHeight: "56px",
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main"
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                  borderWidth: "2px"
                                }
                              }
                            }}
                          />
                        )}
                        noOptionsText="No hay unidades disponibles"
                        sx={{
                          "& .MuiAutocomplete-tag": {
                            margin: "2px"
                          }
                        }}
                      />

                      {errors.unidades && (
                        <SoftTypography variant="caption" color="error" mt={1} display="block">
                          {errors.unidades}
                        </SoftTypography>
                      )}
                    </SoftBox>
                  </Grid>

                  {/* Grupos */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" flexDirection="column" gap={1}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        <BusinessIcon sx={{ fontSize: 20, mr: 1, verticalAlign: 'middle' }} />
                        Grupos
                      </SoftTypography>

                      <Autocomplete
                        multiple
                        options={(() => {
                          console.log("🔍 Autocomplete Grupos - options recibidas:", groupsOptions);
                          return groupsOptions || [];
                        })()}
                        value={Array.isArray(formData.grupos) ? formData.grupos : []}
                        onChange={(event, newValue) => {
                          console.log("🔍 Autocomplete Grupos - onChange:", newValue);
                          handleChange("grupos", newValue || []);
                        }}
                        onBlur={() => handleBlur("grupos")}
                        getOptionLabel={(option) => option?.label || option || ""}
                        isOptionEqualToValue={(option, value) => {
                          const isEqual = option?.value === value?.value || option?.label === value?.label;
                          console.log("🔍 isOptionEqualToValue Grupos:", { option, value, isEqual });
                          return isEqual;
                        }}
                        loading={false}
                        disabled={false}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="filled"
                              label={option?.label || option || ""}
                              color="primary"
                              size="small"
                              {...getTagProps({ index })}
                              key={`grupo-${option?.value || option?.label || 'undefined'}-${index}`}
                              sx={{
                                backgroundColor: "#e3f2fd",
                                color: "#1976d2",
                                fontWeight: "600",
                                "& .MuiChip-deleteIcon": {
                                  color: "#1976d2",
                                  "&:hover": {
                                    color: "#1565c0"
                                  }
                                }
                              }}
                            />
                          ))
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            placeholder="Seleccione los grupos del usuario..."
                            error={!!errors.grupos}
                            helperText={errors.grupos}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "8px",
                                minHeight: "56px",
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main"
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                  borderColor: "primary.main",
                                  borderWidth: "2px"
                                }
                              }
                            }}
                          />
                        )}
                        noOptionsText="No hay grupos disponibles"
                        sx={{
                          "& .MuiAutocomplete-tag": {
                            margin: "2px"
                          }
                        }}
                      />

                      {errors.grupos && (
                        <SoftTypography variant="caption" color="error" mt={1} display="block">
                          {errors.grupos}
                        </SoftTypography>
                      )}
                    </SoftBox>
                  </Grid>

                  {/* Estado del Usuario */}
                  <Grid item xs={12}>
                    <SoftBox display="flex" alignItems="center" justifyContent="space-between" py={2}>
                      <SoftTypography variant="body1" fontWeight="medium" color="text">
                        Estado del usuario:
                      </SoftTypography>
                      <SoftBox display="flex" alignItems="center" gap={2}>
                        <SoftTypography
                          variant="body1"
                          color={formData.status ? "success" : "text"}
                          fontWeight="medium"
                        >
                          {formData.status ? "Activo" : "Inactivo"}
                        </SoftTypography>
                        <Switch
                          checked={formData.status}
                          onChange={(e) => handleChange("status", e.target.checked)}
                          color="primary"
                          size="large"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                              },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#1976d2',
                            },
                          }}
                        />
                      </SoftBox>
                    </SoftBox>
                  </Grid>

                  {/* Restablecer Contraseña (solo en modo edición) */}
                  {mode === "edit" && (
                    <Grid item xs={12}>
                      <SoftBox display="flex" alignItems="center" gap={2} py={2}>
                        <Checkbox
                          checked={resetPassword}
                          onChange={handleResetPasswordChange}
                          color="warning"
                          size="large"
                          sx={{
                            color: '#ff9800',
                            '&.Mui-checked': {
                              color: '#ff9800',
                            },
                          }}
                        />
                        <SoftBox display="flex" alignItems="center" gap={1}>
                          <Box
                            sx={{
                              color: '#ff9800',
                              fontSize: '1.2rem',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            🔐
                          </Box>
                          <SoftTypography variant="body1" fontWeight="medium" color="warning">
                            Restablecer contraseña
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Botones de acción */}
          <Grid item>
            <SoftBox
              display="flex"
              gap={2}
              justifyContent="flex-end"
              pt={3}
            >
              <Button
                variant="outlined"
                color="inherit"
                onClick={onCancel}
                disabled={loading}
                sx={{
                  minWidth: 140,
                  height: 48,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  borderColor: "#6c757d",
                  color: "#6c757d",
                  backgroundColor: "white",
                  "&:hover": {
                    borderColor: "#495057",
                    backgroundColor: "#f8f9fa",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.2s ease"
                }}
              >
                Cancelar
              </Button>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || hasErrors || (mode === "create" && !hasAnyInput)}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                sx={{
                  minWidth: 140,
                  height: 48,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "medium",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    transform: "translateY(-1px)",
                  },
                  transition: "all 0.3s ease"
                }}
              >
                {loading ? "Guardando..." : (mode === "create" ? "Crear Usuario" : "Guardar cambios")}
              </Button>
            </SoftBox>
          </Grid>
        </Grid>
      </form>

      {/* Dialog de confirmación para restablecer contraseña */}
      <Dialog
        open={showResetDialog}
        onClose={cancelResetPassword}
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
        {/* Header con icono y título */}
        <DialogTitle sx={{ pb: 1 }}>
          <SoftBox display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                fontSize: "2rem",
                color: "#ff9800",
                display: "flex",
                alignItems: "center"
              }}
            >
              🔐
            </Box>
            <SoftTypography
              variant="h6"
              fontWeight="bold"
              color="dark"
              sx={{ fontSize: "1.25rem" }}
            >
              Confirmar Restablecimiento de Contraseña
            </SoftTypography>
          </SoftBox>
        </DialogTitle>

        {/* Contenido del mensaje */}
        <DialogContent sx={{ px: 3, pb: 2 }}>
          <SoftBox display="flex" flexDirection="column" gap={2}>
            <SoftTypography variant="body1" color="dark" fontSize="1rem">
              ¿Estás seguro de que deseas restablecer la contraseña del usuario?
            </SoftTypography>

            <SoftTypography variant="body1" color="dark" fontSize="1rem">
              Se generará una nueva contraseña temporal y se enviará al correo electrónico registrado.
            </SoftTypography>

            <SoftTypography
              variant="body2"
              color="text"
              fontSize="0.9rem"
              sx={{ fontStyle: "italic" }}
            >
              Por seguridad, el usuario deberá cambiarla en su primer inicio de sesión.
            </SoftTypography>
          </SoftBox>
        </DialogContent>

        {/* Botones de acción */}
        <DialogActions sx={{ p: 3, gap: 2, justifyContent: "center" }}>
          <Button
            onClick={cancelResetPassword}
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
            Cancelar
          </Button>

          <Button
            onClick={confirmResetPassword}
            variant="contained"
            sx={{
              minWidth: 120,
              height: 44,
              textTransform: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "medium",
              color: "white",
              boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
              "&:hover": {
                backgroundColor: "#1565c0",
                transform: "translateY(-1px)",
                boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
              },
              transition: "all 0.3s ease"
            }}
          >
            Restablecer
          </Button>
        </DialogActions>
      </Dialog>
    </SoftBox>
  );
};

UserDetail.propTypes = {
  user: PropTypes.object,
  mode: PropTypes.oneOf(["create", "edit"]),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  rolesOptions: PropTypes.array,
  groupsOptions: PropTypes.array,
  unitsOptions: PropTypes.array
};

export default UserDetail;
