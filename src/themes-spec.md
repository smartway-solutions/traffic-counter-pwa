# themes 規格

## 目的
主題定義模組（純資料＋工廠函式，無 React 元件）。
主題選擇存於持久化狀態 `state.theme`，由 `RootLayout` 套用 MUI ThemeProvider。

## 三個主題（手機優先）
| name | 標籤 | MUI palette | 計數版面 |
| --- | --- | --- | --- |
| `default` | 預設主題 | 淺色（白底近黑字） | 卡片格：直向 2×3、sm+ 3×2 |
| `dark` | 夜間高對比 | 深色（`#0f1115` 底）減少夜間眩光 | 卡片格（深色配色） |
| `list` | 清單大字 | 淺色（同 default） | **單欄清單**：一列一車種、數字最大化 |

## 匯出 API
- `THEME_OPTIONS`：選單顯示用（name／label／description）。
- `buildMuiTheme(name)`：回傳快取的 MUI Theme（light／dark 兩份實例）。
- `isDarkTheme(name)`：CounterCard 選擇深色配色用。
- `getCounterLayout(name)`：`"grid" | "list"`，CounterPage 依此切換容器版面。

## 相容性
- 舊版 LocalStorage 資料無 `theme` 欄位：`usePersistentState` 讀取時以
  `createInitialState()` 墊底合併，自動補 `"default"`。
- 清除本機資料會一併重設主題（回預設）。
- 匯出頁 AG Grid 維持淺色主題，不隨深色主題切換（示範範圍外）。
