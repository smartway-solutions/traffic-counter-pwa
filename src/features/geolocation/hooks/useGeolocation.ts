import { useEffect, useState } from "react";
import { startGpsSampler } from "../services/gpsSampler.ts";
import { INITIAL_GEOLOCATION_STATE, type IGeolocationState } from "../types/gpsTypes.ts";

export type { IGeolocationState, TGeolocationStatus } from "../types/gpsTypes.ts";

export function useGeolocation(): IGeolocationState {
  const [state, setState] = useState<IGeolocationState>(INITIAL_GEOLOCATION_STATE);
  useEffect(() => startGpsSampler(setState), []);
  return state;
}
