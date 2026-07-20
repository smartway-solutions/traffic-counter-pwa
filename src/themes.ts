import { createTheme, type Theme } from "@mui/material";
import {
  THEME_DEFINITIONS,
  type ICounterCardVisual,
  type IThemeOption,
  type TCounterCardVariant,
  type TCounterLayout
} from "./themeDefinitions.ts";
import type { TThemeName, TVehicleType } from "./types.ts";

export type { ICounterCardVisual, IThemeOption, TCounterCardVariant, TCounterLayout };

export const THEME_OPTIONS: IThemeOption[] = Object.values(THEME_DEFINITIONS).map(
  ({ option }) => option
);

function createMuiTheme(name: TThemeName): Theme {
  const definition = THEME_DEFINITIONS[name];
  return createTheme({
    shape: { borderRadius: 6 },
    palette: {
      mode: definition.mode,
      primary: { main: definition.primary },
      secondary: { main: definition.secondary },
      background: { default: definition.pageBackground, paper: definition.paperBackground },
      text: { primary: definition.textPrimary, secondary: definition.textSecondary },
      divider: definition.divider
    },
    typography: {
      fontFamily:
        'Inter, "Noto Sans TC", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      button: { textTransform: "none", fontWeight: 800 }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "html, body, #root": { height: "100%" },
          body: { margin: 0, overscrollBehavior: "none", WebkitTapHighlightColor: "transparent" },
          "button, input, textarea": { font: "inherit" }
        }
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { minHeight: 44, borderRadius: "6px" } }
      },
      MuiIconButton: {
        styleOverrides: { root: { minWidth: 44, minHeight: 44, borderRadius: "6px" } }
      },
      MuiCard: { styleOverrides: { root: { backgroundImage: "none" } } },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: definition.appBarBackground,
            color: definition.appBarText,
            borderBottom: `1px solid ${definition.divider}`
          }
        }
      },
      MuiDialog: {
        styleOverrides: { paper: { backgroundImage: "none", borderRadius: "8px" } }
      },
      MuiMenu: { styleOverrides: { paper: { borderRadius: "4px" } } },
      MuiMenuItem: { styleOverrides: { root: { borderRadius: 0 } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: "6px" } } }
    }
  });
}

const THEME_CACHE = Object.fromEntries(
  (Object.keys(THEME_DEFINITIONS) as TThemeName[]).map((name) => [name, createMuiTheme(name)])
) as Record<TThemeName, Theme>;

export function isThemeName(value: unknown): value is TThemeName {
  return typeof value === "string" && value in THEME_DEFINITIONS;
}

export function buildMuiTheme(name: TThemeName): Theme {
  return THEME_CACHE[name];
}

export function isDarkTheme(name: TThemeName): boolean {
  return THEME_DEFINITIONS[name].mode === "dark";
}

export function getCounterLayout(name: TThemeName): TCounterLayout {
  return THEME_DEFINITIONS[name].layout;
}

export function getCounterCardVisual(name: TThemeName, vehicleType: TVehicleType): ICounterCardVisual {
  const definition = THEME_DEFINITIONS[name];
  return {
    ...definition.cardPalettes[vehicleType],
    radius: definition.cardRadius,
    shadow: definition.cardShadow
  };
}

export function getAppBarVisual(name: TThemeName): {
  background: string;
  text: string;
  border: string;
} {
  const { appBarBackground, appBarText, divider } = THEME_DEFINITIONS[name];
  return { background: appBarBackground, text: appBarText, border: divider };
}

export function getCounterCardVariant(name: TThemeName, index: number): TCounterCardVariant {
  switch (getCounterLayout(name)) {
    case "list": return "list";
    case "mosaic": return index < 2 ? "mosaicHero" : "mosaicCompact";
    case "keypad": return "key";
    default: return "tile";
  }
}
