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
export type TFeedbackEvent = "increase" | "decrease" | "negativeError";
export type TVibrationLevel = "off" | "light" | "medium" | "strong";
export type TSoundEffect = "off" | "click" | "beep" | "chime" | "warning";

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

export interface IFeedbackEventConfig {
  vibration: TVibrationLevel;
  sound: TSoundEffect;
}

export interface IFeedbackSettings {
  increase: IFeedbackEventConfig;
  decrease: IFeedbackEventConfig;
  negativeError: IFeedbackEventConfig;
}

export type TVehicleCounts = Record<TVehicleType, number>;

export type TThemeName =
  | "default"
  | "dark"
  | "list"
  | "field"
  | "ocean"
  | "sunset"
  | "mono"
  | "neon"
  | "mosaic"
  | "keypad";

export interface IStoredState {
  roadSection: string;
  userName: string;
  theme: TThemeName;
  feedbackSettings: IFeedbackSettings;
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
