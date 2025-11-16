/**
=========================================================
* GestiaSoft - App Table Example Usage
=========================================================
* Example of how to use the AppTable component
*/

import React, { useState } from "react";

// @mui material components
import { Card, CardContent, Button, Box } from "@mui/material";

// @mui icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";

// Custom App Components
import { AppTable } from "Views/componentsApp";

function ExampleUsage() {
  const [data, setData] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      email: "juan.perez@sesal.gob.hn",
      rol: "Administrador",
      departamento: "TI",
      estado: "Activo",
      fechaCreacion: "2024-01-15",
      activo: true
    },
    {
      id: 2,
      nombre: "María González",
      email: "maria.gonzalez@sesal.gob.hn",
      rol: "Usuario",
      departamento: "Recursos Humanos",
      estado: "Activo",
      fechaCreacion: "2024-01-20",
      activo: true
    },
    {
      id: 3,
      nombre: "Carlos Rodríguez",
      email: "carlos.rodriguez@sesal.gob.hn",
      rol: "Supervisor",
      departamento: "Finanzas",
      estado: "Inactivo",
      fechaCreacion: "2024-01-10",
      activo: false
    },
    {
      id: 4,
      nombre: "Ana Martínez",
      email: "ana.martinez@sesal.gob.hn",
      rol: "Usuario",
      departamento: "Salud Pública",
      estado: "Activo",
      fechaCreacion: "2024-01-25",
      activo: true
    },
    {
      id: 5,
      nombre: "Luis Hernández",
      email: "luis.hernandez@sesal.gob.hn",
      rol: "Administrador",
      departamento: "Epidemiología",
      estado: "Activo",
      fechaCreacion: "2024-01-18",
      activo: true
    }
  ]);

  // Configuración de columnas
  const columns = [
    {
      field: "id",
      header: "ID",
      type: "text",
      width: "80px",
      align: "center"
    },
    {
      field: "nombre",
      header: "Nombre",
      type: "text",
      width: "200px"
    },
    {
      field: "email",
      header: "Email",
      type: "text",
      width: "250px"
    },
    {
      field: "rol",
      header: "Rol",
      type: "text",
      width: "150px",
      align: "center"
    },
    {
      field: "departamento",
      header: "Departamento",
      type: "text",
      width: "180px"
    },
    {
      field: "estado",
      header: "Estado",
      type: "status",
      width: "120px",
      statusConfig: {
        "Activo": "success",
        "Inactivo": "error",
        "Pendiente": "warning"
      }
    },
    {
      field: "fechaCreacion",
      header: "Fecha de Creación",
      type: "date",
      width: "150px",
      align: "center"
    },
    {
      field: "activo",
      header: "Activo",
      type: "boolean",
      width: "100px",
      align: "center"
    },
    {
      field: "actions",
      header: "Acciones",
      type: "actions",
      width: "150px"
    }
  ];

  // Configuración de acciones
  const actions = [
    {
      label: "Ver",
      icon: <VisibilityIcon />,
      color: "info",
      tooltip: "Ver detalles del usuario",
      onClick: (row) => console.log("Ver usuario:", row)
    },
    {
      label: "Editar",
      icon: <EditIcon />,
      color: "primary",
      tooltip: "Editar usuario",
      onClick: (row) => console.log("Editar usuario:", row)
    },
    {
      label: "Eliminar",
      icon: <DeleteIcon />,
      color: "error",
      tooltip: "Eliminar usuario",
      onClick: (row) => {
        if (window.confirm(`¿Estás seguro de eliminar a ${row.nombre}?`)) {
          setData(data.filter(item => item.id !== row.id));
        }
      }
    }
  ];

  // Manejador de clics en acciones
  const handleActionClick = (action, row) => {
    if (action.onClick) {
      action.onClick(row);
    }
  };

  // Manejador de clic en fila
  const handleRowClick = (row) => {
    console.log("Fila clickeada:", row);
  };

  return (
    <Card>
      <CardContent>
        <SoftBox p={3}>
          {/* Header con botón */}
          <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <SoftTypography variant="h5" color="info" fontWeight="bold">
              Ejemplo de Tabla Reutilizable
            </SoftTypography>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<AddIcon />}
            >
              Nuevo Usuario
            </Button>
          </SoftBox>

          {/* Tabla reutilizable */}
          <AppTable
            columns={columns}
            data={data}
            actions={actions}
            title="Lista de Usuarios"
            subtitle="Ejemplo de implementación de la tabla reutilizable"
            searchable={true}
            pagination={true}
            rowsPerPageOptions={[3, 5, 10]}
            defaultRowsPerPage={5}
            searchPlaceholder="Buscar usuarios..."
            searchFields={["nombre", "email", "rol", "departamento"]}
            onActionClick={handleActionClick}
            onRowClick={handleRowClick}
            hover={true}
            striped={true}
            elevation={1}
            customStyles={{
              container: {
                border: '1px solid #e0e0e0',
                borderRadius: '8px'
              },
              table: {
                '& .MuiTableCell-root': {
                  borderColor: '#f0f0f0'
                }
              }
            }}
          />
        </SoftBox>
      </CardContent>
    </Card>
  );
}

export default ExampleUsage;

















