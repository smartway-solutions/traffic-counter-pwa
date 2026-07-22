import type { TFeedbackEvent, TSoundEffect, TVibrationLevel } from "../../../types.ts";

export interface IFeedbackEventDefinition {
  key: TFeedbackEvent;
  title: string;
  description: string;
  color: "success" | "warning" | "error";
}

export const FEEDBACK_EVENT_DEFINITIONS: readonly IFeedbackEventDefinition[] = [
  { key: "increase", title: "計數增加", description: "點擊車種卡片成功加 1 時觸發。", color: "success" },
  { key: "decrease", title: "計數減少", description: "點擊減少按鈕成功減 1 時觸發。", color: "warning" },
  { key: "negativeError", title: "小於 0 錯誤", description: "計數已是 0，仍嘗試減少時觸發。", color: "error" }
];

export const VIBRATION_OPTIONS: readonly { value: TVibrationLevel; label: string }[] = [
  { value: "off", label: "關閉" },
  { value: "light", label: "輕微（18ms）" },
  { value: "medium", label: "中等（48ms）" },
  { value: "strong", label: "強烈（兩段震動）" }
];

export const SOUND_OPTIONS: readonly { value: TSoundEffect; label: string }[] = [
  { value: "off", label: "關閉" },
  { value: "click", label: "短促點擊" },
  { value: "beep", label: "單聲提示" },
  { value: "chime", label: "雙音確認" },
  { value: "warning", label: "低頻警告" }
];
