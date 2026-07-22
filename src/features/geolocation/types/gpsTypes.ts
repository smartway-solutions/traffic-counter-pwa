import type { IGpsSnapshot } from "../../../types.ts";

export type TGeolocationStatus = "requesting" | "ready" | "denied" | "unsupported" | "error";

export interface IGeolocationState {
  position: IGpsSnapshot | null;
  sampledAtMs: number | null;
  status: TGeolocationStatus;
  message: string;
}

export interface IGpsSample {
  position: IGpsSnapshot;
  sampledAtMs: number;
}

export const INITIAL_GEOLOCATION_STATE: IGeolocationState = {
  position: null,
  sampledAtMs: null,
  status: "requesting",
  message: "等待 GPS 取樣"
};
