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

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Soft UI Dashboard PRO React context
import { useSoftUIController, setOpenGestionInfo, setSelectedGestionData } from "context";

function ActionCell({ rowData }) {
  const [controller, dispatch] = useSoftUIController();
  const navigate = useNavigate();

  const handleViewGestion = () => {
    // Pasar los datos de la gestión al contexto
    setSelectedGestionData(dispatch, rowData);
    console.log(rowData);
    // Abrir el panel de información
    setOpenGestionInfo(dispatch, true);
  };

  const handleEditGestion = () => {
    // Navegar a la pantalla de edición
    navigate("/Paginas/Editar-Gestion");
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftTypography
        variant="body1"
        color="secondary"
        sx={{ cursor: "pointer", lineHeight: 0 }}
        onClick={handleViewGestion}
      >
        <Tooltip title="Ver información de la gestión" placement="top">
          <Icon>visibility</Icon>
        </Tooltip>
      </SoftTypography>
      <SoftBox mx={2}>
        <SoftTypography
          variant="body1"
          color="secondary"
          sx={{ cursor: "pointer", lineHeight: 0 }}
          onClick={handleEditGestion}
        >
          <Tooltip title="Editar gestión" placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </SoftTypography>
      </SoftBox>
      <SoftTypography variant="body1" color="secondary" sx={{ cursor: "pointer", lineHeight: 0 }}>
        <Tooltip title="Delete product" placement="left">
          <Icon>delete</Icon>
        </Tooltip>
      </SoftTypography>
    </SoftBox>
  );
}

// Typechecking props for the ActionCell
ActionCell.propTypes = {
  rowData: PropTypes.object,
};

export default ActionCell;
