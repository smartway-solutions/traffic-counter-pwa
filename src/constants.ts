import type { IFeedbackSettings, IStoredState, TVehicleCounts } from "./types.ts";
import { VEHICLE_TYPES } from "./types.ts";

export const STORAGE_KEY = "traffic-counter-pwa:v1";

/** 單人單日作業上限：超過即拒絕新增，提示先匯出並清除。 */
export const MAX_RECORD_COUNT = 10_000;

/** Auto Save 固定每 15 分鐘檢查一次；工作區為 0 時不產生空白存檔。 */
export const AUTO_SAVE_INTERVAL_MINUTES = 15;
export const AUTO_SAVE_INTERVAL_MS = AUTO_SAVE_INTERVAL_MINUTES * 60 * 1000;

export const DEFAULT_FEEDBACK_SETTINGS: IFeedbackSettings = {
  increase: { vibration: "light", sound: "off" },
  decrease: { vibration: "light", sound: "off" },
  negativeError: { vibration: "light", sound: "warning" }
};

export function createEmptyCounts(): TVehicleCounts {
  return Object.fromEntries(VEHICLE_TYPES.map((type) => [type, 0])) as TVehicleCounts;
}

export function createInitialState(): IStoredState {
  return {
    roadSection: "",
    userName: "",
    facingDirection: "",
    theme: "default",
    feedbackSettings: structuredClone(DEFAULT_FEEDBACK_SETTINGS),
    autoSaveEnabled: false,
    counts: createEmptyCounts(),
    workingCounts: createEmptyCounts(),
    records: []
  };
}
