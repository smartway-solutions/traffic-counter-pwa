# ExportPage 規格（`#/export`）

## 目的

唯一顯示統計的地方（需求：統計資料在匯出時才顯示）。
提供四分頁檢視與 CSV 匯出；主畫面不出現任何統計數字。

## 版面

- `100dvh` flex 直欄、`overflow: hidden`（整頁不捲動；表格內部自行捲動）。
- 頂欄：返回鍵（回 `#/`）、標題「匯出與統計」、右側「匯出 CSV」按鈕。
- 內容：`DataGridPanel`（受控 `view`）撐滿剩餘高度。

## 匯出流程

1. 點「匯出 CSV」→ 開確認 Dialog：顯示目前分頁名稱、筆數，以及 `BrandNotice`。
2. 「確認匯出」→ 以 `exportRequest { view, token }` 觸發 `DataGridPanel` 匯出目前分頁。
3. 「取消」→ 關閉 Dialog，不匯出。

## 資料

- 計數明細只包含 `count` 事件，輸出車種、操作、工作區／累計結果、時間與 GPS。
- 保存紀錄只包含 `save` 事件，輸出保存方式、狀態、本次事件數、七車種工作區快照、截圖檔名與 Save ID。
- 合計資料使用全期間 `counts`，Quick Save／Auto Save 不改變合計。
- `aggregateRows`／`statisticsRows` 由 `statistics.ts` 純函式即時計算。
- 資料來源為 context 的持久化狀態；本頁不寫入狀態。
