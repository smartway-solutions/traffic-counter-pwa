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
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../appContext.ts";
import { CounterCard } from "../components/CounterCard.tsx";
import { CounterGrid } from "../components/CounterGrid.tsx";
import { CounterHeader } from "../components/CounterHeader.tsx";
import { ThemeDialog } from "../components/ThemeDialog.tsx";
import { createInitialState, MAX_RECORD_COUNT } from "../constants.ts";
import { triggerFeedback } from "../feedback.ts";
import {
  getCounterCardVariant,
  getCounterLayout
} from "../themes.ts";
import type { ICountRecord, TCountAction, TThemeName, TVehicleType } from "../types.ts";
import { VEHICLE_TYPES } from "../types.ts";

interface IFeedbackState {
  vehicleType: TVehicleType;
  action: TCountAction;
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

export function CounterPage(): React.JSX.Element {
  const { state, setState, geolocation, currentTime } = useAppContext();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<IFeedbackState | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const feedbackTimer = useRef<number | null>(null);
  const layout = getCounterLayout(state.theme);

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
    if (state.records.length >= MAX_RECORD_COUNT) {
      setWarning(`已達單日上限 ${MAX_RECORD_COUNT.toLocaleString()} 筆，請先匯出並清除本機資料`);
      return;
    }

    const currentCount = state.counts[vehicleType];
    if (action === "decrease" && currentCount === 0) {
      void triggerFeedback(state.feedbackSettings.negativeError);
      setWarning(`${vehicleType}已是 0，不能再減少`);
      return;
    }

    const delta = action === "increase" ? 1 : -1;
    const now = new Date();
    const record: ICountRecord = {
      id: `${now.getTime()}-${state.records.length + 1}`,
      vehicleType,
      action,
      delta,
      countAfter: currentCount + delta,
      timestampIso: now.toISOString(),
      localTime: localTimeFormatter.format(now),
      gps: geolocation.position,
      roadSection: state.roadSection,
      userName: state.userName
    };

    setState((previous) => ({
      ...previous,
      counts: { ...previous.counts, [vehicleType]: currentCount + delta },
      records: [...previous.records, record]
    }));
    void triggerFeedback(
      action === "increase" ? state.feedbackSettings.increase : state.feedbackSettings.decrease
    );
    flash(vehicleType, action);
  }

  function clearAllData(): void {
    setState(createInitialState());
    setClearDialogOpen(false);
    navigate("/setup", { replace: true });
  }

  return (
    <Box
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
        onExport={() => navigate("/export")}
        onEditSetup={() => navigate("/setup")}
        onFeedbackSettings={() => navigate("/feedback")}
        onManual={() => navigate("/manual")}
        onThemeRequest={() => setThemeDialogOpen(true)}
        onClearRequest={() => setClearDialogOpen(true)}
      />

      <CounterGrid layout={layout}>
        {VEHICLE_TYPES.map((vehicleType, index) => (
          <CounterCard
            key={vehicleType}
            vehicleType={vehicleType}
            count={state.counts[vehicleType]}
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
        open={warning !== null}
        autoHideDuration={2000}
        onClose={() => setWarning(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: "max(8px, env(safe-area-inset-bottom))" }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      </Snackbar>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>清除本機資料？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這會刪除路段、使用者、震動與音效設定、六種車輛合計與所有操作紀錄，且無法復原。建議先匯出 CSV。
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
