/**
=========================================================
* GestiaSoft - App Layout
=========================================================
* Global layout wrapper that uses AppPageLayout for all pages
*/

import React from "react";
import PropTypes from "prop-types";
import { AppPageLayout } from "Views/componentsApp";

const AppLayout = ({ children }) => {
    return (
        <AppPageLayout>
            {children}
        </AppPageLayout>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppLayout;

