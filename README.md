# Robo-Monster Spelling Academy

A multi-page HTML5 spelling game for children around age 7.

## Architecture

This project uses a modular static-site structure:

- Multiple standalone HTML game pages.
- Shared JavaScript, CSS, word data, and story data under `assets/`.
- No external game engine, framework, image asset, or web font.
- `level`, `stars`, and the current `word` are passed between pages through URL parameters.

### Pages

| File | Purpose |
|---|---|
| `index.html` | Entry page |
| `game_mode.html` | Game-mode menu; receives and forwards `level` and `stars` |
| `game01_spelling.html` | Spelling game |
| `game02_fishing.html` | Fishing letter quest: catch the fish carrying the next correct letter |
| `game03_ghost_maze.html` | Ghost Maze letter quest: collect the correct letter from moving ghosts |
| `game04_racing.html` | Bolt’s Letter Adventure platform game |
| `game05_whack_a_mole.html` | Whack-a-Word game: select the complete target word from moles |
| `game06_fill_blank.html` | Fill-in-the-blank game |
| `game07_spaceship.html` | Spaceship letter-shooting game |

### Shared assets

| File | Responsibility |
|---|---|
| `assets/common.js` | Shared game utilities, state, audio, and speech helpers |
| `assets/game-lifecycle.js` | Shared timer, animation-frame, event, and cleanup lifecycle |
| `assets/mode.js` | Mode-menu behaviour |
| `assets/words.js` | Single source of truth for spelling words, emoji, and clues |
| `assets/story.js` | Single source of truth for story pages |
| `assets/styles.css` | Shared styles |
| `assets/game.css` | Shared game styles |
| `assets/game01_spelling.css` | Game 01 styles |
| `assets/game04_racing.css` | Game 04 styles |

## Run locally

Open `index.html` directly in a modern browser. No package installation is required for normal development.

If the browser restricts local file access or audio behaviour, serve the repository from its root:

```bash
npx serve .
```

Then open the local URL shown in the terminal.

## Encoding

- All source files must be saved as **UTF-8 with BOM** (`UTF-8-BOM`).
- Do not save files as UTF-16, Latin-1, or mixed encodings; mixed encodings can introduce invisible characters that break JavaScript parsing.
- After editing any `.js` or `.html` file, confirm the browser console has no `SyntaxError`, `Unexpected identifier`, or `Invalid or unexpected token` before committing.
- Do not paste content from word processors or chat windows directly into source files without checking for smart quotes, non-breaking spaces, or zero-width characters.
- Markdown files must contain real newline characters, not literal `\n` text. A literal `\n` is only acceptable inside a code example that intentionally demonstrates an escape sequence.
- When creating or editing `README.md` with an editor, script, AI tool, or clipboard paste, verify that line breaks are preserved as actual newlines before committing.
- If GitHub renders a Markdown file as one long line or displays repeated `\n` sequences, stop and rewrite the file with real newlines before merging.
- Do not use a blanket find-and-replace for `\n` in source code: JavaScript string literals may legitimately contain `\n`. Apply the fix only to Markdown or text files where a visual line break was intended.
- Before committing a Markdown change, inspect the GitHub diff and rendered preview. Headings, lists, tables, and fenced code blocks must appear on separate lines.

## Development workflow

1. Create a feature or fix branch from `main`.
2. Make one focused change at a time.
3. Keep game-specific logic in the relevant `game*.html` file.
4. Keep shared word, story, style, and lifecycle logic in `assets/`.
5. Test desktop Chrome and iPad Safari, including portrait and landscape layouts.
6. Check the browser console for JavaScript errors.
7. Open a pull request describing the user-visible change and test steps.
8. Merge only after the validation workflow passes.

## Change impact

| Change type | Files to change | Regression scope |
|---|---|---|
| Word, emoji, or clue data | `assets/words.js` | Test every game that uses word data |
| Story content | `assets/story.js` | Test story progression and level unlocking |
| Shared behaviour | `assets/common.js` | Test all affected games |
| Timer or cleanup behaviour | `assets/game-lifecycle.js` | Test mode switching, word completion, returning to the menu, and background/foreground transitions |
| One game’s gameplay | Relevant `game*.html` | Test that game plus mode-menu round trips |
| Shared visual style | `assets/styles.css` or `assets/game.css` | Test all games on desktop and iPad |
| Game-specific visual style | Relevant game CSS file | Test the affected game |

## Game-state rules

- `level` starts at 1.
- `stars` starts at 0.
- Completing one word adds one star.
- Every three stars increases `level` by one.
- Level progression unlocks the corresponding story page.
- URL state must preserve and update `level`, `stars`, and, where applicable, `word`.
- Returning to `game_mode.html` must carry the latest `level` and `stars`.

Examples:

```text
game_mode.html?level=3&stars=7
game05_whack_a_mole.html?level=3&stars=7&word=notebook
```

## Shared letter-quest state

`questWord`, `remainingQuestLetters`, and `activeMode` for letter quests (fishing, ghost maze, racing) are owned by `assets/common.js`. Game pages must **never** declare their own `questWord` or `remainingQuestLetters` variables, because that creates a second, empty copy and the game will show no fish or ghosts, or `undefined` letters.

Read the current quest state through the shared accessor:

```js
const quest = RoboCommon.getLetterQuestState();
// quest.questWord             - current word
// quest.remainingQuestLetters - letters still to find
// quest.activeMode            - current letter-quest mode
```

Consume a correct letter through the shared mutator:

```js
RoboCommon.consumeQuestLetter(); // removes the first remaining letter
```

### Why this rule exists

Commit `6595632` added `let bonusWord` and `let bonusRemaining` inside `common.js`’s IIFE. After that, `startBonusMode()` wrote to common.js’s private copies while `game02`/`game03` read their own empty page-level copies. The result was no fish in game02 and `undefined` ghost letters in game03, with no obvious console error.

### Rules for game pages

1. Do not declare `let questWord`, `let remainingQuestLetters`, or `var questWord` in a game HTML file.
2. Always read quest state with `RoboCommon.getLetterQuestState()`.
3. Always advance the quest with `RoboCommon.consumeQuestLetter()`; never call `.shift()` on a local copy.
4. If a game needs its own `startLetterQuestMode`, it must either call `RoboCommon.activateMode(mode)` or fully manage its own state; never mix both.
5. After changing `common.js`, test **every** letter-quest game (fishing, ghost maze, racing), not only the game you edited.

## Shared lifecycle and timers

Every game must use the shared lifecycle module to avoid leftover timers, animation frames, and event listeners when switching modes, completing a word, returning to the mode menu, or hiding the page.

Load it before the game-specific script:

```html
<script src="./assets/game-lifecycle.js"></script>
```

Create a timer manager and game lifecycle:

```js
const timers = RoboGame.createTimerManager();

const game = RoboGame.createGameLifecycle({
  name: 'whack-a-word',
  timers,
  hooks: {
    initGame() {
      // Reset word, score, DOM, and round state.
    },
    startRound() {
      // Show moles, letters, or the next prompt.
    },
    handleCorrect() {
      // Award one star and prepare the next word.
    },
    handleWrong() {
      // Provide feedback without revealing the answer.
    },
    completeWord() {
      // Stop the round and navigate or load the next word.
    },
    cleanup() {
      // Reset DOM and game-specific state.
    }
  }
});
```

Replace direct browser timer calls with managed calls:

```js
// Before
setTimeout(showNextRound, 450);
setInterval(moveGhost, 1000);
requestAnimationFrame(render);

// After
timers.setTimeout(showNextRound, 450);
timers.setInterval(moveGhost, 1000);
timers.requestAnimationFrame(render);
```

Use `game.cleanup()` when leaving a mode or completing a word. The lifecycle also automatically cleans up on `pagehide`, `beforeunload`, and when the page becomes hidden.

## UI and mobile rules

- Keep large buttons and large touch targets suitable for young children.
- Provide clear positive feedback, animations, and sound effects.
- Prevent text selection, long-press menus, tap highlights, and page rubber-banding.
- Use `100dvh`, safe-area insets, and layouts that avoid header or footer overlap.
- Ensure the game area uses the available height without hiding important UI.
- Test iPad Safari in both portrait and landscape orientations.

## Audio and speech

- Use the Web Audio API for correct, incorrect, victory, and level-up sounds.
- Use SpeechSynthesis to read words and prompts.
- Create or resume `AudioContext` only after the user’s first interaction.
- Do not read the answer aloud after an incorrect choice.
- Reading the completed word aloud is allowed after success.

## Story progression

The story, *The Lost School Colours*, has 100 pages. Each page should contain no more than 260 words and remain suitable for young readers.

- Level 1 maps to story page 0.
- Level 2 maps to story page 1.
- Level 100 maps to story page 99.
- Every three stars increases the player’s level and unlocks the next story page.

Story content belongs in `assets/story.js`; do not duplicate story pages inside individual game HTML files.

## Game-specific rules

### Fishing

Applies to `game02_fishing.html`.

- Show fish carrying letters from the current quest word.
- The player catches the fish carrying the next correct letter in word order.
- Read the current quest state through `RoboCommon.getLetterQuestState()`.
- Advance the quest only through `RoboCommon.consumeQuestLetter()`.
- Show fish immediately after the word popup closes.
- Clear timers and clean up game state when changing mode or completing a word.

### Whack-a-Word

Applies to `game05_whack_a_mole.html`.

- Use a 3 × 3 board with nine holes.
- Show three moles per round: one correct target word and two different distractor words.
- The player selects the complete target word, not individual letters.
- Show the target word in a start popup for five seconds and read it aloud.
- Start moles only after the popup closes.
- Keep the **Hear the Word** button; it may replay the target word but must not reopen the popup or reveal an in-game hint.
- Prevent duplicate clicks and duplicate scoring.
- An incorrect choice plays error feedback but does not end the game.
- A missed correct target must appear again in a later round.

### Ghost Maze

Applies to `game03_ghost_maze.html`.

- Keep three moving ghosts.
- One ghost must always represent the current correct letter.
- Letter matching occurs only after an actual robot/ghost collision.
- Clear timers when changing mode or completing a word.

### Bolt’s Letter Adventure

Applies to `game04_racing.html`.

- Keep Bolt fixed near the left third of the screen while the camera follows.
- Bolt moves forward automatically; the player controls jumping only.
- Provide roughly equal correct and incorrect letters.
- Collect correct letters in word order.
- Trap Bolt for 0.5 seconds after touching an incorrect letter, with a 1.2-second cooldown.
- Regenerate a missed correct letter ahead of Bolt so the word remains completable.
- Show the destination castle only after all letters are collected.
- Use a fixed physics step, such as `1/120` seconds, with rendering tied to the display refresh rate.
- Reset physics, timing, letter, platform, and player state when starting a new word.

## Spaceship game

Applies to `game07_spaceship.html`.

Historical iPad mini Safari issues and their original fixes are documented in [`docs/spaceship-history.md`](docs/spaceship-history.md).

### Current spaceship behaviour

- Tap the spaceship: start/extend a 3-second boost.
- Tap a falling letter: move the ship to that letter’s lane and start a 3-second boost.
- While boosting: letters fall 6× faster, laser range is 2×, background redshifts, engine flame turns red.
- When a laser hits any letter: the boost ends immediately.
- Letters spawn from the top in alternating even/odd lane groups per word.
- A light-yellow circle is drawn around the ship as a graphical protector only.

### Prevention rules for iPad Safari

1. Never destructure shared global objects such as `RoboCommon` at script start; use `const RC = window.RoboCommon || {}` and safe property access with local fallbacks.
2. Guard every optional browser API (`AudioContext`, `speechSynthesis`, `localStorage`, `devicePixelRatio`) with `try/catch` or feature checks.
3. Do not rely on `ctx.roundRect`; use the local `roundRectPath()` helper.
4. For full-screen overlays, handle `click`, `pointerdown`, and `touchend`, and always provide a visible close button.
5. Keep each overlay’s close timer in the file that opened it; do not share timer variables across modules.
6. When a tap must set a game target, suppress subsequent `pointermove` events until `pointerup`/`pointercancel`, or the move handler will override the target.
7. Wrap game startup and word selection in `try/catch` and surface the error in `#hint` so iPad failures are visible without a debugger.
8. Keep a fallback word list so a missing or broken `assets/words.js` cannot prevent the game from starting.
9. In Playwright tests, close any full-screen popup before interacting with the canvas underneath.
10. Run `npm test` (includes the `mobile-safari` iPad WebKit project) before merging; for final confirmation, open the page on a real iPad and check `#hint` for errors.

## Debugging checklist

Before opening a pull request, verify:

- `gameHeading` and `game_mode` remain visible.
- `level` and `stars` update and transfer correctly.
- Completing a word advances correctly to the next word or mode.
- Timers are cleared on completion, pause, mode change, and page exit.
- Incorrect answers do not create a dead end.
- Missed correct targets can reappear.
- Duplicate interactions do not award duplicate stars.
- Backgrounding and restoring the page does not cause timing jumps, freezing, or stutter.
- Word data remains sourced from `assets/words.js`.
- Story data remains sourced from `assets/story.js`.
- JavaScript passes syntax validation.
- Touch interaction works reliably on iPad Safari.
- Letter-quest games show their targets immediately after the word popup closes (fish/ghosts/race letters).
- No game page declares its own `questWord` or `remainingQuestLetters`.
- Markdown files use real newlines; the GitHub-rendered preview does not show literal `\n` sequences.

## Testing

The repository includes Playwright configuration and tests.

```bash
npm install
npx playwright install
npm test
```

`npm test` runs the Playwright test suite. The `mobile-safari` project emulates an iPad (gen 7) with WebKit and must pass before merging spaceship changes.

## Deployment

This repository is suitable for GitHub Pages. Enable Pages in repository settings and publish from `main` or a GitHub Actions workflow.
