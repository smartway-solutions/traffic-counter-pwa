# themes 規格

## 目的
主題模組同時管理配色與計數布局。主題名稱存於 `state.theme`，由 `RootLayout` 套用 MUI ThemeProvider。震動與音效不在主題模組內，避免切換視覺主題時連帶改變操作回饋。

## 11 個主題

### 經典布局
`default`、`dark`、`field`、`ocean`、`sunset`、`mono`、`neon` 使用手機 2×3；寬度至少 680px 且橫向時切換 3×2。`list` 使用 1×6。

### 特殊布局
| name | 標籤 | 版面 | 工學目的 |
| --- | --- | --- | --- |
| `mosaic` | 非對稱資訊牆 | 2 張全寬＋4 張雙欄 | 常用車種優先 |
| `keypad` | 錯位鍵盤 | 2－3－1 | 類硬體按鍵辨識 |

`swipe`、`focus`、`thumb` 已刪除。`isThemeName()` 用於 LocalStorage 遷移，遇到已刪除或未知主題時回復 `default`。

## 圓角隔離
- MUI `shape.borderRadius` 固定為 6px。
- Menu 4px、Dialog 8px、一般 Button／IconButton 6px。
- `cardRadius` 僅由 `CounterCard` 讀取，不寫入全域 MUI shape。

## AppBar 對比
`getAppBarVisual(name)` 回傳背景、文字與分隔線；漢堡 icon 使用明確色值與半透明邊框。

## 手機優先規則
- 主畫面固定 `100dvh`，不產生垂直捲動。
- 寬度 ≤370px 或高度 ≤680px 時壓縮 gap／padding。
- 所有主要操作目標至少 44px。
- 主題選擇器手機全螢幕；寬度 ≤360px 時改為單欄。
- 內容處理 `env(safe-area-inset-*)`。

## 匯出 API
- `THEME_OPTIONS`
- `isThemeName(value)`
- `buildMuiTheme(name)`
- `isDarkTheme(name)`
- `getCounterLayout(name)`
- `getCounterCardVisual(name, vehicleType)`
- `getAppBarVisual(name)`
- `getCounterCardVariant(name, index)`
