import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, ButtonBase, IconButton, Typography } from "@mui/material";
import type { MouseEvent } from "react";
import type { TCountAction, TVehicleType } from "../types.ts";

export interface ICounterCardProps {
  vehicleType: TVehicleType;
  count: number;
  feedback: TCountAction | null;
  variant: "grid" | "list";
  dark: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}

interface ICardPalette {
  background: string;
  accent: string;
}

/** 每個車種一組專屬色：淺色底＋飽和主色（邊框、+1 閃爍） */
const LIGHT_PALETTES: Record<TVehicleType, ICardPalette> = {
  機車: { background: "#e8f0fe", accent: "#0b57d0" },
  汽車: { background: "#e6f4ea", accent: "#188038" },
  公車: { background: "#fef7e0", accent: "#b06000" },
  大貨車: { background: "#f3e8fd", accent: "#7627bb" },
  聯結車: { background: "#e4f7fb", accent: "#007b83" },
  其他: { background: "#f1f3f4", accent: "#5f6368" }
};

/** 夜間主題：深色微染底＋提亮的主色，維持車種辨識與夜間低眩光 */
const DARK_PALETTES: Record<TVehicleType, ICardPalette> = {
  機車: { background: "#14213a", accent: "#8ab4f8" },
  汽車: { background: "#122a1a", accent: "#6dd58c" },
  公車: { background: "#2e2410", accent: "#fdd663" },
  大貨車: { background: "#241333", accent: "#d0a3f5" },
  聯結車: { background: "#0e2a2d", accent: "#78d9e2" },
  其他: { background: "#22252a", accent: "#bdc1c6" }
};

const DECREASE_FLASH = "#d93025";

export function CounterCard(props: ICounterCardProps): React.JSX.Element {
  const palette = (props.dark ? DARK_PALETTES : LIGHT_PALETTES)[props.vehicleType];
  const textColor = props.dark ? "#f1f3f4" : "#111111";
  const flashColor =
    props.feedback === null ? null : props.feedback === "increase" ? palette.accent : DECREASE_FLASH;
  // 夜間主題閃爍用亮色主色，文字改深色才看得清
  const flashText = props.dark && props.feedback === "increase" ? "#0f1115" : "#ffffff";
  const isList = props.variant === "list";

  function handleDecrease(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    props.onDecrease();
  }

  const minusButton = (
    <IconButton
      aria-label={`${props.vehicleType} 減一`}
      aria-disabled={props.count === 0}
      onClick={handleDecrease}
      size="small"
      sx={{
        border: "2px solid",
        borderColor:
          props.count === 0
            ? props.dark
              ? "rgba(255,255,255,0.18)"
              : "rgba(0,0,0,0.15)"
            : flashColor === null
              ? palette.accent
              : "rgba(255,255,255,0.85)",
        color:
          props.count === 0
            ? props.dark
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.25)"
            : "inherit"
      }}
    >
      <RemoveRoundedIcon />
    </IconButton>
  );

  return (
    <ButtonBase
      component="div"
      onClick={props.onIncrease}
      aria-label={`${props.vehicleType} 加一，目前 ${props.count}`}
      sx={{
        minHeight: 0,
        minWidth: 0,
        borderRadius: isList ? 2.5 : 3,
        border: "3px solid",
        borderColor: palette.accent,
        bgcolor: flashColor ?? palette.background,
        color: flashColor === null ? textColor : flashText,
        transition: "background-color 120ms ease, color 120ms ease",
        WebkitTapHighlightColor: "transparent",
        display: "flex",
        flexDirection: isList ? "row" : "column",
        alignItems: isList ? "center" : "stretch",
        justifyContent: "space-between",
        gap: isList ? 1.5 : 0,
        p: isList ? 1 : 1.25,
        px: isList ? 1.5 : 1.25,
        textAlign: "left",
        flex: isList ? 1 : undefined
      }}
    >
      {isList ? (
        <>
          <Typography
            sx={{
              fontSize: "clamp(1.3rem, 4.2dvh, 2rem)",
              fontWeight: 900,
              whiteSpace: "nowrap",
              color: flashColor === null ? palette.accent : "inherit"
            }}
          >
            {props.vehicleType}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {minusButton}
            <Typography
              component="output"
              aria-label={`${props.vehicleType}目前計數`}
              sx={{
                fontSize: "clamp(2.6rem, 10dvh, 4.6rem)",
                fontWeight: 900,
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
                minWidth: "2ch",
                textAlign: "right",
                transform: flashColor === null ? "scale(1)" : "scale(1.12)",
                transition: "transform 120ms ease"
              }}
            >
              {props.count}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Box
            sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, minHeight: 0 }}
          >
            <Typography
              sx={{
                fontSize: "clamp(1.15rem, 3.5dvh, 1.7rem)",
                fontWeight: 900,
                whiteSpace: "nowrap",
                color: flashColor === null ? palette.accent : "inherit"
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>{minusButton}</Box>
        </>
      )}
    </ButtonBase>
  );
}
