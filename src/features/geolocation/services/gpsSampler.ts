import type { IGeolocationState, IGpsSample } from "../types/gpsTypes.ts";
import { GPS_SAMPLE_MAX_AGE_MS } from "../utils/gpsSampling.ts";
import {
  getGeolocationErrorMessage,
  isPermissionDenied,
  requestGpsSample
} from "./geolocationClient.ts";
import { GpsSampleStore } from "./gpsSampleStore.ts";
import { startGpsScheduler } from "./gpsScheduler.ts";

type TGpsStateListener = (
  state: IGeolocationState | ((previous: IGeolocationState) => IGeolocationState)
) => void;

export function startGpsSampler(setState: TGpsStateListener): () => void {
  const samples = new GpsSampleStore();
  let disposed = false;
  let requestInFlight = false;
  let staleTimerId: number | null = null;
  let stopScheduler: (() => void) | null = null;
  let permissionStatus: PermissionStatus | null = null;

  if (!("geolocation" in navigator)) {
    setState({ position: null, sampledAtMs: null, status: "unsupported", message: "裝置不支援 GPS" });
    return () => undefined;
  }

  function clearStaleTimer(): void {
    if (staleTimerId !== null) window.clearTimeout(staleTimerId);
    staleTimerId = null;
  }

  function clearSample(): void {
    clearStaleTimer();
    samples.clear();
  }

  function showDenied(): void {
    stopScheduler?.();
    stopScheduler = null;
    clearSample();
    setState({ position: null, sampledAtMs: null, status: "denied", message: "GPS 權限未允許" });
  }

  function scheduleExpiry(sample: IGpsSample): void {
    clearStaleTimer();
    const delay = Math.max(1, sample.sampledAtMs + GPS_SAMPLE_MAX_AGE_MS + 1 - Date.now());
    staleTimerId = window.setTimeout(() => {
      if (disposed || samples.getLatest()?.sampledAtMs !== sample.sampledAtMs) return;
      clearSample();
      setState({ position: null, sampledAtMs: null, status: "error", message: "GPS 最近樣本已逾時" });
    }, delay);
  }

  function publishSample(sample: IGpsSample): void {
    samples.set(sample);
    setState({
      position: sample.position,
      sampledAtMs: sample.sampledAtMs,
      status: "ready",
      message: `GPS ±${Math.round(sample.position.accuracyMeters)}m`
    });
    scheduleExpiry(sample);
  }

  function publishFailure(error: unknown): void {
    const sample = samples.getFresh(Date.now());
    if (sample !== null) {
      const ageSeconds = Math.max(0, Math.floor((Date.now() - sample.sampledAtMs) / 1_000));
      setState({
        position: sample.position,
        sampledAtMs: sample.sampledAtMs,
        status: "ready",
        message: `GPS 最近樣本 ${ageSeconds} 秒前`
      });
      return;
    }
    clearStaleTimer();
    setState({
      position: null,
      sampledAtMs: null,
      status: "error",
      message: `GPS 取樣失敗：${getGeolocationErrorMessage(error)}`
    });
  }

  async function sampleCurrentPosition(): Promise<void> {
    if (requestInFlight || disposed) return;
    requestInFlight = true;
    if (samples.getLatest() === null) {
      setState({ position: null, sampledAtMs: null, status: "requesting", message: "正在取得 GPS" });
    }
    try {
      const sample = await requestGpsSample();
      if (!disposed) publishSample(sample);
    } catch (error) {
      if (!disposed) {
        if (isPermissionDenied(error)) showDenied();
        else publishFailure(error);
      }
    } finally {
      requestInFlight = false;
    }
  }

  function startScheduler(): void {
    if (stopScheduler === null) {
      stopScheduler = startGpsScheduler(() => void sampleCurrentPosition());
    }
  }

  function handlePermissionChange(): void {
    if (permissionStatus?.state === "denied") showDenied();
    else {
      setState((previous) => previous.position === null
        ? { ...previous, status: "requesting", message: "等待 GPS 取樣" }
        : previous);
      startScheduler();
    }
  }

  async function initialize(): Promise<void> {
    if ("permissions" in navigator) {
      try {
        permissionStatus = await navigator.permissions.query({ name: "geolocation" });
        if (disposed) return;
        permissionStatus.addEventListener("change", handlePermissionChange);
        if (permissionStatus.state === "denied") {
          showDenied();
          return;
        }
      } catch {
        permissionStatus = null;
      }
    }
    startScheduler();
  }

  void initialize();
  return () => {
    disposed = true;
    stopScheduler?.();
    clearStaleTimer();
    permissionStatus?.removeEventListener("change", handlePermissionChange);
  };
}
