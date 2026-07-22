import assert from "node:assert/strict";
import {
  GPS_CACHE_MAX_AGE_MS,
  getDelayToNextGpsSampleWindow,
  getGpsSampleWindow,
  getGpsSampleWindowKey,
  isGpsSampleFresh
} from "../src/features/geolocation/utils/gpsSampling.ts";

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

assert.equal(isGpsSampleFresh(1_000, 1_000 + GPS_CACHE_MAX_AGE_MS), true);
assert.equal(isGpsSampleFresh(1_000, 1_001 + GPS_CACHE_MAX_AGE_MS), false);
assert.equal(isGpsSampleFresh(null, 1_000), false);
assert.equal(isGpsSampleFresh(2_000, 1_000), false);

console.log("GPS sampling boundary tests passed.");
