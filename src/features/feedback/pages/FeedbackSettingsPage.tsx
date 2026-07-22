import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import { Alert, AppBar, Box, Button, IconButton, Snackbar, Stack, Toolbar, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../../appContext.ts";
import type { IFeedbackSettings, TFeedbackEvent, TSoundEffect, TVibrationLevel } from "../../../types.ts";
import { FeedbackEventCard } from "../components/FeedbackEventCard.tsx";
import { FeedbackSettingsFooter } from "../components/FeedbackSettingsFooter.tsx";
import { FeedbackSupportPanel } from "../components/FeedbackSupportPanel.tsx";
import { FEEDBACK_EVENT_DEFINITIONS } from "../types/feedbackSettingsOptions.ts";
import { getFeedbackSupport, triggerFeedback } from "../services/feedback.ts";

const RESULT_LABELS = { played: "已播放", off: "已關閉", unsupported: "瀏覽器不支援" } as const;

export function FeedbackSettingsPage(): React.JSX.Element {
  const { state, setState } = useAppContext();
  const navigate = useNavigate();
  const support = useMemo(getFeedbackSupport, []);
  const [draft, setDraft] = useState<IFeedbackSettings>(() => structuredClone(state.feedbackSettings));
  const [message, setMessage] = useState<string | null>(null);

  function update(eventKey: TFeedbackEvent, patch: Partial<IFeedbackSettings[TFeedbackEvent]>): void {
    setDraft((previous) => ({
      ...previous,
      [eventKey]: { ...previous[eventKey], ...patch }
    }));
  }

  async function test(eventKey: TFeedbackEvent): Promise<void> {
    const result = await triggerFeedback(draft[eventKey]);
    setMessage(`震動：${RESULT_LABELS[result.vibration]}；音效：${RESULT_LABELS[result.sound]}`);
  }

  function disableAll(): void {
    const off = { vibration: "off", sound: "off" } as const;
    setDraft({ increase: off, decrease: off, negativeError: off });
  }

  function save(): void {
    setState((previous) => ({ ...previous, feedbackSettings: draft }));
    navigate("/", { replace: true });
  }

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default", pb: 11 }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ pt: "max(4px, env(safe-area-inset-top))", px: 1 }}>
          <IconButton aria-label="返回計數畫面" onClick={() => navigate(-1)} sx={{ color: "inherit" }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1, minWidth: 0, ml: 0.5 }}>
            <Typography fontWeight={950}>震動與音效</Typography>
            <Typography variant="caption" sx={{ opacity: 0.78 }}>獨立於主題，儲存在本機</Typography>
          </Box>
          <NotificationsActiveRoundedIcon />
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ width: "min(100%, 620px)", mx: "auto", p: 1.25 }}>
        <FeedbackSupportPanel {...support} />
        <Stack spacing={1.25}>
          {FEEDBACK_EVENT_DEFINITIONS.map((definition) => (
            <FeedbackEventCard
              key={definition.key}
              definition={definition}
              config={draft[definition.key]}
              onVibrationChange={(value: TVibrationLevel) => update(definition.key, { vibration: value })}
              onSoundChange={(value: TSoundEffect) => update(definition.key, { sound: value })}
              onTest={() => void test(definition.key)}
            />
          ))}
        </Stack>
        <Button color="inherit" fullWidth sx={{ mt: 1.25 }} onClick={disableAll}>全部關閉</Button>
      </Box>
      <FeedbackSettingsFooter onCancel={() => navigate(-1)} onSave={save} />
      <Snackbar
        open={message !== null}
        autoHideDuration={2400}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: 9 }}
      >
        <Alert severity="info" variant="filled" onClose={() => setMessage(null)}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
