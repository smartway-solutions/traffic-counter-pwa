# ThemeDialog 規格

## 目的
主題選擇 Dialog（漢堡選單「更改主題」開啟），手機優先：
每個選項是整列大觸控目標（`py: 1.5`），點選即套用並由父層關閉。

## 內容
- 清單來源 `THEME_OPTIONS`（見 `src/themes-spec.md`）：
  預設主題／夜間高對比／清單大字。
- 每列：主題名稱（粗體）＋一行說明；目前主題以 `selected` 樣式標示並顯示勾勾。

## Props
| 名稱 | 說明 |
| --- | --- |
| `open` / `onClose` | 開關；點背景或 Esc 可關閉（非強制性選擇） |
| `current` | 目前主題（打勾與 selected 樣式） |
| `onSelect(theme)` | 點選主題：父層寫入 `state.theme` 並關閉 Dialog |

## 行為
- 選擇立即生效（MUI ThemeProvider 隨 `state.theme` 重建），無需確認步驟。
- 主題持久化在 LocalStorage；清除本機資料會重設回預設主題。
