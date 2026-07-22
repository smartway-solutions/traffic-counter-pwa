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
    let disposed = false;
    let watchId: number | null = null;

    if (!("geolocation" in navigator)) {
      setState({ position: null, status: "unsupported", message: "裝置不支援 GPS" });
      return undefined;
    }

    function startWatching(): void {
      if (disposed || watchId !== null) {
        return;
      }
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (disposed) {
            return;
          }
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
          if (disposed) {
            return;
          }
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
    }

    async function initialize(): Promise<void> {
      if (!("permissions" in navigator)) {
        startWatching();
        return;
      }

      try {
        const permission = await navigator.permissions.query({ name: "geolocation" });
        if (disposed) {
          return;
        }
        if (permission.state === "denied") {
          setState({ position: null, status: "denied", message: "GPS 權限未允許" });
          return;
        }
        startWatching();
      } catch {
        // Permissions API 不可用或查詢失敗時，退回標準 Geolocation API。
        startWatching();
      }
    }

    void initialize();

    return () => {
      disposed = true;
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return state;
}
