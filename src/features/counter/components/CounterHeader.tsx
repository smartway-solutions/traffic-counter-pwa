import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { AppBar, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { getAppBarVisual } from "../../../themes.ts";
import type { TThemeName } from "../../../types.ts";
import { CounterActionDrawer, type ICounterActionDrawerProps } from "./CounterActionDrawer.tsx";
import { GpsStatusLamp } from "../../geolocation/components/GpsStatusLamp.tsx";

export interface ICounterHeaderProps
  extends Omit<ICounterActionDrawerProps, "open" | "onClose"> {
  roadSection: string;
  userName: string;
  currentTime: string;
  geolocation: IGeolocationState;
  themeName: TThemeName;
  quickSaveDisabled: boolean;
  onQuickSave: () => void;
}

export function CounterHeader(props: ICounterHeaderProps): React.JSX.Element {
  const [sheetOpen, setSheetOpen] = useState(false);
  const appBar = getAppBarVisual(props.themeName);

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
            minHeight: 0
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
              whiteSpace: "nowrap"
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
              bgcolor: `${appBar.text}12`
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <CounterActionDrawer {...props} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}
