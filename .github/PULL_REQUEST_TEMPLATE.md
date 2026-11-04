# Pull Request

## Summary

<!-- Describe the user-visible change and why it is needed. -->

## Change type

Select all that apply:

- [ ] Word, emoji, or clue data (`assets/words.js`)
- [ ] Story content (`assets/story.js`)
- [ ] Shared game behaviour (`assets/common.js`)
- [ ] Shared lifecycle, timer, or cleanup behaviour (`assets/game-lifecycle.js`)
- [ ] Mode menu (`game_mode.html` or `assets/mode.js`)
- [ ] One game’s gameplay or UI
- [ ] Shared visual style (`assets/styles.css` or `assets/game.css`)
- [ ] Game-specific visual style
- [ ] Documentation only
- [ ] Test or tooling only

## Affected files and games

List every file changed and every game/page that may be affected:

- [ ] `index.html`
- [ ] `game_mode.html`
- [ ] `game01_spelling.html`
- [ ] `game02_fishing.html`
- [ ] `game03_ghost_maze.html`
- [ ] `game04_racing.html`
- [ ] `game05_whack_a_mole.html`
- [ ] `game06_fill_blank.html`
- [ ] `game07_spaceship.html`
- [ ] `assets/common.js`
- [ ] `assets/game-lifecycle.js`
- [ ] `assets/mode.js`
- [ ] `assets/words.js`
- [ ] `assets/story.js`
- [ ] Shared CSS
- [ ] Game-specific CSS
- [ ] Tests

## Scope and architecture

- [ ] This PR contains one focused change.
- [ ] Game-specific logic remains in the relevant `game*.html` file.
- [ ] Shared word, story, style, and lifecycle logic remains in `assets/`.
- [ ] No game page declares its own `bonusWord` or `bonusRemaining`.
- [ ] Bonus state is read through `RoboCommon.getBonusState()`.
- [ ] Bonus progress is advanced only through `RoboCommon.consumeBonusLetter()`.
- [ ] Direct `setTimeout`, `setInterval`, and `requestAnimationFrame` calls are not introduced; use the shared timer manager.
- [ ] `game.cleanup()` is called when leaving a mode or completing a word.

## Encoding and Markdown

- [ ] All changed source files are saved as UTF-8 with BOM (`UTF-8-BOM`).
- [ ] No smart quotes, non-breaking spaces, or zero-width characters were introduced.
- [ ] Markdown changes use real newline characters; the rendered preview does not show literal `\n` sequences.
- [ ] Headings, lists, tables, and fenced code blocks render correctly on GitHub.
- [ ] No blanket find-and-replace of `\n` was applied to JavaScript source code.

## Game-state checks

- [ ] `level` starts at 1 and `stars` starts at 0.
- [ ] Completing one word adds one star.
- [ ] Every three stars increases `level` by one.
- [ ] `level`, `stars`, and the current `word` are preserved and forwarded through URL parameters.
- [ ] Returning to `game_mode.html` carries the latest `level` and `stars`.
- [ ] Story progression and level unlocking still work.
- [ ] Duplicate interactions do not award duplicate stars.
- [ ] Incorrect answers do not create a dead end.
- [ ] Missed correct targets can reappear in a later round.

## Testing

Run the applicable checks locally:

```bash
npm install
npx playwright install
npx playwright test
```

- [ ] Desktop Chrome was tested.
- [ ] iPad Safari was tested in both portrait and landscape orientations.
- [ ] The browser console has no JavaScript errors.
- [ ] Mode switching, word completion, returning to the menu, and page background/foreground transitions were tested.
- [ ] All bonus-mode games were tested if `assets/common.js` changed.
- [ ] All games using word data were tested if `assets/words.js` changed.
- [ ] Story progression and level unlocking were tested if `assets/story.js` changed.
- [ ] Playwright tests pass, including the `mobile-safari` iPad WebKit project for spaceship changes.
- [ ] For final spaceship confirmation, the page was checked on a real iPad and `#hint` contains no errors.

## iPad Safari compatibility

Complete this section for any UI, input, audio, canvas, overlay, or shared-helper change:

- [ ] `RoboCommon` is not destructured at script start.
- [ ] Optional browser APIs are guarded with feature checks or `try/catch`.
- [ ] `ctx.roundRect` is not used; use the local `roundRectPath()` helper where needed.
- [ ] Full-screen overlays handle `click`, `pointerdown`, and `touchend`, and include a visible close button.
- [ ] Overlay close timers remain in the file that opened them.
- [ ] Tap targets set the intended game target without being overridden by subsequent `pointermove` events.
- [ ] Game startup and word selection failures surface visibly in `#hint`.
- [ ] A fallback word list remains available if `assets/words.js` fails to load.

## Child-friendly UI

- [ ] Buttons and touch targets remain large enough for young children.
- [ ] Positive feedback, animations, and sound effects remain clear and appropriate.
- [ ] Text selection, long-press menus, tap highlights, and page rubber-banding remain prevented.
- [ ] Layout uses `100dvh`, safe-area insets, and avoids header/footer overlap.
- [ ] Important UI is not hidden on small screens or in either iPad orientation.

## Deployment

- [ ] The change works when served from the repository root.
- [ ] GitHub Pages deployment from `main` will not break.
- [ ] Any new file is included in the service worker cache list if it must work offline.

## Screenshots or recordings

<!-- Add desktop and iPad screenshots or a short recording for UI changes. -->

## Reviewer checklist

- [ ] The change scope is focused and correctly placed.
- [ ] The affected games and shared modules have been tested.
- [ ] No shared-state, timer, cleanup, or iPad Safari regression is visible.
- [ ] The GitHub-rendered Markdown preview is correct.
- [ ] The validation workflow passes before merge.
