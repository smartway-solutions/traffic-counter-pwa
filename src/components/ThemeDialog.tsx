import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { THEME_OPTIONS } from "../themes.ts";
import type { TThemeName } from "../types.ts";
import { ThemeOptionCard } from "./ThemeOptionCard.tsx";

export interface IThemeDialogProps {
  open: boolean;
  current: TThemeName;
  onClose: () => void;
  onSelect: (theme: TThemeName) => void;
}

export function ThemeDialog(props: IThemeDialogProps): React.JSX.Element {
  const muiTheme = useTheme();
  const fullScreen = useMediaQuery(muiTheme.breakpoints.down("sm"));

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: fullScreen
          ? { borderRadius: 0 }
          : { borderRadius: "8px", maxHeight: "min(760px, calc(100dvh - 32px))" }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pr: 1,
          pt: fullScreen ? "max(12px, env(safe-area-inset-top))" : 2
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="div" variant="h6" fontWeight={950}>
            選擇計數介面
          </Typography>
          <Typography component="div" variant="caption" color="text.secondary">
            共 {THEME_OPTIONS.length} 款；包含經典與非對稱布局
          </Typography>
        </Box>
        <IconButton aria-label="關閉主題選擇" onClick={props.onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 1, sm: 1.5 },
          pb: fullScreen ? "max(24px, env(safe-area-inset-bottom))" : 2.5
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 1,
            "@media (max-width: 360px)": { gridTemplateColumns: "1fr", gap: 0.75 }
          }}
        >
          {THEME_OPTIONS.map((option) => {
            const selected = option.name === props.current;
            return (
              <ThemeOptionCard
                key={option.name}
                option={option}
                selected={selected}
                onSelect={props.onSelect}
              />
            );
          })}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
