import VolumeUpRoundedIcon from "@mui/icons-material/VolumeUpRounded";
import VibrationRoundedIcon from "@mui/icons-material/VibrationRounded";
import { Chip, Paper, Stack, Typography } from "@mui/material";

export interface IFeedbackSupportPanelProps {
  vibration: boolean;
  sound: boolean;
}

export function FeedbackSupportPanel(props: IFeedbackSupportPanelProps): React.JSX.Element {
  return (
    <Paper variant="outlined" sx={{ p: 1.25, borderRadius: "6px", mb: 1.25 }}>
      <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
        <Chip
          icon={<VibrationRoundedIcon />}
          label={props.vibration ? "支援震動" : "不支援震動"}
          color={props.vibration ? "success" : "default"}
          variant="outlined"
        />
        <Chip
          icon={<VolumeUpRoundedIcon />}
          label={props.sound ? "支援音效" : "不支援音效"}
          color={props.sound ? "success" : "default"}
          variant="outlined"
        />
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        iPhone Safari 通常不支援 Web Vibration API；音效仍可能受靜音模式、音量及瀏覽器政策限制。
      </Typography>
    </Paper>
  );
}
