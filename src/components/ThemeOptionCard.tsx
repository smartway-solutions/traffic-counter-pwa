import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import type { IThemeOption } from "../themes.ts";
import type { TThemeName } from "../types.ts";

interface IThemeOptionCardProps {
  option: IThemeOption;
  selected: boolean;
  onSelect: (theme: TThemeName) => void;
}

const SPECIAL_LAYOUTS = new Set<TThemeName>(["mosaic", "keypad"]);

function getThemeTag(name: TThemeName): string {
  return SPECIAL_LAYOUTS.has(name) ? "特殊布局" : "經典布局";
}

export function ThemeOptionCard({ option, selected, onSelect }: IThemeOptionCardProps) {
  return (
    <ButtonBase
      onClick={() => onSelect(option.name)}
      aria-pressed={selected}
      sx={{
        position: "relative",
        minHeight: 146,
        alignItems: "stretch",
        justifyContent: "stretch",
        borderRadius: "8px",
        overflow: "hidden",
        border: "2px solid",
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: "background.paper",
        textAlign: "left",
        boxShadow: selected ? "0 0 0 2px rgba(127,127,127,0.14)" : "none",
        transition: "transform 120ms ease, border-color 120ms ease",
        "&:active": { transform: "scale(0.985)" },
        "@media (max-width: 360px)": { minHeight: 118 }
      }}
    >
      <Stack sx={{ width: "100%", p: 1.1 }} spacing={0.75}>
        <Box sx={{ height: 40, display: "grid", gridTemplateColumns: "1.4fr 1fr 0.8fr", borderRadius: "4px", overflow: "hidden", border: "1px solid", borderColor: "divider" }}>
          {option.previewColors.map((color) => <Box key={color} sx={{ bgcolor: color }} />)}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={0.6}>
            <Typography fontWeight={950} fontSize="0.96rem" lineHeight={1.2}>{option.label}</Typography>
            <Typography component="span" sx={{ px: 0.55, py: 0.15, border: "1px solid", borderColor: "divider", borderRadius: "3px", color: "text.secondary", fontSize: "0.62rem", fontWeight: 900, whiteSpace: "nowrap" }}>
              {getThemeTag(option.name)}
            </Typography>
          </Stack>
          <Typography color="text.secondary" fontSize="0.74rem" lineHeight={1.32} sx={{ mt: 0.4, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {option.description}
          </Typography>
        </Box>
      </Stack>
      {selected && (
        <Box sx={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, borderRadius: "50%", bgcolor: "primary.main", color: "primary.contrastText", display: "grid", placeItems: "center", boxShadow: 2 }}>
          <CheckRoundedIcon fontSize="small" />
        </Box>
      )}
    </ButtonBase>
  );
}
