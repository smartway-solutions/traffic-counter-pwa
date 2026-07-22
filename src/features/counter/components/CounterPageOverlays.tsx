import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar
} from "@mui/material";
import { ThemeDialog } from "../../../components/ThemeDialog.tsx";
import type { TThemeName } from "../../../types.ts";
import type { ICounterNotice } from "../services/counterSave.ts";

interface ICounterPageOverlaysProps {
  themeDialogOpen: boolean;
  clearDialogOpen: boolean;
  currentTheme: TThemeName;
  notice: ICounterNotice | null;
  onThemeClose: () => void;
  onThemeSelect: (theme: TThemeName) => void;
  onClearClose: () => void;
  onClearConfirm: () => void;
  onNoticeClose: () => void;
}

export function CounterPageOverlays(props: ICounterPageOverlaysProps): React.JSX.Element {
  return (
    <>
      <ThemeDialog
        open={props.themeDialogOpen}
        current={props.currentTheme}
        onClose={props.onThemeClose}
        onSelect={props.onThemeSelect}
      />
      <Snackbar
        open={props.notice !== null}
        autoHideDuration={2800}
        onClose={props.onNoticeClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: "max(8px, env(safe-area-inset-bottom))" }}
      >
        <Alert
          severity={props.notice?.severity ?? "warning"}
          variant="filled"
          onClose={props.onNoticeClose}
        >
          {props.notice?.message}
        </Alert>
      </Snackbar>
      <Dialog open={props.clearDialogOpen} onClose={props.onClearClose} fullWidth maxWidth="xs">
        <DialogTitle>清除本機資料？</DialogTitle>
        <DialogContent>
          <DialogContentText>
            這會刪除路段、使用者、Auto Save、震動與音效設定、七種車輛累計、工作區數字與所有事件紀錄，且無法復原。建議先匯出 CSV。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pb: "max(12px, env(safe-area-inset-bottom))" }}>
          <Button onClick={props.onClearClose}>取消</Button>
          <Button color="error" variant="contained" onClick={props.onClearConfirm}>確認清除</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
