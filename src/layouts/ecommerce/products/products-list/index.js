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

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftButton from "components/SoftButton";

// Soft UI Dashboard PRO React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Data
import dataTableData from "layouts/ecommerce/products/products-list/data/dataTableData";

// Custom components
import GestionInfoPanel from "layouts/ecommerce/products/products-list/components/GestionInfoPanel";

// Soft UI Dashboard PRO React context
import { useSoftUIController, setOpenGestionInfo } from "context";

function ProductsList() {
  const [controller, dispatch] = useSoftUIController();
  const { openGestionInfo, selectedGestionData } = controller;

  const handleCloseGestionInfo = () => {
    setOpenGestionInfo(dispatch, false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={{ xs: 2, sm: 3 }} mx={{ xs: 1, sm: 2, md: 3 }}>
        <Card>
          <SoftBox
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            p={{ xs: 2, sm: 3 }}
            gap={{ xs: 2, sm: 0 }}
          >
            <SoftBox lineHeight={1} flex={1}>
              <SoftTypography
                variant="h5"
                fontWeight="medium"
                fontSize={{ xs: "1.25rem", sm: "1.5rem", md: "1.75rem" }}
              >
                Gestiones Activas
              </SoftTypography>
              <SoftTypography
                variant="button"
                fontWeight="regular"
                color="text"
                fontSize={{ xs: "0.875rem", sm: "1rem" }}
              >
                A continuaciòn se mostraran las gestiones que estan activas en el sistema y las unidades donde se encuentran.
              </SoftTypography>
            </SoftBox>
            <Stack spacing={1} direction="row">
              <Link to="/Paginas/Gestiones">
                <SoftButton
                  variant="gradient"
                  color="info"
                  size="medium"
                >
                  + Nueva Gestiòn
                </SoftButton>
              </Link>
            </Stack>
          </SoftBox>
          <SoftBox px={{ xs: 1, sm: 2, md: 3 }} pb={{ xs: 2, sm: 3 }}>
            <DataTable
              table={dataTableData}
              entriesPerPage={{
                defaultValue: 7,
                entries: [5, 7, 10, 15, 20, 25],
              }}
              canSearch
            />
          </SoftBox>
        </Card>
      </SoftBox>

      {/* Panel lateral de información de gestión */}
      <GestionInfoPanel
        open={openGestionInfo}
        onClose={handleCloseGestionInfo}
        gestionData={selectedGestionData}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default ProductsList;
