import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import {
  Dialog,
  DialogTitle,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { THEME_OPTIONS } from "../themes.ts";
import type { TThemeName } from "../types.ts";

export interface IThemeDialogProps {
  open: boolean;
  current: TThemeName;
  onClose: () => void;
  onSelect: (theme: TThemeName) => void;
}

export function ThemeDialog(props: IThemeDialogProps): React.JSX.Element {
  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="xs">
      <DialogTitle fontWeight={900}>更改主題</DialogTitle>
      <List sx={{ pb: 1 }}>
        {THEME_OPTIONS.map((option) => (
          <ListItemButton
            key={option.name}
            selected={option.name === props.current}
            onClick={() => props.onSelect(option.name)}
            sx={{ py: 1.5 }}
          >
            <ListItemText
              primary={option.label}
              secondary={option.description}
              slotProps={{ primary: { fontWeight: 800 } }}
            />
            {option.name === props.current && (
              <ListItemIcon sx={{ minWidth: 0, color: "primary.main" }}>
                <CheckRoundedIcon />
              </ListItemIcon>
            )}
          </ListItemButton>
        ))}
      </List>
    </Dialog>
  );
}
