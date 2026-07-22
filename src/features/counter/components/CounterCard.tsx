import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { ButtonBase, IconButton } from "@mui/material";
import { useRef } from "react";
import type { MouseEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  getCounterCardVisual,
  isDarkTheme,
  type TCounterCardVariant
} from "../../../themes.ts";
import type { TCountAction, TThemeName, TVehicleType } from "../../../types.ts";
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

function isPointerInside<T extends HTMLElement>(event: ReactPointerEvent<T>): boolean {
  const bounds = event.currentTarget.getBoundingClientRect();
  return (
    event.clientX >= bounds.left &&
    event.clientX <= bounds.right &&
    event.clientY >= bounds.top &&
    event.clientY <= bounds.bottom
  );
}

export function CounterCard(props: ICounterCardProps): React.JSX.Element {
  const activeIncreasePointers = useRef(new Set<number>());
  const activeDecreasePointers = useRef(new Set<number>());
  const lastTouchActivation = useRef<number | null>(null);
  const visual = getCounterCardVisual(props.themeName, props.vehicleType);
  const dark = isDarkTheme(props.themeName);
  const flashColor =
    props.feedback === null ? null : props.feedback === "increase" ? visual.accent : DECREASE_FLASH;
  const isList = props.variant === "list";

  function isTouchLikePointer(pointerType: string): boolean {
    return pointerType === "touch" || pointerType === "pen";
  }

  function isCompatibilityClick(event: MouseEvent<HTMLElement>): boolean {
    const nativePointerType =
      "pointerType" in event.nativeEvent ? String(event.nativeEvent.pointerType) : "";
    if (event.detail === 0) return false;
    if (nativePointerType !== "") return isTouchLikePointer(nativePointerType);
    return (
      lastTouchActivation.current !== null &&
      event.timeStamp - lastTouchActivation.current >= 0 &&
      event.timeStamp - lastTouchActivation.current < 750
    );
  }

  function handleIncreasePointerDown(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!isTouchLikePointer(event.pointerType)) return;
    activeIncreasePointers.current.add(event.pointerId);
  }

  function handleIncreasePointerUp(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!isTouchLikePointer(event.pointerType)) return;
    const startedHere = activeIncreasePointers.current.delete(event.pointerId);
    if (!startedHere) return;
    lastTouchActivation.current = event.timeStamp;
    if (isPointerInside(event)) props.onIncrease();
  }

  function handleIncreasePointerCancel(event: ReactPointerEvent<HTMLDivElement>): void {
    activeIncreasePointers.current.delete(event.pointerId);
  }

  function handleIncreaseClick(event: MouseEvent<HTMLDivElement>): void {
    if (isCompatibilityClick(event)) return;
    props.onIncrease();
  }

  function handleDecreasePointerDown(event: ReactPointerEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (!isTouchLikePointer(event.pointerType)) return;
    activeDecreasePointers.current.add(event.pointerId);
  }

  function handleDecreasePointerUp(event: ReactPointerEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (!isTouchLikePointer(event.pointerType)) return;
    const startedHere = activeDecreasePointers.current.delete(event.pointerId);
    if (!startedHere) return;
    lastTouchActivation.current = event.timeStamp;
    if (isPointerInside(event)) props.onDecrease();
  }

  function handleDecreasePointerCancel(event: ReactPointerEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    activeDecreasePointers.current.delete(event.pointerId);
  }

  function handleDecreaseClick(event: MouseEvent<HTMLButtonElement>): void {
    event.stopPropagation();
    if (isCompatibilityClick(event)) return;
    props.onDecrease();
  }

  const decreaseButton = (
    <IconButton
      aria-label={`${props.vehicleType} 減一`}
      aria-disabled={props.count === 0}
      onPointerDown={handleDecreasePointerDown}
      onPointerUp={handleDecreasePointerUp}
      onPointerCancel={handleDecreasePointerCancel}
      onClick={handleDecreaseClick}
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
      onPointerDown={handleIncreasePointerDown}
      onPointerUp={handleIncreasePointerUp}
      onPointerCancel={handleIncreasePointerCancel}
      onClick={handleIncreaseClick}
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
