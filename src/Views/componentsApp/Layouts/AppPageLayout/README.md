# AppPageLayout

## Descripción
`AppPageLayout` es un layout personalizado para páginas que incluye automáticamente el navbar, sidebar y footer de la aplicación GestiaSoft.

## Características
- **Navbar personalizado**: Incluye `AppNavbar` con logo, navegación y menú de usuario
- **Sidebar del proyecto**: Respeta el sidebar principal del proyecto (renderizado desde `App.js`)
- **Footer personalizado**: Incluye `AppFooter` con información de la empresa
- **Layout responsivo**: Se adapta a diferentes tamaños de pantalla
- **Espaciado automático**: Maneja automáticamente el espaciado entre navbar, contenido y footer

## Uso

### Importación
```jsx
import { AppPageLayout } from "Views/componentsApp";
```

### Implementación básica
```jsx
function MiPagina() {
  return (
    <AppPageLayout>
      {/* Solo el contenido de tu página */}
      <Container>
        <h1>Mi Contenido</h1>
      </Container>
    </AppPageLayout>
  );
}
```

### Con opciones de transparencia
```jsx
function MiPaginaTransparente() {
  return (
    <AppPageLayout transparent light>
      {/* Contenido con navbar transparente */}
    </AppPageLayout>
  );
}
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `node` | **requerido** | Contenido de la página |
| `transparent` | `boolean` | `false` | Hace el navbar transparente |
| `light` | `boolean` | `false` | Usa colores claros en el navbar |

## Estructura del Layout

```
AppPageLayout
├── AppNavbar (transparente/opaco, claro/oscuro)
├── Contenido de la página (con padding automático)
└── AppFooter
```

## Ventajas sobre otros layouts

1. **Consistencia**: Usa los mismos componentes que el resto de la aplicación
2. **Simplicidad**: Solo necesitas envolver tu contenido
3. **Flexibilidad**: Opciones de transparencia y colores
4. **Mantenibilidad**: Centralizado en `componentsApp`
5. **Responsividad**: Maneja automáticamente diferentes tamaños de pantalla

## Ejemplo completo

```jsx
import React from "react";
import { Container, Grid, Card, CardContent } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import { AppPageLayout } from "Views/componentsApp";

function EjemploCompleto() {
  return (
    <AppPageLayout>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <SoftBox p={3}>
                  <SoftTypography variant="h3" color="info" textAlign="center">
                    Mi Página
                  </SoftTypography>
                  <SoftTypography variant="body1" textAlign="center">
                    Contenido de ejemplo
                  </SoftTypography>
                </SoftBox>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </AppPageLayout>
  );
}

export default EjemploCompleto;
```

## Notas importantes

- El sidebar se renderiza automáticamente desde `App.js`
- El navbar y footer se renderizan desde este layout
- El contenido se envuelve automáticamente con padding y espaciado correcto
- Funciona perfectamente con el sistema de rutas existente

















