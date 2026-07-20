# RootLayout 規格

## 目的
Hash 路由的根層：持有全域狀態（LocalStorage 持久化狀態、GPS watch、每秒時鐘），
透過 React Router `Outlet` context 傳給各頁，並實作進入守衛。

## 路由守衛
- `isSetupComplete`（路段與使用者皆為非空白字串）為 false 且目前不在 `/setup` 時，
  一律 `<Navigate to="/setup" replace />`。
- 已完成設定時允許再次進入 `/setup`（重新編輯）。

## 提供的 context（`useAppContext()` 取用）
| 欄位 | 說明 |
| --- | --- |
| `state` / `setState` | LocalStorage 持久化的 `IStoredState` |
| `geolocation` | GPS 狀態（status / message / position 快照） |
| `currentTime` | 每秒更新的本地時間字串 |

## 主題
- 依 `state.theme` 以 `buildMuiTheme` 建立 MUI Theme，
  ThemeProvider＋CssBaseline 包住整個 Outlet（含 Navigate 分支）。

## 限制
- 除 ThemeProvider 外不渲染任何 UI，只做守衛與 context 供應，保持檔案精簡。
