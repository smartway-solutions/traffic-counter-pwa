import {
  getDelayToNextGpsSampleWindow,
  getGpsSampleWindowKey,
  isGpsRequestDue
} from "../utils/gpsSampling.ts";

export function startGpsScheduler(onWindow: (nowMs: number) => void): () => void {
  let disposed = false;
  let timerId: number | null = null;
  let lastWindowKey: string | null = null;
  let lastRequestedAtMs: number | null = null;

  function clearTimer(): void {
    if (timerId !== null) window.clearTimeout(timerId);
    timerId = null;
  }

  function run(): void {
    if (disposed) return;
    clearTimer();
    const nowMs = Date.now();
    if (document.visibilityState !== "visible") return;

    const windowKey = getGpsSampleWindowKey(nowMs);
    if (windowKey !== lastWindowKey && isGpsRequestDue(lastRequestedAtMs, nowMs)) {
      lastWindowKey = windowKey;
      lastRequestedAtMs = nowMs;
      onWindow(nowMs);
    }
    timerId = window.setTimeout(run, getDelayToNextGpsSampleWindow(nowMs));
  }

  function handleVisibilityChange(): void {
    if (document.visibilityState === "visible") run();
    else clearTimer();
  }

  document.addEventListener("visibilitychange", handleVisibilityChange);
  run();
  return () => {
    disposed = true;
    clearTimer();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}
