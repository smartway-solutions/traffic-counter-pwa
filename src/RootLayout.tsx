import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { isSetupComplete, type IAppContext } from "./appContext.ts";
import { useClock } from "./hooks/useClock.ts";
import { useGeolocation } from "./hooks/useGeolocation.ts";
import { usePersistentState } from "./hooks/usePersistentState.ts";
import { buildMuiTheme } from "./themes.ts";

export function RootLayout(): React.JSX.Element {
  const [state, setState] = usePersistentState();
  const geolocation = useGeolocation();
  const currentTime = useClock();
  const location = useLocation();
  const muiTheme = useMemo(() => buildMuiTheme(state.theme), [state.theme]);

  const context: IAppContext = { state, setState, geolocation, currentTime };
  const needsSetup = !isSetupComplete(state) && location.pathname !== "/setup";

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {needsSetup ? <Navigate to="/setup" replace /> : <Outlet context={context} />}
    </ThemeProvider>
  );
}
