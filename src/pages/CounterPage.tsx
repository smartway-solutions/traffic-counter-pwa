import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../appContext.ts";
import { CounterCard } from "../components/CounterCard.tsx";
import { CounterGrid } from "../components/CounterGrid.tsx";
import { CounterHeader } from "../components/CounterHeader.tsx";
import { ThemeDialog } from "../components/ThemeDialog.tsx";
import {
  AUTO_SAVE_INTERVAL_MS,
  createEmptyCounts,
  createInitialState,
  MAX_RECORD_COUNT
} from "../constants.ts";
import { triggerFeedback } from "../feedback.ts";
import { persistStoredState } from "../hooks/usePersistentState.ts";
import { captureElementAsPng } from "../saveSnapshot.ts";
import { getCounterCardVariant, getCounterLayout } from "../themes.ts";
import type {
  ICountRecord,
  IStoredState,
  TCountAction,
  TSaveType,
  TThemeName,
  TVehicleCounts,
  TVehicleType
} from "../types.ts";
import { VEHICLE_TYPES } from "../types.ts";

interface IFeedbackState {
  vehicleType: TVehicleType;
  action: TCountAction;
}

interface INoticeState {
  message: string;
  severity: "success" | "warning";
}

const localTimeFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

function hasWorkingCounts(counts: TVehicleCounts): boolean {
  return VEHICLE_TYPES.some((vehicleType) => counts[vehicleType] > 0);
}

function sanitizeFilenamePart(value: string): string {
  const normalized = value.trim().replaceAll(/[\\/:*?"<>|\s]+/g, "-");
  return normalized === "" ? "未命名" : normalized.slice(0, 50);
}

function createScreenshotFilename(state: IStoredState, saveType: TSaveType, now: Date): string {
  const timestamp = now.toISOString().replaceAll(":", "-").replace(".000Z", "Z");
  return [
    "traffic-counter",
    saveType,
    sanitizeFilenamePart(state.roadSection),
    sanitizeFilenamePart(state.userName),
    timestamp
  ].join("-") + ".png";
}

function countUnsavedRecords(records: ICountRecord[]): number {
  let lastSaveIndex = -1;
  for (let index = records.length - 1; index >= 0; index -= 1) {
    const record = records[index];
    if (record?.eventType === "save" && record.saveStatus === "completed") {
      lastSaveIndex = index;
      break;
    }
  }
  return records.slice(lastSaveIndex + 1).filter((record) => record.eventType === "count").length;
}

export function CounterPage(): React.JSX.Element {
  const { state, setState, geolocation, currentTime } = useAppContext();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<IFeedbackState | null>(null);
  const [notice, setNotice] = useState<INoticeState | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const feedbackTimer = useRef<number | null>(null);
  const captureTargetRef = useRef<HTMLDivElement | null>(null);
  const savingRef = useRef(false);
  const stateRef = useRef(state);
  const saveRef = useRef<(saveType: TSaveType) => Promise<void>>(async () => undefined);
  const layout = getCounterLayout(state.theme);

  stateRef.current = state;

  useEffect(() => {
    if (!state.autoSaveEnabled) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      void saveRef.current("auto_save");
    }, AUTO_SAVE_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [state.autoSaveEnabled]);

  function selectTheme(theme: TThemeName): void {
    setState((previous) => ({ ...previous, theme }));
    setThemeDialogOpen(false);
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

    const currentWorkingCount = snapshot.workingCounts[vehicleType];
    const currentTotalCount = snapshot.counts[vehicleType];
    if (action === "decrease" && currentWorkingCount === 0) {
      void triggerFeedback(snapshot.feedbackSettings.negativeError);
      setNotice({ message: `${vehicleType}工作區已是 0，不能再減少`, severity: "warning" });
      return;
    }

    const delta = action === "increase" ? 1 : -1;
    const now = new Date();
    const record: ICountRecord = {
      id: `${now.getTime()}-${snapshot.records.length + 1}`,
      eventType: "count",
      saveType: null,
      saveId: null,
      saveStatus: null,
      vehicleType,
      action,
      delta,
      countAfter: currentTotalCount + delta,
      workingCountAfter: currentWorkingCount + delta,
      timestampIso: now.toISOString(),
      localTime: localTimeFormatter.format(now),
      gps: geolocation.position,
      roadSection: snapshot.roadSection,
      userName: snapshot.userName,
      screenshotFilename: null,
      savedWorkingCountsJson: null,
      savedRecordCount: null
    };

    const nextState: IStoredState = {
      ...snapshot,
      counts: { ...snapshot.counts, [vehicleType]: currentTotalCount + delta },
      workingCounts: { ...snapshot.workingCounts, [vehicleType]: currentWorkingCount + delta },
      records: [...snapshot.records, record]
    };
    // 同一個 render 週期內連續觸發時也從最新值累加，避免 closure 中的舊 state 覆蓋計數。
    stateRef.current = nextState;
    setState(nextState);
    void triggerFeedback(
      action === "increase"
        ? snapshot.feedbackSettings.increase
        : snapshot.feedbackSettings.decrease
    );
    flash(vehicleType, action);
  }

  async function save(saveType: TSaveType): Promise<void> {
    if (savingRef.current) {
      return;
    }

    const snapshot = stateRef.current;
    if (saveType === "auto_save" && !hasWorkingCounts(snapshot.workingCounts)) {
      return;
    }
    if (snapshot.records.length >= MAX_RECORD_COUNT) {
      setNotice({
        message: "事件資料已達上限，無法新增 Save 事件；請先匯出並清除本機資料",
        severity: "warning"
      });
      return;
    }

    const captureTarget = captureTargetRef.current;
    if (captureTarget === null) {
      setNotice({ message: "找不到主畫面截圖目標。請重新整理後再試。", severity: "warning" });
      return;
    }

    savingRef.current = true;
    setSaving(true);
    const now = new Date();
    const saveId = `${saveType}-${now.getTime()}`;
    const screenshotFilename = createScreenshotFilename(snapshot, saveType, now);
    const saveRecord: ICountRecord = {
      id: saveId,
      eventType: "save",
      saveType,
      saveId,
      saveStatus: "pending",
      vehicleType: null,
      action: null,
      delta: 0,
      countAfter: null,
      workingCountAfter: null,
      timestampIso: now.toISOString(),
      localTime: localTimeFormatter.format(now),
      gps: geolocation.position,
      roadSection: snapshot.roadSection,
      userName: snapshot.userName,
      screenshotFilename,
      savedWorkingCountsJson: JSON.stringify(snapshot.workingCounts),
      savedRecordCount: countUnsavedRecords(snapshot.records)
    };
    const pendingState: IStoredState = {
      ...snapshot,
      records: [...snapshot.records, saveRecord]
    };
    let pendingRecorded = false;

    try {
      // 1. 先把保存事件與當前工作區快照立即寫入本機；此時畫面數字尚未清除。
      // LocalStorage quota 等寫入錯誤也必須進入失敗流程，不能讓 UI 卡在保存中。
      persistStoredState(pendingState);
      pendingRecorded = true;
      stateRef.current = pendingState;
      setState(pendingState);

      // 2. 完成主畫面 PNG 產生與下載動作。
      await captureElementAsPng(captureTarget, screenshotFilename);

      const latest = stateRef.current;
      const nextState: IStoredState = {
        ...latest,
        // 3. 截圖完成後才清除主畫面工作區；累計 counts 與所有原始事件保留。
        workingCounts: createEmptyCounts(),
        records: latest.records.map((record) =>
          record.id === saveId ? { ...record, saveStatus: "completed" } : record
        )
      };

      persistStoredState(nextState);
      stateRef.current = nextState;
      setState(nextState);
      setNotice({
        message: `${saveType === "quick_save" ? "Quick Save" : "Auto Save"} 完成：截圖已下載，主畫面已歸零`,
        severity: "success"
      });
    } catch (error) {
      const latest = pendingRecorded ? stateRef.current : snapshot;
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
        const persistReason =
          persistError instanceof Error ? persistError.message : String(persistError);
        reason = `${reason}；失敗狀態也無法寫入本機：${persistReason}`;
      }
      stateRef.current = failedState;
      setState(failedState);
      setNotice({
        message:
          saveType === "auto_save"
            ? `Auto Save 失敗並已關閉：${reason}`
            : `Quick Save 失敗，主畫面未歸零：${reason}`,
        severity: "warning"
      });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  }

  saveRef.current = save;

  function clearAllData(): void {
    setState(createInitialState());
    setClearDialogOpen(false);
    navigate("/setup", { replace: true });
  }

  return (
    <Box
      ref={captureTargetRef}
      sx={{
        height: "100dvh",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default"
      }}
    >
      <CounterHeader
        roadSection={state.roadSection}
        userName={state.userName}
        currentTime={currentTime}
        geolocation={geolocation}
        themeName={state.theme}
        autoSaveEnabled={state.autoSaveEnabled}
        quickSaveDisabled={saving}
        onQuickSave={() => void save("quick_save")}
        onAutoSaveChange={(autoSaveEnabled) =>
          setState((previous) => ({ ...previous, autoSaveEnabled }))
        }
        onExport={() => navigate("/export")}
        onEditSetup={() => navigate("/setup")}
        onFeedbackSettings={() => navigate("/feedback")}
        onManual={() => navigate("/manual")}
        onChangelog={() => navigate("/changelog")}
        onThemeRequest={() => setThemeDialogOpen(true)}
        onClearRequest={() => setClearDialogOpen(true)}
      />

      <CounterGrid layout={layout}>
        {VEHICLE_TYPES.map((vehicleType, index) => (
          <CounterCard
            key={vehicleType}
            vehicleType={vehicleType}
            count={state.workingCounts[vehicleType]}
            feedback={feedback?.vehicleType === vehicleType ? feedback.action : null}
            variant={getCounterCardVariant(state.theme, index)}
            themeName={state.theme}
            onIncrease={() => count(vehicleType, "increase")}
            onDecrease={() => count(vehicleType, "decrease")}
          />
        ))}
      </CounterGrid>

      <ThemeDialog
        open={themeDialogOpen}
        current={state.theme}
        onClose={() => setThemeDialogOpen(false)}
        onSelect={selectTheme}
      />

      <Snackbar
        open={notice !== null}
        autoHideDuration={2800}
        onClose={() => setNotice(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: "max(8px, env(safe-area-inset-bottom))" }}
      >
        <Alert severity={notice?.severity ?? "warning"} variant="filled" onClose={() => setNotice(null)}>
          {notice?.message}
        </Alert>
      </Snackbar>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>清除本機資料？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這會刪除路段、使用者、Auto Save、震動與音效設定、七種車輛累計、工作區數字與所有事件紀錄，且無法復原。建議先匯出 CSV。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: "max(12px, env(safe-area-inset-bottom))" }}>
          <Button onClick={() => setClearDialogOpen(false)}>取消</Button>
          <Button color="error" variant="contained" onClick={clearAllData}>
            確認清除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
