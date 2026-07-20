# CounterCard 規格

## 目的
主畫面單一車種的計數卡片。整張卡都是 +1 的觸控目標，
卡片第一行「車種名稱靠左、大數字靠右」，右下角小「−」鈕 −1。

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
