import type { IGpsSnapshot } from "../../../types.ts";
import type { IGeolocationState } from "../types/gpsTypes.ts";
import { isGpsSampleFresh } from "./gpsSampling.ts";

export function getFreshGpsSnapshot(
  geolocation: IGeolocationState,
  nowMs: number
): IGpsSnapshot | null {
  if (geolocation.position === null || !isGpsSampleFresh(geolocation.sampledAtMs, nowMs)) {
    return null;
  }
  return { ...geolocation.position };
}
