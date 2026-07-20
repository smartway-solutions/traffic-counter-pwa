import type { IAggregateRow, ICountRecord, IStatisticsRow, TVehicleCounts } from "./types.ts";
import { VEHICLE_TYPES } from "./types.ts";

export function buildAggregateRows(counts: TVehicleCounts, records: ICountRecord[]): IAggregateRow[] {
  return VEHICLE_TYPES.map((vehicleType) => {
    const typeRecords = records.filter((record) => record.vehicleType === vehicleType);
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
  const totalCount = aggregateRows.reduce((sum, row) => sum + row.currentCount, 0);
  const gpsCount = records.filter((record) => record.gps !== null).length;
  const firstRecord = records.at(0);
  const lastRecord = records.at(-1);
  const busiest = [...aggregateRows].sort((left, right) => right.currentCount - left.currentCount)[0];

  return [
    { metric: "目前車流合計", value: totalCount, note: "六種車輛目前計數總和" },
    { metric: "操作紀錄數", value: records.length, note: "增加與減少操作的事件總數" },
    {
      metric: "GPS 完整率",
      value: records.length === 0 ? "—" : `${((gpsCount / records.length) * 100).toFixed(1)}%`,
      note: `${gpsCount} 筆包含 GPS`
    },
    { metric: "最高車種", value: busiest?.vehicleType ?? "—", note: busiest ? `目前 ${busiest.currentCount} 輛` : "尚無資料" },
    { metric: "首次計數", value: firstRecord?.localTime ?? "—", note: firstRecord?.vehicleType ?? "尚無資料" },
    { metric: "最後計數", value: lastRecord?.localTime ?? "—", note: lastRecord?.vehicleType ?? "尚無資料" },
    { metric: "路段", value: roadSection, note: "匯出資料保留每筆操作當下值" },
    { metric: "使用者", value: userName, note: "匯出資料保留每筆操作當下值" }
  ];
}
