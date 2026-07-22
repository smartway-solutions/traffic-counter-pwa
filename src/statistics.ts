import type { IAggregateRow, ICountRecord, IStatisticsRow, TVehicleCounts } from "./types.ts";
import { VEHICLE_TYPES } from "./types.ts";

function getCountRecords(records: ICountRecord[]): ICountRecord[] {
  return records.filter((record) => record.eventType === "count");
}

export function buildAggregateRows(counts: TVehicleCounts, records: ICountRecord[]): IAggregateRow[] {
  const countRecords = getCountRecords(records);
  return VEHICLE_TYPES.map((vehicleType) => {
    const typeRecords = countRecords.filter((record) => record.vehicleType === vehicleType);
    return {
      vehicleType,
      currentCount: counts[vehicleType],
      increases: typeRecords.filter((record) => record.action === "increase").length,
      decreases: typeRecords.filter((record) => record.action === "decrease").length,
      lastCountTime: typeRecords.at(-1)?.localTime ?? "—"
    };
  });
}

export function buildStatisticsRows(
  aggregateRows: IAggregateRow[],
  records: ICountRecord[],
  roadSection: string,
  userName: string
): IStatisticsRow[] {
  const countRecords = getCountRecords(records);
  const saveRecords = records.filter((record) => record.eventType === "save");
  const totalCount = aggregateRows.reduce((sum, row) => sum + row.currentCount, 0);
  const gpsCount = countRecords.filter((record) => record.gps !== null).length;
  const firstRecord = countRecords.at(0);
  const lastRecord = countRecords.at(-1);
  const busiest =
    totalCount === 0
      ? undefined
      : [...aggregateRows].sort((left, right) => right.currentCount - left.currentCount)[0];

  return [
    { metric: "累計車流合計", value: totalCount, note: "七種車輛全期間累計；Save 不清除" },
    { metric: "計數事件數", value: countRecords.length, note: "增加與減少操作的事件總數" },
    { metric: "保存事件數", value: saveRecords.length, note: "Quick Save 與 Auto Save 的事件總數" },
    {
      metric: "GPS 完整率",
      value:
        countRecords.length === 0
          ? "—"
          : `${((gpsCount / countRecords.length) * 100).toFixed(1)}%`,
      note: `${gpsCount} 筆計數事件包含 GPS`
    },
    {
      metric: "最高車種",
      value: busiest?.vehicleType ?? "—",
      note: busiest ? `累計 ${busiest.currentCount} 輛` : "尚無資料"
    },
    {
      metric: "首次計數",
      value: firstRecord?.localTime ?? "—",
      note: firstRecord?.vehicleType ?? "尚無資料"
    },
    {
      metric: "最後計數",
      value: lastRecord?.localTime ?? "—",
      note: lastRecord?.vehicleType ?? "尚無資料"
    },
    { metric: "路段", value: roadSection, note: "匯出資料保留每筆事件當下值" },
    { metric: "使用者", value: userName, note: "匯出資料保留每筆事件當下值" }
  ];
}
