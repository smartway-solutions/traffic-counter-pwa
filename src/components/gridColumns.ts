import type { ColDef } from "ag-grid-community";
import type { IAggregateRow, ICountRecord, IStatisticsRow } from "../types.ts";

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

// 不使用 pinned：釘選欄會壓縮可捲動視窗，手機上容易看似「捲不動」。
// 原始資料欄位多，靠 AG Grid 內部橫向捲動；合計／統計的 minWidth 控制在手機寬度內。
export const RAW_COLUMNS: ColDef<ICountRecord>[] = [
  { field: "vehicleType", headerName: "車種", minWidth: 90 },
  {
    field: "action",
    headerName: "操作",
    valueFormatter: ({ value }: { value: unknown }) => (value === "increase" ? "增加" : "減少")
  },
  { field: "delta", headerName: "變動", maxWidth: 80 },
  { field: "countAfter", headerName: "操作後計數", minWidth: 110 },
  { field: "localTime", headerName: "時間戳", minWidth: 170 },
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
  { field: "roadSection", headerName: "路段", minWidth: 130 },
  { field: "userName", headerName: "使用者", minWidth: 100 },
  { field: "timestampIso", headerName: "ISO 時間", minWidth: 200 }
];

export const AGGREGATE_COLUMNS: ColDef<IAggregateRow>[] = [
  { field: "vehicleType", headerName: "車種", minWidth: 76 },
  { field: "currentCount", headerName: "合計", minWidth: 64 },
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
