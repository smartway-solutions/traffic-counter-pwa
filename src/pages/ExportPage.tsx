import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";
import FolderZipRoundedIcon from "@mui/icons-material/FolderZipRounded";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Toolbar,
  Typography
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../appContext.ts";
import { BrandNotice } from "../components/BrandNotice.tsx";
import {
  DataGridPanel,
  type IExportRequest,
  type IZipExportRequest,
  type IZipExportResult,
  type TGridView
} from "../components/DataGridPanel.tsx";
import { buildAggregateRows, buildStatisticsRows } from "../statistics.ts";

const VIEW_LABELS: Record<TGridView, string> = {
  counts: "計數明細",
  saves: "保存紀錄",
  aggregate: "合計資料",
  statistics: "統計資料"
};

export function ExportPage(): React.JSX.Element {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const [view, setView] = useState<TGridView>("saves");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [exportRequest, setExportRequest] = useState<IExportRequest | null>(null);
  const [zipExportRequest, setZipExportRequest] = useState<IZipExportRequest | null>(null);
  const [zipping, setZipping] = useState(false);
  const [zipResult, setZipResult] = useState<IZipExportResult | null>(null);

  const aggregateRows = useMemo(
    () => buildAggregateRows(state.counts, state.records),
    [state.counts, state.records]
  );
  const countRows = useMemo(
    () => state.records.filter((record) => record.eventType === "count"),
    [state.records]
  );
  const saveRows = useMemo(
    () => state.records.filter((record) => record.eventType === "save"),
    [state.records]
  );
  const statisticsRows = useMemo(
    () => buildStatisticsRows(aggregateRows, state.records, state.roadSection, state.userName),
    [aggregateRows, state.records, state.roadSection, state.userName]
  );

  function confirmExport(): void {
    setExportRequest({ view, token: Date.now() });
    setConfirmOpen(false);
  }

  function downloadZip(): void {
    setZipping(true);
    setZipExportRequest({ token: Date.now() });
  }

  function handleZipResult(result: IZipExportResult): void {
    setZipping(false);
    setZipResult(result);
  }

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AppBar position="static" elevation={1} color="inherit">
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <IconButton aria-label="返回計數畫面" edge="start" onClick={() => navigate("/")}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={900} sx={{ flex: 1 }} noWrap>
            匯出與統計
          </Typography>
          <Button
            variant="outlined"
            startIcon={<FolderZipRoundedIcon />}
            onClick={downloadZip}
            disabled={zipping}
          >
            {zipping ? "打包中…" : "打包下載 ZIP"}
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadRoundedIcon />}
            onClick={() => setConfirmOpen(true)}
          >
            匯出 CSV
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", p: 1 }}>
        <DataGridPanel
          view={view}
          onViewChange={setView}
          countRows={countRows}
          saveRows={saveRows}
          aggregateRows={aggregateRows}
          statisticsRows={statisticsRows}
          exportRequest={exportRequest}
          zipExportRequest={zipExportRequest}
          onZipExportResult={handleZipResult}
        />
      </Box>

      <Snackbar
        open={zipResult !== null}
        autoHideDuration={3200}
        onClose={() => setZipResult(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={zipResult?.success ? "success" : "warning"}
          variant="filled"
          onClose={() => setZipResult(null)}
        >
          {zipResult?.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle fontWeight={900}>匯出 CSV</DialogTitle>
        <DialogContent>
          <DialogContentText>
            將匯出「{VIEW_LABELS[view]}」為 UTF-8（含 BOM）CSV，
            共 {view === "counts"
              ? countRows.length
              : view === "saves"
                ? saveRows.length
                : view === "aggregate"
                  ? aggregateRows.length
                  : statisticsRows.length} 筆。
          </DialogContentText>
          <BrandNotice />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>取消</Button>
          <Button variant="contained" startIcon={<FileDownloadRoundedIcon />} onClick={confirmExport}>
            確認匯出
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
