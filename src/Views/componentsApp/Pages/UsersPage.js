/**
=========================================================
* GestiaSoft - Users Page
=========================================================
* Custom users page using AppSidenavLayout
*/

import { useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";

// Soft UI Dashboard PRO React example components
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Table from "examples/Tables/Table";

// Custom Layout
import { AppSidenavLayout } from "../Layouts";

// Data
import tableData from "layouts/dashboards/default/data/salesTableData";

import { APP_NAME } from "config/appConfig";

function UsersPage() {
    const { columns, rows } = tableData;

    // ComplexStatisticsCard dropdown menu state
    const [usersActiveMenu, setUsersActiveMenu] = useState(null);
    const [clickEventsMenu, setClickEventsMenu] = useState(null);
    const [purchasesMenu, setPurchasesMenu] = useState(null);
    const [likesMenu, setLikesMenu] = useState(null);

    // ComplexStatisticsCard dropdown menu handlers
    const openUsersActiveMenu = (event) => setUsersActiveMenu(event.currentTarget);
    const closeUsersActiveMenu = () => setUsersActiveMenu(null);
    const openClickEventsMenu = (event) => setClickEventsMenu(event.currentTarget);
    const closeClickEventsMenu = () => setClickEventsMenu(null);
    const openPurchasesMenu = (event) => setPurchasesMenu(event.currentTarget);
    const closePurchasesMenu = () => setPurchasesMenu(null);
    const openLikesMenu = (event) => setLikesMenu(event.currentTarget);
    const closeLikesMenu = () => setLikesMenu(null);

    // Dropdown menu template for the ComplexProjectCard
    const renderMenu = (state, close) => (
        <Menu
            anchorEl={state}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(state)}
            onClose={close}
            keepMounted
        >
            <MenuItem onClick={close}>Ver Detalles</MenuItem>
            <MenuItem onClick={close}>Editar</MenuItem>
            <MenuItem onClick={close}>Eliminar</MenuItem>
        </Menu>
    );

    // Custom routes for the sidenav
    const customRoutes = [
        {
            type: "collapse",
            name: "Dashboard",
            key: "dashboard",
            icon: "dashboard",
            route: "/dashboards/default",
        },
        {
            type: "collapse",
            name: "Usuarios",
            key: "users",
            icon: "people",
            collapse: [
                {
                    name: "Reportes",
                    key: "reports",
                    route: "/pages/users/reports",
                },
                {
                    name: "Nuevo Usuario",
                    key: "new-user",
                    route: "/pages/users/new-user",
                },
                {
                    name: "Lista de Usuarios",
                    key: "users-list",
                    route: "/pages/users/users-list",
                },
            ],
        },
        {
            type: "collapse",
            name: "Perfil",
            key: "profile",
            icon: "person",
            route: "/pages/profile/profile-overview",
        },
        {
            type: "collapse",
            name: "Configuración",
            key: "settings",
            icon: "settings",
            route: "/pages/account/settings",
        },
    ];

    return (
        <AppSidenavLayout routes={customRoutes} brandName={APP_NAME}>
            <SoftBox py={3}>
                <SoftBox mb={3}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <ComplexStatisticsCard
                                        icon="account_circle"
                                        count={{ number: 1600, label: "usuarios activos" }}
                                        percentage="+55%"
                                        dropdown={{
                                            action: openUsersActiveMenu,
                                            menu: renderMenu(usersActiveMenu, closeUsersActiveMenu),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ComplexStatisticsCard
                                        icon="touch_app"
                                        count={{ number: 357, label: "eventos de clic" }}
                                        percentage="+124%"
                                        dropdown={{
                                            action: openClickEventsMenu,
                                            menu: renderMenu(clickEventsMenu, closeClickEventsMenu),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ComplexStatisticsCard
                                        icon="shopping_cart"
                                        count={{ number: 2300, label: "compras" }}
                                        percentage="+55%"
                                        dropdown={{
                                            action: openPurchasesMenu,
                                            menu: renderMenu(purchasesMenu, closePurchasesMenu),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <ComplexStatisticsCard
                                        icon="thumb_up"
                                        count={{ number: 940, label: "me gusta" }}
                                        percentage="+90%"
                                        dropdown={{
                                            action: openLikesMenu,
                                            menu: renderMenu(likesMenu, closeLikesMenu),
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <SoftBox
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "background.paper",
                                    borderRadius: 2,
                                    p: 3,
                                }}
                            >
                                <SoftBox textAlign="center">
                                    <SoftBox
                                        component="img"
                                        src="/static/media/logo-ct.5d5d9eef.png"
                                        alt={APP_NAME}
                                        width="80px"
                                        mb={2}
                                    />
                                    <SoftBox
                                        component="h6"
                                        variant="h6"
                                        color="text"
                                        fontWeight="medium"
                                        mb={1}
                                    >
                                        {APP_NAME}
                                    </SoftBox>
                                    <SoftBox
                                        component="p"
                                        variant="body2"
                                        color="text"
                                        opacity={0.7}
                                    >
                                        Sistema de Gestión de Usuarios
                                    </SoftBox>
                                </SoftBox>
                            </SoftBox>
                        </Grid>
                    </Grid>
                </SoftBox>

                <Table columns={columns} rows={rows} />
            </SoftBox>
        </AppSidenavLayout>
    );
}

export default UsersPage;








