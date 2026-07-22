import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import type { TCounterCardVariant } from "../../../themes.ts";
import type { TVehicleType } from "../../../types.ts";

interface ICounterCardLayoutProps {
  variant: TCounterCardVariant;
  vehicleType: TVehicleType;
  count: number;
  accentColor: string;
  flashing: boolean;
  decreaseButton: ReactNode;
}

function Count({
  value,
  vehicleType,
  fontSize,
  flashing
}: {
  value: number;
  vehicleType: TVehicleType;
  fontSize: string;
  flashing: boolean;
}) {
  return (
    <Typography
      component="output"
      aria-label={`${vehicleType}目前計數`}
      sx={{
        fontSize,
        fontWeight: 950,
        lineHeight: 0.9,
        fontVariantNumeric: "tabular-nums",
        minWidth: "2ch",
        textAlign: "center",
        letterSpacing: "-0.05em",
        transform: flashing ? "scale(1.1)" : "scale(1)",
        transition: "transform 120ms ease"
      }}
    >
      {value}
    </Typography>
  );
}

function Label({ children, color, fontSize }: { children: ReactNode; color: string; fontSize: string }) {
  return (
    <Typography sx={{ fontSize, fontWeight: 950, whiteSpace: "nowrap", color, lineHeight: 1.1 }}>
      {children}
    </Typography>
  );
}

export function CounterCardLayout(props: ICounterCardLayoutProps): React.JSX.Element {
  const count = (fontSize: string) => (
    <Count
      value={props.count}
      vehicleType={props.vehicleType}
      fontSize={fontSize}
      flashing={props.flashing}
    />
  );

  switch (props.variant) {
    case "list":
      return (
        <Box sx={{ width: 1, height: 1, display: "grid", gridTemplateColumns: "minmax(6.5rem, 1fr) auto minmax(2.5ch, auto)", alignItems: "center", gap: 1.1, px: 1.4, py: 0.75 }}>
          <Label color={props.accentColor} fontSize="clamp(1.15rem, 4.2dvh, 1.8rem)">{props.vehicleType}</Label>
          {props.decreaseButton}
          {count("clamp(2.5rem, 9dvh, 4.5rem)")}
        </Box>
      );
    case "mosaicHero":
      return (
        <Box sx={{ width: 1, height: 1, display: "grid", gridTemplateColumns: "minmax(7rem, 1fr) auto auto", alignItems: "center", gap: 1.25, px: 1.5, py: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Label color={props.accentColor} fontSize="clamp(1.2rem, 4dvh, 1.8rem)">{props.vehicleType}</Label>
            <Typography sx={{ mt: 0.5, fontSize: "0.72rem", fontWeight: 800, opacity: 0.72 }}>點擊整張卡片 ＋1</Typography>
          </Box>
          {count("clamp(3rem, 10dvh, 5rem)")}
          {props.decreaseButton}
        </Box>
      );
    case "mosaicCompact":
      return (
        <Box sx={{ width: 1, height: 1, display: "grid", gridTemplateRows: "auto 1fr auto", p: 1 }}>
          <Label color={props.accentColor} fontSize="clamp(0.95rem, 3dvh, 1.3rem)">{props.vehicleType}</Label>
          <Box sx={{ display: "grid", placeItems: "center" }}>{count("clamp(2.6rem, 8.5dvh, 4.2rem)")}</Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>{props.decreaseButton}</Box>
        </Box>
      );
    case "key":
      return (
        <Box sx={{ width: 1, height: 1, display: "grid", placeItems: "center", alignContent: "center", gap: 0.35, px: 0.6, py: 0.8 }}>
          <Label color={props.accentColor} fontSize="clamp(0.9rem, 2.8dvh, 1.2rem)">{props.vehicleType}</Label>
          {count("clamp(2.6rem, 8dvh, 4.2rem)")}
          <Box sx={{ position: "absolute", right: 6, bottom: 6 }}>{props.decreaseButton}</Box>
        </Box>
      );
    default:
      return (
        <Box sx={{ width: 1, height: 1, display: "grid", gridTemplateRows: "1fr auto", gap: 0.5, p: 1.1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 0.75, minHeight: 0 }}>
            <Label color={props.accentColor} fontSize="clamp(1.02rem, 3.3dvh, 1.55rem)">{props.vehicleType}</Label>
            {count("clamp(2.35rem, 8.2dvh, 4.1rem)")}
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>{props.decreaseButton}</Box>
        </Box>
      );
  }
}
