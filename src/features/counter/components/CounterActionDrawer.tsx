import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography
} from "@mui/material";
import { AUTO_SAVE_INTERVAL_MINUTES } from "../../../constants.ts";
import { THEME_OPTIONS } from "../../../themes.ts";

export interface ICounterActionDrawerProps {
  open: boolean;
  autoSaveEnabled: boolean;
  onClose: () => void;
  onAutoSaveChange: (enabled: boolean) => void;
  onExport: () => void;
  onEditSetup: () => void;
  onFeedbackSettings: () => void;
  onManual: () => void;
  onChangelog: () => void;
  onThemeRequest: () => void;
  onClearRequest: () => void;
}

interface IActionItem {
  label: string;
  icon: React.JSX.Element;
  action: () => void;
  danger?: boolean;
}

export function CounterActionDrawer(props: ICounterActionDrawerProps): React.JSX.Element {
  const actions: IActionItem[] = [
    { label: "匯出與統計", icon: <FileDownloadRoundedIcon />, action: props.onExport },
    { label: "編輯路段／使用者", icon: <EditRoundedIcon />, action: props.onEditSetup },
    { label: "震動與音效", icon: <NotificationsActiveRoundedIcon />, action: props.onFeedbackSettings },
    { label: "使用手冊", icon: <MenuBookRoundedIcon />, action: props.onManual },
    { label: "版本變更說明", icon: <HistoryRoundedIcon />, action: props.onChangelog },
    {
      label: `更改主題（${THEME_OPTIONS.length} 款）`,
      icon: <PaletteRoundedIcon />,
      action: props.onThemeRequest
    },
    {
      label: "清除本機資料",
      icon: <DeleteForeverRoundedIcon />,
      action: props.onClearRequest,
      danger: true
    }
  ];

  function run(action: () => void): void {
    props.onClose();
    action();
  }

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={props.onClose}
      slotProps={{
        paper: {
          sx: {
            width: "min(88vw, 360px)",
            pt: "env(safe-area-inset-top)",
            pb: "env(safe-area-inset-bottom)"
          }
        }
      }}
    >
      <Box sx={{ px: 2, py: 1.5 }}>
        <Typography fontWeight={950}>功能</Typography>
        <Typography variant="caption" color="text.secondary">右側 Sheet</Typography>
      </Box>
      <Divider />
      <List disablePadding>
        <ListItem
          sx={{ minHeight: 64, px: 2 }}
          secondaryAction={
            <Switch
              edge="end"
              checked={props.autoSaveEnabled}
              onChange={(_event, checked) => props.onAutoSaveChange(checked)}
              inputProps={{ "aria-label": "Auto Save" }}
            />
          }
        >
          <ListItemText
            primary="Auto Save"
            secondary={`每 ${AUTO_SAVE_INTERVAL_MINUTES} 分鐘；工作區為 0 時略過`}
            slotProps={{ primary: { fontWeight: 900 } }}
          />
        </ListItem>
      </List>
      <Divider />
      <List disablePadding>
        {actions.map((item) => (
          <ListItemButton
            key={item.label}
            onClick={() => run(item.action)}
            sx={{ minHeight: 52, color: item.danger ? "error.main" : "inherit" }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
