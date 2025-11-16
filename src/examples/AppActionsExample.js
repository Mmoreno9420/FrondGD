/**
=========================================================
* GestiaSoft - App Actions Usage Example
=========================================================
* Ejemplo completo de cómo usar los hooks y contextos de acciones
*/

import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    CardContent,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    TextField,
    Switch,
    FormControlLabel,
    Alert,
    Chip,
    Divider
} from "@mui/material";

// Importar hooks
import { useUserSession } from "../hooks/useUserSession";
import { useScreenSteps } from "../hooks/useScreenSteps";
import { useSavedElements } from "../hooks/useSavedElements";
import { useAppActions } from "../context/AppActionsContext";

// Ejemplo 1: Gestión de Sesión de Usuario
const UserSessionExample = () => {
    const {
        isAuthenticated,
        user,
        permissions,
        login,
        logout,
        hasPermission,
        hasAnyPermission
    } = useUserSession();

    const [loginData, setLoginData] = useState({
        email: "admin@sesal.gob.hn",
        password: "123456"
    });

    const handleLogin = () => {
        const mockUser = {
            id: 1,
            name: "Administrador",
            email: loginData.email,
            role: "admin"
        };

        const mockToken = "mock-jwt-token-12345";
        const mockPermissions = ["users.read", "users.write", "permissions.read"];

        login(mockUser, mockToken, mockPermissions);
    };

    const handleLogout = () => {
        logout();
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Ejemplo 1: Gestión de Sesión de Usuario
                </Typography>

                {!isAuthenticated ? (
                    <Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            No hay sesión activa
                        </Typography>
                        <TextField
                            label="Email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <Button onClick={handleLogin} variant="contained" sx={{ mt: 2 }}>
                            Iniciar Sesión
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Sesión activa
                        </Alert>
                        <Typography variant="body2">
                            <strong>Usuario:</strong> {user?.name}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Email:</strong> {user?.email}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Rol:</strong> {user?.role}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" gutterBottom>
                            <strong>Permisos:</strong>
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                            {permissions.map((permission) => (
                                <Chip
                                    key={permission}
                                    label={permission}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>

                        <Typography variant="body2" gutterBottom>
                            <strong>Verificaciones:</strong>
                        </Typography>
                        <Typography variant="caption" display="block">
                            Tiene permiso &quot;users.read&quot;: {hasPermission("users.read") ? "✅ Sí" : "❌ No"}
                        </Typography>
                        <Typography variant="caption" display="block">
                            Tiene algún permiso de usuarios: {hasAnyPermission(["users.read", "users.write"]) ? "✅ Sí" : "❌ No"}
                        </Typography>

                        <Button onClick={handleLogout} variant="outlined" color="error" sx={{ mt: 2 }}>
                            Cerrar Sesión
                        </Button>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Ejemplo 2: Pasos de Pantalla (Wizard/Stepper)
const ScreenStepsExample = () => {
    const {
        currentStep,
        totalSteps,
        steps,
        currentStepData,
        progress,
        isFirstStep,
        isLastStep,
        canGoNext,
        canGoBack,
        isCompleted,
        setupSteps,
        goNext,
        goPrevious,
        goTo,
        reset,
        complete
    } = useScreenSteps();

    const [stepData, setStepData] = useState({});

    // Configurar pasos al montar el componente
    useEffect(() => {
        const stepsConfig = [
            { title: "Información Personal", description: "Datos básicos del usuario" },
            { title: "Configuración", description: "Preferencias del sistema" },
            { title: "Confirmación", description: "Revisar y confirmar" }
        ];

        setupSteps(stepsConfig);
    }, [setupSteps]);

    const handleNext = () => {
        // Validar datos del paso actual antes de continuar
        if (currentStep === 0 && !stepData.name) {
            alert("Por favor ingresa tu nombre");
            return;
        }

        goNext();
    };

    const handleComplete = () => {
        complete();
        alert("¡Proceso completado!");
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Box>
                        <TextField
                            label="Nombre"
                            value={stepData.name || ""}
                            onChange={(e) => setStepData({ ...stepData, name: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            value={stepData.email || ""}
                            onChange={(e) => setStepData({ ...stepData, email: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={stepData.notifications || false}
                                    onChange={(e) => setStepData({ ...stepData, notifications: e.target.checked })}
                                />
                            }
                            label="Recibir notificaciones"
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={stepData.darkMode || false}
                                    onChange={(e) => setStepData({ ...stepData, darkMode: e.target.checked })}
                                />
                            }
                            label="Modo oscuro"
                        />
                    </Box>
                );
            case 2:
                return (
                    <Box>
                        <Typography variant="body2" gutterBottom>
                            <strong>Resumen:</strong>
                        </Typography>
                        <Typography variant="body2">
                            Nombre: {stepData.name}
                        </Typography>
                        <Typography variant="body2">
                            Email: {stepData.email}
                        </Typography>
                        <Typography variant="body2">
                            Notificaciones: {stepData.notifications ? "Activadas" : "Desactivadas"}
                        </Typography>
                        <Typography variant="body2">
                            Modo oscuro: {stepData.darkMode ? "Activado" : "Desactivado"}
                        </Typography>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Ejemplo 2: Pasos de Pantalla (Wizard)
                </Typography>

                <Stepper activeStep={currentStep} sx={{ mb: 3 }}>
                    {steps.map((step, index) => (
                        <Step key={index}>
                            <StepLabel>{step.title}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Progreso: {progress}%
                </Typography>

                <Box sx={{ mb: 3 }}>
                    {renderStepContent()}
                </Box>

                <Box display="flex" gap={2}>
                    {canGoBack && (
                        <Button onClick={goPrevious} variant="outlined">
                            Anterior
                        </Button>
                    )}

                    {canGoNext && (
                        <Button onClick={handleNext} variant="contained">
                            Siguiente
                        </Button>
                    )}

                    {isLastStep && !isCompleted && (
                        <Button onClick={handleComplete} variant="contained" color="success">
                            Completar
                        </Button>
                    )}

                    <Button onClick={reset} variant="text">
                        Reiniciar
                    </Button>
                </Box>

                {isCompleted && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        ¡Proceso completado exitosamente!
                    </Alert>
                )}
            </CardContent>
        </Card>
    );
};

// Ejemplo 3: Elementos Guardados
const SavedElementsExample = () => {
    const {
        forms,
        selections,
        filters,
        preferences,
        saveForm,
        getForm,
        saveSelection,
        getSelection,
        saveFilter,
        getFilter,
        savePreference,
        getPreference,
        clearForms,
        clearSelections,
        clearFilters,
        clearPreferences,
        clearAll
    } = useSavedElements();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const handleSaveForm = () => {
        saveForm("userForm", formData);
        alert("Formulario guardado!");
    };

    const handleLoadForm = () => {
        const savedForm = getForm("userForm");
        if (savedForm) {
            setFormData(savedForm);
            alert("Formulario cargado!");
        } else {
            alert("No hay formulario guardado");
        }
    };

    const handleSaveSelection = () => {
        saveSelection("userPreferences", {
            theme: "dark",
            language: "es",
            notifications: true
        });
        alert("Selección guardada!");
    };

    const handleSaveFilter = () => {
        saveFilter("userList", {
            status: "active",
            department: "IT",
            search: "admin"
        });
        alert("Filtro guardado!");
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Ejemplo 3: Elementos Guardados
                </Typography>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Formulario:
                    </Typography>
                    <TextField
                        label="Nombre"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Teléfono"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        fullWidth
                        margin="normal"
                    />

                    <Box display="flex" gap={1} sx={{ mt: 2 }}>
                        <Button onClick={handleSaveForm} variant="contained" size="small">
                            Guardar Formulario
                        </Button>
                        <Button onClick={handleLoadForm} variant="outlined" size="small">
                            Cargar Formulario
                        </Button>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Button onClick={handleSaveSelection} variant="outlined" size="small">
                        Guardar Selección
                    </Button>
                    <Button onClick={handleSaveFilter} variant="outlined" size="small">
                        Guardar Filtro
                    </Button>
                    <Button onClick={clearForms} variant="text" size="small" color="error">
                        Limpiar Formularios
                    </Button>
                    <Button onClick={clearAll} variant="text" size="small" color="error">
                        Limpiar Todo
                    </Button>
                </Box>

                <Typography variant="subtitle2" gutterBottom>
                    Elementos Guardados:
                </Typography>
                <Typography variant="caption" display="block">
                    Formularios: {Object.keys(forms).length}
                </Typography>
                <Typography variant="caption" display="block">
                    Selecciones: {Object.keys(selections).length}
                </Typography>
                <Typography variant="caption" display="block">
                    Filtros: {Object.keys(filters).length}
                </Typography>
                <Typography variant="caption" display="block">
                    Preferencias: {Object.keys(preferences).length}
                </Typography>
            </CardContent>
        </Card>
    );
};

// Ejemplo 4: Notificaciones y Modales
const NotificationsExample = () => {
    const { addNotification, removeNotification, markNotificationRead, clearNotifications } = useAppActions();
    const { openModal, closeModal } = useAppActions();
    const { state } = useAppActions();

    const handleAddNotification = (type = "info") => {
        addNotification({
            type,
            title: `Notificación ${type}`,
            message: `Esta es una notificación de tipo ${type}`,
            duration: 5000
        });
    };

    const handleOpenModal = () => {
        openModal("exampleModal", {
            title: "Modal de Ejemplo",
            content: "Este es el contenido del modal"
        });
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Ejemplo 4: Notificaciones y Modales
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Button
                        onClick={() => handleAddNotification("success")}
                        variant="contained"
                        color="success"
                        size="small"
                    >
                        Notificación Éxito
                    </Button>
                    <Button
                        onClick={() => handleAddNotification("error")}
                        variant="contained"
                        color="error"
                        size="small"
                    >
                        Notificación Error
                    </Button>
                    <Button
                        onClick={() => handleAddNotification("warning")}
                        variant="contained"
                        color="warning"
                        size="small"
                    >
                        Notificación Advertencia
                    </Button>
                    <Button
                        onClick={() => handleAddNotification("info")}
                        variant="contained"
                        color="info"
                        size="small"
                    >
                        Notificación Info
                    </Button>
                </Box>

                <Box display="flex" gap={1} sx={{ mb: 2 }}>
                    <Button onClick={handleOpenModal} variant="outlined" size="small">
                        Abrir Modal
                    </Button>
                    <Button onClick={closeModal} variant="outlined" size="small">
                        Cerrar Modal
                    </Button>
                    <Button onClick={clearNotifications} variant="text" size="small" color="error">
                        Limpiar Notificaciones
                    </Button>
                </Box>

                <Typography variant="body2" gutterBottom>
                    <strong>Estado:</strong>
                </Typography>
                <Typography variant="caption" display="block">
                    Modal activo: {state.modals.active || "Ninguno"}
                </Typography>
                <Typography variant="caption" display="block">
                    Notificaciones no leídas: {state.notifications.unreadCount}
                </Typography>
                <Typography variant="caption" display="block">
                    Total de notificaciones: {state.notifications.messages.length}
                </Typography>
            </CardContent>
        </Card>
    );
};

// Componente principal
const AppActionsExample = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Ejemplos de Acciones de la App
            </Typography>

            <Box display="grid" gap={3} gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))">
                <UserSessionExample />
                <ScreenStepsExample />
                <SavedElementsExample />
                <NotificationsExample />
            </Box>
        </Box>
    );
};

export default AppActionsExample;
