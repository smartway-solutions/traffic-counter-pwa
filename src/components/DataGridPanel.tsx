import { Box, Paper, Tab, Tabs } from "@mui/material";
import {
  ClientSideRowModelModule,
  CsvExportModule,
  ModuleRegistry,
  PaginationModule,
  themeQuartz,
  type GridApi,
  type GridReadyEvent
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, type SyntheticEvent } from "react";
import type { IAggregateRow, ICountRecord, IStatisticsRow } from "../types.ts";
import { AGGREGATE_COLUMNS, DEFAULT_COL_DEF, RAW_COLUMNS, STATISTICS_COLUMNS } from "./gridColumns.ts";

ModuleRegistry.registerModules([ClientSideRowModelModule, CsvExportModule, PaginationModule]);

export type TGridView = "raw" | "aggregate" | "statistics";

export interface IExportRequest {
  view: TGridView;
  token: number;
}

export interface IDataGridPanelProps {
  view: TGridView;
  onViewChange: (view: TGridView) => void;
  rawRows: ICountRecord[];
  aggregateRows: IAggregateRow[];
  statisticsRows: IStatisticsRow[];
  exportRequest: IExportRequest | null;
}

const gridTheme = themeQuartz;

function exportGrid(api: GridApi, viewName: TGridView): void {
  api.exportDataAsCsv({
    fileName: `traffic-counter-${viewName}-${new Date().toISOString().replaceAll(":", "-")}.csv`,
    prependContent: "\uFEFF",
    processCellCallback: ({ value }: { value: unknown }) => {
      const text = value === null || value === undefined ? "" : String(value);
      return /^[+\-=@\t\r]/.test(text) ? `'${text}` : text;
    }
  });
}

export function DataGridPanel(props: IDataGridPanelProps): React.JSX.Element {
  const gridApis = useRef<Partial<Record<TGridView, GridApi>>>({});
  const handledExportToken = useRef<number | null>(null);

  useEffect(() => {
    const request = props.exportRequest;
    if (request === null || request.token === handledExportToken.current) {
      return;
    }
    const api = gridApis.current[request.view];
    if (api === undefined) {
      throw new Error(`AG Grid 尚未初始化：${request.view}`);
    }
    handledExportToken.current = request.token;
    exportGrid(api, request.view);
  }, [props.exportRequest]);

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
        <Tab value="raw" label={`原始資料 (${props.rawRows.length})`} />
        <Tab value="aggregate" label="合計資料" />
        <Tab value="statistics" label="統計資料" />
      </Tabs>

      <Box sx={gridBoxSx("raw")}>
        <AgGridReact<ICountRecord>
          theme={gridTheme}
          rowData={props.rawRows}
          columnDefs={RAW_COLUMNS}
          defaultColDef={DEFAULT_COL_DEF}
          getRowId={({ data }: { data: ICountRecord }) => data.id}
          onGridReady={(event: GridReadyEvent) => registerGrid("raw", event)}
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
