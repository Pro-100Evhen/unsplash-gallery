"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true,
  palette: {
    primary: {
      main: "#111111",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#111111",
      secondary: "#6b6b6b",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.04em",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default theme;
