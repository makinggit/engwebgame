const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function waitForGameStart(page) {
  await expect(page.locator('#wordPop')).toHaveClass(/show/);
  await expect
    .poll(() => page.evaluate(() => RoboSpaceship.getState().state), { timeout: 5000 })
    .toBe('playing');
}

test.describe('spaceship spelling game', () => {
  test('loads and starts without errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');

    await expect(page.locator('#boostBtn')).toBeVisible();
    await waitForGameStart(page);

    const state = await page.evaluate(() => RoboSpaceship.getState());
    expect(state.word).not.toBe('');
    expect(state.state).toBe('playing');
    expect(errors).toEqual([]);
  });

  test('automatically fires a laser', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');
    await waitForGameStart(page);

    await expect
      .poll(() => page.evaluate(() => RoboSpaceship.getState().lasers), { timeout: 2000 })
      .toBeGreaterThanOrEqual(1);

    const state = await page.evaluate(() => RoboSpaceship.getState());
    expect(state.lasers).toBeGreaterThanOrEqual(1);
    expect(errors).toEqual([]);
  });

  test('boost button activates a three-second boost', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');
    await waitForGameStart(page);

    await page.locator('#boostBtn').click();
    const state = await page.evaluate(() => RoboSpaceship.getState());

    expect(state.boostUntil).toBeGreaterThan(state.clock);
    expect(state.boostUntil - state.clock).toBeLessThanOrEqual(3);
    expect(errors).toEqual([]);
  });

  test('laser destroys an asteroid without losing HP', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game07_spaceship.html?level=1&stars=0');
    await waitForGameStart(page);

    await page.evaluate(() => {
      const state = RoboSpaceship.getState();
      // Place the asteroid directly in the upward laser path.
      RoboSpaceship.spawnAsteroid(state.shipX, state.shipY - 120);
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
    await waitForGameStart(page);

    const before = await page.evaluate(() => RoboSpaceship.getState().shipX);
    await page.keyboard.down('ArrowRight');
    await page.waitForTimeout(400);
    await page.keyboard.up('ArrowRight');

    const after = await page.evaluate(() => RoboSpaceship.getState().shipX);
    expect(after).toBeGreaterThan(before);
    expect(errors).toEqual([]);
  });
});
