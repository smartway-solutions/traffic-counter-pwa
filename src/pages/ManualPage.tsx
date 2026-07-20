import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { AppBar, Box, IconButton, Paper, Stack, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router";

interface IManualSection {
  id: string;
  title: string;
  description: string;
  media: string;
}

const MANUAL_SECTIONS: IManualSection[] = [
  {
    id: "setup",
    title: "初次進入：作業設定",
    description:
      "第一次開啟（或清除資料後）會強制顯示作業設定：填寫「路段」與「使用者」後才能進入計數畫面，兩者皆填寫前「開始計數」不會亮起。",
    media: "setup.mp4"
  },
  {
    id: "count",
    title: "計數：加一與減一",
    description:
      "點卡片任意處即可 +1，整卡會閃爍該車種主色；點卡片右下角的「−」鈕 −1，整卡閃紅色。計數為 0 時「−」呈灰色，再點會提示不能再減少。",
    media: "count.mp4"
  },
  {
    id: "export",
    title: "匯出 CSV",
    description:
      "右上選單 →「匯出與統計」進入匯出頁，統計資料只在這裡顯示。點「匯出 CSV」後會先出現確認視窗（含目前分頁與筆數），按「確認匯出」即下載 UTF-8（含 BOM）CSV 檔。",
    media: "export.mp4"
  },
  {
    id: "sort",
    title: "表格操作：排序",
    description:
      "在匯出頁的表格點欄位標題即可排序：點一下遞增、再點一下遞減、第三下取消排序。範例為依「操作後計數」排序原始資料。",
    media: "sort.mp4"
  },
  {
    id: "hide-column",
    title: "表格操作：隱藏欄位",
    description:
      "按住欄位標題並拖曳到表格外放開，即可隱藏該欄，讓畫面聚焦在需要的欄位。重新整理頁面即可還原全部欄位。",
    media: "hide-column.mp4"
  },
  {
    id: "edit",
    title: "編輯路段／使用者",
    description:
      "右上選單 →「編輯路段／使用者」可修改設定；與初次設定不同，編輯模式提供「取消」，取消時不會變更任何資料。",
    media: "edit.mp4"
  },
  {
    id: "clear",
    title: "清除本機資料",
    description:
      "右上選單 →「清除本機資料」會先確認；確認後刪除路段、使用者與所有計數紀錄（無法復原，建議先匯出 CSV），並回到作業設定畫面。",
    media: "clear.mp4"
  }
];

export function ManualPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <AppBar position="static" elevation={1} color="inherit">
        <Toolbar variant="dense" sx={{ gap: 1 }}>
          <IconButton aria-label="返回計數畫面" edge="start" onClick={() => navigate("/")}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={900} noWrap>
            使用手冊
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
        <Stack spacing={2} sx={{ maxWidth: 480, mx: "auto", p: 2 }}>
          {MANUAL_SECTIONS.map((section, index) => (
            <Paper
              key={section.id}
              elevation={0}
              sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}
            >
              <Box sx={{ p: 1.5, pb: 1 }}>
                <Typography variant="subtitle1" fontWeight={900}>
                  {index + 1}. {section.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {section.description}
                </Typography>
              </Box>
              <Box
                component="video"
                src={`${import.meta.env.BASE_URL}manual/${section.media}`}
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                sx={{ display: "block", width: "100%", bgcolor: "#000" }}
              />
            </Paper>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
