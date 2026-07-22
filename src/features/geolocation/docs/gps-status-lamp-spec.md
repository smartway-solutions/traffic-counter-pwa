# GpsStatusLamp 規格

## 目的
以「燈號圓點 + 說明文字」呈現 GPS 狀態。純顯示元件，**不可交互**。
（`pointerEvents: none`，無點擊行為），GPS 不可用時使用者仍可繼續計數。

## Props
| 名稱 | 型別 | 說明 |
| --- | --- | --- |
| `status` | `TGeolocationStatus` | `ready / requesting / denied / error / unsupported` |
| `message` | `string` | 顯示文字，例如「GPS ±12m」「GPS 權限未允許」 |

## 配色（強烈陽光下仍可識別：淺色底 + 深色字 + 飽和燈點）
| 狀態 | 底色 | 燈點 | 意義 |
| --- | --- | --- | --- |
| `ready` | 淺綠 `#e6f4ea` | 綠 `#188038` | GPS 就緒（含精度）或使用 70 秒內快取 |
| `requesting` | 淺黃 `#fef7e0` | 琥珀 `#f9ab00` | 取得中 |
| `denied` | **淺紅 `#fce8e6`** | 紅 `#d93025` | 權限未允許（需求：至少淺黃或淺紅） |
| `error` | 淺紅 `#fce8e6` | 紅 `#d93025` | 取得失敗或快取逾時 |
| `unsupported` | 淺黃 `#fef7e0` | 琥珀 `#f9ab00` | 裝置不支援 |

## 無障礙
- `role="status"` 與 `aria-label`，供螢幕閱讀器朗讀目前 GPS 狀態。
