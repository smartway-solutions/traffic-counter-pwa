import { useEffect, useState } from "react";
import type { IGpsSnapshot } from "../types.ts";

export type TGeolocationStatus = "requesting" | "ready" | "denied" | "unsupported" | "error";

export interface IGeolocationState {
  position: IGpsSnapshot | null;
  status: TGeolocationStatus;
  message: string;
}

export function useGeolocation(): IGeolocationState {
  const [state, setState] = useState<IGeolocationState>({
    position: null,
    status: "requesting",
    message: "正在取得 GPS"
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setState({ position: null, status: "unsupported", message: "裝置不支援 GPS" });
      return undefined;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracyMeters: position.coords.accuracy
          },
          status: "ready",
          message: `GPS ±${Math.round(position.coords.accuracy)}m`
        });
      },
      (error) => {
        const denied = error.code === error.PERMISSION_DENIED;
        setState({
          position: null,
          status: denied ? "denied" : "error",
          message: denied ? "GPS 權限未允許" : `GPS 錯誤：${error.message}`
        });
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
        timeout: 15_000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return state;
}
