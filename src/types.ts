export const VEHICLE_TYPES = [
  "機車",
  "汽車",
  "公車",
  "大貨車",
  "聯結車",
  "自行車",
  "其他"
] as const;

export type TVehicleType = (typeof VEHICLE_TYPES)[number];
export type TCountAction = "increase" | "decrease";
export type TRecordEventType = "count" | "save";
export type TSaveType = "quick_save" | "auto_save";
export type TSaveStatus = "pending" | "completed" | "failed";
export type TFeedbackEvent = "increase" | "decrease" | "negativeError";
export type TVibrationLevel = "off" | "light" | "medium" | "strong";
export type TSoundEffect = "off" | "click" | "beep" | "chime" | "warning";

export interface IGpsSnapshot {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}

/**
 * 原始事件列。count 與 save 共用同一張事件表，避免 Save 只存在 UI 而無法稽核。
 * save 事件不代表車種增減，因此車種、操作與計數欄位為 null。
 */
export interface ICountRecord {
  id: string;
  eventType: TRecordEventType;
  saveType: TSaveType | null;
  saveId: string | null;
  saveStatus: TSaveStatus | null;
  vehicleType: TVehicleType | null;
  action: TCountAction | null;
  delta: 1 | -1 | 0;
  /** 全期間累計值；save 事件為 null。 */
  countAfter: number | null;
  /** 主畫面工作區值；Save 完成後歸零，save 事件為 null。 */
  workingCountAfter: number | null;
  timestampIso: string;
  localTime: string;
  gps: IGpsSnapshot | null;
  roadSection: string;
  userName: string;
  screenshotFilename: string | null;
  savedWorkingCountsJson: string | null;
  savedRecordCount: number | null;
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
  autoSaveEnabled: boolean;
  /** 全期間累計，Quick Save／Auto Save 不清除。 */
  counts: TVehicleCounts;
  /** 主畫面工作區，Save 截圖完成後歸零。 */
  workingCounts: TVehicleCounts;
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
