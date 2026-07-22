import { useOutletContext } from "react-router";
import type { Dispatch, SetStateAction } from "react";
import type { IGeolocationState } from "./features/geolocation/types/gpsTypes.ts";
import type { IStoredState } from "./types.ts";

export interface IAppContext {
  state: IStoredState;
  setState: Dispatch<SetStateAction<IStoredState>>;
  geolocation: IGeolocationState;
  currentTime: string;
}

export function useAppContext(): IAppContext {
  return useOutletContext<IAppContext>();
}

export function isSetupComplete(state: IStoredState): boolean {
  return state.roadSection.trim() !== "" && state.userName.trim() !== "";
}
