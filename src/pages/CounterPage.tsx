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
import { CounterHeader } from "../components/CounterHeader.tsx";
import { createInitialState, MAX_RECORD_COUNT } from "../constants.ts";
import type { ICountRecord, TCountAction, TVehicleType } from "../types.ts";
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
  const feedbackTimer = useRef<number | null>(null);

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
    flash(vehicleType, action);
  }

  function clearAllData(): void {
    setState(createInitialState());
    setClearDialogOpen(false);
    navigate("/setup", { replace: true });
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <CounterHeader
        roadSection={state.roadSection}
        userName={state.userName}
        currentTime={currentTime}
        geolocation={geolocation}
        onExport={() => navigate("/export")}
        onEditSetup={() => navigate("/setup")}
        onClearRequest={() => setClearDialogOpen(true)}
      />

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))" },
          gridAutoRows: "minmax(0, 1fr)",
          gap: 1,
          p: 1
        }}
      >
        {VEHICLE_TYPES.map((vehicleType) => (
          <CounterCard
            key={vehicleType}
            vehicleType={vehicleType}
            count={state.counts[vehicleType]}
            feedback={feedback?.vehicleType === vehicleType ? feedback.action : null}
            onIncrease={() => count(vehicleType, "increase")}
            onDecrease={() => count(vehicleType, "decrease")}
          />
        ))}
      </Box>

      <Snackbar
        open={warning !== null}
        autoHideDuration={2000}
        onClose={() => setWarning(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="warning" variant="filled" onClose={() => setWarning(null)}>
          {warning}
        </Alert>
      </Snackbar>

      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>清除本機資料？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這會刪除路段、使用者、六種車輛合計與所有操作紀錄，且無法復原。建議先匯出 CSV。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>取消</Button>
          <Button color="error" variant="contained" onClick={clearAllData}>
            確認清除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
