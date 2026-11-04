# Spaceship Game Issue History

This document records historical iPad mini Safari issues in `game07_spaceship.html` and the fixes introduced to resolve them. It is retained for engineering context; the current behaviour and prevention rules remain in [`README.md`](../README.md).

## Fixed issues

| Issue | Fix in place |
|---|---|
| `ctx.roundRect` unavailable on older Safari | Use the local `roundRectPath()` helper instead of `ctx.roundRect`. |
| Boost button caused layout and test coupling | The 🚀 Boost button was removed; tapping the spaceship or any falling letter activates the 3-second boost. |
| Tapping a letter did not change the ship’s lane | On a letter tap, set `targetShipX` to the letter’s X and suppress `pointermove` until `pointerup`/`pointercancel` (`pointerBoostActive` flag), otherwise the move handler overwrites the lane target. |
| Boost visual feedback was unclear | During boost: background gradient becomes `#100000` → `#000000`, engine flame turns red, and starfield speeds up. |
| Laser sound was unwanted | `fireLaser()` no longer plays a sound. |
| Boost difficulty | While boosting, falling letters drop at 6× normal speed; the laser range is 2× normal. |
| Boost should not persist after a hit | Hitting any letter (correct or wrong) sets `boostUntil = 0` and ends the boost immediately. |
| Letters appeared mid-screen | Letters spawn above the top edge (`y = 40 - index * 50`) and fall into view. |
| Game failed to start on iPad mini | Do not destructure `RoboCommon`; use safe property access with local fallbacks for every shared helper, keep a fallback word list, and wrap `startWord()`/boot in `try/catch` showing errors in `#hint`. |
| Word popup could not be closed on iPad mini | Use a local `closeWordPopupNow()` (clears the game’s own timer and removes `show`), listen for `click`, `pointerdown`, and `touchend` on `#wordPop`, and provide a visible ✕ button. |
| Spaceship tap test failed because the word popup intercepted the tap | In `tests/spaceship.spec.js`, close `#wordPop` and wait for it to lose `show` before tapping the canvas. |
