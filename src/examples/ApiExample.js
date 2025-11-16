/**
=========================================================
* GestiaSoft - API Usage Example
=========================================================
* Ejemplo de cómo usar los hooks y servicios de API
*/

import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Typography, Box, Alert } from "@mui/material";

// Importar hooks y servicios
import { useApi, useGet, usePost } from "../hooks/useApi";
import { permissionService } from "../services/permissionService";
import { API_CONFIG } from "../config/apiConfig";

// Ejemplo 1: Usando useApi hook genérico
const ApiExample1 = () => {
    const { get, post, isLoading, data, error, reset } = useApi();

    const handleGetData = async () => {
        try {
            const result = await get("/test-endpoint");
            console.log("Datos obtenidos:", result);
        } catch (err) {
            console.error("Error:", err.userMessage);
        }
    };

    const handlePostData = async () => {
        try {
            const result = await post("/test-endpoint", { name: "Test", value: 123 });
            console.log("Datos enviados:", result);
        } catch (err) {
            console.error("Error:", err.userMessage);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Ejemplo 1: useApi Hook Genérico</Typography>
                <Box mt={2}>
                    <Button onClick={handleGetData} disabled={isLoading} variant="contained" sx={{ mr: 1 }}>
                        {isLoading ? "Cargando..." : "GET Data"}
                    </Button>
                    <Button onClick={handlePostData} disabled={isLoading} variant="outlined" sx={{ mr: 1 }}>
                        POST Data
                    </Button>
                    <Button onClick={reset} variant="text">
                        Reset
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error.userMessage}
                    </Alert>
                )}
                {data && (
                    <Box mt={2}>
                        <Typography variant="body2">Datos: {JSON.stringify(data)}</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Ejemplo 2: Usando useGet hook específico
const ApiExample2 = () => {
    const { execute, isLoading, data, error } = useGet("/api/users");

    useEffect(() => {
        // Ejecutar automáticamente al montar el componente
        execute();
    }, [execute]);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Ejemplo 2: useGet Hook Específico</Typography>
                <Box mt={2}>
                    <Button onClick={execute} disabled={isLoading} variant="contained">
                        {isLoading ? "Cargando..." : "Recargar Usuarios"}
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error.userMessage}
                    </Alert>
                )}
                {data && (
                    <Box mt={2}>
                        <Typography variant="body2">Usuarios: {JSON.stringify(data)}</Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Ejemplo 3: Usando servicio específico de permisos
const ApiExample3 = () => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadPermissions = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await permissionService.getPermissions({
                page: 1,
                limit: 10,
                search: "",
                status: "all"
            });
            setPermissions(result.data || []);
        } catch (err) {
            setError(err.userMessage);
        } finally {
            setLoading(false);
        }
    };

    const createPermission = async () => {
        try {
            const newPermission = {
                nombre: "Nuevo Permiso",
                descripcion: "Descripción del nuevo permiso",
                modulo: "General",
                accion: "crear",
                status: true
            };

            const result = await permissionService.createPermission(newPermission);
            console.log("Permiso creado:", result);

            // Recargar la lista
            loadPermissions();
        } catch (err) {
            setError(err.userMessage);
        }
    };

    useEffect(() => {
        loadPermissions();
    }, []);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Ejemplo 3: Servicio de Permisos</Typography>
                <Box mt={2}>
                    <Button onClick={loadPermissions} disabled={loading} variant="contained" sx={{ mr: 1 }}>
                        {loading ? "Cargando..." : "Cargar Permisos"}
                    </Button>
                    <Button onClick={createPermission} disabled={loading} variant="outlined">
                        Crear Permiso
                    </Button>
                </Box>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {permissions.length > 0 && (
                    <Box mt={2}>
                        <Typography variant="body2">
                            Permisos cargados: {permissions.length}
                        </Typography>
                        <Typography variant="caption" display="block">
                            {JSON.stringify(permissions.slice(0, 2))}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

// Ejemplo 4: Configuración de API
const ApiExample4 = () => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Ejemplo 4: Configuración de API</Typography>
                <Box mt={2}>
                    <Typography variant="body2">
                        <strong>URL Base:</strong> {API_CONFIG.baseURL}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Timeout:</strong> {API_CONFIG.timeout}ms
                    </Typography>
                    <Typography variant="body2">
                        <strong>Reintentos:</strong> {API_CONFIG.retry.attempts}
                    </Typography>
                    <Typography variant="body2">
                        <strong>Endpoints de Permisos:</strong>
                    </Typography>
                    <Typography variant="caption" display="block">
                        Lista: {API_CONFIG.endpoints.permissions.list}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Crear: {API_CONFIG.endpoints.permissions.create}
                    </Typography>
                    <Typography variant="caption" display="block">
                        Actualizar: {API_CONFIG.endpoints.permissions.update}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

// Componente principal que muestra todos los ejemplos
const ApiExample = () => {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Ejemplos de Uso de API
            </Typography>

            <Box display="grid" gap={3} gridTemplateColumns="repeat(auto-fit, minmax(400px, 1fr))">
                <ApiExample1 />
                <ApiExample2 />
                <ApiExample3 />
                <ApiExample4 />
            </Box>
        </Box>
    );
};

export default ApiExample;
