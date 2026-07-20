import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { createInitialState, STORAGE_KEY } from "../constants.ts";
import type { IStoredState } from "../types.ts";

function readStoredState(): IStoredState {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return createInitialState();
  }

  try {
    // 以初始狀態墊底合併，讓舊版資料（缺 theme 等新欄位）自動補齊預設值
    return { ...createInitialState(), ...(JSON.parse(raw) as Partial<IStoredState>) };
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
