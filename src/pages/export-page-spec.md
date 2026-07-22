# ExportPage 規格（`#/export`）

## 目的

唯一顯示統計的地方（需求：統計資料在匯出時才顯示）。
提供四分頁檢視與 ZIP 打包匯出；主畫面不出現任何統計數字。

## 版面

- `100dvh` flex 直欄、`overflow: hidden`（整頁不捲動；表格內部自行捲動）。
- 頂欄：返回鍵（回 `#/`）、標題「匯出與統計」、右側「打包下載 ZIP」按鈕。
- 內容：`DataGridPanel`（受控 `view`）撐滿剩餘高度。
- 預設分頁為「保存紀錄」。

## 匯出流程

1. 點「打包下載 ZIP」→ 以 `zipExportRequest { token }` 觸發 `DataGridPanel` 依序取得四個分頁的 CSV（`GridApi.getDataAsCsv()`）。
2. 全部取得後打包成單一 ZIP 並下載；完成或失敗都會用底部 Snackbar 顯示結果。
3. 沒有單分頁 CSV 匯出功能；四張表一律一起打包，避免使用者只匯出片段資料。

## 資料

- 計數明細只包含 `count` 事件，輸出車種、操作、工作區／累計結果、時間與 GPS。
- 保存紀錄只包含 `save` 事件，輸出保存方式、狀態、本次事件數、七車種工作區快照、截圖檔名與 Save ID。
- 合計資料使用全期間 `counts`，Quick Save／Auto Save 不改變合計。
- `aggregateRows`／`statisticsRows` 由 `statistics.ts` 純函式即時計算。
- 資料來源為 context 的持久化狀態；本頁不寫入狀態。
