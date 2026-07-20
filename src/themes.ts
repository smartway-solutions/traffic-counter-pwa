import { createTheme, type Theme } from "@mui/material";
import type { TThemeName } from "./types.ts";

export interface IThemeOption {
  name: TThemeName;
  label: string;
  description: string;
}

export const THEME_OPTIONS: IThemeOption[] = [
  { name: "default", label: "預設主題", description: "淺色卡片格狀排列，白天戶外作業" },
  { name: "dark", label: "夜間高對比", description: "深色底減少眩光，夜間或隧道作業" },
  { name: "list", label: "清單大字", description: "單欄清單、數字最大化，單手快速點按" }
];

const shared = {
  shape: { borderRadius: 14 },
  typography: {
    fontFamily:
      'Inter, "Noto Sans TC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    button: { textTransform: "none" as const }
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } }
  }
};

const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: "light",
    primary: { main: "#0b57d0" },
    text: { primary: "#111111" },
    background: { default: "#ffffff", paper: "#ffffff" }
  }
});

const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: "dark",
    primary: { main: "#8ab4f8" },
    background: { default: "#0f1115", paper: "#181b21" }
  }
});

export function buildMuiTheme(name: TThemeName): Theme {
  return name === "dark" ? darkTheme : lightTheme;
}

export function isDarkTheme(name: TThemeName): boolean {
  return name === "dark";
}

/** 清單主題改為單欄列表，其餘維持 2×3／3×2 卡片格 */
export function getCounterLayout(name: TThemeName): "grid" | "list" {
  return name === "list" ? "list" : "grid";
}
