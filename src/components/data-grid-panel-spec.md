# DataGridPanel／gridColumns 規格

## 目的
匯出頁的資料檢視：AG Grid Community 四分頁（計數明細／保存紀錄／合計／統計）。
欄位定義獨立在 `gridColumns.ts`（純資料，無 React），保持元件檔精簡。

## 受控模式
- `view` / `onViewChange` 由父層（ExportPage）持有，Tabs 只回報切換。
- 四個 Grid 同時掛載、以 `display: none` 隱藏非當前分頁，
  保證匯出前 GridApi 已就緒且排序／篩選狀態不因切換遺失。

## 匯出
- 由父層以 `exportRequest: { view, token }` 觸發（token 去重，避免重複匯出）。
- `exportDataAsCsv`：檔名 `traffic-counter-<view>-<ISO時間>.csv`、
  前置 UTF-8 BOM、`processCellCallback` 對 `+ - = @ \t \r` 開頭的值加 `'` 前綴，
  防護試算表公式注入。
- 面板本身**不含匯出按鈕**；匯出入口與確認 Dialog 在 ExportPage。

## 版面
- 根 Paper `flex: 1` + `min-height: 0` + `min-width: 0`，Grid 尺寸由父層 flex 決定，
  配合整頁不捲動；表格內容超寬時由 AG Grid 內部橫向捲動。
- **不使用 pinned 欄**：釘選欄會壓縮可捲動視窗，手機上容易看似捲不動。
- 合計／統計分頁的欄位 `minWidth` 控制在手機直向寬度（~390px）內，不需橫向捲動；
  計數明細／保存紀錄保留稽核欄位，維持表格內部橫向捲動。
- 計數明細與保存紀錄分頁：pagination 每頁 20 筆（事件上限 10,000 筆，單人單日規模）。
