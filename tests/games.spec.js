const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test.describe('game01_spelling', () => {
  test('loads, shows letters, and accepts a letter tap without errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game01_spelling.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();
    const letter = page.locator('#letters .letter').first();
    await expect(letter).toBeVisible();
    await letter.click();
    expect(errors).toEqual([]);
  });
});

test.describe('game02_fishing', () => {
  test('loads and shows a fish target without errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game02_fishing.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();
    await expect(page.locator('#playArea .target.fish').first()).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('game03_ghost_maze', () => {
  test('loads and shows maze controls without errors', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game03_ghost_maze.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();
    await expect(page.locator('.ghost-maze-controls .up')).toBeVisible();
    await expect(page.locator('.ghost-maze-controls .down')).toBeVisible();
    await expect(page.locator('.ghost-maze-controls .left')).toBeVisible();
    await expect(page.locator('.ghost-maze-controls .right')).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('game04_racing', () => {
  test('loads, shows canvas, and jump does not throw', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game04_racing.html?level=1&stars=0');
    await expect(page.locator('#racingApp')).toBeVisible();
    await expect(page.locator('#game')).toBeVisible();
    await page.locator('#jump').dispatchEvent('pointerdown');
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });
});

test.describe('game05_whack_a_mole', () => {
  test('shows nine holes, intro popup closes after 5 seconds', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game05_whack_a_mole.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();
    await expect(page.locator('#wordPop.show')).toBeVisible();
    await expect(page.locator('.mole-hole')).toHaveCount(9);
    await expect(page.locator('#wordPop.show')).toBeHidden({ timeout: 8000 });
    expect(errors).toEqual([]);
  });
});

test.describe('game06_fill_blank', () => {
  test('shows sentence popup, speaks it, and closes after 5 seconds', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game06_fill_blank.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();

    const popup = page.locator('#wordPop.show');
    await expect(popup).toBeVisible();
    await expect(page.locator('#popWord')).not.toHaveText('');
    await expect(popup).toBeHidden({ timeout: 7000 });

    await page.locator('#hearBtn').click();
    await expect(popup).toBeVisible();
    await expect(popup).toBeHidden({ timeout: 7000 });

    expect(errors).toEqual([]);
  });

  test('renders only lowercase choices and fills the first blank', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game06_fill_blank.html?level=1&stars=0');
    await expect(page.locator('#gamePage')).toBeVisible();

    // Wait for the opening sentence popup to close before interacting.
    await expect(page.locator('#wordPop.show')).toBeHidden({ timeout: 7000 });

    const choices = page.locator('#letters .letter');
    await expect(choices.first()).toBeVisible();
    const choiceCount = await choices.count();
    expect(choiceCount).toBeGreaterThan(0);

    for (let i = 0; i < choiceCount; i += 1) {
      await expect(choices.nth(i)).toHaveText(/^[a-z]$/);
    }

    const firstBlank = page.locator('.sentence-blank').first();
    await expect(firstBlank).toBeVisible();
    const before = await firstBlank.textContent();
    await choices.first().click();
    const after = await firstBlank.textContent();

    expect(after).not.toBe(before);
    expect(errors).toEqual([]);
  });
});

test.describe('game_mode navigation', () => {
  test('passes level and stars to each game', async ({ page }) => {
    const cases = [
      ['game01_spelling', 'game01_spelling.html'],
      ['game02_fishing', 'game02_fishing.html'],
      ['game03_ghost_maze', 'game03_ghost_maze.html'],
      ['game04_racing', 'game04_racing.html'],
      ['game05_whack_a_mole', 'game05_whack_a_mole.html'],
      ['game06_fill_blank', 'game06_fill_blank.html'],
    ];
    for (const [buttonId, target] of cases) {
      await page.goto(BASE + 'game_mode.html?level=2&stars=3');
      await page.locator('#' + buttonId).click();
      await expect(page).toHaveURL(new RegExp(target.replace('.', '\\.') + '\\?level=2&stars=3'));
    }
  });
});
