/** 每分鐘只在前兩個 10 秒視窗取樣，每個視窗最多一次。 */
export const GPS_SAMPLE_WINDOW_MS = 10_000;
export const GPS_ACTIVE_WINDOW_COUNT = 2;
export const GPS_SAMPLE_TIMEOUT_MS = 8_000;
export const GPS_CACHE_MAX_AGE_MS = 70_000;

export type TGpsSampleWindow = 0 | 1;

function getMinuteOffset(nowMs: number): number {
  return ((nowMs % 60_000) + 60_000) % 60_000;
}

export function getGpsSampleWindow(nowMs: number): TGpsSampleWindow | null {
  const offset = getMinuteOffset(nowMs);
  if (offset <= GPS_SAMPLE_WINDOW_MS) {
    return 0;
  }
  if (offset <= GPS_SAMPLE_WINDOW_MS * GPS_ACTIVE_WINDOW_COUNT) {
    return 1;
  }
  return null;
}

export function getGpsSampleWindowKey(nowMs: number): string | null {
  const windowIndex = getGpsSampleWindow(nowMs);
  if (windowIndex === null) {
    return null;
  }
  return `${Math.floor(nowMs / 60_000)}:${windowIndex}`;
}

/** 回傳下一個可能取樣時間；加 1ms 明確區隔 10.000 與 10.001 秒。 */
export function getDelayToNextGpsSampleWindow(nowMs: number): number {
  const offset = getMinuteOffset(nowMs);
  if (offset <= GPS_SAMPLE_WINDOW_MS) {
    return Math.max(1, GPS_SAMPLE_WINDOW_MS + 1 - offset);
  }
  return Math.max(1, 60_000 - offset);
}

export function isGpsSampleFresh(sampledAtMs: number | null, nowMs: number): boolean {
  return (
    sampledAtMs !== null &&
    nowMs >= sampledAtMs &&
    nowMs - sampledAtMs <= GPS_CACHE_MAX_AGE_MS
  );
}
