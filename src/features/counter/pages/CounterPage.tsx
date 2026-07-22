import { Box } from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../../appContext.ts";
import { createInitialState } from "../../../constants.ts";
import { getCounterCardVariant, getCounterLayout } from "../../../themes.ts";
import type { TThemeName } from "../../../types.ts";
import { VEHICLE_TYPES } from "../../../types.ts";
import { CounterCard } from "../components/CounterCard.tsx";
import { CounterGrid } from "../components/CounterGrid.tsx";
import { CounterHeader } from "../components/CounterHeader.tsx";
import { CounterPageOverlays } from "../components/CounterPageOverlays.tsx";
import { useCounterController } from "../hooks/useCounterController.ts";

export function CounterPage(): React.JSX.Element {
  const { state, setState, geolocation } = useAppContext();
  const navigate = useNavigate();
  const captureTargetRef = useRef<HTMLDivElement | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const controller = useCounterController({ state, setState, geolocation, captureTargetRef });
  const layout = getCounterLayout(state.theme);

  function selectTheme(theme: TThemeName): void {
    setState((previous) => ({ ...previous, theme }));
    setThemeDialogOpen(false);
  }

  function clearAllData(): void {
    setState(createInitialState());
    setClearDialogOpen(false);
    navigate("/setup", { replace: true });
  }

  async function share(): Promise<void> {
    const shareData = {
      title: "手機交通量計數器",
      text: "手機交通量計數器 PWA：離線用手機計數車流、記錄 GPS 並匯出 CSV。",
      url: `${window.location.origin}${window.location.pathname}`
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        controller.setNotice({ message: "分享失敗，請改用手動複製連結。", severity: "warning" });
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
      controller.setNotice({ message: "此瀏覽器不支援分享，已複製安裝連結到剪貼簿。", severity: "success" });
    } catch {
      controller.setNotice({ message: "此瀏覽器不支援分享，且無法自動複製連結。", severity: "warning" });
    }
  }

  return (
    <Box
      ref={captureTargetRef}
      sx={{
        height: "100dvh",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "background.default"
      }}
    >
      <CounterHeader
        roadSection={state.roadSection}
        userName={state.userName}
        facingDirection={state.facingDirection}
        geolocation={geolocation}
        themeName={state.theme}
        autoSaveEnabled={state.autoSaveEnabled}
        quickSaveDisabled={controller.saving}
        onQuickSave={() => void controller.save("quick_save")}
        onAutoSaveChange={(autoSaveEnabled) =>
          setState((previous) => ({ ...previous, autoSaveEnabled }))
        }
        onExport={() => navigate("/export")}
        onEditSetup={() => navigate("/setup")}
        onFeedbackSettings={() => navigate("/feedback")}
        onManual={() => navigate("/manual")}
        onChangelog={() => navigate("/changelog")}
        onThemeRequest={() => setThemeDialogOpen(true)}
        onShare={() => void share()}
        onClearRequest={() => setClearDialogOpen(true)}
      />
      <CounterGrid layout={layout}>
        {VEHICLE_TYPES.map((vehicleType, index) => (
          <CounterCard
            key={vehicleType}
            vehicleType={vehicleType}
            count={state.workingCounts[vehicleType]}
            feedback={
              controller.feedback?.vehicleType === vehicleType ? controller.feedback.action : null
            }
            variant={getCounterCardVariant(state.theme, index)}
            themeName={state.theme}
            onIncrease={() => controller.count(vehicleType, "increase")}
            onDecrease={() => controller.count(vehicleType, "decrease")}
          />
        ))}
      </CounterGrid>
      <CounterPageOverlays
        themeDialogOpen={themeDialogOpen}
        clearDialogOpen={clearDialogOpen}
        currentTheme={state.theme}
        notice={controller.notice}
        onThemeClose={() => setThemeDialogOpen(false)}
        onThemeSelect={selectTheme}
        onClearClose={() => setClearDialogOpen(false)}
        onClearConfirm={clearAllData}
        onNoticeClose={() => controller.setNotice(null)}
      />
    </Box>
  );
}
