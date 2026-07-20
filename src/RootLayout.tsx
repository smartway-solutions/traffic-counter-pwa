import { Navigate, Outlet, useLocation } from "react-router";
import { isSetupComplete, type IAppContext } from "./appContext.ts";
import { useClock } from "./hooks/useClock.ts";
import { useGeolocation } from "./hooks/useGeolocation.ts";
import { usePersistentState } from "./hooks/usePersistentState.ts";

export function RootLayout(): React.JSX.Element {
  const [state, setState] = usePersistentState();
  const geolocation = useGeolocation();
  const currentTime = useClock();
  const location = useLocation();

  if (!isSetupComplete(state) && location.pathname !== "/setup") {
    return <Navigate to="/setup" replace />;
  }

  const context: IAppContext = { state, setState, geolocation, currentTime };
  return <Outlet context={context} />;
}
