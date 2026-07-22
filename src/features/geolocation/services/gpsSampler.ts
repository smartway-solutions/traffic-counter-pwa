import {
  GPS_CACHE_MAX_AGE_MS,
  GPS_SAMPLE_TIMEOUT_MS,
  getDelayToNextGpsSampleWindow,
  getGpsSampleWindowKey,
  isGpsSampleFresh
} from "../utils/gpsSampling.ts";
import type { IGpsSnapshot } from "../../../types.ts";
import type { IGeolocationState } from "../types/gpsTypes.ts";

type TGpsStateListener = (state: IGeolocationState | ((previous: IGeolocationState) => IGeolocationState)) => void;

export function startGpsSampler(setState: TGpsStateListener): () => void {
  let disposed = false;
  let scheduleTimerId: number | null = null;
  let staleTimerId: number | null = null;
  let requestInFlight = false;
  let permissionBlocked = false;
  let lastRequestedWindowKey: string | null = null;
  let permissionStatus: PermissionStatus | null = null;
  let cachedPosition: IGpsSnapshot | null = null;
  let cachedAtMs: number | null = null;

  if (!("geolocation" in navigator)) {
    setState({ position: null, sampledAtMs: null, status: "unsupported", message: "裝置不支援 GPS" });
    return () => undefined;
  }

  function clearTimer(timerId: number | null): null {
    if (timerId !== null) window.clearTimeout(timerId);
    return null;
  }

  function expireStaleCache(nowMs: number): void {
    if (cachedPosition === null || isGpsSampleFresh(cachedAtMs, nowMs)) return;
    cachedPosition = null;
    cachedAtMs = null;
    staleTimerId = clearTimer(staleTimerId);
    setState({ position: null, sampledAtMs: null, status: "error", message: "GPS 資料逾時" });
  }

  function scheduleCacheExpiry(sampledAtMs: number): void {
    staleTimerId = clearTimer(staleTimerId);
    const delay = Math.max(1, sampledAtMs + GPS_CACHE_MAX_AGE_MS + 1 - Date.now());
    staleTimerId = window.setTimeout(() => {
      if (!disposed && cachedAtMs === sampledAtMs) expireStaleCache(Date.now());
    }, delay);
  }

  function handlePosition(position: GeolocationPosition): void {
    requestInFlight = false;
    if (disposed) return;
    const sampledAtMs = Date.now();
    cachedPosition = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracyMeters: position.coords.accuracy
    };
    cachedAtMs = sampledAtMs;
    setState({
      position: cachedPosition,
      sampledAtMs,
      status: "ready",
      message: `GPS ±${Math.round(position.coords.accuracy)}m`
    });
    scheduleCacheExpiry(sampledAtMs);
  }

  function handlePositionError(error: GeolocationPositionError): void {
    requestInFlight = false;
    if (disposed) return;
    if (error.code === error.PERMISSION_DENIED) {
      permissionBlocked = true;
      scheduleTimerId = clearTimer(scheduleTimerId);
      staleTimerId = clearTimer(staleTimerId);
      cachedPosition = null;
      cachedAtMs = null;
      setState({ position: null, sampledAtMs: null, status: "denied", message: "GPS 權限未允許" });
      return;
    }

    expireStaleCache(Date.now());
    if (cachedPosition !== null && cachedAtMs !== null) {
      const ageSeconds = Math.max(0, Math.floor((Date.now() - cachedAtMs) / 1_000));
      setState({
        position: cachedPosition,
        sampledAtMs: cachedAtMs,
        status: "ready",
        message: `GPS 快取 ${ageSeconds} 秒前`
      });
      return;
    }
    setState({ position: null, sampledAtMs: null, status: "error", message: `GPS 取樣失敗：${error.message}` });
  }

  function requestCurrentWindow(nowMs: number): void {
    const windowKey = getGpsSampleWindowKey(nowMs);
    if (
      windowKey === null ||
      windowKey === lastRequestedWindowKey ||
      requestInFlight ||
      document.visibilityState !== "visible"
    ) return;

    lastRequestedWindowKey = windowKey;
    requestInFlight = true;
    if (cachedPosition === null) {
      setState({ position: null, sampledAtMs: null, status: "requesting", message: "正在取得 GPS" });
    }
    navigator.geolocation.getCurrentPosition(handlePosition, handlePositionError, {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: GPS_SAMPLE_TIMEOUT_MS
    });
  }

  function runScheduler(): void {
    if (disposed) return;
    scheduleTimerId = clearTimer(scheduleTimerId);
    const nowMs = Date.now();
    expireStaleCache(nowMs);
    if (!permissionBlocked && permissionStatus?.state !== "denied") requestCurrentWindow(nowMs);
    if (document.visibilityState === "visible") {
      scheduleTimerId = window.setTimeout(runScheduler, getDelayToNextGpsSampleWindow(nowMs));
    }
  }

  function handleVisibilityChange(): void {
    if (document.visibilityState === "visible") runScheduler();
    else scheduleTimerId = clearTimer(scheduleTimerId);
  }

  function handlePermissionChange(): void {
    if (permissionStatus?.state === "denied") {
      permissionBlocked = true;
      scheduleTimerId = clearTimer(scheduleTimerId);
      staleTimerId = clearTimer(staleTimerId);
      cachedPosition = null;
      cachedAtMs = null;
      setState({ position: null, sampledAtMs: null, status: "denied", message: "GPS 權限未允許" });
      return;
    }
    permissionBlocked = false;
    setState((previous) => previous.position === null
      ? { ...previous, status: "requesting", message: "等待 GPS 取樣" }
      : previous);
    runScheduler();
  }

  async function initialize(): Promise<void> {
    if ("permissions" in navigator) {
      try {
        permissionStatus = await navigator.permissions.query({ name: "geolocation" });
        if (disposed) return;
        permissionStatus.addEventListener("change", handlePermissionChange);
        if (permissionStatus.state === "denied") {
          handlePermissionChange();
          return;
        }
      } catch {
        permissionStatus = null;
      }
    }
    runScheduler();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  void initialize();
  return () => {
    disposed = true;
    scheduleTimerId = clearTimer(scheduleTimerId);
    staleTimerId = clearTimer(staleTimerId);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    permissionStatus?.removeEventListener("change", handlePermissionChange);
  };
}
