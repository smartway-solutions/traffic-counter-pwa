# BrandNotice 規格

## 目的
智慧財產權標示。左側為公司圖示 `public/company-icon.png`（28×28、`object-fit: contain`，
僅引用檔案、不做圖像處理），右側固定為兩行：

1. `智慧財產權標示：智行股份有限公司`（純文字）
2. `https://www.smartway-solutions-inc.com/`——**可點擊 Link**（`target="_blank"`
   ＋ `rel="noopener noreferrer"`），顯示文字仍為網址原文。

## 出現位置
- `SetupPage` 的作業設定 Dialog 底部（填寫路段／使用者時可見）。
- `ExportPage` 匯出 CSV 的確認 Dialog 底部。

## 樣式
- `caption`、`text.secondary`，網址 `word-break: break-all` 避免小螢幕溢出。
- 純顯示，無互動。公司名稱與網址以具名常數輸出，供其他模組引用。
