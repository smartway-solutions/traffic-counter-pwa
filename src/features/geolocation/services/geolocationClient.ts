import type { IGpsSnapshot } from "../../../types.ts";
import type { IGpsSample } from "../types/gpsTypes.ts";
import { GPS_SAMPLE_TIMEOUT_MS } from "../utils/gpsSampling.ts";

export class GeolocationRequestError extends Error {
  constructor(
    message: string,
    readonly code: number
  ) {
    super(message);
    this.name = "GeolocationRequestError";
  }
}

function toSnapshot(position: GeolocationPosition): IGpsSnapshot {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracyMeters: position.coords.accuracy
  };
}

export function requestGpsSample(): Promise<IGpsSample> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ position: toSnapshot(position), sampledAtMs: Date.now() }),
      (error) => reject(new GeolocationRequestError(error.message, error.code)),
      { enableHighAccuracy: true, maximumAge: 0, timeout: GPS_SAMPLE_TIMEOUT_MS }
    );
  });
}

export function isPermissionDenied(error: unknown): boolean {
  return error instanceof GeolocationRequestError && error.code === 1;
}

export function getGeolocationErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
