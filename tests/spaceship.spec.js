const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('spaceship spelling game', () => {
  test('loads without errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    await expect(page.locator('#boostBtn')).toBeVisible();
    const state = await page.evaluate(() => RoboSpaceship.getState());
    expect(state.word).not.toBe('');
    expect(errors).toEqual([]);
  });

  test('automatically fires a laser', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    await page.waitForTimeout(500);
    const state = await page.evaluate(() => RoboSpaceship.getState());

    expect(state.lasers).toBeGreaterThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test('boost button activates a three-second boost', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    await page.locator('#boostBtn').click();
    const state = await page.evaluate(() => RoboSpaceship.getState());

    expect(state.boostUntil).toBeGreaterThan(state.clock);
    expect(state.boostUntil - state.clock).toBeLessThanOrEqual(3);
    expect(errors).toEqual([]);
  });

  test('laser destroys an asteroid without losing HP', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    await page.evaluate(() => {
      const state = RoboSpaceship.getState();
      RoboSpaceship.spawnAsteroid(state.shipX, 300);
      RoboSpaceship.fireLaser();
    });

    await expect
      .poll(() => page.evaluate(() => RoboSpaceship.getState().asteroids), { timeout: 3000 })
      .toBe(0);

    const state = await page.evaluate(() => RoboSpaceship.getState());
    expect(state.hp).toBe(5);
    expect(errors).toEqual([]);
  });

  test('arrow keys move the spaceship', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    const before = await page.evaluate(() => RoboSpaceship.getState().shipX);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(400);
    await page.keyboard.up('ArrowRight');

    const after = await page.evaluate(() => RoboSpaceship.getState().shipX);
    expect(after).toBeGreaterThan(before);
    expect(errors).toEqual([]);
  });
});
