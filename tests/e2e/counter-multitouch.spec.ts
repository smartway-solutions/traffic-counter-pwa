import { expect, test, type Page } from "@playwright/test";

const EMPTY_COUNTS = {
  機車: 0,
  汽車: 0,
  公車: 0,
  大貨車: 0,
  聯結車: 0,
  自行車: 0,
  其他: 0
};

async function readCount(page: Page, vehicleType: "機車" | "汽車"): Promise<number> {
  const label = await page.getByLabel(new RegExp(`^${vehicleType} 加一`)).getAttribute("aria-label");
  const match = label?.match(/目前 (\d+)$/);
  if (match?.[1] === undefined) throw new Error(`無法從 aria-label 讀取${vehicleType}計數：${label}`);
  return Number(match[1]);
}

test("快速交替與雙指同按會分別計數，取消或滑出不計數", async ({ page, context }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.addInitScript((counts) => {
    localStorage.setItem(
      "traffic-counter-pwa:v1",
      JSON.stringify({
        roadSection: "中山路／民權路口",
        userName: "測試員",
        facingDirection: "北向",
        theme: "default",
        feedbackSettings: {
          increase: { vibration: "off", sound: "off" },
          decrease: { vibration: "off", sound: "off" },
          negativeError: { vibration: "off", sound: "off" }
        },
        autoSaveEnabled: false,
        counts,
        workingCounts: counts,
        records: []
      })
    );
  }, EMPTY_COUNTS);

  await page.goto("/#/");
  const motorcycleButton = page.getByLabel(/^機車 加一/);
  const carButton = page.getByLabel(/^汽車 加一/);
  await expect(motorcycleButton).toBeVisible();
  await expect(carButton).toBeVisible();

  const motorcycleBox = await motorcycleButton.boundingBox();
  const carBox = await carButton.boundingBox();
  expect(motorcycleBox).not.toBeNull();
  expect(carBox).not.toBeNull();
  if (motorcycleBox === null || carBox === null) throw new Error("找不到計數按鈕座標");

  const motorcyclePoint = {
    id: 1,
    x: motorcycleBox.x + motorcycleBox.width / 2,
    y: motorcycleBox.y + motorcycleBox.height / 2
  };
  const carPoint = {
    id: 2,
    x: carBox.x + carBox.width / 2,
    y: carBox.y + carBox.height / 2
  };
  const cdp = await context.newCDPSession(page);

  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [motorcyclePoint]
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchCancel", touchPoints: [] });
  await expect.poll(() => readCount(page, "機車")).toBe(0);

  const outsideMotorcyclePoint = {
    ...motorcyclePoint,
    y: motorcycleBox.y + motorcycleBox.height + 24
  };
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [motorcyclePoint]
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [outsideMotorcyclePoint]
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => readCount(page, "機車")).toBe(0);

  for (let index = 0; index < 10; index += 1) {
    const point = index % 2 === 0 ? motorcyclePoint : carPoint;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [point] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await expect.poll(() => readCount(page, "機車")).toBe(5);
  await expect.poll(() => readCount(page, "汽車")).toBe(5);

  for (let index = 0; index < 10; index += 1) {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [motorcyclePoint]
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [motorcyclePoint, carPoint]
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [carPoint] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await expect.poll(() => readCount(page, "機車")).toBe(15);
  await expect.poll(() => readCount(page, "汽車")).toBe(15);

  await carButton.click();
  await motorcycleButton.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => readCount(page, "機車")).toBe(16);
  await expect.poll(() => readCount(page, "汽車")).toBe(16);
  expect(pageErrors).toEqual([]);
});
