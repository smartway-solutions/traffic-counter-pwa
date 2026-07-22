import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { useState } from "react";
import { useClock } from "../../../hooks/useClock.ts";
import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { getAppBarVisual } from "../../../themes.ts";
import type { TThemeName } from "../../../types.ts";
import { CounterActionDrawer, type ICounterActionDrawerProps } from "./CounterActionDrawer.tsx";
import { GpsStatusLamp } from "../../geolocation/components/GpsStatusLamp.tsx";

export interface ICounterHeaderProps
  extends Omit<ICounterActionDrawerProps, "open" | "onClose"> {
  roadSection: string;
  userName: string;
  facingDirection: string;
  geolocation: IGeolocationState;
  themeName: TThemeName;
  quickSaveDisabled: boolean;
  onQuickSave: () => void;
}

function HeaderClock(): React.JSX.Element {
  const currentTime = useClock();

  return (
    <Typography
      variant="caption"
      sx={{
        flexShrink: 0,
        fontVariantNumeric: "tabular-nums",
        opacity: 0.82,
        fontSize: "0.66rem"
      }}
      noWrap
    >
      {currentTime}
    </Typography>
  );
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
            pt: "max(8px, env(safe-area-inset-top))",
            pb: 1,
            pl: "max(8px, env(safe-area-inset-left))",
            pr: "max(8px, env(safe-area-inset-right))",
            gap: 0.65,
            minHeight: 64
          }}
        >
          <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.3}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between" spacing={0.75}>
              <HeaderClock />
              <Typography
                sx={{
                  minWidth: 0,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  textAlign: "right",
                  overflowWrap: "anywhere"
                }}
              >
                {props.userName}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <Typography
                sx={{
                  flex: 1,
                  minWidth: 0,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  lineHeight: 1.25,
                  opacity: 0.88,
                  overflowWrap: "anywhere"
                }}
              >
                {[props.facingDirection, props.roadSection].filter(Boolean).join("｜")}
              </Typography>
              <GpsStatusLamp status={props.geolocation.status} message={props.geolocation.message} />
            </Stack>
          </Stack>
          <IconButton
            aria-label="Quick Save"
            disabled={props.quickSaveDisabled}
            onClick={props.onQuickSave}
            sx={{
              flexShrink: 0,
              color: `${appBar.text} !important`,
              border: `1px solid ${appBar.text}55`,
              bgcolor: `${appBar.text}12`
            }}
          >
            <SaveRoundedIcon />
          </IconButton>
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
