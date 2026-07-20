# 手機交通量計數器 PWA（靜態網站 DEMO）

Vite + React + TypeScript + React Router 7（hash 路由）+ Material UI + AG Grid Community + LocalStorage。

**線上 DEMO**：<https://smartway-solutions.github.io/traffic-counter-pwa/>
（push `main` 後由 GitHub Actions 自動建置部署）

## 路由（`createHashRouter`）

| 路徑 | 頁面 | 說明 |
| --- | --- | --- |
| `#/setup` | SetupPage | Dialog 強制填寫路段／使用者，未完成前進不了其他頁 |
| `#/` | CounterPage | 主畫面：六車種單列計數，整頁不捲動 |
| `#/export` | ExportPage | 統計只在這裡顯示；匯出 CSV 前有確認 Dialog（含智財標示） |

## 功能重點

- 手持手機快速計數：卡片直向 2×3、寬螢幕 3×2，每車種專屬配色；卡內名稱靠左、大數字靠右，點整卡 +1、卡內「−」鈕 −1
- 強烈陽光可讀：淺色底＋近黑數字，整卡飽和色閃爍回饋（+1 車種主色／−1 紅）
- 路段／使用者設定完成後在頂欄以純文字顯示，可從漢堡選單重新編輯
- 漢堡選單：匯出與統計、編輯路段／使用者、**清除本機資料**（確認 Dialog）
- GPS 燈號＋文字（非交互）：就緒淺綠、取得中淺黃、**權限未允許淺紅**；GPS 不可用仍可計數
- 資料規模：單人單日上限 **10,000 筆**，達上限拒絕新增並提示先匯出
- CSV：UTF-8 BOM、防公式注入；每筆紀錄含 ISO 時間、GPS 快照、路段／使用者當下值
- 智慧財產權標示（Setup 與匯出 Dialog）：智行股份有限公司 https://www.smartway-solutions-inc.com/

## 規格文件

每個 page／component 旁有對應 `xxx-spec.md`（`src/pages/`、`src/components/`、`src/root-layout-spec.md`）。

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

`dist/` 可部署到任何 HTTPS 靜態網站服務，不需要應用程式後端或資料庫；hash 路由不需要伺服器 rewrite 設定。

## 授權

程式碼以 [Apache License 2.0](./LICENSE) 授權，著作權人為智行股份有限公司（Smartway Solutions Inc.）。

**品牌資產備註**：「智行股份有限公司」名稱、官網網址與品牌圖檔
（`public/company-icon.png`、`public/smartway-icon.png`）為智行股份有限公司之商標／品牌資產，
**不在程式碼授權範圍內**（Apache-2.0 第 6 條亦明文不授予商標權）。
Fork 或再散布本專案時，請替換上述圖檔並移除公司名稱與網址標示。

## 重要限制

1. PWA Service Worker 與手機 GPS 通常要求 HTTPS；`localhost` 是開發例外。
2. 直接以 `file://` 雙擊 `index.html` 不等同於靜態網站部署，PWA 與模組載入不會正常運作。
3. LocalStorage 適合 DEMO 與單日 1 萬筆內的紀錄；更大量應改 IndexedDB。
4. 清除瀏覽器網站資料、無痕模式結束或更換裝置後，資料可能消失；正式作業前應定期匯出 CSV。
