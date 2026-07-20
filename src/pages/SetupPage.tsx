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
import { useAppContext } from "../appContext.ts";
import { BrandNotice } from "../components/BrandNotice.tsx";

export function SetupPage(): React.JSX.Element {
  const { state, setState } = useAppContext();
  const navigate = useNavigate();
  const [roadSection, setRoadSection] = useState(state.roadSection);
  const [userName, setUserName] = useState(state.userName);

  const canSave = roadSection.trim() !== "" && userName.trim() !== "";

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

      <Dialog open fullWidth maxWidth="xs" disableEscapeKeyDown>
        <DialogTitle fontWeight={900}>作業設定</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            填寫路段與使用者後才能進入計數畫面；之後會以純文字顯示在頂欄，可從選單重新編輯。
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
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="contained" size="large" fullWidth disabled={!canSave} onClick={save}>
            開始計數
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
