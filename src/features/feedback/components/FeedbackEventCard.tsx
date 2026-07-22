import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  type SelectChangeEvent
} from "@mui/material";
import type { IFeedbackEventConfig, TSoundEffect, TVibrationLevel } from "../../../types.ts";
import {
  SOUND_OPTIONS,
  VIBRATION_OPTIONS,
  type IFeedbackEventDefinition
} from "../types/feedbackSettingsOptions.ts";

export interface IFeedbackEventCardProps {
  definition: IFeedbackEventDefinition;
  config: IFeedbackEventConfig;
  onVibrationChange: (value: TVibrationLevel) => void;
  onSoundChange: (value: TSoundEffect) => void;
  onTest: () => void;
}

export function FeedbackEventCard(props: IFeedbackEventCardProps): React.JSX.Element {
  const { definition } = props;
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{
        p: 1.25,
        borderRadius: "6px",
        borderLeft: "5px solid",
        borderLeftColor: `${definition.color}.main`
      }}
    >
      <Typography fontSize="1.05rem" fontWeight={950}>{definition.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
        {definition.description}
      </Typography>
      <Stack spacing={1.1}>
        <FormControl fullWidth size="small">
          <InputLabel id={`${definition.key}-vibration-label`}>震動等級</InputLabel>
          <Select
            labelId={`${definition.key}-vibration-label`}
            label="震動等級"
            value={props.config.vibration}
            onChange={(event: SelectChangeEvent) =>
              props.onVibrationChange(event.target.value as TVibrationLevel)
            }
          >
            {VIBRATION_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel id={`${definition.key}-sound-label`}>音效</InputLabel>
          <Select
            labelId={`${definition.key}-sound-label`}
            label="音效"
            value={props.config.sound}
            onChange={(event: SelectChangeEvent) =>
              props.onSoundChange(event.target.value as TSoundEffect)
            }
          >
            {SOUND_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={props.onTest}>測試這組設定</Button>
      </Stack>
    </Paper>
  );
}
