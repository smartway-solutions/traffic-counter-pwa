import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { AppBar, Box, IconButton, Paper, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import changelog from "../../CHANGELOG.md?raw";

export function ChangelogPage(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ pt: "max(4px, env(safe-area-inset-top))", px: 1, gap: 0.5 }}>
          <IconButton aria-label="返回計數畫面" onClick={() => navigate(-1)} sx={{ color: "inherit" }}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography fontWeight={950} sx={{ flex: 1 }}>
            版本變更說明
          </Typography>
          <HistoryRoundedIcon />
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ width: "min(100%, 720px)", mx: "auto", p: 1.25 }}>
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: "6px" }}>
          <Typography
            component="pre"
            sx={{
              m: 0,
              font: "inherit",
              fontSize: "0.92rem",
              lineHeight: 1.75,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere"
            }}
          >
            {changelog.trim()}
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
}
