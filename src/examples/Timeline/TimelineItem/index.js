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

// @mui material components
import Icon from "@mui/material/Icon";

// Soft UI Dashboard PRO React components
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftBadge from "components/SoftBadge";
import SoftButton from "components/SoftButton";

// Timeline context
import { useTimeline } from "examples/Timeline/context";

// Custom styles for the TimelineItem
import { timelineItem, timelineItemIcon } from "examples/Timeline/TimelineItem/styles";

function TimelineItem({
  color = "info",
  icon,
  title,
  dateTime,
  description = "",
  badges = [],
  lastItem = false,
  handleOpenDocuments = false,
}) {
  const isDark = useTimeline();

  const renderBadges =
    badges.length > 0
      ? badges.map((badge, key) => {
        const badgeKey = `badge-${key}`;

        return (
          <SoftBox key={badgeKey} mr={key === badges.length - 1 ? 0 : 0.5}>
            <SoftBadge color={color} size="xs" badgeContent={badge} container />
          </SoftBox>
        );
      })
      : null;

  return (
    <SoftBox position="relative" sx={(theme) => timelineItem(theme, { lastItem })}>
      <SoftBox
        bgColor={isDark ? "dark" : "white"}
        width="1.625rem"
        height="1.625rem"
        borderRadius="50%"
        position="absolute"
        top="3.25%"
        left="2px"
        zIndex={2}
      >
        <Icon sx={(theme) => timelineItemIcon(theme, { color })}>{icon}</Icon>
      </SoftBox>
      <SoftBox ml={5.75} pt={description ? 0.7 : 0.5} lineHeight={0} maxWidth="30rem">
        <SoftTypography variant="button" fontWeight="medium" color={isDark ? "white" : "dark"}>
          {title}
        </SoftTypography>
        <SoftBox mt={0.5}>
          <SoftTypography
            variant="caption"
            fontWeight="medium"
            color={isDark ? "secondary" : "text"}
          >
            {dateTime}
          </SoftTypography>
        </SoftBox>
        <SoftBox mt={2} mb={1.5}>
          {description ? (
            <SoftTypography
              variant="body2"
              color="text"
              fontSize={{ xs: "0.75rem", sm: "0.875rem", md: "1rem" }}
              sx={{
                wordWrap: "break-word",
                overflowWrap: "break-word",
                whiteSpace: "normal",
                lineHeight: 1.5,
                maxWidth: "100%"
              }}
            >
              {description}
            </SoftTypography>
          ) : null}
        </SoftBox>

        {/* Botón Ver documentos */}
        {handleOpenDocuments && (
          <SoftBox mt={2} mb={2} textAlign="left">
            <SoftButton
              color="info"
              variant="outlined"
              size="small"
              onClick={handleOpenDocuments}
              startIcon={<Icon>description</Icon>}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                borderRadius: "8px",
                textTransform: "none",
                fontWeight: "500",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                "&:hover": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                  transform: "translateY(-1px)"
                },
                transition: "all 0.2s ease-in-out"
              }}
            >
              Ver documentos
            </SoftButton>
          </SoftBox>
        )}

        {badges.length > 0 ? (
          <SoftBox display="flex" pb={lastItem ? 1 : 2}>
            {renderBadges}
          </SoftBox>
        ) : null}
      </SoftBox>
    </SoftBox>
  );
}

// Typechecking props for the TimelineItem
TimelineItem.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
    "light",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  dateTime: PropTypes.string.isRequired,
  description: PropTypes.string,
  badges: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  lastItem: PropTypes.bool,
  handleOpenDocuments: PropTypes.func,
};

export default TimelineItem;
