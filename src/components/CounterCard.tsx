import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { ButtonBase, IconButton } from "@mui/material";
import type { MouseEvent } from "react";
import {
  getCounterCardVisual,
  isDarkTheme,
  type TCounterCardVariant
} from "../themes.ts";
import type { TCountAction, TThemeName, TVehicleType } from "../types.ts";
import { CounterCardLayout } from "./CounterCardLayout.tsx";

export interface ICounterCardProps {
  vehicleType: TVehicleType;
  count: number;
  feedback: TCountAction | null;
  variant: TCounterCardVariant;
  themeName: TThemeName;
  onIncrease: () => void;
  onDecrease: () => void;
}

const DECREASE_FLASH = "#D93025";

export function CounterCard(props: ICounterCardProps): React.JSX.Element {
  const visual = getCounterCardVisual(props.themeName, props.vehicleType);
  const dark = isDarkTheme(props.themeName);
  const flashColor =
    props.feedback === null ? null : props.feedback === "increase" ? visual.accent : DECREASE_FLASH;
  const isList = props.variant === "list";

  function handleDecrease(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    props.onDecrease();
  }

  const decreaseButton = (
    <IconButton
      aria-label={`${props.vehicleType} 減一`}
      aria-disabled={props.count === 0}
      onClick={handleDecrease}
      size="small"
      sx={{
        width: isList ? 48 : 44,
        height: isList ? 48 : 44,
        flexShrink: 0,
        border: "2px solid",
        borderRadius: "6px",
        borderColor:
          props.count === 0
            ? dark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.18)"
            : flashColor === null ? visual.accent : "rgba(255,255,255,0.88)",
        color:
          props.count === 0
            ? dark ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.28)"
            : "inherit",
        bgcolor: flashColor === null ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.12)",
        "&:active": { transform: "scale(0.92)" }
      }}
    >
      <RemoveRoundedIcon fontSize="medium" />
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
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: `${visual.radius}px`,
        border:
          props.themeName === "mono" || props.themeName === "field" || props.variant === "key"
            ? "3px solid"
            : "2px solid",
        borderColor: visual.border,
        background: flashColor ?? visual.background,
        color:
          flashColor === null
            ? visual.text
            : dark && props.feedback === "increase" ? "#071019" : "#FFFFFF",
        boxShadow: visual.shadow,
        transition:
          "background 120ms ease, color 120ms ease, transform 100ms ease, box-shadow 120ms ease",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        textAlign: "left",
        "&:active": { transform: "scale(0.978)", boxShadow: "none" }
      }}
    >
      <CounterCardLayout
        variant={props.variant}
        vehicleType={props.vehicleType}
        count={props.count}
        accentColor={flashColor === null ? visual.accent : "inherit"}
        flashing={flashColor !== null}
        decreaseButton={decreaseButton}
      />
    </ButtonBase>
  );
}
