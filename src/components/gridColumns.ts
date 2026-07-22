import type { ColDef } from "ag-grid-community";
import type { IAggregateRow, ICountRecord, IStatisticsRow, TVehicleType } from "../types.ts";
import { VEHICLE_TYPES } from "../types.ts";

export const DEFAULT_COL_DEF: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  minWidth: 80,
  flex: 1
};

function getGpsText(record: ICountRecord): string {
  if (record.gps === null) {
    return "未取得";
  }
  return `${record.gps.latitude.toFixed(6)}, ${record.gps.longitude.toFixed(6)}`;
}

/** 事件時間與 GPS 實際取樣時間的差距；用來判斷座標是幾秒前定位的。 */
function getGpsDelaySeconds(record: ICountRecord): number | null {
  if (record.gps === null || record.gps.sampledAtMs === null) {
    return null;
  }
  const eventMs = new Date(record.timestampIso).getTime();
  return Math.max(0, (eventMs - record.gps.sampledAtMs) / 1_000);
}

function getActionLabel(value: unknown): string {
  if (value === "increase") {
    return "增加";
  }
  if (value === "decrease") {
    return "減少";
  }
  return "—";
}

function getSaveTypeLabel(value: unknown): string {
  if (value === "quick_save") {
    return "Quick Save";
  }
  if (value === "auto_save") {
    return "Auto Save";
  }
  return "—";
}

function getSaveStatusLabel(value: unknown): string {
  if (value === "completed") {
    return "完成";
  }
  if (value === "failed") {
    return "失敗";
  }
  if (value === "pending") {
    return "處理中";
  }
  return "—";
}

function getSavedWorkingCount(record: ICountRecord, vehicleType: TVehicleType): number | null {
  if (record.savedWorkingCountsJson === null) {
    return null;
  }
  try {
    const snapshot = JSON.parse(record.savedWorkingCountsJson) as Record<string, unknown>;
    const value = snapshot[vehicleType];
    return typeof value === "number" ? value : null;
  } catch {
    return null;
  }
}

// 不使用 pinned：釘選欄會壓縮可捲動視窗，手機上容易看似「捲不動」。
export const COUNT_COLUMNS: ColDef<ICountRecord>[] = [
  { field: "vehicleType", headerName: "車種", minWidth: 90 },
  {
    field: "action",
    headerName: "操作",
    minWidth: 80,
    valueFormatter: ({ value }: { value: unknown }) => getActionLabel(value)
  },
  { field: "delta", headerName: "變動", maxWidth: 80 },
  { field: "workingCountAfter", headerName: "工作區操作後", minWidth: 125 },
  { field: "countAfter", headerName: "累計操作後", minWidth: 115 },
  { field: "localTime", headerName: "時間戳", minWidth: 170 },
  {
    headerName: "GPS 位置",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => (data ? getGpsText(data) : ""),
    minWidth: 190
  },
  {
    headerName: "精度(m)",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => data?.gps?.accuracyMeters ?? null,
    valueFormatter: ({ value }: { value: unknown }) =>
      typeof value === "number" ? value.toFixed(1) : ""
  },
  {
    headerName: "GPS 延遲(秒)",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => (data ? getGpsDelaySeconds(data) : null),
    valueFormatter: ({ value }: { value: unknown }) =>
      typeof value === "number" ? value.toFixed(1) : "",
    minWidth: 110
  },
  { field: "roadSection", headerName: "路段", minWidth: 130 },
  { field: "userName", headerName: "使用者", minWidth: 100 },
  { field: "id", headerName: "事件 ID", minWidth: 180 },
  { field: "timestampIso", headerName: "ISO 時間", minWidth: 200 }
];

export const SAVE_COLUMNS: ColDef<ICountRecord>[] = [
  {
    field: "saveType",
    headerName: "保存方式",
    minWidth: 112,
    valueFormatter: ({ value }: { value: unknown }) => getSaveTypeLabel(value)
  },
  {
    field: "saveStatus",
    headerName: "狀態",
    minWidth: 90,
    valueFormatter: ({ value }: { value: unknown }) => getSaveStatusLabel(value)
  },
  { field: "savedRecordCount", headerName: "本次保存事件數", minWidth: 135 },
  { field: "localTime", headerName: "時間戳", minWidth: 170 },
  ...VEHICLE_TYPES.map(
    (vehicleType): ColDef<ICountRecord> => ({
      colId: `saved-${vehicleType}`,
      headerName: vehicleType,
      minWidth: 84,
      valueGetter: ({ data }: { data: ICountRecord | undefined }) =>
        data ? getSavedWorkingCount(data, vehicleType) : null
    })
  ),
  { field: "screenshotFilename", headerName: "截圖檔名", minWidth: 260 },
  { field: "saveId", headerName: "Save ID", minWidth: 190 },
  {
    headerName: "GPS 位置",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => (data ? getGpsText(data) : ""),
    minWidth: 190
  },
  {
    headerName: "精度(m)",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => data?.gps?.accuracyMeters ?? null,
    valueFormatter: ({ value }: { value: unknown }) => (typeof value === "number" ? value.toFixed(1) : "")
  },
  {
    headerName: "GPS 延遲(秒)",
    valueGetter: ({ data }: { data: ICountRecord | undefined }) => (data ? getGpsDelaySeconds(data) : null),
    valueFormatter: ({ value }: { value: unknown }) =>
      typeof value === "number" ? value.toFixed(1) : "",
    minWidth: 110
  },
  { field: "roadSection", headerName: "路段", minWidth: 130 },
  { field: "userName", headerName: "使用者", minWidth: 100 },
  { field: "timestampIso", headerName: "ISO 時間", minWidth: 200 }
];

export const AGGREGATE_COLUMNS: ColDef<IAggregateRow>[] = [
  { field: "vehicleType", headerName: "車種", minWidth: 76 },
  { field: "currentCount", headerName: "累計", minWidth: 64 },
  { field: "increases", headerName: "增加", minWidth: 64 },
  { field: "decreases", headerName: "減少", minWidth: 64 },
  { field: "lastCountTime", headerName: "最後計數", minWidth: 100 }
];

export const STATISTICS_COLUMNS: ColDef<IStatisticsRow>[] = [
  { field: "metric", headerName: "統計項目", minWidth: 104 },
  // value 混用數字與字串（%、時間、—），固定文字型別以免 AG Grid 推斷成數字欄
  { field: "value", headerName: "數值", minWidth: 96, cellDataType: "text" },
  { field: "note", headerName: "說明", minWidth: 140, flex: 2 }
];
