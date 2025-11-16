/**
=========================================================
* GestiaSoft - Login Page
=========================================================
* Custom login page based on Illustration layout
*/

import { useState, useEffect } from "react";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Switch from "@mui/material/Switch";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";

// Authentication layout components
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";

// Image
import chat from "assets/images/illustrations/chat.png";

// Hooks
import { useUserSession } from "hooks/useUserSession";

// Services
import { authService } from "services/authService";

function Login() {
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { login } = useUserSession();
    const navigate = useNavigate();

    const handleSetRememberMe = () => setRememberMe(!rememberMe);

    // Cargar configuración de "Recordarme" al montar el componente
    useEffect(() => {
        const savedRememberMe = localStorage.getItem("rememberMe");
        const savedEmail = localStorage.getItem("rememberedEmail");

        if (savedRememberMe === "true" && savedEmail) {
            setRememberMe(true);
            setEmail(savedEmail);
            console.log("========================================");
            console.log("CONFIGURACIÓN 'RECORDARME' CARGADA");
            console.log("========================================");
            console.log("Recordarme: SÍ");
            console.log("Email recordado:", savedEmail);
            console.log("========================================");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Llamar al servicio de autenticación
            const response = await authService.login(email, password);

            // Verificar que la respuesta sea exitosa
            if (response.status !== 200 || !response.data) {
                setError(response.mensaje || "Error al iniciar sesión");
                setLoading(false);
                return;
            }

            // Extraer datos del usuario de la respuesta
            const userData = response.data;

            // Mapear los datos para el sistema de sesión
            const sessionUserData = {
                usuario_id: userData.usuario_id,
                nombre: userData.nombre,
                email: userData.email,
                unidad_actual_id: userData.unidad.unidad_id,
                rol: userData.rol.rol, // Nombre del rol
                id_rol: userData.rol.id_rol, // ID del rol para comparaciones
                status: userData.status,
                ultimo_login: userData.ultimo_login,
                // Datos adicionales para mantener compatibilidad
                id: userData.usuario_id,
                departamento: userData.unidad.nombre
            };

            console.log("========================================");
            console.log("LOGIN EXITOSO");
            console.log("========================================");
            console.log("Usuario:", sessionUserData.nombre);
            console.log("Email:", sessionUserData.email);
            console.log("usuario_id:", sessionUserData.usuario_id);
            console.log("unidad_actual_id:", sessionUserData.unidad_actual_id);
            console.log("Rol:", sessionUserData.rol);
            console.log("Recordarme:", rememberMe ? "SÍ" : "NO");
            console.log("========================================");

            // Guardar configuración de "Recordarme"
            if (rememberMe) {
                localStorage.setItem("rememberMe", "true");
                localStorage.setItem("rememberedEmail", email);
                console.log("✅ Configuración 'Recordarme' guardada");
            } else {
                localStorage.removeItem("rememberMe");
                localStorage.removeItem("rememberedEmail");
                console.log("❌ Configuración 'Recordarme' removida");
            }

            // Ejecutar login con los datos del usuario
            // Nota: Por ahora no hay token real del backend, usar un placeholder
            const placeholderToken = "authenticated";
            const placeholderPermissions = []; // Se pueden agregar después desde el backend

            login(
                sessionUserData,
                placeholderToken,
                placeholderPermissions,
                sessionUserData.usuario_id,
                sessionUserData.unidad_actual_id
            );

            // Redirigir a la página de gestiones
            navigate("/gestiones/gestion");
        } catch (err) {
            // Manejar errores de la API
            const errorMessage = err?.response?.data?.mensaje ||
                err?.message ||
                "Error al iniciar sesión. Verifica tus credenciales.";
            setError(errorMessage);
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <IllustrationLayout
            title="Iniciar Sesión"
            description="Ingresa tu correo y contraseña para acceder"
            illustration={{
                image: chat,
                title: '"La gestión segura de tu información comienza aquí"',
                description:
                    "Sistema integral de administración documental y seguimiento de gestiones. Optimiza tus procesos, colabora con tu equipo y mantén el control de cada paso.",
            }}
        >
            <SoftBox component="form" role="form" onSubmit={handleSubmit}>
                {error && (
                    <SoftBox mb={2}>
                        <SoftTypography variant="caption" color="error" fontWeight="medium">
                            {error}
                        </SoftTypography>
                    </SoftBox>
                )}

                <SoftBox mb={2}>
                    <SoftInput
                        type="email"
                        placeholder="Email"
                        size="large"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </SoftBox>

                <SoftBox mb={2}>
                    <SoftInput
                        type="password"
                        placeholder="Contraseña"
                        size="large"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </SoftBox>

                <SoftBox display="flex" alignItems="center">
                    <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                    <SoftTypography
                        variant="button"
                        fontWeight="regular"
                        onClick={handleSetRememberMe}
                        sx={{ cursor: "pointer", userSelect: "none" }}
                    >
                        &nbsp;&nbsp;Recordarme
                    </SoftTypography>
                </SoftBox>

                <SoftBox mt={4} mb={1}>
                    <SoftButton
                        type="submit"
                        variant="gradient"
                        color="info"
                        size="large"
                        fullWidth
                        disabled={loading}
                    >
                        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </SoftButton>
                </SoftBox>

                <SoftBox mt={3} textAlign="center">
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                        ¿Olvidaste tu contraseña?{" "}
                        <SoftTypography
                            component={Link}
                            to="/authentication/reset-password/illustration"
                            variant="button"
                            color="info"
                            fontWeight="medium"
                            textGradient
                        >
                            Recuperar
                        </SoftTypography>
                    </SoftTypography>
                </SoftBox>
            </SoftBox>
        </IllustrationLayout>
    );
}

export default Login;

