const { test, expect } = require('@playwright/test');

const BASE = '/';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

async function expectPopupWordChapter(page, expectedChapter) {
  const popup = page.locator('#wordPop.show');
  await expect(popup).toBeVisible();
  const word = (await page.locator('#popWord').textContent()).trim();
  expect(word).not.toBe('');

  const chapter = await page.evaluate(
    (target) => RoboWords.getWordByText(target)?.chapter,
    word
  );
  expect(chapter).toBe(expectedChapter);
}

test.describe('word chapter selection', () => {
  test('filters WORD_LIST by chapter', async ({ page }) => {
    const errors = trackErrors(page);
    await page.goto(BASE + 'game01_spelling.html?level=1&stars=0');

    const chapters = await page.evaluate(() => ({
      one: RoboWords.getWordsByChapter(1).map((item) => item.word),
      two: RoboWords.getWordsByChapter(2).map((item) => item.word),
    }));

    expect(chapters.one).toContain('notebook');
    expect(chapters.one).not.toContain('cousin');
    expect(chapters.two).toContain('cousin');
    expect(chapters.two).not.toContain('notebook');
    expect(errors).toEqual([]);
  });

  test('game01 uses chapter 1 at level 1 and chapter 2 from level 2', async ({ page }) => {
    const errors = trackErrors(page);

    await page.goto(BASE + 'game01_spelling.html?level=1&stars=0');
    await expectPopupWordChapter(page, 1);

    await page.goto(BASE + 'game01_spelling.html?level=2&stars=0');
    await expectPopupWordChapter(page, 2);

    expect(errors).toEqual([]);
  });

  test('game05 uses chapter 1 at level 1 and chapter 2 from level 2', async ({ page }) => {
    const errors = trackErrors(page);

    await page.goto(BASE + 'game05_whack_a_mole.html?level=1&stars=0');
    await expectPopupWordChapter(page, 1);

    await page.goto(BASE + 'game05_whack_a_mole.html?level=2&stars=0');
    await expectPopupWordChapter(page, 2);

    expect(errors).toEqual([]);
  });
});
