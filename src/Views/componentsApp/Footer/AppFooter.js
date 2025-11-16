/**
=========================================================
* GestiaSoft - App Footer
=========================================================
* Custom simplified footer for the application
*/

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";

function AppFooter({
    company = { href: "/", name: "SESAL" },
    links = [],
}) {
    const { href, name } = company;
    const { size } = typography;

    const renderLinks = () =>
        links.map((link) => (
            <SoftBox key={link.name} component="li" px={2} lineHeight={1}>
                <Link href={link.href} color="inherit" underline="hover">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                        {link.name}
                    </SoftTypography>
                </Link>
            </SoftBox>
        ));

    return (
        <SoftBox
            component="footer"
            py={2} // Reducido de 4 a 2 - Menos espacio vertical
            px={2}
            mt={2} // Reducido de 6 a 2 - Menos margen superior
            sx={{
                backgroundColor: "transparent", // Fondo transparente
                borderTop: "none", // Sin borde superior
                borderColor: "transparent", // Sin color de borde
                position: "relative",
                zIndex: 1,
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
                // Asegurar que esté en el pie de página
                marginTop: "auto",
                // Sin sombra
                boxShadow: "none",
            }}
        >
            <SoftBox
                width="100%"
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                justifyContent="space-between"
                alignItems="center"
                px={1.5}
            >
                <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexWrap="wrap"
                    color="text"
                    fontSize={size.sm}
                    px={1.5}
                >
                    &copy; {new Date().getFullYear()}, desarrollado con
                    <SoftBox fontSize={size.md} color="info" mb={-0.5} mx={0.25}>
                        <Icon color="inherit" fontSize="inherit">
                            favorite
                        </Icon>
                    </SoftBox>
                    por
                    <Link href={href} color="inherit" underline="hover">
                        <SoftTypography variant="button" fontWeight="medium" color="info">
                            &nbsp;{name}&nbsp;
                        </SoftTypography>
                    </Link>
                    para una mejor gestión.
                </SoftBox>

                {links.length > 0 && (
                    <SoftBox
                        component="ul"
                        sx={({ breakpoints }) => ({
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "center",
                            listStyle: "none",
                            mt: 2, // Reducido de 3 a 2
                            mb: 0,
                            p: 0,

                            [breakpoints.up("lg")]: {
                                mt: 0,
                            },
                        })}
                    >
                        {renderLinks()}
                    </SoftBox>
                )}
            </SoftBox>
        </SoftBox>
    );
}

// Typechecking props for the AppFooter
AppFooter.propTypes = {
    company: PropTypes.objectOf(PropTypes.string),
    links: PropTypes.arrayOf(PropTypes.object),
};

export default AppFooter;
