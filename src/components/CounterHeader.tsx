import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { AppBar, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from "@mui/material";
import { useState, type MouseEvent } from "react";
import type { IGeolocationState } from "../hooks/useGeolocation.ts";
import { GpsStatusLamp } from "./GpsStatusLamp.tsx";

export interface ICounterHeaderProps {
  roadSection: string;
  userName: string;
  currentTime: string;
  geolocation: IGeolocationState;
  onExport: () => void;
  onEditSetup: () => void;
  onClearRequest: () => void;
}

export function CounterHeader(props: ICounterHeaderProps): React.JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  function pick(action: () => void): void {
    setMenuAnchor(null);
    action();
  }

  return (
    <AppBar position="static" elevation={1} color="inherit">
      <Toolbar variant="dense" sx={{ py: 0.5, gap: 1, minHeight: 0 }}>
        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.25}>
          <Stack direction="row" alignItems="baseline" spacing={1}>
            <Typography variant="subtitle1" fontWeight={900} noWrap>
              交通量計數器
            </Typography>
            <Typography variant="caption" sx={{ fontVariantNumeric: "tabular-nums" }} noWrap>
              {props.currentTime}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" fontWeight={700} noWrap sx={{ flex: 1, minWidth: 0 }}>
              {props.roadSection}｜{props.userName}
            </Typography>
            <GpsStatusLamp status={props.geolocation.status} message={props.geolocation.message} />
          </Stack>
        </Stack>
        <IconButton
          aria-label="更多功能"
          edge="end"
          onClick={(event: MouseEvent<HTMLButtonElement>) => setMenuAnchor(event.currentTarget)}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Toolbar>

      <Menu anchorEl={menuAnchor} open={menuAnchor !== null} onClose={() => setMenuAnchor(null)}>
        <MenuItem onClick={() => pick(props.onExport)}>
          <FileDownloadRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          匯出與統計
        </MenuItem>
        <MenuItem onClick={() => pick(props.onEditSetup)}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          編輯路段／使用者
        </MenuItem>
        <MenuItem onClick={() => pick(props.onClearRequest)} sx={{ color: "error.main" }}>
          <DeleteForeverRoundedIcon fontSize="small" sx={{ mr: 1 }} />
          清除本機資料
        </MenuItem>
      </Menu>
    </AppBar>
  );
}
