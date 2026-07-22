/** 每分鐘切成六個固定 10 秒視窗，每個視窗最多取樣一次。 */
export const GPS_SAMPLE_WINDOW_MS = 10_000;
export const GPS_SAMPLE_WINDOWS_PER_MINUTE = 6;
export const GPS_SAMPLE_TIMEOUT_MS = 8_000;
/** 一個取樣週期加一次請求 timeout，再保留 2 秒排程誤差。 */
export const GPS_SAMPLE_MAX_AGE_MS = 20_000;

export type TGpsSampleWindow = 0 | 1 | 2 | 3 | 4 | 5;

function getMinuteOffset(nowMs: number): number {
  return ((nowMs % 60_000) + 60_000) % 60_000;
}

export function getGpsSampleWindow(nowMs: number): TGpsSampleWindow {
  const offset = getMinuteOffset(nowMs);
  if (offset === 0) return 0;
  return Math.min(
    GPS_SAMPLE_WINDOWS_PER_MINUTE - 1,
    Math.floor((offset - 1) / GPS_SAMPLE_WINDOW_MS)
  ) as TGpsSampleWindow;
}

export function getGpsSampleWindowKey(nowMs: number): string {
  const windowIndex = getGpsSampleWindow(nowMs);
  return `${Math.floor(nowMs / 60_000)}:${windowIndex}`;
}

export function isGpsRequestDue(lastRequestedAtMs: number | null, nowMs: number): boolean {
  return (
    lastRequestedAtMs === null ||
    (nowMs >= lastRequestedAtMs && nowMs - lastRequestedAtMs >= GPS_SAMPLE_WINDOW_MS)
  );
}

/** 回傳下一個可能取樣時間；加 1ms 明確區隔 10.000 與 10.001 秒。 */
export function getDelayToNextGpsSampleWindow(nowMs: number): number {
  const offset = getMinuteOffset(nowMs);
  const windowIndex = getGpsSampleWindow(nowMs);
  if (windowIndex === GPS_SAMPLE_WINDOWS_PER_MINUTE - 1) {
    return Math.max(1, 60_000 - offset);
  }
  const nextWindowStart = (windowIndex + 1) * GPS_SAMPLE_WINDOW_MS + 1;
  return Math.max(1, nextWindowStart - offset);
}

export function isGpsSampleFresh(sampledAtMs: number | null, nowMs: number): boolean {
  return (
    sampledAtMs !== null &&
    nowMs >= sampledAtMs &&
    nowMs - sampledAtMs <= GPS_SAMPLE_MAX_AGE_MS
  );
}
