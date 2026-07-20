export const VEHICLE_TYPES = [
  "機車",
  "汽車",
  "公車",
  "大貨車",
  "聯結車",
  "其他"
] as const;

export type TVehicleType = (typeof VEHICLE_TYPES)[number];
export type TCountAction = "increase" | "decrease";

export interface IGpsSnapshot {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}

export interface ICountRecord {
  id: string;
  vehicleType: TVehicleType;
  action: TCountAction;
  delta: 1 | -1;
  countAfter: number;
  timestampIso: string;
  localTime: string;
  gps: IGpsSnapshot | null;
  roadSection: string;
  userName: string;
}

export type TVehicleCounts = Record<TVehicleType, number>;

export interface IStoredState {
  roadSection: string;
  userName: string;
  counts: TVehicleCounts;
  records: ICountRecord[];
}

export interface IAggregateRow {
  vehicleType: TVehicleType;
  currentCount: number;
  increases: number;
  decreases: number;
  lastCountTime: string;
}

export interface IStatisticsRow {
  metric: string;
  value: string | number;
  note: string;
}
