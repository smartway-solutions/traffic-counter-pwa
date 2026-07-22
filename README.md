# 手機交通量計數器 PWA（靜態網站 DEMO）

Vite + React + TypeScript + React Router 7（hash 路由）+ Material UI + AG Grid Community + LocalStorage。

**線上 DEMO**：<https://smartway-solutions.github.io/traffic-counter-pwa/>
（push `main` 後由 GitHub Actions 自動建置部署）

## 路由（`createHashRouter`）

| 路徑 | 頁面 | 說明 |
| --- | --- | --- |
| `#/setup` | SetupPage | 填寫或編輯路段／使用者 |
| `#/` | CounterPage | 七車種手機計數主畫面，固定 `100dvh` |
| `#/feedback` | FeedbackSettingsPage | 獨立設定增加、減少、負數錯誤的震動與音效 |
| `#/export` | ExportPage | AG Grid 計數明細、保存紀錄、合計、統計與 CSV 匯出 |
| `#/manual` | ManualPage | 教學影片與文字說明 |
| `#/changelog` | ChangelogPage | 顯示 `CHANGELOG.md` 版本變更說明 |

## 功能重點

- 手持手機快速計數：點整張車種卡片 +1，卡內小按鈕 −1。
- 每次操作保存車種、增減、操作後數量、ISO 時間、GPS 快照、路段與使用者。
- 路段／使用者、主題、震動音效設定、計數與原始紀錄全部保存在 LocalStorage，不需要應用程式後端。
- 右側 Sheet：Auto Save 開關、匯出與統計、編輯路段／使用者、震動與音效、使用手冊、版本變更說明、更改主題、清除本機資料。
- 10 款手機優先主題；包含七車種網格、七列清單、非對稱資訊牆與 2－3－2 鍵盤。
- Header 提供 Quick Save；右側 Sheet 可切換每 15 分鐘 Auto Save。
- Save 完成截圖下載後只清除主畫面工作區數字，累計與原始事件保持不變。
- GPS 每分鐘切成六個固定 10 秒視窗，每個視窗最多取樣一次；計數只讀 70 秒內快取，不因快速按鍵提高定位頻率。
- GPS 燈號：就緒、取得中、快取逾時、權限未允許；GPS 不可用仍可計數。
- 單人單日上限 10,000 筆；達上限拒絕新增並提示先匯出。
- CSV 使用 UTF-8 BOM 並處理公式注入風險。
- 使用手冊影片位於 `public/manual/`，不納入 PWA 預快取。
- 本次未附上的 `public/` 資產索引見 `public-meta/README.md`。

## 震動與音效

設定完全獨立於主題，分為三種事件：

| 事件 | 預設震動 | 預設音效 |
| --- | --- | --- |
| 計數增加 | 輕微 | 關閉 |
| 計數減少 | 輕微 | 關閉 |
| 小於 0 錯誤 | 輕微 | 低頻警告 |

震動選項：關閉、輕微、中等、強烈兩段。
音效選項：關閉、短促點擊、單聲提示、雙音確認、低頻警告。

設定頁可立即測試，並顯示 Web Vibration 與 Web Audio 支援狀態。iPhone Safari 通常不支援 Web Vibration API；音效也可能受靜音模式、媒體音量及瀏覽器政策限制。

## 主題

| 主題 | 適用情境 | 版面 |
| --- | --- | --- |
| 標準藍白 | 一般用途、清爽卡片 | 2×4／橫向 3×3 |
| 夜間高對比 | 深灰低眩光 | 2×4／橫向 3×3 |
| 清單大字 | 單欄與超大數字 | 1×7 |
| 戶外螢光 | 強日照、高反差 | 2×4／橫向 3×3 |
| 海洋藍綠 | 長時間觀看 | 2×4／橫向 3×3 |
| 暖陽珊瑚 | 暖色辨識 | 2×4／橫向 3×3 |
| 黑白工程 | 工程儀表與紙本表格感 | 2×4／橫向 3×3 |
| 霓虹控制台 | 夜間鮮明辨識 | 2×4／橫向 3×3 |
| 非對稱資訊牆 | 常用車種放大 | 2 張全寬＋5 張雙欄 |
| 錯位鍵盤 | 類大型硬體鍵盤 | 2－3－2 錯位布局 |

已刪除：橫向滑卡、單車種聚焦、底部拇指操作、小螢幕交錯列。舊 LocalStorage 若仍保存已刪除主題，啟動時會自動切回「標準藍白」。

## 手機工學

- 寬度不超過 370px 或高度不超過 680px 時縮小間距，但主要觸控目標仍至少 44px。
- 主題選擇器寬度不超過 360px 時由雙欄切為單欄。
- AppBar 漢堡按鈕使用主題明確前景色與可見邊框。
- MUI 全域圓角固定為 6px；計數 Card 才使用主題專屬圓角，Menu、Dialog、Button 不受影響。
- 固定底部操作列與主要頁面均處理 `env(safe-area-inset-*)`。

## 啟動

```bash
corepack enable
pnpm install
pnpm dev
```

建置靜態網站：

```bash
pnpm build
pnpm preview
```

`dist/` 可部署到任何 HTTPS 靜態網站服務。Hash 路由不需要伺服器 rewrite 設定。

## 程式結構

主要功能採 feature-first 目錄：`src/features/counter`、`src/features/feedback`、`src/features/geolocation`。各 feature 依需要分成 `pages`、`components`、`hooks`、`services`、`types`、`utils` 與 `docs`；頁面元件以布局組合為主，共用主題、持久化與跨功能資料型別留在 `src/` 共用層。

## 授權

程式碼以 [Apache License 2.0](./LICENSE) 授權，著作權人為智行股份有限公司（Smartway Solutions Inc.）。

品牌名稱、官網網址與 `public/company-icon.png`、`public/smartway-icon.png` 不在程式碼授權範圍內。Fork 或再散布時請替換品牌資產並移除公司名稱與網址。

## 重要限制

1. PWA Service Worker 與手機 GPS 通常要求 HTTPS；`localhost` 是開發例外。
2. 直接以 `file://` 開啟 `index.html` 不等同靜態網站部署。
3. LocalStorage 適合 DEMO 與單日 1 萬筆內紀錄；更大量應改用 IndexedDB。
4. 清除瀏覽器網站資料、無痕模式結束或更換裝置後，資料可能消失；正式作業應定期匯出 CSV。
