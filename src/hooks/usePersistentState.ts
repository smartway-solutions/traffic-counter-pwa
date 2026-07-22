import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { createInitialState, STORAGE_KEY } from "../constants.ts";
import { isThemeName } from "../themes.ts";
import type {
  ICountRecord,
  IFeedbackSettings,
  IStoredState,
  TVehicleCounts,
  TVehicleType
} from "../types.ts";
import { VEHICLE_TYPES } from "../types.ts";

function mergeFeedbackSettings(
  initial: IFeedbackSettings,
  stored: Partial<IFeedbackSettings> | undefined
): IFeedbackSettings {
  return {
    increase: { ...initial.increase, ...stored?.increase },
    decrease: { ...initial.decrease, ...stored?.decrease },
    negativeError: { ...initial.negativeError, ...stored?.negativeError }
  };
}

function mergeCounts(initial: TVehicleCounts, stored: Partial<TVehicleCounts> | undefined): TVehicleCounts {
  return Object.fromEntries(
    VEHICLE_TYPES.map((vehicleType) => {
      const storedValue = stored?.[vehicleType];
      return [vehicleType, typeof storedValue === "number" ? storedValue : initial[vehicleType]];
    })
  ) as TVehicleCounts;
}

function isVehicleType(value: unknown): value is TVehicleType {
  return typeof value === "string" && VEHICLE_TYPES.includes(value as TVehicleType);
}

function normalizeRecord(value: unknown): ICountRecord | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const record = value as Partial<ICountRecord>;
  if (typeof record.id !== "string" || typeof record.timestampIso !== "string") {
    return null;
  }

  const isSave = record.eventType === "save";
  const vehicleType = isVehicleType(record.vehicleType) ? record.vehicleType : null;
  const legacyCountAfter = typeof record.countAfter === "number" ? record.countAfter : null;

  return {
    id: record.id,
    eventType: isSave ? "save" : "count",
    saveType:
      record.saveType === "quick_save" || record.saveType === "auto_save" ? record.saveType : null,
    saveId: typeof record.saveId === "string" ? record.saveId : null,
    // 頁面重新載入後已無任何工作能接續 pending Save，因此明確恢復成 failed。
    saveStatus: isSave
      ? record.saveStatus === "pending"
        ? "failed"
        : record.saveStatus === "completed" || record.saveStatus === "failed"
          ? record.saveStatus
          : "completed"
      : null,
    vehicleType,
    action: record.action === "increase" || record.action === "decrease" ? record.action : null,
    delta: record.delta === -1 ? -1 : record.delta === 0 ? 0 : 1,
    countAfter: legacyCountAfter,
    workingCountAfter:
      typeof record.workingCountAfter === "number" ? record.workingCountAfter : legacyCountAfter,
    timestampIso: record.timestampIso,
    localTime: typeof record.localTime === "string" ? record.localTime : record.timestampIso,
    gps: record.gps ?? null,
    roadSection: typeof record.roadSection === "string" ? record.roadSection : "",
    userName: typeof record.userName === "string" ? record.userName : "",
    screenshotFilename:
      typeof record.screenshotFilename === "string" ? record.screenshotFilename : null,
    savedWorkingCountsJson:
      typeof record.savedWorkingCountsJson === "string" ? record.savedWorkingCountsJson : null,
    savedRecordCount: typeof record.savedRecordCount === "number" ? record.savedRecordCount : null
  };
}

function readStoredState(): IStoredState {
  const initial = createInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return initial;
  }

  try {
    const stored = JSON.parse(raw) as Partial<IStoredState>;
    const counts = mergeCounts(initial.counts, stored.counts);
    return {
      ...initial,
      ...stored,
      theme: isThemeName(stored.theme) ? stored.theme : "default",
      feedbackSettings: mergeFeedbackSettings(initial.feedbackSettings, stored.feedbackSettings),
      autoSaveEnabled: stored.autoSaveEnabled === true,
      counts,
      // 舊版只有 counts；升級時主畫面沿用舊數字，避免重新整理後突然歸零。
      workingCounts: mergeCounts(initial.workingCounts, stored.workingCounts ?? counts),
      records: Array.isArray(stored.records)
        ? stored.records.map(normalizeRecord).filter((record): record is ICountRecord => record !== null)
        : []
    };
  } catch (error) {
    throw new Error(
      `LocalStorage 資料損毀，請在瀏覽器開發者工具刪除鍵值 ${STORAGE_KEY} 後重新整理。`,
      { cause: error }
    );
  }
}

export function persistStoredState(state: IStoredState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function usePersistentState(): [
  IStoredState,
  Dispatch<SetStateAction<IStoredState>>
] {
  const [state, setState] = useState<IStoredState>(readStoredState);

  useEffect(() => {
    try {
      persistStoredState(state);
    } catch (error) {
      // 計數狀態仍保留在記憶體；避免 quota/security 例外使整個 React tree 中斷。
      console.error("無法將交通計數狀態寫入 LocalStorage。", error);
    }
  }, [state]);

  return [state, setState];
}
