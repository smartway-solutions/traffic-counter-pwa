import { Button, Paper, Stack } from "@mui/material";

export interface IFeedbackSettingsFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export function FeedbackSettingsFooter(props: IFeedbackSettingsFooterProps): React.JSX.Element {
  return (
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
        <Button fullWidth color="inherit" onClick={props.onCancel}>取消</Button>
        <Button fullWidth variant="contained" onClick={props.onSave}>儲存設定</Button>
      </Stack>
    </Paper>
  );
}
