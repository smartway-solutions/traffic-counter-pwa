import { Box, Paper, Tab, Tabs } from "@mui/material";
import {
  ClientSideRowModelModule,
  CsvExportModule,
  ModuleRegistry,
  NumberFilterModule,
  PaginationModule,
  TextFilterModule,
  themeQuartz,
  type CsvExportParams,
  type GridApi,
  type GridReadyEvent
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import JSZip from "jszip";
import { useEffect, useRef, type SyntheticEvent } from "react";
import type { IAggregateRow, ICountRecord, IStatisticsRow } from "../types.ts";
import { downloadBlob } from "../utils/downloadBlob.ts";
import {
  AGGREGATE_COLUMNS,
  COUNT_COLUMNS,
  DEFAULT_COL_DEF,
  SAVE_COLUMNS,
  STATISTICS_COLUMNS
} from "./gridColumns.ts";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  CsvExportModule,
  PaginationModule,
  TextFilterModule,
  NumberFilterModule
]);

export type TGridView = "counts" | "saves" | "aggregate" | "statistics";

export interface IZipExportRequest {
  token: number;
}

export interface IZipExportResult {
  success: boolean;
  message: string;
}

export interface IDataGridPanelProps {
  view: TGridView;
  onViewChange: (view: TGridView) => void;
  countRows: ICountRecord[];
  saveRows: ICountRecord[];
  aggregateRows: IAggregateRow[];
  statisticsRows: IStatisticsRow[];
  zipExportRequest: IZipExportRequest | null;
  onZipExportResult: (result: IZipExportResult) => void;
}

const gridTheme = themeQuartz;
const ALL_VIEWS: TGridView[] = ["counts", "saves", "aggregate", "statistics"];

const csvExportParams: CsvExportParams = {
  prependContent: "\uFEFF",
  processCellCallback: ({ value }: { value: unknown }) => {
    const text = value === null || value === undefined ? "" : String(value);
    return /^[+\-=@\t\r]/.test(text) ? `'${text}` : text;
  }
};

async function exportAllAsZip(gridApis: Partial<Record<TGridView, GridApi>>): Promise<void> {
  const timestamp = new Date().toISOString().replaceAll(":", "-");
  const zip = new JSZip();
  for (const view of ALL_VIEWS) {
    const api = gridApis[view];
    if (api === undefined) {
      throw new Error(`AG Grid 尚未初始化：${view}`);
    }
    const csv = api.getDataAsCsv(csvExportParams) ?? "";
    zip.file(`traffic-counter-${view}-${timestamp}.csv`, csv);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `traffic-counter-all-${timestamp}.zip`);
}

export function DataGridPanel(props: IDataGridPanelProps): React.JSX.Element {
  const gridApis = useRef<Partial<Record<TGridView, GridApi>>>({});
  const handledZipToken = useRef<number | null>(null);

  useEffect(() => {
    const request = props.zipExportRequest;
    if (request === null || request.token === handledZipToken.current) {
      return;
    }
    handledZipToken.current = request.token;
    exportAllAsZip(gridApis.current)
      .then(() => props.onZipExportResult({ success: true, message: "已將所有資料打包為 ZIP 並下載。" }))
      .catch((error: unknown) => {
        props.onZipExportResult({
          success: false,
          message: error instanceof Error ? error.message : String(error)
        });
      });
  }, [props.zipExportRequest]);

  function registerGrid(viewName: TGridView, event: GridReadyEvent): void {
    gridApis.current[viewName] = event.api;
  }

  const gridBoxSx = (viewName: TGridView) =>
    ({
      display: props.view === viewName ? "block" : "none",
      flex: 1,
      minHeight: 0,
      minWidth: 0,
      width: "100%"
    }) as const;

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <Tabs
        value={props.view}
        onChange={(_event: SyntheticEvent, nextView: TGridView) => props.onViewChange(nextView)}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab value="counts" label={`計數明細 (${props.countRows.length})`} />
        <Tab value="saves" label={`保存紀錄 (${props.saveRows.length})`} />
        <Tab value="aggregate" label="合計資料" />
        <Tab value="statistics" label="統計資料" />
      </Tabs>

      <Box sx={gridBoxSx("counts")}>
        <AgGridReact<ICountRecord>
          theme={gridTheme}
          rowData={props.countRows}
          columnDefs={COUNT_COLUMNS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={({ data }: { data: ICountRecord }) => data.id}
          onGridReady={(event: GridReadyEvent) => registerGrid("counts", event)}
          pagination
          paginationPageSize={20}
        />
      </Box>
      <Box sx={gridBoxSx("saves")}>
        <AgGridReact<ICountRecord>
          theme={gridTheme}
          rowData={props.saveRows}
          columnDefs={SAVE_COLUMNS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={({ data }: { data: ICountRecord }) => data.id}
          onGridReady={(event: GridReadyEvent) => registerGrid("saves", event)}
          pagination
          paginationPageSize={20}
        />
      </Box>
      <Box sx={gridBoxSx("aggregate")}>
        <AgGridReact<IAggregateRow>
          theme={gridTheme}
          rowData={props.aggregateRows}
          columnDefs={AGGREGATE_COLUMNS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={({ data }: { data: IAggregateRow }) => data.vehicleType}
          onGridReady={(event: GridReadyEvent) => registerGrid("aggregate", event)}
        />
      </Box>
      <Box sx={gridBoxSx("statistics")}>
        <AgGridReact<IStatisticsRow>
          theme={gridTheme}
          rowData={props.statisticsRows}
          columnDefs={STATISTICS_COLUMNS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={({ data }: { data: IStatisticsRow }) => data.metric}
          onGridReady={(event: GridReadyEvent) => registerGrid("statistics", event)}
        />
      </Box>
    </Paper>
  );
}
