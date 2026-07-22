import type { IGpsSample } from "../types/gpsTypes.ts";
import { isGpsSampleFresh } from "../utils/gpsSampling.ts";

export class GpsSampleStore {
  private latest: IGpsSample | null = null;

  set(sample: IGpsSample): void {
    this.latest = sample;
  }

  getLatest(): IGpsSample | null {
    return this.latest;
  }

  getFresh(nowMs: number): IGpsSample | null {
    if (this.latest === null || !isGpsSampleFresh(this.latest.sampledAtMs, nowMs)) {
      this.latest = null;
    }
    return this.latest;
  }

  clear(): void {
    this.latest = null;
  }
}
