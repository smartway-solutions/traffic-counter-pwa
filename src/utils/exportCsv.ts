import type { ColDef, ValueFormatterParams, ValueGetterParams } from "ag-grid-community";

/** 有效防止 CSV 公式注入；與 DataGridPanel 的 processCellCallback 規則一致。 */
function guardFormulaInjection(text: string): string {
  return /^[+\-=@\t\r]/.test(text) ? `'${text}` : text;
}

function csvEscape(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

function resolveCellValue<T>(colDef: ColDef<T>, data: T): unknown {
  if (typeof colDef.valueGetter === "function") {
    return colDef.valueGetter({ data } as ValueGetterParams<T>);
  }
  if (colDef.field) {
    return (data as unknown as Record<string, unknown>)[String(colDef.field)];
  }
  return "";
}

function resolveCellText<T>(colDef: ColDef<T>, data: T): string {
  let value = resolveCellValue(colDef, data);
  if (typeof colDef.valueFormatter === "function") {
    value = colDef.valueFormatter({ value } as ValueFormatterParams<T>);
  }
  const text = value === null || value === undefined ? "" : String(value);
  return guardFormulaInjection(text);
}

/**
 * 不依賴 AG Grid 實例，直接依欄位定義將資料序列化成 CSV。
 * Quick Save／Auto Save 當下匯出頁的 Grid 並未掛載，無法使用 GridApi.getDataAsCsv()。
 */
export function buildCsvFromColumns<T>(columns: ColDef<T>[], rows: T[]): string {
  const headerRow = columns.map((colDef) => csvEscape(colDef.headerName ?? String(colDef.field ?? "")));
  const dataRows = rows.map((row) =>
    columns.map((colDef) => csvEscape(resolveCellText(colDef, row))).join(",")
  );
  return String.fromCharCode(0xfeff) + [headerRow.join(","), ...dataRows].join("\r\n");
}
