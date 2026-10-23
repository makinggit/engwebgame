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
| `game02_fishing.html` | Whack-a-Word game; filename retained for compatibility |
| `game03_ghost_maze.html` | Ghost Maze game |
| `game04_racing.html` | Bolt’s Letter Adventure platform game |
| `game05_whack_a_mole.html` | Whack-a-Word game |
| `game06_fill_blank.html` | Fill-in-the-blank game |

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

Source files use UTF-8-BOM encoding.

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

### Whack-a-Word

Applies to `game02_fishing.html` and `game05_whack_a_mole.html`.

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

## Testing

The repository includes Playwright configuration and tests.

```bash
npm install
npx playwright install
npx playwright test
```

## Deployment

This repository is suitable for GitHub Pages. Enable Pages in repository settings and publish from `main` or a GitHub Actions workflow.
