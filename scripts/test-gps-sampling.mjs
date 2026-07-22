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
assert.equal(getGpsSampleWindow(20_001), null);
assert.equal(getGpsSampleWindow(59_999), null);
assert.equal(getGpsSampleWindow(60_000), 0);

assert.equal(getGpsSampleWindowKey(9_000), "0:0");
assert.equal(getGpsSampleWindowKey(11_000), "0:1");
assert.equal(getGpsSampleWindowKey(61_000), "1:0");
assert.equal(getGpsSampleWindowKey(30_000), null);

const windowKeysInOneMinute = new Set(
  Array.from({ length: 60_000 }, (_value, millisecond) => getGpsSampleWindowKey(millisecond)).filter(
    (key) => key !== null
  )
);
assert.deepEqual([...windowKeysInOneMinute], ["0:0", "0:1"]);

assert.equal(getDelayToNextGpsSampleWindow(0), 10_001);
assert.equal(getDelayToNextGpsSampleWindow(10_000), 1);
assert.equal(getDelayToNextGpsSampleWindow(10_001), 49_999);
assert.equal(getDelayToNextGpsSampleWindow(59_999), 1);

assert.equal(isGpsSampleFresh(1_000, 1_000 + GPS_CACHE_MAX_AGE_MS), true);
assert.equal(isGpsSampleFresh(1_000, 1_001 + GPS_CACHE_MAX_AGE_MS), false);
assert.equal(isGpsSampleFresh(null, 1_000), false);
assert.equal(isGpsSampleFresh(2_000, 1_000), false);

console.log("GPS sampling boundary tests passed.");
