import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import PaletteRoundedIcon from "@mui/icons-material/PaletteRounded";
import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState, type MouseEvent } from "react";
import type { IGeolocationState } from "../hooks/useGeolocation.ts";
import { getAppBarVisual, THEME_OPTIONS } from "../themes.ts";
import type { TThemeName } from "../types.ts";
import { GpsStatusLamp } from "./GpsStatusLamp.tsx";

export interface ICounterHeaderProps {
  roadSection: string;
  userName: string;
  currentTime: string;
  geolocation: IGeolocationState;
  themeName: TThemeName;
  onExport: () => void;
  onEditSetup: () => void;
  onFeedbackSettings: () => void;
  onManual: () => void;
  onChangelog: () => void;
  onThemeRequest: () => void;
  onClearRequest: () => void;
}

export function CounterHeader(props: ICounterHeaderProps): React.JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const appBar = getAppBarVisual(props.themeName);

  function pick(action: () => void): void {
    setMenuAnchor(null);
    action();
  }

  return (
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
          gap: 0.75,
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
        <IconButton
          aria-label="更多功能"
          onClick={(event: MouseEvent<HTMLButtonElement>) => setMenuAnchor(event.currentTarget)}
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

      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={() => setMenuAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 224, borderRadius: "4px" } } }}
      >
        <MenuItem onClick={() => pick(props.onExport)} sx={{ minHeight: 48 }}>
          <FileDownloadRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          匯出與統計
        </MenuItem>
        <MenuItem onClick={() => pick(props.onEditSetup)} sx={{ minHeight: 48 }}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          編輯路段／使用者
        </MenuItem>
        <MenuItem onClick={() => pick(props.onFeedbackSettings)} sx={{ minHeight: 48 }}>
          <NotificationsActiveRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          震動與音效
        </MenuItem>
        <MenuItem onClick={() => pick(props.onManual)} sx={{ minHeight: 48 }}>
          <MenuBookRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          使用手冊
        </MenuItem>
        <MenuItem onClick={() => pick(props.onChangelog)} sx={{ minHeight: 48 }}>
          <HistoryRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          版本變更說明
        </MenuItem>
        <MenuItem onClick={() => pick(props.onThemeRequest)} sx={{ minHeight: 48 }}>
          <PaletteRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          更改主題（{THEME_OPTIONS.length} 款）
        </MenuItem>
        <MenuItem
          onClick={() => pick(props.onClearRequest)}
          sx={{ minHeight: 48, color: "error.main" }}
        >
          <DeleteForeverRoundedIcon fontSize="small" sx={{ mr: 1.25 }} />
          清除本機資料
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
