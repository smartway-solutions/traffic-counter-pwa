import type { IGeolocationState } from "../../geolocation/types/gpsTypes.ts";
import { getFreshGpsSnapshot } from "../../geolocation/utils/gpsSnapshot.ts";
import type {
  ICountRecord,
  IStoredState,
  TCountAction,
  TSaveType,
  TVehicleCounts,
  TVehicleType
} from "../../../types.ts";
import { VEHICLE_TYPES } from "../../../types.ts";

const localTimeFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});

export function hasWorkingCounts(counts: TVehicleCounts): boolean {
  return VEHICLE_TYPES.some((vehicleType) => counts[vehicleType] > 0);
}

function sanitizeFilenamePart(value: string): string {
  const normalized = value.trim().replaceAll(/[\\/:*?"<>|\s]+/g, "-");
  return normalized === "" ? "未命名" : normalized.slice(0, 50);
}

export function createScreenshotFilename(
  state: IStoredState,
  saveType: TSaveType,
  now: Date
): string {
  const timestamp = now.toISOString().replaceAll(":", "-").replace(".000Z", "Z");
  return [
    "traffic-counter",
    saveType,
    sanitizeFilenamePart(state.roadSection),
    sanitizeFilenamePart(state.userName),
    timestamp
  ].join("-") + ".png";
}

export function countUnsavedRecords(records: ICountRecord[]): number {
  let lastSaveIndex = -1;
  for (let index = records.length - 1; index >= 0; index -= 1) {
    const record = records[index];
    if (record?.eventType === "save" && record.saveStatus === "completed") {
      lastSaveIndex = index;
      break;
    }
  }
  return records.slice(lastSaveIndex + 1).filter((record) => record.eventType === "count").length;
}

export function createCountRecord(
  snapshot: IStoredState,
  geolocation: IGeolocationState,
  vehicleType: TVehicleType,
  action: TCountAction,
  now = new Date()
): ICountRecord {
  const delta = action === "increase" ? 1 : -1;
  return {
    id: `${now.getTime()}-${snapshot.records.length + 1}`,
    eventType: "count",
    saveType: null,
    saveId: null,
    saveStatus: null,
    vehicleType,
    action,
    delta,
    countAfter: snapshot.counts[vehicleType] + delta,
    workingCountAfter: snapshot.workingCounts[vehicleType] + delta,
    timestampIso: now.toISOString(),
    localTime: localTimeFormatter.format(now),
    gps: getFreshGpsSnapshot(geolocation, now.getTime()),
    roadSection: snapshot.roadSection,
    userName: snapshot.userName,
    screenshotFilename: null,
    savedWorkingCountsJson: null,
    savedRecordCount: null
  };
}

export function createSaveRecord(
  snapshot: IStoredState,
  geolocation: IGeolocationState,
  saveType: TSaveType,
  saveId: string,
  screenshotFilename: string,
  now: Date
): ICountRecord {
  return {
    id: saveId,
    eventType: "save",
    saveType,
    saveId,
    saveStatus: "pending",
    vehicleType: null,
    action: null,
    delta: 0,
    countAfter: null,
    workingCountAfter: null,
    timestampIso: now.toISOString(),
    localTime: localTimeFormatter.format(now),
    gps: getFreshGpsSnapshot(geolocation, now.getTime()),
    roadSection: snapshot.roadSection,
    userName: snapshot.userName,
    screenshotFilename,
    savedWorkingCountsJson: JSON.stringify(snapshot.workingCounts),
    savedRecordCount: countUnsavedRecords(snapshot.records)
  };
}
