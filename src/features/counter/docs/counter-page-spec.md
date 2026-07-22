# CounterPage 規格（`#/`）

## 目的

手機優先、快速人工計數；整頁固定 `100dvh`。

頁面只組合版面；計數互動由 hook 管理，事件建構與 Save 交易分別位於 utils 與 services。

## 布局

- 經典：七車種 2×4／橫向 3×3。
- 清單：1×7。
- 非對稱資訊牆：2 張全寬＋5 張雙欄。
- 錯位鍵盤：2－3－2。
- 車種順序：機車、汽車、公車、大貨車、聯結車、自行車、其他。

## 響應式工學

- `max-width: 370px` 或 `max-height: 680px`：縮小 gap／padding。
- 主要觸控目標至少 44px，底部內容處理 safe-area。

## 計數規則

每次成功操作新增不可變 `ICountRecord`，包含時間、GPS、路段與使用者快照；最多 10,000 筆事件。

- `counts`：全期間累計，Save 不清除。
- `workingCounts`：主畫面工作區，Save 截圖完成後歸零。
- 增加成功：套用 `feedbackSettings.increase`。
- 減少成功：套用 `feedbackSettings.decrease`。
- 工作區為 0 仍減少：不寫入紀錄，套用 `feedbackSettings.negativeError` 並顯示警告。
- 計數或儲存時使用最近一次成功定位；若定位已超過 20 秒，事件的 `gps` 為 `null`。按鈕事件不得直接呼叫 Geolocation API。

## Quick Save／Auto Save

1. 立即把當前狀態與 `save` 事件寫入 LocalStorage，狀態為 `pending`。
2. 產生並下載主畫面 PNG。
3. 截圖完成後，把 Save 狀態改為 `completed`，只清除 `workingCounts`。
4. 截圖失敗則標記 `failed`，不清工作區；Auto Save 失敗時自動關閉開關。

截圖 SVG 使用 data URL 載入，避免含 `foreignObject` 的 `blob:` SVG 污染 Canvas 而使 PNG 匯出失敗。
LocalStorage 寫入失敗也必須結束保存狀態並顯示錯誤；失敗 Save 不作為下一次保存事件數的分界。
頁面重新載入時，無法接續的 `pending` Save 轉為 `failed`，工作區維持原值。

Save 事件包含 `saveType`、`saveId`、狀態、截圖檔名、保存時工作區 JSON 與本次保存的計數事件數。
