import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { Children, type ReactNode } from "react";
import type { TCounterLayout } from "../themes.ts";

interface ICounterGridProps {
  children: ReactNode;
  layout: TCounterLayout;
}

type StyleObject = Exclude<SxProps<Theme>, readonly unknown[] | ((theme: Theme) => unknown)>;

const TIGHT_SCREEN = "@media (max-width: 370px), (max-height: 680px)";

const ROOT_SX: StyleObject = {
  flex: 1,
  minHeight: 0,
  px: 0.8,
  pt: 0.8,
  pb: "max(8px, env(safe-area-inset-bottom))",
  [TIGHT_SCREEN]: {
    px: 0.45,
    pt: 0.45,
    pb: "max(5px, env(safe-area-inset-bottom))"
  }
};

const LAYOUT_SX: Record<TCounterLayout, StyleObject> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridTemplateRows: "repeat(4, minmax(0, 1fr))",
    gap: { xs: 0.8, sm: 1.1 },
    px: { xs: 0.8, sm: 1.1 },
    pt: { xs: 0.8, sm: 1.1 },
    [TIGHT_SCREEN]: { gap: 0.4, px: 0.45, pt: 0.45 },
    "@media (min-width: 680px) and (orientation: landscape)": {
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gridTemplateRows: "repeat(3, minmax(0, 1fr))"
    }
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 0.65,
    [TIGHT_SCREEN]: { gap: 0.4, px: 0.45, pt: 0.45 }
  },
  mosaic: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gridTemplateRows: "repeat(5, minmax(0, 1fr))",
    gap: 0.7,
    [TIGHT_SCREEN]: { gap: 0.4, px: 0.45, pt: 0.45 }
  },
  keypad: {
    display: "grid",
    gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
    gridTemplateRows: "repeat(3, minmax(0, 1fr))",
    gap: 0.7,
    [TIGHT_SCREEN]: { gap: 0.38, px: 0.4, pt: 0.4 }
  }
};

const KEYPAD_COLUMNS = [
  "1 / span 3",
  "4 / span 3",
  "1 / span 2",
  "3 / span 2",
  "5 / span 2",
  "1 / span 3",
  "4 / span 3"
];

function getItemSx(layout: TCounterLayout, index: number): StyleObject {
  const common = { minWidth: 0, minHeight: 0 };
  switch (layout) {
    case "list":
      return { ...common, flex: 1 };
    case "mosaic":
      return { ...common, gridColumn: index < 2 ? "1 / -1" : "auto" };
    case "keypad":
      return { ...common, gridColumn: KEYPAD_COLUMNS[index] };
    default:
      return common;
  }
}

export function CounterGrid({ children, layout }: ICounterGridProps): React.JSX.Element {
  return (
    <Box sx={[ROOT_SX, LAYOUT_SX[layout]]}>
      {Children.map(children, (child, index) => (
        <Box sx={getItemSx(layout, index)}>{child}</Box>
      ))}
    </Box>
  );
}
