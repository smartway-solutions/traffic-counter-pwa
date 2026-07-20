# CounterHeader 規格

## 目的
主畫面頂欄，刻意壓縮高度（兩行、dense Toolbar），把畫面高度留給計數列。

## 版面
- 第一行：App 名稱（小字）＋每秒更新時間（caption、tabular-nums）。
- 第二行：`路段｜使用者` **純文字**（設定完成後不再是輸入框，超寬時 ellipsis）
  ＋ 右側 `GpsStatusLamp`（非交互燈號）。
- 右側漢堡（更多）按鈕開啟下拉選單。

## 漢堡選單項目
1. 匯出與統計 → `onExport`（導向 `#/export`；統計只在匯出頁顯示）。
2. 編輯路段／使用者 → `onEditSetup`（導向 `#/setup`）。
3. **清除本機資料** → `onClearRequest`（紅字；由父層開確認 Dialog）。

任一項點擊後先關閉選單再執行回呼。

## Props
`roadSection`、`userName`、`currentTime`、`geolocation`、
`onExport`、`onEditSetup`、`onClearRequest`。
