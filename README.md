# Robo-Monster Spelling Academy

A single-file HTML5 spelling game for children around age 7.

## Game modes

- Spelling Mission
- Fish for Letters
- Ghost Letter Maze
- Rainbow Race and Chase

## Run locally

Open `index.html` directly in a modern browser. No server or package installation is required.

## Development workflow

1. Create a feature or fix branch from `main`.
2. Make one focused change at a time.
3. Test desktop Chrome and iPad Safari, including portrait/landscape layouts.
4. Check browser console for JavaScript errors.
5. Open a pull request and describe the user-visible change and test steps.
6. Merge only after the validation workflow passes.

## Important game-state rules

- The word list and current letter state are the source of truth; UI text should be rendered from state.
- Ghost Maze must keep three moving ghosts.
- The current correct letter must always be represented by one ghost.
- Letter matching occurs only after an actual robot/ghost collision.
- Timers must be cleared when changing mode or completing a word.

## Deployment

This repository is suitable for GitHub Pages. Enable Pages in repository settings and publish from `main` or a GitHub Actions workflow.
