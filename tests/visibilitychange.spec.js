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

  test('game05 keeps its board stable across visibility changes', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game05_whack_a_mole.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();
    await expect(page.locator('.mole-hole')).toHaveCount(9);

    // Go to background and return. Game05 intentionally does not add a
    // body pause class or force-clear/repopulate moles on visibilitychange.
    await setHidden(page, true);
    await setHidden(page, false);

    // The board remains available and can show an active mole after returning.
    await expect(page.locator('.mole-button.is-up').first()).toBeVisible({ timeout: 8000 });
    expect(errors).toEqual([]);
  });

  test('game01 remains interactive after returning from background', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game01_spelling.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();

    // Wait for the opening word popup to close before interacting.
    await expect(page.locator('#wordPop.show')).toBeHidden({ timeout: 8000 });

    await setHidden(page, true);
    await setHidden(page, false);

    const letter = page.locator('#letters .letter').first();
    await expect(letter).toBeVisible();
    await letter.click();

    expect(errors).toEqual([]);
  });
});
