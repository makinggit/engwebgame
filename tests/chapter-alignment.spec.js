const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('chapter alignment', () => {
  test('uses default chapter start levels', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'index.html');

    const chapters = await page.evaluate(() => ({
      level1: RoboCommon.getChapterForLevel(1),
      level2: RoboCommon.getChapterForLevel(2),
      level4: RoboCommon.getChapterForLevel(4),
      level5: RoboCommon.getChapterForLevel(5),
      level100: RoboCommon.getChapterForLevel(100),
    }));

    expect(chapters).toEqual({
      level1: 1,
      level2: 2,
      level4: 2,
      level5: 3,
      level100: 3,
    });
    expect(errors).toEqual([]);
  });

  test('supports custom and future chapter thresholds', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'index.html');

    const chapters = await page.evaluate(() => {
      const starts = { 1: 1, 2: 2, 3: 5, 4: 9 };
      return {
        level1: RoboCommon.getChapterForLevel(1, starts),
        level4: RoboCommon.getChapterForLevel(4, starts),
        level5: RoboCommon.getChapterForLevel(5, starts),
        level8: RoboCommon.getChapterForLevel(8, starts),
        level9: RoboCommon.getChapterForLevel(9, starts),
        level50: RoboCommon.getChapterForLevel(50, starts),
      };
    });

    expect(chapters).toEqual({
      level1: 1,
      level4: 2,
      level5: 3,
      level8: 3,
      level9: 4,
      level50: 4,
    });
    expect(errors).toEqual([]);
  });

  test('parent settings normalize and auto-save ascending chapter starts', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'index.html');

    await page.locator('#settingsBtn').click();

    const question = await page.locator('#gateQuestion').textContent();
    const [left, right] = question.split('×').map((value) => Number(value.trim()));
    await page.locator('#gateAnswer').fill(String(left * right));
    await page.locator('#gateCheckBtn').click();

    await expect(page.locator('#parentSettings')).toBeVisible();

    await page.locator('#chapter1Start').fill('1');
    await page.locator('#chapter2Start').fill('1');
    await page.locator('#chapter3Start').fill('2');

    await page.locator('#chapter3Start').dispatchEvent('change');

    await expect(page.locator('#chapter1Start')).toHaveValue('1');
    await expect(page.locator('#chapter2Start')).toHaveValue('2');
    await expect(page.locator('#chapter3Start')).toHaveValue('3');

    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('roboParentSettings')));
    expect(saved.chapterStartLevels).toEqual({ 1: 1, 2: 2, 3: 3 });
    expect(errors).toEqual([]);
  });
});
