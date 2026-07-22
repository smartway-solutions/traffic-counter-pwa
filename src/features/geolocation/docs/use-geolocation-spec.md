# useGeolocation 規格

React hook 僅訂閱狀態；取樣排程與瀏覽器 API 生命週期由 geolocation service 管理。

## 取樣排程

- 不使用持續的 `watchPosition()`。
- 每分鐘分成 `00.000–10.000` 秒與 `10.001–20.000` 秒兩個視窗。
- 每個視窗以 window key 節流，最多呼叫一次 `getCurrentPosition()`。
- 前一次請求仍在執行時略過新視窗，不建立併發定位請求。
- 高精度定位、`maximumAge: 0`、timeout 8 秒。

## 快取

- 成功位置在記憶體保留 70 秒，包含實際取樣時間 `sampledAtMs`。
- 計數與 Save 事件透過 `getFreshGpsSnapshot()` 複製快取；過期時回傳 `null`。
- 單次取樣失敗時，仍可使用尚未過期的上一筆位置。
- 超過 70 秒沒有成功樣本時，清除位置並顯示「GPS 資料逾時」。

## 權限與生命週期

- 啟動前先查詢 Permissions API；已拒絕時不呼叫定位 API。
- 監聽權限變更，重新允許後從當前取樣窗恢復。
- 分頁進入背景時清除排程 timer；回到前景只處理當前視窗，不補跑過去視窗。
- React Strict Mode 清理後，舊的非同步 callback 不得更新 state。
