import type { Dispatch, RefObject, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { AUTO_SAVE_INTERVAL_MS, MAX_RECORD_COUNT } from "../../../constants.ts";
import type { IStoredState, TCountAction, TSaveType, TVehicleType } from "../../../types.ts";
import { triggerFeedback } from "../../feedback/services/feedback.ts";
import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { saveCounterSnapshot, type ICounterNotice } from "../services/counterSave.ts";
import { createCountRecord, hasWorkingCounts } from "../utils/counterRecords.ts";

export interface ICounterFeedback {
  vehicleType: TVehicleType;
  action: TCountAction;
}

interface IUseCounterControllerOptions {
  state: IStoredState;
  setState: Dispatch<SetStateAction<IStoredState>>;
  geolocation: IGeolocationState;
  captureTargetRef: RefObject<HTMLDivElement | null>;
}

export function useCounterController(options: IUseCounterControllerOptions) {
  const { state, setState, geolocation, captureTargetRef } = options;
  const [feedback, setFeedback] = useState<ICounterFeedback | null>(null);
  const [notice, setNotice] = useState<ICounterNotice | null>(null);
  const [saving, setSaving] = useState(false);
  const feedbackTimer = useRef<number | null>(null);
  const savingRef = useRef(false);
  const stateRef = useRef(state);
  const saveRef = useRef<(saveType: TSaveType) => Promise<void>>(async () => undefined);
  stateRef.current = state;

  useEffect(() => {
    if (!state.autoSaveEnabled) {
      return undefined;
    }
    const intervalId = window.setInterval(() => void saveRef.current("auto_save"), AUTO_SAVE_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [state.autoSaveEnabled]);

  useEffect(() => () => {
    if (feedbackTimer.current !== null) window.clearTimeout(feedbackTimer.current);
  }, []);

  function applyState(nextState: IStoredState): void {
    stateRef.current = nextState;
    setState(nextState);
  }

  function flash(vehicleType: TVehicleType, action: TCountAction): void {
    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current);
    }
    setFeedback({ vehicleType, action });
    feedbackTimer.current = window.setTimeout(() => setFeedback(null), 260);
  }

  function count(vehicleType: TVehicleType, action: TCountAction): void {
    if (savingRef.current) {
      setNotice({ message: "正在保存與截圖，完成前暫停計數", severity: "warning" });
      return;
    }
    const snapshot = stateRef.current;
    if (snapshot.records.length >= MAX_RECORD_COUNT) {
      setNotice({
        message: `已達單日上限 ${MAX_RECORD_COUNT.toLocaleString()} 筆，請先匯出並清除本機資料`,
        severity: "warning"
      });
      return;
    }
    if (action === "decrease" && snapshot.workingCounts[vehicleType] === 0) {
      void triggerFeedback(snapshot.feedbackSettings.negativeError);
      setNotice({ message: `${vehicleType}工作區已是 0，不能再減少`, severity: "warning" });
      return;
    }

    const record = createCountRecord(snapshot, geolocation, vehicleType, action);
    const nextState: IStoredState = {
      ...snapshot,
      counts: { ...snapshot.counts, [vehicleType]: record.countAfter },
      workingCounts: { ...snapshot.workingCounts, [vehicleType]: record.workingCountAfter },
      records: [...snapshot.records, record]
    };
    applyState(nextState);
    void triggerFeedback(
      action === "increase" ? snapshot.feedbackSettings.increase : snapshot.feedbackSettings.decrease
    );
    flash(vehicleType, action);
  }

  async function save(saveType: TSaveType): Promise<void> {
    if (savingRef.current) return;
    const snapshot = stateRef.current;
    if (saveType === "auto_save" && !hasWorkingCounts(snapshot.workingCounts)) return;
    if (snapshot.records.length >= MAX_RECORD_COUNT) {
      setNotice({
        message: "事件資料已達上限，無法新增 Save 事件；請先匯出並清除本機資料",
        severity: "warning"
      });
      return;
    }
    if (captureTargetRef.current === null) {
      setNotice({ message: "找不到主畫面截圖目標。請重新整理後再試。", severity: "warning" });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    try {
      setNotice(await saveCounterSnapshot({
        saveType,
        snapshot,
        geolocation,
        captureTarget: captureTargetRef.current,
        getLatestState: () => stateRef.current,
        applyState
      }));
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  saveRef.current = save;
  return { feedback, notice, setNotice, saving, count, save };
}
