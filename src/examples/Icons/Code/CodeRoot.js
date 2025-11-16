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

import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export default styled(Box)(({ theme, ownerState }) => {
  const { palette, functions, typography, boxShadows } = theme;
  const { color, size } = ownerState;

  const { white, text, info, secondary } = palette;
  const { pxToRem } = functions;
  const { size: fontSize } = typography;

  // size value
  const sizeValue = {
    small: {
      width: pxToRem(20),
      height: pxToRem(20),
    },
    medium: {
      width: pxToRem(24),
      height: pxToRem(24),
    },
    large: {
      width: pxToRem(32),
      height: pxToRem(32),
    },
  };

  // color value
  const colorValue = {
    white: {
      color: white.main,
    },
    primary: {
      color: info.main,
    },
    secondary: {
      color: secondary.main,
    },
    info: {
      color: info.main,
    },
    success: {
      color: palette.success.main,
    },
    warning: {
      color: palette.warning.main,
    },
    error: {
      color: palette.error.main,
    },
    dark: {
      color: text.primary,
    },
    text: {
      color: text.primary,
    },
  };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    textAlign: "center",
    borderRadius: pxToRem(6),
    width: sizeValue[size].width,
    height: sizeValue[size].height,
    fontSize: size === "small" ? pxToRem(12) : fontSize[size],
    ...colorValue[color],
  };
});














