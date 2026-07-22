import type { TThemeName, TVehicleType } from "./types.ts";

export type TCounterLayout =
  | "grid"
  | "list"
  | "mosaic"
  | "keypad";

export type TCounterCardVariant =
  | "tile"
  | "list"
  | "mosaicHero"
  | "mosaicCompact"
  | "key";

export interface IThemeOption {
  name: TThemeName;
  label: string;
  description: string;
  previewColors: readonly [string, string, string];
}

export interface ICounterCardVisual {
  background: string;
  accent: string;
  text: string;
  border: string;
  shadow: string;
  radius: number;
}

export interface IThemeDefinition {
  option: IThemeOption;
  mode: "light" | "dark";
  layout: TCounterLayout;
  primary: string;
  secondary: string;
  pageBackground: string;
  paperBackground: string;
  textPrimary: string;
  textSecondary: string;
  divider: string;
  appBarBackground: string;
  appBarText: string;
  cardRadius: number;
  cardShadow: string;
  cardPalettes: Record<TVehicleType, Omit<ICounterCardVisual, "radius" | "shadow">>;
}

export const THEME_DEFINITIONS: Record<TThemeName, IThemeDefinition> = {
  default: {
    option: {
      name: "default",
      label: "標準藍白",
      description: "乾淨、熟悉、適合一般室內外作業",
      previewColors: ["#0B57D0", "#E8F0FE", "#FFFFFF"]
    },
    mode: "light",
    layout: "grid",
    primary: "#0B57D0",
    secondary: "#5F6368",
    pageBackground: "#F5F7FB",
    paperBackground: "#FFFFFF",
    textPrimary: "#111827",
    textSecondary: "#5F6368",
    divider: "#D8DEE8",
    appBarBackground: "#FFFFFF",
    appBarText: "#111827",
    cardRadius: 12,
    cardShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
    cardPalettes: {
      機車: { background: "#E8F0FE", accent: "#0B57D0", text: "#111827", border: "#0B57D0" },
      汽車: { background: "#E6F4EA", accent: "#188038", text: "#111827", border: "#188038" },
      公車: { background: "#FEF7E0", accent: "#B06000", text: "#111827", border: "#B06000" },
      大貨車: { background: "#F3E8FD", accent: "#7627BB", text: "#111827", border: "#7627BB" },
      聯結車: { background: "#E4F7FB", accent: "#007B83", text: "#111827", border: "#007B83" },
      自行車: { background: "#FCE8E6", accent: "#D93025", text: "#111827", border: "#D93025" },
      其他: { background: "#F1F3F4", accent: "#5F6368", text: "#111827", border: "#5F6368" }
    }
  },
  dark: {
    option: {
      name: "dark",
      label: "夜間高對比",
      description: "深灰低眩光，數字與操作區仍保持清楚",
      previewColors: ["#8AB4F8", "#181B21", "#0F1115"]
    },
    mode: "dark",
    layout: "grid",
    primary: "#8AB4F8",
    secondary: "#BDC1C6",
    pageBackground: "#0F1115",
    paperBackground: "#181B21",
    textPrimary: "#F1F3F4",
    textSecondary: "#BDC1C6",
    divider: "#343840",
    appBarBackground: "#181B21",
    appBarText: "#F1F3F4",
    cardRadius: 10,
    cardShadow: "0 8px 22px rgba(0, 0, 0, 0.34)",
    cardPalettes: {
      機車: { background: "#14213A", accent: "#8AB4F8", text: "#F1F3F4", border: "#8AB4F8" },
      汽車: { background: "#122A1A", accent: "#6DD58C", text: "#F1F3F4", border: "#6DD58C" },
      公車: { background: "#2E2410", accent: "#FDD663", text: "#F1F3F4", border: "#FDD663" },
      大貨車: { background: "#241333", accent: "#D0A3F5", text: "#F1F3F4", border: "#D0A3F5" },
      聯結車: { background: "#0E2A2D", accent: "#78D9E2", text: "#F1F3F4", border: "#78D9E2" },
      自行車: { background: "#311A1A", accent: "#F28B82", text: "#F1F3F4", border: "#F28B82" },
      其他: { background: "#22252A", accent: "#BDC1C6", text: "#F1F3F4", border: "#BDC1C6" }
    }
  },
  list: {
    option: {
      name: "list",
      label: "清單大字",
      description: "單欄排列，單手操作與超大數字優先",
      previewColors: ["#17324D", "#DCE8F1", "#F7FAFC"]
    },
    mode: "light",
    layout: "list",
    primary: "#17324D",
    secondary: "#527089",
    pageBackground: "#EDF3F7",
    paperBackground: "#FFFFFF",
    textPrimary: "#102A43",
    textSecondary: "#527089",
    divider: "#C8D7E3",
    appBarBackground: "#17324D",
    appBarText: "#FFFFFF",
    cardRadius: 8,
    cardShadow: "0 4px 12px rgba(23, 50, 77, 0.10)",
    cardPalettes: {
      機車: { background: "#F7FAFC", accent: "#0B5CAD", text: "#102A43", border: "#0B5CAD" },
      汽車: { background: "#F7FAFC", accent: "#207A4D", text: "#102A43", border: "#207A4D" },
      公車: { background: "#F7FAFC", accent: "#A65E00", text: "#102A43", border: "#A65E00" },
      大貨車: { background: "#F7FAFC", accent: "#7250A3", text: "#102A43", border: "#7250A3" },
      聯結車: { background: "#F7FAFC", accent: "#0A7783", text: "#102A43", border: "#0A7783" },
      自行車: { background: "#F7FAFC", accent: "#C2410C", text: "#102A43", border: "#C2410C" },
      其他: { background: "#F7FAFC", accent: "#52606D", text: "#102A43", border: "#52606D" }
    }
  },
  field: {
    option: {
      name: "field",
      label: "戶外螢光",
      description: "高亮黃底、黑框與強烈色塊，陽光下快速辨識",
      previewColors: ["#111827", "#FDE047", "#FFF7CC"]
    },
    mode: "light",
    layout: "grid",
    primary: "#111827",
    secondary: "#7C2D12",
    pageBackground: "#FFF7CC",
    paperBackground: "#FFFBEB",
    textPrimary: "#111827",
    textSecondary: "#4B5563",
    divider: "#111827",
    appBarBackground: "#FDE047",
    appBarText: "#111827",
    cardRadius: 4,
    cardShadow: "4px 4px 0 #111827",
    cardPalettes: {
      機車: { background: "#FEF08A", accent: "#1D4ED8", text: "#111827", border: "#111827" },
      汽車: { background: "#BBF7D0", accent: "#166534", text: "#111827", border: "#111827" },
      公車: { background: "#FED7AA", accent: "#9A3412", text: "#111827", border: "#111827" },
      大貨車: { background: "#E9D5FF", accent: "#6B21A8", text: "#111827", border: "#111827" },
      聯結車: { background: "#A5F3FC", accent: "#155E75", text: "#111827", border: "#111827" },
      自行車: { background: "#FECACA", accent: "#991B1B", text: "#111827", border: "#111827" },
      其他: { background: "#E5E7EB", accent: "#374151", text: "#111827", border: "#111827" }
    }
  },
  ocean: {
    option: {
      name: "ocean",
      label: "海洋藍綠",
      description: "低飽和藍綠與柔和陰影，長時間觀看較舒適",
      previewColors: ["#006D77", "#83C5BE", "#EDF6F5"]
    },
    mode: "light",
    layout: "grid",
    primary: "#006D77",
    secondary: "#0F766E",
    pageBackground: "#EAF4F4",
    paperBackground: "#F8FCFC",
    textPrimary: "#153A3E",
    textSecondary: "#4E6D70",
    divider: "#B8D8D5",
    appBarBackground: "#EDF6F5",
    appBarText: "#153A3E",
    cardRadius: 12,
    cardShadow: "0 10px 26px rgba(0, 109, 119, 0.12)",
    cardPalettes: {
      機車: { background: "#D9F0F0", accent: "#006D77", text: "#153A3E", border: "#3D9CA4" },
      汽車: { background: "#DFF3EA", accent: "#2A7F62", text: "#153A3E", border: "#65A98F" },
      公車: { background: "#FFF1D6", accent: "#A66A00", text: "#153A3E", border: "#D9A84E" },
      大貨車: { background: "#EEE7F7", accent: "#72568A", text: "#153A3E", border: "#A88BBC" },
      聯結車: { background: "#DCEAF7", accent: "#31688E", text: "#153A3E", border: "#6E9EBC" },
      自行車: { background: "#FCE7F3", accent: "#9D174D", text: "#153A3E", border: "#C77AA2" },
      其他: { background: "#E7EEEE", accent: "#587274", text: "#153A3E", border: "#91A6A7" }
    }
  },
  sunset: {
    option: {
      name: "sunset",
      label: "暖陽珊瑚",
      description: "米白、橘紅與暖棕，視覺更活潑但仍清晰",
      previewColors: ["#B42318", "#FFB4A2", "#FFF1E6"]
    },
    mode: "light",
    layout: "grid",
    primary: "#B42318",
    secondary: "#9A3412",
    pageBackground: "#FFF1E6",
    paperBackground: "#FFF9F5",
    textPrimary: "#3B1D17",
    textSecondary: "#76554E",
    divider: "#E8C4B8",
    appBarBackground: "#FFF9F5",
    appBarText: "#3B1D17",
    cardRadius: 10,
    cardShadow: "0 10px 24px rgba(180, 35, 24, 0.11)",
    cardPalettes: {
      機車: { background: "#FFE5D9", accent: "#B42318", text: "#3B1D17", border: "#E76F51" },
      汽車: { background: "#E8F3E2", accent: "#4D7C0F", text: "#3B1D17", border: "#84A95C" },
      公車: { background: "#FFE8B6", accent: "#A15C00", text: "#3B1D17", border: "#D9982F" },
      大貨車: { background: "#F2DFEA", accent: "#8A3A63", text: "#3B1D17", border: "#B66C91" },
      聯結車: { background: "#DDEEEF", accent: "#23656A", text: "#3B1D17", border: "#5A9296" },
      自行車: { background: "#E8E4F4", accent: "#6D4C91", text: "#3B1D17", border: "#9278B0" },
      其他: { background: "#ECE4DF", accent: "#6B544A", text: "#3B1D17", border: "#9C8277" }
    }
  },
  mono: {
    option: {
      name: "mono",
      label: "黑白工程",
      description: "黑白高反差、硬邊框、近似工程儀表與紙本表格",
      previewColors: ["#111111", "#D9D9D9", "#FFFFFF"]
    },
    mode: "light",
    layout: "grid",
    primary: "#111111",
    secondary: "#444444",
    pageBackground: "#EDEDED",
    paperBackground: "#FFFFFF",
    textPrimary: "#111111",
    textSecondary: "#555555",
    divider: "#111111",
    appBarBackground: "#111111",
    appBarText: "#FFFFFF",
    cardRadius: 0,
    cardShadow: "3px 3px 0 #111111",
    cardPalettes: {
      機車: { background: "#FFFFFF", accent: "#111111", text: "#111111", border: "#111111" },
      汽車: { background: "#F3F3F3", accent: "#222222", text: "#111111", border: "#111111" },
      公車: { background: "#E7E7E7", accent: "#333333", text: "#111111", border: "#111111" },
      大貨車: { background: "#DADADA", accent: "#444444", text: "#111111", border: "#111111" },
      聯結車: { background: "#CDCDCD", accent: "#555555", text: "#111111", border: "#111111" },
      自行車: { background: "#C6C6C6", accent: "#666666", text: "#111111", border: "#111111" },
      其他: { background: "#BFBFBF", accent: "#111111", text: "#111111", border: "#111111" }
    }
  },
  neon: {
    option: {
      name: "neon",
      label: "霓虹控制台",
      description: "深藍黑底搭配青色與洋紅，夜間辨識更鮮明",
      previewColors: ["#22D3EE", "#D946EF", "#0B1020"]
    },
    mode: "dark",
    layout: "grid",
    primary: "#22D3EE",
    secondary: "#D946EF",
    pageBackground: "#070B16",
    paperBackground: "#0B1020",
    textPrimary: "#F5F3FF",
    textSecondary: "#A5B4FC",
    divider: "#263151",
    appBarBackground: "#0B1020",
    appBarText: "#F5F3FF",
    cardRadius: 8,
    cardShadow: "0 0 20px rgba(34, 211, 238, 0.14)",
    cardPalettes: {
      機車: { background: "#101934", accent: "#22D3EE", text: "#F5F3FF", border: "#22D3EE" },
      汽車: { background: "#10251E", accent: "#34D399", text: "#F5F3FF", border: "#34D399" },
      公車: { background: "#2A2110", accent: "#FBBF24", text: "#F5F3FF", border: "#FBBF24" },
      大貨車: { background: "#281332", accent: "#D946EF", text: "#F5F3FF", border: "#D946EF" },
      聯結車: { background: "#101D35", accent: "#60A5FA", text: "#F5F3FF", border: "#60A5FA" },
      自行車: { background: "#32152A", accent: "#F472B6", text: "#F5F3FF", border: "#F472B6" },
      其他: { background: "#202336", accent: "#C4B5FD", text: "#F5F3FF", border: "#C4B5FD" }
    }
  },
  mosaic: {
    option: {
      name: "mosaic",
      label: "非對稱資訊牆",
      description: "前兩種車輛使用全寬大卡，其餘五種採緊湊雙欄",
      previewColors: ["#172554", "#BFDBFE", "#F8FAFC"]
    },
    mode: "light",
    layout: "mosaic",
    primary: "#1D4ED8",
    secondary: "#475569",
    pageBackground: "#EAF0FA",
    paperBackground: "#F8FAFC",
    textPrimary: "#0F172A",
    textSecondary: "#475569",
    divider: "#94A3B8",
    appBarBackground: "#172554",
    appBarText: "#FFFFFF",
    cardRadius: 6,
    cardShadow: "0 4px 0 rgba(23, 37, 84, 0.18)",
    cardPalettes: {
      機車: { background: "#DBEAFE", accent: "#1D4ED8", text: "#0F172A", border: "#1D4ED8" },
      汽車: { background: "#DCFCE7", accent: "#15803D", text: "#0F172A", border: "#15803D" },
      公車: { background: "#FEF3C7", accent: "#A16207", text: "#0F172A", border: "#A16207" },
      大貨車: { background: "#F3E8FF", accent: "#7E22CE", text: "#0F172A", border: "#7E22CE" },
      聯結車: { background: "#CFFAFE", accent: "#0E7490", text: "#0F172A", border: "#0E7490" },
      自行車: { background: "#FCE7F3", accent: "#BE185D", text: "#0F172A", border: "#BE185D" },
      其他: { background: "#E2E8F0", accent: "#475569", text: "#0F172A", border: "#475569" }
    }
  },
  keypad: {
    option: {
      name: "keypad",
      label: "錯位鍵盤",
      description: "2－3－2 錯位排列，像大型硬體按鍵，不使用規則網格",
      previewColors: ["#5B21B6", "#DDD6FE", "#F5F3FF"]
    },
    mode: "light",
    layout: "keypad",
    primary: "#5B21B6",
    secondary: "#334155",
    pageBackground: "#F3F0FF",
    paperBackground: "#FFFFFF",
    textPrimary: "#1E1B4B",
    textSecondary: "#5B5675",
    divider: "#8B5CF6",
    appBarBackground: "#FFFFFF",
    appBarText: "#1E1B4B",
    cardRadius: 2,
    cardShadow: "0 4px 0 rgba(76, 29, 149, 0.28)",
    cardPalettes: {
      機車: { background: "#EDE9FE", accent: "#5B21B6", text: "#1E1B4B", border: "#5B21B6" },
      汽車: { background: "#DCFCE7", accent: "#166534", text: "#1E1B4B", border: "#166534" },
      公車: { background: "#FEF3C7", accent: "#92400E", text: "#1E1B4B", border: "#92400E" },
      大貨車: { background: "#FCE7F3", accent: "#9D174D", text: "#1E1B4B", border: "#9D174D" },
      聯結車: { background: "#CFFAFE", accent: "#155E75", text: "#1E1B4B", border: "#155E75" },
      自行車: { background: "#FFEDD5", accent: "#C2410C", text: "#1E1B4B", border: "#C2410C" },
      其他: { background: "#E2E8F0", accent: "#334155", text: "#1E1B4B", border: "#334155" }
    }
  },
};
