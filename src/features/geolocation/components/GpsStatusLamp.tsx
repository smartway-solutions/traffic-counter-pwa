import { Box, Typography } from "@mui/material";
import type { TGeolocationStatus } from "../types/gpsTypes.ts";

export interface IGpsStatusLampProps {
  status: TGeolocationStatus;
  message: string;
}

interface ILampStyle {
  background: string;
  text: string;
  dot: string;
}

const LAMP_STYLES: Record<TGeolocationStatus, ILampStyle> = {
  ready: { background: "#e6f4ea", text: "#1e4620", dot: "#188038" },
  requesting: { background: "#fef7e0", text: "#5f4b00", dot: "#f9ab00" },
  denied: { background: "#fce8e6", text: "#8c1d18", dot: "#d93025" },
  error: { background: "#fce8e6", text: "#8c1d18", dot: "#d93025" },
  unsupported: { background: "#fef7e0", text: "#5f4b00", dot: "#f9ab00" }
};

export function GpsStatusLamp(props: IGpsStatusLampProps): React.JSX.Element {
  const style = LAMP_STYLES[props.status];
  return (
    <Box
      role="status"
      aria-label={`GPS 狀態：${props.message}`}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.25,
        borderRadius: 999,
        bgcolor: style.background,
        pointerEvents: "none",
        flexShrink: 0
      }}
    >
      <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: style.dot, flexShrink: 0 }} />
      <Typography variant="caption" fontWeight={700} sx={{ color: style.text, whiteSpace: "nowrap" }}>
        {props.message}
      </Typography>
    </Box>
  );
}
