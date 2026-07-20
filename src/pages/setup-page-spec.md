# SetupPage 規格（`#/setup`）

## 目的
以 **Dialog** 強制填寫「路段」與「使用者」，兩者皆填寫完成前無法進入主畫面。

## 進入條件
- `RootLayout` 守衛：路段或使用者為空白時，任何路徑都會被導向此頁。
- 已完成設定時也可從主畫面選單進入，重新編輯（欄位帶入現值）。

## 行為
- Dialog 常開、不可關閉（無關閉鈕、`disableEscapeKeyDown`）；背景僅顯示 App 名稱。
- 「開始計數」按鈕在兩欄位（trim 後）皆非空前為 disabled。
- 儲存時 trim 後寫入持久化狀態，`navigate("/", { replace: true })`。
- 使用者欄位按 Enter 等同按下「開始計數」。

## 不做的事
- 不顯示統計、不啟動計數；GPS watch 由 RootLayout 持有，與本頁無關。
