import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VibrationRoundedIcon from "@mui/icons-material/VibrationRounded";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  Toolbar,
  Typography,
  type SelectChangeEvent
} from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../appContext.ts";
import { getFeedbackSupport, triggerFeedback } from "../feedback.ts";
import type {
  IFeedbackEventConfig,
  IFeedbackSettings,
  TFeedbackEvent,
  TSoundEffect,
  TVibrationLevel
} from "../types.ts";

interface IEventDefinition {
  key: TFeedbackEvent;
  title: string;
  description: string;
  color: "success" | "warning" | "error";
}

const EVENT_DEFINITIONS: readonly IEventDefinition[] = [
  {
    key: "increase",
    title: "計數增加",
    description: "點擊車種卡片成功加 1 時觸發。",
    color: "success"
  },
  {
    key: "decrease",
    title: "計數減少",
    description: "點擊減少按鈕成功減 1 時觸發。",
    color: "warning"
  },
  {
    key: "negativeError",
    title: "小於 0 錯誤",
    description: "計數已是 0，仍嘗試減少時觸發。",
    color: "error"
  }
];

const VIBRATION_OPTIONS: readonly { value: TVibrationLevel; label: string }[] = [
  { value: "off", label: "關閉" },
  { value: "light", label: "輕微（18ms）" },
  { value: "medium", label: "中等（48ms）" },
  { value: "strong", label: "強烈（兩段震動）" }
];

const SOUND_OPTIONS: readonly { value: TSoundEffect; label: string }[] = [
  { value: "off", label: "關閉" },
  { value: "click", label: "短促點擊" },
  { value: "beep", label: "單聲提示" },
  { value: "chime", label: "雙音確認" },
  { value: "warning", label: "低頻警告" }
];

function playbackMessage(
  result: Awaited<ReturnType<typeof triggerFeedback>>
): string {
  const labels = {
    played: "已播放",
    off: "已關閉",
    unsupported: "瀏覽器不支援"
  } as const;
  return `震動：${labels[result.vibration]}；音效：${labels[result.sound]}`;
}

export function FeedbackSettingsPage(): React.JSX.Element {
  const { state, setState } = useAppContext();
  const navigate = useNavigate();
  const support = useMemo(getFeedbackSupport, []);
  const [draft, setDraft] = useState<IFeedbackSettings>(() => structuredClone(state.feedbackSettings));
  const [message, setMessage] = useState<string | null>(null);

  function updateEvent(
    eventKey: TFeedbackEvent,
    field: keyof IFeedbackEventConfig,
    value: TVibrationLevel | TSoundEffect
  ): void {
    setDraft((previous) => ({
      ...previous,
      [eventKey]: { ...previous[eventKey], [field]: value }
    }));
  }

  async function test(eventKey: TFeedbackEvent): Promise<void> {
    const result = await triggerFeedback(draft[eventKey]);
    setMessage(playbackMessage(result));
  }

  function disableAll(): void {
    setDraft((previous) => ({
      increase: { ...previous.increase, vibration: "off", sound: "off" },
      decrease: { ...previous.decrease, vibration: "off", sound: "off" },
      negativeError: { ...previous.negativeError, vibration: "off", sound: "off" }
    }));
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
            <Typography variant="caption" sx={{ opacity: 0.78 }}>
              獨立於主題，儲存在本機
            </Typography>
          </Box>
          <NotificationsActiveRoundedIcon />
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ width: "min(100%, 620px)", mx: "auto", p: 1.25 }}>
        <Paper variant="outlined" sx={{ p: 1.25, borderRadius: "6px", mb: 1.25 }}>
          <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
            <Chip
              icon={<VibrationRoundedIcon />}
              label={support.vibration ? "支援震動" : "不支援震動"}
              color={support.vibration ? "success" : "default"}
              variant="outlined"
            />
            <Chip
              icon={<VolumeUpRoundedIcon />}
              label={support.sound ? "支援音效" : "不支援音效"}
              color={support.sound ? "success" : "default"}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            iPhone Safari 通常不支援 Web Vibration API；音效仍可能受靜音模式、音量及瀏覽器政策限制。
          </Typography>
        </Paper>

        <Stack spacing={1.25}>
          {EVENT_DEFINITIONS.map((definition) => {
            const config = draft[definition.key];
            return (
              <Paper
                key={definition.key}
                component="section"
                variant="outlined"
                sx={{ p: 1.25, borderRadius: "6px", borderLeft: "5px solid", borderLeftColor: `${definition.color}.main` }}
              >
                <Typography fontSize="1.05rem" fontWeight={950}>
                  {definition.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
                  {definition.description}
                </Typography>

                <Stack spacing={1.1}>
                  <FormControl fullWidth size="small">
                    <InputLabel id={`${definition.key}-vibration-label`}>震動等級</InputLabel>
                    <Select
                      labelId={`${definition.key}-vibration-label`}
                      label="震動等級"
                      value={config.vibration}
                      onChange={(event: SelectChangeEvent) =>
                        updateEvent(definition.key, "vibration", event.target.value as TVibrationLevel)
                      }
                    >
                      {VIBRATION_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth size="small">
                    <InputLabel id={`${definition.key}-sound-label`}>音效</InputLabel>
                    <Select
                      labelId={`${definition.key}-sound-label`}
                      label="音效"
                      value={config.sound}
                      onChange={(event: SelectChangeEvent) =>
                        updateEvent(definition.key, "sound", event.target.value as TSoundEffect)
                      }
                    >
                      {SOUND_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Button variant="outlined" onClick={() => void test(definition.key)}>
                    測試這組設定
                  </Button>
                </Stack>
              </Paper>
            );
          })}
        </Stack>

        <Button color="inherit" fullWidth sx={{ mt: 1.25 }} onClick={disableAll}>
          全部關閉
        </Button>
      </Box>

      <Paper
        square
        elevation={8}
        sx={{
          position: "fixed",
          inset: "auto 0 0 0",
          p: 1,
          pb: "max(8px, env(safe-area-inset-bottom))",
          borderTop: "1px solid",
          borderColor: "divider"
        }}
      >
        <Stack direction="row" spacing={1} sx={{ width: "min(100%, 620px)", mx: "auto" }}>
          <Button fullWidth color="inherit" onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button fullWidth variant="contained" onClick={save}>
            儲存設定
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={message !== null}
        autoHideDuration={2400}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ mb: 9 }}
      >
        <Alert severity="info" variant="filled" onClose={() => setMessage(null)}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
