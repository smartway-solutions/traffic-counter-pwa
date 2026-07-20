# CounterCard 規格

## 目的
主畫面單一車種的計數卡片。整張卡都是 +1 的觸控目標，
「車種名稱靠左、大數字靠右」，「−」鈕 −1。

## 兩種版面（`variant`，由主題決定）
- `grid`（預設／夜間主題）：直式卡片，第一行名稱＋數字、右下角「−」鈕。
- `list`（清單大字主題）：單列橫向——名稱靠左，右側「−」鈕＋特大數字
  （`clamp(2.6rem, 10dvh, 4.6rem)`），六列由父層 flex 均分高度。

## 深色支援（`dark`，夜間主題時為 true）
- 改用 `DARK_PALETTES`：深色微染底＋提亮主色，維持車種辨識、降低夜間眩光。
- +1 閃爍為亮主色底＋**深色文字**（亮底配白字看不清）；−1 閃紅維持白字。

## 每車種專屬配色（淺色底＋飽和主色，陽光下仍高對比）
| 車種 | 底色 | 主色（邊框／名稱／+1 閃爍） |
| --- | --- | --- |
| 機車 | `#e8f0fe` | 藍 `#0b57d0` |
| 汽車 | `#e6f4ea` | 綠 `#188038` |
| 公車 | `#fef7e0` | 琥珀 `#b06000` |
| 大貨車 | `#f3e8fd` | 紫 `#7627bb` |
| 聯結車 | `#e4f7fb` | 青 `#007b83` |
| 其他 | `#f1f3f4` | 灰 `#5f6368` |

計數數字一律近黑 `#111`，只有名稱用主色，確保數字可讀性一致。

## 版面
- 卡片尺寸由父層 grid 均分（直向 2×3、寬螢幕 3×2），不產生捲動。
- 第一行：名稱 `clamp(1.15rem, 3.5dvh, 1.7rem)` 靠左；
  數字 `clamp(2.4rem, 8dvh, 4rem)`、900、tabular-nums 靠右。
- 底部：右下角「−」IconButton，2px 車種主色外框（閃爍時轉白框）。
- 計數 0 時「−」只轉灰色樣式（`aria-disabled`），**不用原生 `disabled`**：
  原生 disabled 會 `pointer-events: none`，點擊會穿透到卡片變成 +1。
  改為永遠 `stopPropagation` 並照常呼叫 `onDecrease`，由父層彈「已是 0」警告。
- 外框 3px 主色圓角邊，底色為該車種淺色。

## 回饋
- +1：整卡閃爍該車種**飽和主色**、文字轉白。
- −1：整卡閃爍紅 `#d93025`、文字轉白。
- 數字同步 `scale(1.12)`；transition 120ms，由父層 ~260ms 後清除 feedback。
- 外層 `ButtonBase component="div"` 保留 ripple、避免巢狀 button。

## Props
`vehicleType`、`count`、`feedback ("increase"|"decrease"|null)`、`onIncrease`、`onDecrease`。
