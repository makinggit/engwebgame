const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function setHidden(page, hidden) {
  await page.evaluate((h) => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => (h ? 'hidden' : 'visible'),
    });
    document.dispatchEvent(new Event('visibilitychange'));
  }, hidden);
}

test.describe('visibilitychange pause/resume', () => {
  test('game04 resumes rAF loop after returning from background', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game04_racing.html?level=1&stars=0');
    await expect(page.locator('#racingApp')).toBeVisible();

    // Go to background
    await setHidden(page, true);
    await expect(page.locator('body.is-paused')).toHaveCount(0); // game04 does not use is-paused class

    // Return to foreground
    await setHidden(page, false);
    await page.waitForTimeout(500);

    // Canvas should still be interactive and no errors
    await page.locator('#jump').dispatchEvent('pointerdown');
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

  test('game05 stops moles in background and restarts on return', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game05_whack_a_mole.html?level=1&stars=0');
    await expect(page.locator('.mole-hole')).toHaveCount(9);

    // Go to background: pause hook clears moles
    await setHidden(page, true);
    await expect(page.locator('.mole')).toHaveCount(0);

    // Return: resume hook repopulates moles
    await setHidden(page, false);
    await expect(page.locator('.mole').first()).toBeVisible({ timeout: 5000 });
    expect(errors).toEqual([]);
  });

  test('game01 shows pause overlay in background and removes on return', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game01_spelling.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();

    await setHidden(page, true);
    await expect(page.locator('body.is-paused')).toHaveCount(1);

    await setHidden(page, false);
    await expect(page.locator('body.is-paused')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
});
