# RootLayout 規格

## 目的
Hash 路由根層：持有 LocalStorage 狀態與 GPS 最近樣本狀態，透過 React Router `Outlet` context 傳給各頁。主畫面時鐘由 Header 的獨立子元件管理，避免每秒更新整個路由內容。

## 路由守衛
- 路段或使用者未完成，且目前不在 `/setup` 時，導向 `/setup`。
- 已完成設定時可再次進入 `/setup` 編輯。

## context
| 欄位 | 說明 |
| --- | --- |
| `state` / `setState` | `IStoredState`，包含主題、震動音效設定、計數與紀錄 |
| `geolocation` | GPS 狀態與位置快照 |

## 主題
- 依 `state.theme` 取得預先快取的 10 款 MUI Theme。
- Dialog、Menu、Button 使用固定小圓角；計數 Card 圓角不寫入全域 shape。
- 震動與音效由 `feedbackSettings` 管理，與主題切換無關。
