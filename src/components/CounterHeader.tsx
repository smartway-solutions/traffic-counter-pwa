import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Switch,
  Toolbar,
  Typography
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import type { IGeolocationState } from "../hooks/useGeolocation.ts";
import { AUTO_SAVE_INTERVAL_MINUTES } from "../constants.ts";
import { getAppBarVisual, THEME_OPTIONS } from "../themes.ts";
import type { TThemeName } from "../types.ts";
import { GpsStatusLamp } from "./GpsStatusLamp.tsx";

export interface ICounterHeaderProps {
  roadSection: string;
  userName: string;
  currentTime: string;
  geolocation: IGeolocationState;
  themeName: TThemeName;
  autoSaveEnabled: boolean;
  quickSaveDisabled: boolean;
  onQuickSave: () => void;
  onAutoSaveChange: (enabled: boolean) => void;
  onExport: () => void;
  onEditSetup: () => void;
  onFeedbackSettings: () => void;
  onManual: () => void;
  onChangelog: () => void;
  onThemeRequest: () => void;
  onClearRequest: () => void;
}

interface ISheetAction {
  label: string;
  icon: React.JSX.Element;
  onClick: () => void;
  danger?: boolean;
}

export function CounterHeader(props: ICounterHeaderProps): React.JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const appBar = getAppBarVisual(props.themeName);

  function run(action: () => void): void {
    setSheetOpen(false);
    action();
  }

  const actions: ISheetAction[] = [
    {
      label: "匯出與統計",
      icon: <FileDownloadRoundedIcon fontSize="small" />,
      onClick: props.onExport
    },
    {
      label: "編輯路段／使用者",
      icon: <EditRoundedIcon fontSize="small" />,
      onClick: props.onEditSetup
    },
    {
      label: "震動與音效",
      icon: <NotificationsActiveRoundedIcon fontSize="small" />,
      onClick: props.onFeedbackSettings
    },
    {
      label: "使用手冊",
      icon: <MenuBookRoundedIcon fontSize="small" />,
      onClick: props.onManual
    },
    {
      label: "版本變更說明",
      icon: <HistoryRoundedIcon fontSize="small" />,
      onClick: props.onChangelog
    },
    {
      label: `更改主題（${THEME_OPTIONS.length} 款）`,
      icon: <PaletteRoundedIcon fontSize="small" />,
      onClick: props.onThemeRequest
    },
    {
      label: "清除本機資料",
      icon: <DeleteForeverRoundedIcon fontSize="small" />,
      onClick: props.onClearRequest,
      danger: true
    }
  ];

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: appBar.background,
          color: appBar.text,
          borderBottom: `1px solid ${appBar.border}`,
          backgroundImage: "none"
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            pt: "max(4px, env(safe-area-inset-top))",
            pb: 0.6,
            pl: "max(8px, env(safe-area-inset-left))",
            pr: "max(8px, env(safe-area-inset-right))",
            gap: 0.65,
            minHeight: 0,
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.15}>
            <Stack direction="row" alignItems="baseline" spacing={0.75}>
              <Typography sx={{ fontSize: "0.98rem", fontWeight: 950 }} noWrap>
                交通量計數器
              </Typography>
              <Typography
                variant="caption"
                sx={{ fontVariantNumeric: "tabular-nums", opacity: 0.82, fontSize: "0.69rem" }}
                noWrap
              >
                {props.currentTime}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography
                sx={{ flex: 1, minWidth: 0, fontSize: "0.78rem", fontWeight: 800, opacity: 0.88 }}
                noWrap
              >
                {props.roadSection}｜{props.userName}
              </Typography>
              <GpsStatusLamp status={props.geolocation.status} message={props.geolocation.message} />
            </Stack>
          </Stack>

          <Button
            aria-label="Quick Save"
            disabled={props.quickSaveDisabled}
            onClick={props.onQuickSave}
            startIcon={<SaveRoundedIcon />}
            sx={{
              flexShrink: 0,
              minWidth: 0,
              px: 1,
              color: `${appBar.text} !important`,
              border: `1px solid ${appBar.text}55`,
              bgcolor: `${appBar.text}12`,
              fontSize: "0.72rem",
              fontWeight: 900,
              whiteSpace: "nowrap",
              "& .MuiSvgIcon-root": { color: `${appBar.text} !important` },
              "&:hover": { bgcolor: `${appBar.text}1F` }
            }}
          >
            Quick Save
          </Button>

          <IconButton
            aria-label="開啟右側功能面板"
            onClick={() => setSheetOpen(true)}
            sx={{
              flexShrink: 0,
              color: `${appBar.text} !important`,
              border: `1px solid ${appBar.text}55`,
              bgcolor: `${appBar.text}12`,
              "& .MuiSvgIcon-root": {
                color: `${appBar.text} !important`,
                fill: appBar.text
              },
              "&:hover": { bgcolor: `${appBar.text}1F` }
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
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
          <Typography variant="caption" color="text.secondary">
            右側 Sheet
          </Typography>
        </Box>
        <Divider />

        <List disablePadding>
          <ListItem sx={{ minHeight: 64, px: 2 }} secondaryAction={
            <Switch
              edge="end"
              checked={props.autoSaveEnabled}
              onChange={(_event: ChangeEvent<HTMLInputElement>, checked: boolean) =>
                props.onAutoSaveChange(checked)
              }
              inputProps={{ "aria-label": "Auto Save" }}
            />
          }>
            <ListItemText
              primary="Auto Save"
              secondary={`每 ${AUTO_SAVE_INTERVAL_MINUTES} 分鐘；工作區為 0 時略過`}
              slotProps={{ primary: { fontWeight: 900 } }}
            />
          </ListItem>
        </List>
        <Divider />

        <List disablePadding>
          {actions.map((action) => (
            <ListItemButton
              key={action.label}
              onClick={() => run(action.onClick)}
              sx={{ minHeight: 52, color: action.danger ? "error.main" : "inherit" }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>{action.icon}</ListItemIcon>
              <ListItemText primary={action.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}
