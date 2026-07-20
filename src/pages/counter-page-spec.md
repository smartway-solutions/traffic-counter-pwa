# CounterPage 規格（`#/`）

## 目的
手機優先、快速人工計數；整頁固定 `100dvh`。

## 布局
- 經典：2×3／橫向 3×2。
- 清單：1×6。
- 非對稱資訊牆：2 張全寬＋4 張雙欄。
- 錯位鍵盤：2－3－1。

## 響應式工學
- `max-width: 370px` 或 `max-height: 680px`：縮小 gap／padding。
- 主要觸控目標至少 44px，底部內容處理 safe-area。

## 計數規則
每次成功操作新增不可變 `ICountRecord`，包含時間、GPS、路段與使用者快照；最多 10,000 筆。

- 增加成功：套用 `feedbackSettings.increase`。
- 減少成功：套用 `feedbackSettings.decrease`。
- 目前為 0 仍減少：不寫入紀錄，套用 `feedbackSettings.negativeError` 並顯示警告。
