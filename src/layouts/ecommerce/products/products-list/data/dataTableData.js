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

/* eslint-disable react/prop-types */
// Soft UI Dashboard PRO React components
import SoftBadge from "components/SoftBadge";

// ProductsList page components
import ProductCell from "layouts/ecommerce/products/products-list/components/ProductCell";
import ActionCell from "layouts/ecommerce/products/products-list/components/ActionCell";

// Images
import adidasHoodie from "assets/images/ecommerce/adidas-hoodie.jpeg";
import macBookPro from "assets/images/ecommerce/macbook-pro.jpeg";
import metroChair from "assets/images/ecommerce/metro-chair.jpeg";
import alchimiaChair from "assets/images/ecommerce/alchimia-chair.jpeg";
import fendiCoat from "assets/images/ecommerce/fendi-coat.jpeg";
import offWhiteJacket from "assets/images/ecommerce/off-white-jacket.jpeg";
import yohjiYamamoto from "assets/images/ecommerce/yohji-yamamoto.jpeg";
import mcqueenShirt from "assets/images/ecommerce/mcqueen-shirt.jpeg";
import yellowChair from "assets/images/ecommerce/yellow-chair.jpeg";
import heronTshirt from "assets/images/ecommerce/heron-tshirt.jpeg";
import livingChair from "assets/images/ecommerce/living-chair.jpeg";
import orangeSofa from "assets/images/ecommerce/orange-sofa.jpeg";
import burberry from "assets/images/ecommerce/burberry.jpeg";
import dgSkirt from "assets/images/ecommerce/d&g-skirt.jpeg";
import undercover from "assets/images/ecommerce/undercover.jpeg";
import docs from "assets/images/ecommerce/docs.jpg";

// Badges
const outOfStock = (
  <SoftBadge variant="contained" color="error" size="xs" badgeContent="atrasado" container />
);
const inStock = (
  <SoftBadge variant="contained" color="success" size="xs" badgeContent="Recibido" container />
);

const inTime = (
  <SoftBadge variant="contained" color="primary" size="xs" badgeContent="En Proceso" container />
);

const dataTableData = {
  columns: [
    {
      Header: "Expediente",
      accessor: "product",
      width: "40%",
      Cell: ({ value: [name, data] }) => (
        <ProductCell image={data.image} name={name} checked={data.checked} />
      ),
    },
    { Header: "Unidad", accessor: "category" },
    { Header: "Fecha de Creación", accessor: "price" },
    { Header: "Fecha de llegada", accessor: "sku" },
    {
      Header: "status",
      accessor: "status",
      Cell: ({ value }) => (value === "in stock" ? inStock : outOfStock),
    },
    { Header: "action", accessor: "action" },
  ],

  rows: [
    {
      product: ["Licitación de Equipos Médicos", { image: docs, checked: true }],
      category: "Vigilancia Epidemiológica",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 0,
      status: "out of stock",
      action: <ActionCell rowData={{
        product: ["Licitación de Equipos Médicos", { image: docs, checked: true }],
        category: "Vigilancia Epidemiológica",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "out of stock"
      }} />,
    },
    {
      product: ["Adquisición de Medicamentos", { image: docs, checked: false }],
      category: "Regulación Sanitaria",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 0,
      status: "inTime",
      action: <ActionCell rowData={{
        product: ["Adquisición de Medicamentos", { image: docs, checked: false }],
        category: "Regulación Sanitaria",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "inTime"
      }} />,
    },
    {
      product: ["Compra de Material de Laboratorio", { image: docs, checked: false }],
      category: "Promoción de la Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 978,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Compra de Material de Laboratorio", { image: docs, checked: false }],
        category: "Promoción de la Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Suministros Hospitalarios", { image: docs, checked: false }],
      category: "Planificación y Evaluación en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 0,
      status: "out of stock",
      action: <ActionCell rowData={{
        product: ["Suministros Hospitalarios", { image: docs, checked: false }],
        category: "Planificación y Evaluación en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "out of stock"
      }} />,
    },
    {
      product: ["Contratación de Servicios Médicos Especializados", { image: docs, checked: false }],
      category: "Recursos Humanos en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 725,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Contratación de Servicios Médicos Especializados", { image: docs, checked: false }],
        category: "Recursos Humanos en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Obras y Remodelaciones Hospitalarias", { image: docs, checked: false }],
      category: "Clothing",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 725,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Obras y Remodelaciones Hospitalarias", { image: docs, checked: false }],
        category: "Clothing",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Transporte y Logística de Insumos Médicos", { image: docs, checked: true }],
      category: "Gestión de Medicamentos",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 725,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Transporte y Logística de Insumos Médicos", { image: docs, checked: true }],
        category: "Gestión de Medicamentos",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Alexander McQueen", { image: docs, checked: true }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 51293,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Alexander McQueen", { image: docs, checked: true }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Luin Floor Lamp", { image: docs, checked: true }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 34,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Luin Floor Lamp", { image: docs, checked: true }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Heron Preston T-shirt", { image: docs, checked: false }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 0,
      status: "out of stock",
      action: <ActionCell rowData={{
        product: ["Heron Preston T-shirt", { image: docs, checked: false }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "out of stock"
      }} />,
    },
    {
      product: ["Gray Living Chair", { image: docs, checked: true }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 32,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Gray Living Chair", { image: docs, checked: true }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Derbyshire Orange Sofa", { image: docs, checked: false }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 22,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Derbyshire Orange Sofa", { image: docs, checked: false }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Burberry Low-Tops", { image: docs, checked: true }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 725,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Burberry Low-Tops", { image: docs, checked: true }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
    {
      product: ["Dolce & Gabbana Skirt", { image: docs, checked: false }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 0,
      status: "out of stock",
      action: <ActionCell rowData={{
        product: ["Dolce & Gabbana Skirt", { image: docs, checked: false }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "out of stock"
      }} />,
    },
    {
      product: ["Undercover T-shirt", { image: docs, checked: false }],
      category: "Atención Primaria en Salud",
      price: "12/03/2025",
      sku: "15/03/2025",
      quantity: 725,
      status: "in stock",
      action: <ActionCell rowData={{
        product: ["Undercover T-shirt", { image: docs, checked: false }],
        category: "Atención Primaria en Salud",
        price: "12/03/2025",
        sku: "15/03/2025",
        status: "in stock"
      }} />,
    },
  ],
};

export default dataTableData;
