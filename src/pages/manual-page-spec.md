# ManualPage 規格（`#/manual`）

## 目的
操作教學頁：每個操作一段「標題＋文字說明＋示範影片」。
是全站唯一**允許垂直自由捲動**的頁面（其餘頁面維持不捲動）。

## 版面
- 頂欄固定：返回鍵（回 `#/`）＋標題「使用手冊」。
- 內容區 `flex: 1` + `overflow-y: auto`（`overscroll-behavior: contain`），
  卡片式章節，`max-width: 480px` 置中。
- 每章節：編號＋標題（subtitle1/900）、文字說明（body2/secondary）、影片。

## 教學影片
- 檔案放在 `public/manual/*.mp4`（H.264；以 Playwright 錄製、ffmpeg 轉檔，
  操作示範使用「博愛路＋王小明」假資料）。
- `<video autoplay loop muted playsinline controls preload="metadata">`。
- **不納入 PWA 預快取**：vite.config workbox `globIgnores: ["manual/**"]`，
  避免大型媒體佔用離線快取；離線時本頁影片無法播放，屬預期行為，
  **內容區頂端有 info Alert 明確告知使用者**。

## 章節（與 `public/manual/` 檔案一一對應）
1. `setup.mp4` 初次進入：作業設定（強制填寫）
2. `count.mp4` 計數 +／−（含 0 下限提示）
3. `export.mp4` 匯出 CSV（含確認 Dialog）
4. `sort.mp4` 表格排序（點欄標題循環：遞增→遞減→取消）
5. `move-column.mp4` 移動欄位（標題列內左右拖曳調整欄序）
6. `hide-column.mp4` 隱藏欄位（拖曳欄標題到表格外）
7. `edit.mp4` 編輯路段／使用者（可取消）
8. `clear.mp4` 清除本機資料（確認後回作業設定）

## 進入方式
主畫面右上「更多」選單 →「使用手冊」；由 `RootLayout` 守衛，未完成設定前不可達。
