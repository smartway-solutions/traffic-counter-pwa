import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { isSetupComplete, useAppContext } from "../appContext.ts";
import { BrandNotice } from "../components/BrandNotice.tsx";

export function SetupPage(): React.JSX.Element {
  const { state, setState } = useAppContext();
  const navigate = useNavigate();
  const [roadSection, setRoadSection] = useState(state.roadSection);
  const [userName, setUserName] = useState(state.userName);

  // 已完成初始設定＝從選單進來的「編輯」模式，可取消返回；否則為強制初始設定
  const isEditing = isSetupComplete(state);
  const canSave = roadSection.trim() !== "" && userName.trim() !== "";

  function cancel(): void {
    navigate("/", { replace: true });
  }

  function save(): void {
    if (!canSave) {
      return;
    }
    setState((previous) => ({
      ...previous,
      roadSection: roadSection.trim(),
      userName: userName.trim()
    }));
    navigate("/", { replace: true });
  }

  return (
    <Box sx={{ height: "100dvh", display: "grid", placeItems: "center", bgcolor: "#f5f7fb" }}>
      <Typography variant="h6" fontWeight={900} color="text.secondary">
        手機交通量計數器
      </Typography>

      <Dialog
        open
        fullWidth
        maxWidth="xs"
        disableEscapeKeyDown={!isEditing}
        onClose={isEditing ? cancel : undefined}
      >
        <DialogTitle fontWeight={900}>{isEditing ? "編輯路段／使用者" : "作業設定"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {isEditing
              ? "修改後儲存，或取消返回計數畫面。"
              : "填寫路段與使用者後才能進入計數畫面；之後會以純文字顯示在頂欄，可從選單重新編輯。"}
          </DialogContentText>
          <Stack spacing={2}>
            <TextField
              label="路段"
              value={roadSection}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setRoadSection(event.target.value)}
              placeholder="例：中山路／民權路口"
              autoFocus
              fullWidth
              required
            />
            <TextField
              label="使用者"
              value={userName}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setUserName(event.target.value)}
              placeholder="例：王小明"
              fullWidth
              required
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  save();
                }
              }}
            />
          </Stack>
          <BrandNotice />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          {isEditing && (
            <Button size="large" onClick={cancel}>
              取消
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            fullWidth={!isEditing}
            disabled={!canSave}
            onClick={save}
          >
            {isEditing ? "儲存" : "開始計數"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
