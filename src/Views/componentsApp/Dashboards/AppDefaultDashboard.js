/**
=========================================================
* GestiaSoft - App Default Dashboard
=========================================================
* Custom dashboard using AppDashboardLayout and AppNavbar
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React example components
import MiniStatisticsCard from "examples/Cards/StatisticsCards/MiniStatisticsCard";
import SalesTable from "examples/Tables/SalesTable";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import Globe from "examples/Globe";

// Soft UI Dashboard PRO React base styles
import typography from "assets/theme/base/typography";
import breakpoints from "assets/theme/base/breakpoints";

// Data
import reportsBarChartData from "layouts/dashboards/default/data/reportsBarChartData";

// Custom Layout
import { AppDashboardLayout } from "../Layouts";

function AppDefaultDashboard() {
    const { values } = breakpoints;
    const { size } = typography;
    const { chart, items } = reportsBarChartData;

    return (
        <AppDashboardLayout>
            <SoftBox py={3}>
                <Grid container>
                    <Grid item xs={12} lg={7}>
                        <SoftBox mb={3} p={1}>
                            <SoftTypography
                                variant={window.innerWidth < values.sm ? "h3" : "h2"}
                                textTransform="capitalize"
                                fontWeight="bold"
                            >
                                Estadísticas Generales
                            </SoftTypography>
                        </SoftBox>

                        <Grid container>
                            <Grid item xs={12}>
                                <Globe
                                    display={{ xs: "none", md: "block" }}
                                    position="absolute"
                                    top="10%"
                                    right={0}
                                    mt={{ xs: -12, lg: 1 }}
                                    mr={{ xs: 0, lg: 10 }}
                                    canvasStyle={{ marginTop: "3rem" }}
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={5}>
                                <SoftBox mb={3}>
                                    <MiniStatisticsCard
                                        title={{ text: "Dinero de hoy", fontWeight: "bold" }}
                                        count="$53,000"
                                        percentage={{ color: "success", text: "+55%" }}
                                        icon={{ color: "info", component: "paid" }}
                                    />
                                </SoftBox>
                                <MiniStatisticsCard
                                    title={{ text: "Usuarios de hoy", fontWeight: "bold" }}
                                    count="2,300"
                                    percentage={{ color: "success", text: "+3%" }}
                                    icon={{ color: "info", component: "public" }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <SoftBox mb={3}>
                                    <MiniStatisticsCard
                                        title={{ text: "Nuevos clientes", fontWeight: "bold" }}
                                        count="+3,462"
                                        percentage={{ color: "error", text: "-2%" }}
                                        icon={{ color: "info", component: "person" }}
                                    />
                                </SoftBox>
                                <MiniStatisticsCard
                                    title={{ text: "Ventas", fontWeight: "bold" }}
                                    count="$103,430"
                                    percentage={{ color: "success", text: "+5%" }}
                                    icon={{ color: "info", component: "shopping_cart" }}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={5}>
                        <SoftBox>
                            <ReportsBarChart
                                title="Actividad de ventas"
                                description={
                                    <SoftBox display="flex" alignItems="center">
                                        <SoftBox
                                            fontSize={size.lg}
                                            color="success"
                                            mb={0.3}
                                            mr={0.5}
                                            lineHeight={0}
                                        >
                                            <Icon className="fas fa-arrow-up" />
                                        </SoftBox>
                                        <SoftTypography variant="button" color="text" fontWeight="medium">
                                            4% más{" "}
                                            <SoftTypography variant="button" color="text" fontWeight="regular">
                                                en 2024
                                            </SoftTypography>
                                        </SoftTypography>
                                    </SoftBox>
                                }
                                chart={chart}
                                items={items}
                            />
                        </SoftBox>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                                <SoftBox>
                                    <SoftTypography variant="h6" fontWeight="medium">
                                        Tabla de Ventas
                                    </SoftTypography>
                                    <SoftBox display="flex" alignItems="center" lineHeight={0}>
                                        <Icon
                                            sx={{
                                                fontWeight: "bold",
                                                color: ({ palette: { info } }) => info.main,
                                            }}
                                        >
                                            done
                                        </Icon>
                                        <SoftTypography variant="button" fontWeight="regular" color="text">
                                            &nbsp;<strong>30 done</strong> this month
                                        </SoftTypography>
                                    </SoftBox>
                                </SoftBox>
                            </SoftBox>
                            <SoftBox
                                sx={{
                                    "& .MuiTableRow-root:not(:last-child)": {
                                        "& td": {
                                            borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                                `${borderWidth[1]} solid ${borderColor}`,
                                        },
                                    },
                                }}
                            >
                                <SalesTable />
                            </SoftBox>
                        </Card>
                    </Grid>
                </Grid>
            </SoftBox>
        </AppDashboardLayout>
    );
}

export default AppDefaultDashboard;
