import type { IStoredState, TVehicleCounts } from "./types.ts";
import { VEHICLE_TYPES } from "./types.ts";

export const STORAGE_KEY = "traffic-counter-pwa:v1";

/** 單人單日作業上限：超過即拒絕新增，提示先匯出並清除。 */
export const MAX_RECORD_COUNT = 10_000;

export function createEmptyCounts(): TVehicleCounts {
  return Object.fromEntries(VEHICLE_TYPES.map((type) => [type, 0])) as TVehicleCounts;
}

export function createInitialState(): IStoredState {
  return {
    roadSection: "",
    userName: "",
    theme: "default",
    counts: createEmptyCounts(),
    records: []
  };
}
