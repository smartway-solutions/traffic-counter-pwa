# `public/` 現況索引

> 本次交付刻意不包含 `public/`。下列清單依目前程式碼、Vite PWA 設定與規格文件推導；未實際檢查檔案內容、尺寸與編碼。請保留原專案中的同名檔案，不要以空白檔案代替。

| 檔案名稱 | 預期位置 | 用途 | 目前程式引用 |
| --- | --- | --- | --- |
| `smartway-icon.png` | `public/smartway-icon.png` | 網站 favicon、Apple Touch Icon、PWA 192×192／maskable 圖示 | `index.html`、`vite.config.ts` |
| `company-icon.png` | `public/company-icon.png` | CSV 匯出確認視窗中的公司品牌圖示 | `src/components/BrandNotice.tsx` |
| `setup.mp4` | `public/manual/setup.mp4` | 使用手冊：初次作業設定 | `src/pages/ManualPage.tsx` |
| `count.mp4` | `public/manual/count.mp4` | 使用手冊：車種加一／減一 | `src/pages/ManualPage.tsx` |
| `export.mp4` | `public/manual/export.mp4` | 使用手冊：CSV 匯出流程 | `src/pages/ManualPage.tsx` |
| `sort.mp4` | `public/manual/sort.mp4` | 使用手冊：AG Grid 排序 | `src/pages/ManualPage.tsx` |
| `move-column.mp4` | `public/manual/move-column.mp4` | 使用手冊：移動欄位 | `src/pages/ManualPage.tsx` |
| `hide-column.mp4` | `public/manual/hide-column.mp4` | 使用手冊：隱藏欄位 | `src/pages/ManualPage.tsx` |
| `edit.mp4` | `public/manual/edit.mp4` | 使用手冊：編輯路段／使用者 | `src/pages/ManualPage.tsx` |
| `clear.mp4` | `public/manual/clear.mp4` | 使用手冊：清除本機資料 | `src/pages/ManualPage.tsx` |

## 目錄用途

- `public/`：Vite 原樣複製的靜態資產根目錄。
- `public/manual/`：教學影片；目前由 Workbox `globIgnores: ["manual/**"]` 排除，不納入 PWA 預快取。
- 本次新增的 Quick Save／Auto Save 截圖由瀏覽器即時產生並下載，不需要新增 `public/` 圖片。
