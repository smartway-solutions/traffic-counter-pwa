import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import type { MouseEvent } from "react";
import type { TCountAction, TVehicleType } from "../types.ts";

export interface ICounterCardProps {
  vehicleType: TVehicleType;
  count: number;
  feedback: TCountAction | null;
  onIncrease: () => void;
  onDecrease: () => void;
}

interface ICardPalette {
  background: string;
  accent: string;
}

/** 每個車種一組專屬色：淺色底＋飽和主色（邊框、+1 閃爍） */
const CARD_PALETTES: Record<TVehicleType, ICardPalette> = {
  機車: { background: "#e8f0fe", accent: "#0b57d0" },
  汽車: { background: "#e6f4ea", accent: "#188038" },
  公車: { background: "#fef7e0", accent: "#b06000" },
  大貨車: { background: "#f3e8fd", accent: "#7627bb" },
  聯結車: { background: "#e4f7fb", accent: "#007b83" },
  其他: { background: "#f1f3f4", accent: "#5f6368" }
};

const DECREASE_FLASH = "#d93025";

export function CounterCard(props: ICounterCardProps): React.JSX.Element {
  const palette = CARD_PALETTES[props.vehicleType];
  const flashColor =
    props.feedback === null ? null : props.feedback === "increase" ? palette.accent : DECREASE_FLASH;

  function handleDecrease(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    props.onDecrease();
  }

  return (
    <ButtonBase
      component="div"
      onClick={props.onIncrease}
      aria-label={`${props.vehicleType} 加一，目前 ${props.count}`}
      sx={{
        minHeight: 0,
        minWidth: 0,
        borderRadius: 3,
        border: "3px solid",
        borderColor: palette.accent,
        bgcolor: flashColor ?? palette.background,
        color: flashColor === null ? "#111111" : "#ffffff",
        transition: "background-color 120ms ease, color 120ms ease",
        WebkitTapHighlightColor: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "space-between",
        p: 1.25,
        textAlign: "left"
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minHeight: 0 }}>
        <Typography
          sx={{
            fontSize: "clamp(1.15rem, 3.5dvh, 1.7rem)",
            fontWeight: 900,
            whiteSpace: "nowrap",
            color: flashColor === null ? palette.accent : "#ffffff"
          }}
        >
          {props.vehicleType}
        </Typography>
        <Typography
          component="output"
          aria-label={`${props.vehicleType}目前計數`}
          sx={{
            fontSize: "clamp(2.4rem, 8dvh, 4rem)",
            fontWeight: 900,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            transform: flashColor === null ? "scale(1)" : "scale(1.12)",
            transition: "transform 120ms ease"
          }}
        >
          {props.count}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          aria-label={`${props.vehicleType} 減一`}
          aria-disabled={props.count === 0}
          onClick={handleDecrease}
          size="small"
          sx={{
            border: "2px solid",
            borderColor:
              props.count === 0
                ? "rgba(0,0,0,0.15)"
                : flashColor === null
                  ? palette.accent
                  : "rgba(255,255,255,0.85)",
            color: props.count === 0 ? "rgba(0,0,0,0.25)" : "inherit"
          }}
        >
          <RemoveRoundedIcon />
        </IconButton>
      </Box>
    </ButtonBase>
  );
}
