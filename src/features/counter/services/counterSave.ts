import JSZip from "jszip";
import {
  AGGREGATE_COLUMNS,
  COUNT_COLUMNS,
  SAVE_COLUMNS,
  STATISTICS_COLUMNS
} from "../../../components/gridColumns.ts";
import { createEmptyCounts } from "../../../constants.ts";
import { persistStoredState } from "../../../hooks/usePersistentState.ts";
import { buildAggregateRows, buildStatisticsRows } from "../../../statistics.ts";
import type { IStoredState, TSaveType } from "../../../types.ts";
import { downloadBlob } from "../../../utils/downloadBlob.ts";
import { buildCsvFromColumns } from "../../../utils/exportCsv.ts";
import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { createSaveRecord, createScreenshotFilename } from "../utils/counterRecords.ts";
import { renderElementToPngBlob } from "./saveSnapshot.ts";

/** 只打包 CSV 資料，不含截圖；截圖已由 renderElementToPngBlob() 另外單獨下載，避免重複。 */
async function buildDataOnlyZip(state: IStoredState): Promise<Blob> {
  const zip = new JSZip();

  const countRows = state.records.filter((record) => record.eventType === "count");
  const saveRows = state.records.filter((record) => record.eventType === "save");
  const aggregateRows = buildAggregateRows(state.counts, state.records);
  const statisticsRows = buildStatisticsRows(aggregateRows, state.records, state.roadSection, state.userName);

  zip.file("計數明細.csv", buildCsvFromColumns(COUNT_COLUMNS, countRows));
  zip.file("保存紀錄.csv", buildCsvFromColumns(SAVE_COLUMNS, saveRows));
  zip.file("合計資料.csv", buildCsvFromColumns(AGGREGATE_COLUMNS, aggregateRows));
  zip.file("統計資料.csv", buildCsvFromColumns(STATISTICS_COLUMNS, statisticsRows));

  return zip.generateAsync({ type: "blob" });
}

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

    const latest = getLatestState();
    const completedState: IStoredState = {
      ...latest,
      workingCounts: createEmptyCounts(),
      records: latest.records.map((record) =>
        record.id === saveId ? { ...record, saveStatus: "completed" } : record
      )
    };
    const dataZipBlob = await buildDataOnlyZip(completedState);
    downloadBlob(pngBlob, screenshotFilename);
    // 瀏覽器對「同一頁面連續觸發多個下載」有節流／攔截機制；間隔一小段時間送出第二個下載，
    // 降低被視為一次性多檔下載而被封鎖或跳出「允許多個下載」提示的機率。
    await new Promise((resolve) => window.setTimeout(resolve, 300));
    downloadBlob(dataZipBlob, screenshotFilename.replace(/\.png$/i, "-data.zip"));

    persistStoredState(completedState);
    applyState(completedState);
    return {
      message: `${saveType === "quick_save" ? "Quick Save" : "Auto Save"} 完成：截圖與資料已分別下載，主畫面已歸零`,
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
