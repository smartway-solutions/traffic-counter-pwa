import assert from "node:assert/strict";
import {
  GPS_SAMPLE_MAX_AGE_MS,
  getDelayToNextGpsSampleWindow,
  getGpsSampleWindow,
  getGpsSampleWindowKey,
  isGpsRequestDue,
  isGpsSampleFresh
} from "../src/features/geolocation/utils/gpsSampling.ts";
import { GpsSampleStore } from "../src/features/geolocation/services/gpsSampleStore.ts";
import { createInitialState } from "../src/constants.ts";
import {
  createCountRecord,
  createSaveRecord
} from "../src/features/counter/utils/counterRecords.ts";

assert.equal(getGpsSampleWindow(0), 0);
assert.equal(getGpsSampleWindow(10_000), 0);
assert.equal(getGpsSampleWindow(10_001), 1);
assert.equal(getGpsSampleWindow(20_000), 1);
assert.equal(getGpsSampleWindow(20_001), 2);
assert.equal(getGpsSampleWindow(30_001), 3);
assert.equal(getGpsSampleWindow(40_001), 4);
assert.equal(getGpsSampleWindow(50_001), 5);
assert.equal(getGpsSampleWindow(59_999), 5);
assert.equal(getGpsSampleWindow(60_000), 0);

assert.equal(getGpsSampleWindowKey(9_000), "0:0");
assert.equal(getGpsSampleWindowKey(11_000), "0:1");
assert.equal(getGpsSampleWindowKey(21_000), "0:2");
assert.equal(getGpsSampleWindowKey(31_000), "0:3");
assert.equal(getGpsSampleWindowKey(41_000), "0:4");
assert.equal(getGpsSampleWindowKey(51_000), "0:5");
assert.equal(getGpsSampleWindowKey(61_000), "1:0");

const windowKeysInOneMinute = new Set(
  Array.from({ length: 60_000 }, (_value, millisecond) => getGpsSampleWindowKey(millisecond)).filter(
    (key) => key !== null
  )
);
assert.deepEqual([...windowKeysInOneMinute], ["0:0", "0:1", "0:2", "0:3", "0:4", "0:5"]);

assert.equal(getDelayToNextGpsSampleWindow(0), 10_001);
assert.equal(getDelayToNextGpsSampleWindow(10_000), 1);
assert.equal(getDelayToNextGpsSampleWindow(10_001), 10_000);
assert.equal(getDelayToNextGpsSampleWindow(20_000), 1);
assert.equal(getDelayToNextGpsSampleWindow(20_001), 10_000);
assert.equal(getDelayToNextGpsSampleWindow(50_001), 9_999);
assert.equal(getDelayToNextGpsSampleWindow(59_999), 1);

assert.equal(isGpsRequestDue(null, 9_900), true);
assert.equal(isGpsRequestDue(9_900, 10_001), false);
assert.equal(isGpsRequestDue(9_900, 19_899), false);
assert.equal(isGpsRequestDue(9_900, 19_900), true);
assert.equal(isGpsRequestDue(20_000, 19_999), false);

assert.equal(GPS_SAMPLE_MAX_AGE_MS, 20_000);
assert.equal(isGpsSampleFresh(1_000, 1_000 + GPS_SAMPLE_MAX_AGE_MS), true);
assert.equal(isGpsSampleFresh(1_000, 1_001 + GPS_SAMPLE_MAX_AGE_MS), false);
assert.equal(isGpsSampleFresh(null, 1_000), false);
assert.equal(isGpsSampleFresh(2_000, 1_000), false);

const samples = new GpsSampleStore();
const sample = {
  position: { latitude: 25.04, longitude: 121.56, accuracyMeters: 8 },
  sampledAtMs: 1_000
};
samples.set(sample);
assert.equal(samples.getFresh(1_000 + GPS_SAMPLE_MAX_AGE_MS), sample);
assert.equal(samples.getFresh(1_001 + GPS_SAMPLE_MAX_AGE_MS), null);
assert.equal(samples.getLatest(), null);

const storedState = createInitialState();
storedState.roadSection = "測試路段";
storedState.userName = "測試員";
const staleGeolocation = {
  position: sample.position,
  sampledAtMs: sample.sampledAtMs,
  status: "error",
  message: "GPS 最近樣本已逾時"
};
const eventTime = new Date(sample.sampledAtMs + GPS_SAMPLE_MAX_AGE_MS + 1);
const countRecord = createCountRecord(
  storedState,
  staleGeolocation,
  "機車",
  "increase",
  eventTime
);
assert.equal(countRecord.gps, null);
assert.equal(countRecord.eventType, "count");
assert.equal(countRecord.delta, 1);
assert.equal(countRecord.countAfter, 1);
assert.equal(countRecord.roadSection, "測試路段");

const saveRecord = createSaveRecord(
  storedState,
  staleGeolocation,
  "quick_save",
  "quick-save-test",
  "quick-save-test.png",
  eventTime
);
assert.equal(saveRecord.gps, null);
assert.equal(saveRecord.eventType, "save");
assert.equal(saveRecord.saveStatus, "pending");
assert.equal(saveRecord.userName, "測試員");

console.log("GPS sampling boundary tests passed.");
