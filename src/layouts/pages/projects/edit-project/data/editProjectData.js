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

// Datos de ejemplo para el timeline de unidades
export const timelineData = [
    {
        color: "info",
        icon: "notifications",
        title: "Gerencia administrativa",
        time: "Hace 2 días",
        startDate: "2024-01-15",
        endDate: "2024-01-16",
        description: "Gestión ingresada para revisión inicial",
        status: "En revisión"
    },
    {
        color: "warning",
        icon: "schedule",
        title: "Unidad de Ejecución de Gasto",
        time: "Hace 1 día",
        startDate: "2024-01-16",
        endDate: "2024-01-17",
        description: "En proceso de evaluación presupuestaria",
        status: "En proceso"
    },
    {
        color: "success",
        icon: "check_circle",
        title: "Unidad de compra",
        time: "Hace 3 horas",
        startDate: "2024-01-17",
        endDate: "2024-01-18",
        description: "Aprobado para continuar con el proceso",
        status: "Aprobado"
    },
    {
        color: "primary",
        icon: "pending",
        title: "Contraloría General",
        time: "Pendiente",
        startDate: "2024-01-19",
        endDate: null,
        description: "Esperando revisión de control interno",
        status: "Pendiente"
    }
];

// Datos de ejemplo para la tabla de documentos
export const documentsData = [
    {
        id: 1,
        name: "Memorándum de solicitud.pdf",
        unit: "Gerencia administrativa",
        unitIcon: "business",
        date: "2024-01-15",
        type: "PDF",
        typeIcon: "picture_as_pdf",
        size: "2.5 MB",
        comments: [
            {
                id: 1,
                user: "Dr. Carlos Méndez",
                unit: "Gerencia administrativa",
                date: "2024-01-15",
                text: "Solicitud inicial de la gestión con justificación técnica completa"
            },
            {
                id: 2,
                user: "Lic. Ana Rodríguez",
                unit: "Unidad de compra",
                date: "2024-01-16",
                text: "Documento recibido y en revisión. Se requiere validación de especificaciones."
            }
        ]
    },
    {
        id: 2,
        name: "Presupuesto detallado.xlsx",
        unit: "Unidad de Ejecución de Gasto",
        unitIcon: "account_balance",
        date: "2024-01-16",
        type: "Excel",
        typeIcon: "table_chart",
        size: "1.8 MB",
        comments: [
            {
                id: 3,
                user: "C.P. Luis Torres",
                unit: "Unidad de Ejecución de Gasto",
                date: "2024-01-16",
                text: "Análisis presupuestario completo con desglose por partidas y justificación de costos"
            }
        ]
    },
    {
        id: 3,
        name: "Especificaciones técnicas.docx",
        unit: "Gerencia administrativa",
        unitIcon: "business",
        date: "2024-01-18",
        type: "Word",
        typeIcon: "description",
        size: "3.2 MB",
        comments: [
            {
                id: 4,
                user: "Ing. María González",
                unit: "Gerencia administrativa",
                date: "2024-01-18",
                text: "Documento actualizado con las especificaciones técnicas solicitadas por la unidad de compra"
            },
            {
                id: 5,
                user: "Lic. Roberto Silva",
                unit: "Unidad de compra",
                date: "2024-01-19",
                text: "Especificaciones aprobadas. Se procede con el análisis de proveedores."
            }
        ]
    },
    {
        id: 4,
        name: "Análisis de mercado.pdf",
        unit: "Unidad de compra",
        unitIcon: "shopping_cart",
        date: "2024-01-19",
        type: "PDF",
        typeIcon: "picture_as_pdf",
        size: "4.1 MB",
        comments: [
            {
                id: 6,
                user: "Lic. Patricia López",
                unit: "Unidad de compra",
                date: "2024-01-19",
                text: "Estudio de precios y proveedores disponibles en el mercado. Se identificaron 3 opciones viables."
            }
        ]
    }
];

// Datos de la gestión actual para pre-llenar el formulario
export const currentGestionData = {
    name: "Adquisición de Equipos Informáticos para Laboratorio",
    description: "Se requiere la adquisición de equipos informáticos para el laboratorio de análisis clínico, incluyendo computadoras, impresoras y software especializado para el procesamiento de muestras y generación de reportes.",
    units: ["unidad 1"],
    startDate: "2024-01-15",
    budget: "$45,000.00",
    priority: "Alta",
    status: "En proceso"
};
