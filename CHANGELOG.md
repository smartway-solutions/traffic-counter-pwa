# 0.8.0

## 使用者

- 主畫面的 Quick Save 改為只顯示儲存 icon；截圖產生並觸發下載成功後，以 toast 顯示「Quick Save 完成」。
- 主畫面 Header 移除「交通量計數器」標題並增加垂直空間；第一行顯示時間與使用者，第二行顯示「面向方向｜路段」，較長文字可完整換行、不再以省略號截斷。
- 修正快速交替或雙指同時按壓不同車種時，部分或全部按壓沒有計入的問題；觸控與觸控筆現在會在有效放開時分別計數，取消手勢或滑出按鈕不會誤計。

## 開發者

- 時鐘移出全域 App Context，改由 Header 的獨立子元件每秒更新，避免連帶重新渲染整個路由頁面。
- 車種卡片會分別追蹤觸控與觸控筆的 pointer；只在有效的 `pointerup` 計數，`pointercancel` 或滑出按鈕時取消，並略過後續相容性 `click`。滑鼠與鍵盤仍保留原有 `click` 操作。
- 新增 Playwright E2E 測試，涵蓋快速交替、十次雙指同按、取消與滑出手勢，以及滑鼠與鍵盤操作的計數回歸。

# 0.7.0

## 使用者

- 匯出頁改成先看「保存紀錄」，欄位順序改成狀態、時間戳、七種車輛在前，其他資訊在後。
- 「計數明細」欄位順序改成車種、累計操作後、時間戳在前，其他資訊在後。
- 匯出頁移除「匯出 CSV」單分頁匯出；改成單一「打包下載 ZIP」按鈕，一次把計數明細、保存紀錄、合計資料、統計資料四張表打包成一個 ZIP 下載。
- Quick Save／Auto Save 維持只下載主畫面截圖 PNG（與 0.6.0 相同），考量到手機瀏覽器對連續多檔下載的限制，不與資料表一起打包。
- 作業設定新增「面向方向」欄位：可從常見方向清單直接選，也能自行輸入文字；選填，不影響既有路段／使用者流程。
- 右側功能選單移除頂部「功能／右側 Sheet」提示文字，底部新增「關閉」按鈕。
- 右側功能選單新增「分享 App」，會呼叫手機的分享功能分享安裝連結；不支援分享的瀏覽器會改成複製連結到剪貼簿。
- 修正匯出頁主控台一直出現 AG Grid filter module 錯誤訊息的問題。

## 開發者

- `gridColumns.ts` 的 `COUNT_COLUMNS`／`SAVE_COLUMNS` 欄位順序調整；新增 `facingDirection`（面向方向）欄位。
- `IStoredState`／`ICountRecord` 新增 `facingDirection: string`；`usePersistentState.ts` 對舊資料與畸形資料正規化為空字串。
- 新增 `src/utils/downloadBlob.ts`，`saveSnapshot.ts` 的 `captureElementAsPng()` 改為 `renderElementToPngBlob()` 並回傳 Blob，交由呼叫端下載。
- 新增依賴 `jszip`，僅用於匯出頁「打包下載 ZIP」；Quick Save／Auto Save 未使用。
- `DataGridPanel.tsx` 新增 `zipExportRequest`／`onZipExportResult`，透過既有 GridApi 以 `getDataAsCsv()` 匯出全部四個檢視並打包下載；移除單分頁 `exportRequest` 相關程式碼。
- `ModuleRegistry` 補上 `TextFilterModule`／`NumberFilterModule`，解決 `DEFAULT_COL_DEF` 的 `filter: true` 缺少對應模組的 AG Grid error #200。

# 0.6.0

## 使用者

- 定位改成每分鐘固定六次穩定取樣，不再持續連線 GPS，更省電也更穩定。
- 按下車種按鈕不會額外觸發定位，計數速度不受影響；若最近一次定位已超過 20 秒，仍會完整保存計數，只是該筆事件不含座標。
- 車種按鈕沒有固定冷卻時間，可以快速連續點擊；260ms 只是按鈕的視覺回饋。
- 匯出頁新增「GPS 延遲(秒)」欄位，可以看出座標是幾秒前取得的。
- 修正舊資料或損毀資料可能讓匯出頁顯示錯誤或空白的問題。

## 開發者

- 依 Counter、Feedback、Geolocation feature 重整目錄；頁面只保留佈局，互動 hook、服務、型別與工具各自分層。
- 拆分超過 200 行的 CounterPage、CounterHeader 與 FeedbackSettingsPage；目前所有 TSX 均低於 200 行。
- GPS 改為獨立排程取樣：每分鐘切成六個固定 10 秒視窗，各視窗以節流與 in-flight 防重入最多請求一次 `getCurrentPosition()`；分頁在背景時停止排程，回到前景不補跑錯過的視窗。
- `IGpsSnapshot` 新增 `sampledAtMs` 實際取樣時間欄位；`getFreshGpsSnapshot()` 沿用 20 秒新鮮度視窗，超過即回傳 `null` 且該筆事件 GPS 留空。舊資料無此欄位時正規化為 `null`，不影響相容性。
- `usePersistentState.ts` 新增 GPS 型別守衛，載入時驗證 `latitude`／`longitude`／`accuracyMeters` 是否為 number，避免畸形資料在匯出頁 `.toFixed()` 時拋出例外。

# 0.5.0

## 使用者

- 車種由六種擴充為七種，新增「自行車」；同步更新 10 款主題配色與版面。
- 漢堡選單改為由右側滑出的面板。
- 新增 Auto Save：開啟後每 15 分鐘自動檢查一次，工作區有計數時就會自動保存。
- 頁首新增 Quick Save 按鈕，可手動立即保存並下載畫面截圖。
- 保存完成後主畫面工作區歸零，但累計數字與所有原始紀錄都會完整保留，不受影響。
- 匯出頁的「計數明細」與「保存紀錄」拆成兩張可各自查看／匯出的表格，不再混在同一張稀疏表格。
- 修正部分情況下 Quick Save 截圖失敗、保存卡住、或快速連續點擊可能誤用舊計數的問題。
- App 重新整理後，尚未完成的保存會標示為失敗，但工作區數字仍會保留，不會憑空消失。

## 開發者

- Quick Save／Auto Save 依序執行：寫入含工作區快照的 `pending` Save 事件、下載主畫面 PNG、標記保存完成，再將主畫面工作區計數歸零。
- 原始資料新增 `eventType`、`saveType`、`saveId`、截圖檔名、保存時工作區快照與本次保存事件數。
- Auto Save 截圖失敗時不清零，並關閉 Auto Save，避免瀏覽器持續重試自動下載。
- 修正 Quick Save 截圖使用 `blob:` SVG 時污染 Canvas、造成 PNG 匯出失敗且主畫面無法歸零的問題。
- 修正 LocalStorage 寫入失敗時 Save 卡住、失敗 Save 導致重試事件數低估，以及快速連續點擊可能使用舊計數的問題。
- 應用程式重新載入時，未完成的 `pending` Save 會恢復為 `failed`，並保留工作區數字。
- 定位監聽前先查詢瀏覽器權限；已封鎖時不再重複呼叫 Geolocation API，避免 Strict Mode 造成重複權限警告。
- 新增 `public-meta/README.md`，記錄本次未附上的 `public/` 資產名稱、位置與用途。

# 0.4.0

## 使用者

- 移除橫向滑卡、單車種聚焦、底部拇指操作與小螢幕交錯列，保留 10 款主題。
- 新增獨立的震動與音效設定頁，不受主題切換影響。
- 計數增加、計數減少、小於 0 錯誤可各自設定震動等級與音效。
- 震動提供關閉／輕微／中等／強烈；音效提供關閉／短促點擊／單聲提示／雙音確認／低頻警告。
- 設定頁可立即測試效果，並顯示瀏覽器對震動／音效的支援狀態。
- 若使用舊版已刪除的主題，開啟時會自動改回標準藍白，不會出錯。

## 開發者

- 新增獨立 `#/feedback` 路由頁面，狀態與主題系統分離。
- 舊版已刪除主題的自動遷移邏輯，避免啟動時主題查找例外。

# 0.3.0

## 使用者

- 修正黑白工程、清單大字主題的漢堡按鈕看不清楚的問題。
- 新增非對稱資訊牆與錯位鍵盤版面。
- 新增小螢幕交錯列版面。
- 小螢幕（寬度 ≤370px 或高度 ≤680px）自動改用緊湊間距；主題選擇器窄螢幕改單欄顯示。

## 開發者

- 將計數 Card 圓角與 MUI 全域 shape 分離；Menu／Dialog／Button 使用固定小圓角。
- 所有計數 Card 最大圓角收斂至 12px。
