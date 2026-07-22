import { createEmptyCounts } from "../../../constants.ts";
import { persistStoredState } from "../../../hooks/usePersistentState.ts";
import type { IStoredState, TSaveType } from "../../../types.ts";
import { downloadBlob } from "../../../utils/downloadBlob.ts";
import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { createSaveRecord, createScreenshotFilename } from "../utils/counterRecords.ts";
import { renderElementToPngBlob } from "./saveSnapshot.ts";

export interface ICounterNotice {
  message: string;
  severity: "success" | "warning";
}

interface ISaveCounterOptions {
  saveType: TSaveType;
  snapshot: IStoredState;
  geolocation: IGeolocationState;
  captureTarget: HTMLElement;
  getLatestState: () => IStoredState;
  applyState: (state: IStoredState) => void;
}

export async function saveCounterSnapshot(options: ISaveCounterOptions): Promise<ICounterNotice> {
  const { saveType, snapshot, geolocation, captureTarget, getLatestState, applyState } = options;
  const now = new Date();
  const saveId = `${saveType}-${now.getTime()}`;
  const screenshotFilename = createScreenshotFilename(snapshot, saveType, now);
  const saveRecord = createSaveRecord(
    snapshot,
    geolocation,
    saveType,
    saveId,
    screenshotFilename,
    now
  );
  const pendingState: IStoredState = {
    ...snapshot,
    records: [...snapshot.records, saveRecord]
  };
  let pendingRecorded = false;

  try {
    // 保存事件先寫入本機；截圖成功以前，工作區數字保持不變。
    persistStoredState(pendingState);
    pendingRecorded = true;
    applyState(pendingState);

    const pngBlob = await renderElementToPngBlob(captureTarget);
    downloadBlob(pngBlob, screenshotFilename);

    const latest = getLatestState();
    const completedState: IStoredState = {
      ...latest,
      workingCounts: createEmptyCounts(),
      records: latest.records.map((record) =>
        record.id === saveId ? { ...record, saveStatus: "completed" } : record
      )
    };
    persistStoredState(completedState);
    applyState(completedState);
    return {
      message:
        saveType === "quick_save"
          ? "Quick Save 完成"
          : "Auto Save 完成：截圖已下載，主畫面已歸零",
      severity: "success"
    };
  } catch (error) {
    const latest = pendingRecorded ? getLatestState() : snapshot;
    const failedState: IStoredState = {
      ...latest,
      autoSaveEnabled: saveType === "auto_save" ? false : latest.autoSaveEnabled,
      records: pendingRecorded
        ? latest.records.map((record) =>
            record.id === saveId ? { ...record, saveStatus: "failed" } : record
          )
        : latest.records
    };
    let reason = error instanceof Error ? error.message : String(error);
    try {
      persistStoredState(failedState);
    } catch (persistError) {
      const persistReason = persistError instanceof Error ? persistError.message : String(persistError);
      reason = `${reason}；失敗狀態也無法寫入本機：${persistReason}`;
    }
    applyState(failedState);
    return {
      message:
        saveType === "auto_save"
          ? `Auto Save 失敗並已關閉：${reason}`
          : `Quick Save 失敗，主畫面未歸零：${reason}`,
      severity: "warning"
    };
  }
}
