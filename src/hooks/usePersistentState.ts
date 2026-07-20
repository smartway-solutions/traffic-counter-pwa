import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { createInitialState, STORAGE_KEY } from "../constants.ts";
import { isThemeName } from "../themes.ts";
import type { IFeedbackSettings, IStoredState } from "../types.ts";

function mergeFeedbackSettings(
  initial: IFeedbackSettings,
  stored: Partial<IFeedbackSettings> | undefined
): IFeedbackSettings {
  return {
    increase: { ...initial.increase, ...stored?.increase },
    decrease: { ...initial.decrease, ...stored?.decrease },
    negativeError: { ...initial.negativeError, ...stored?.negativeError }
  };
}

function readStoredState(): IStoredState {
  const initial = createInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return initial;
  }

  try {
    const stored = JSON.parse(raw) as Partial<IStoredState>;
    return {
      ...initial,
      ...stored,
      theme: isThemeName(stored.theme) ? stored.theme : "default",
      feedbackSettings: mergeFeedbackSettings(initial.feedbackSettings, stored.feedbackSettings),
      counts: { ...initial.counts, ...stored.counts },
      records: Array.isArray(stored.records) ? stored.records : []
    };
  } catch (error) {
    throw new Error(
      `LocalStorage 資料損毀，請在瀏覽器開發者工具刪除鍵值 ${STORAGE_KEY} 後重新整理。`,
      { cause: error }
    );
  }
}

export function usePersistentState(): [
  IStoredState,
  Dispatch<SetStateAction<IStoredState>>
] {
  const [state, setState] = useState<IStoredState>(readStoredState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
