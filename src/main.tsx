import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createHashRouter } from "react-router";
import { RootLayout } from "./RootLayout.tsx";
import { CounterPage } from "./pages/CounterPage.tsx";
import { ExportPage } from "./pages/ExportPage.tsx";
import { SetupPage } from "./pages/SetupPage.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0b57d0" },
    text: { primary: "#111111" },
    background: { default: "#ffffff", paper: "#ffffff" }
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, "Noto Sans TC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none" }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } }
  }
});

const router = createHashRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <CounterPage /> },
      { path: "setup", element: <SetupPage /> },
      { path: "export", element: <ExportPage /> }
    ]
  }
]);

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("找不到 #root，請確認 index.html 未被修改。")
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
