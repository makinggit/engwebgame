# Robo-Monster Spelling Academy

A HTML5 spelling game for children around age 7.

## Run locally

Open `index.html` directly in a modern browser. No server or package installation is required.

## Encoding

File encoding is in UTF-8-BOM.

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

## Shared lifecycle & timers

Each game should use the shared lifecycle module to avoid leftover timers, animation frames, and event listeners when switching modes, completing a word, returning to the mode menu, or hiding the page.

Add this script before the game-specific script:

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

# Development Brief

以下是一份開發說明。它總結所有已完成需求與規則；請以它作為後續開發、除錯及改版的單一規格來源。

## 專案目標

建立一個適合兒童的單檔 HTML 拼字遊戲，主角為 Momo the Monster 和 Bolt the Robot。玩家透過不同小遊戲拼出英文單字，收集星星、升級，並解鎖《The Lost School Colours》故事。

核心原則：

- 適合 iPad Safari、手機瀏覽器及桌面瀏覽器。
- 單一 HTML 檔案，不依賴外部圖片、字型、框架或遊戲引擎。
- 保留原有 `words`、`level`、`stars`、升級故事與 URL 狀態。
- 操作必須適合幼兒：大按鈕、清晰回饋、無文字選取、無長按選單、無頁面回彈。
- 每個遊戲模式都應有明確的完成條件、音效、動畫及正向回饋。

## 共用規則

### 資料與狀態

保留原有英文單字資料，包括 `word`、`emoji` 及 `clue`。

至少包含以下單字：

- notebook
- yellow
- purple
- crayon
- eraser
- pencil
- school
- white
- black
- ruler
- bag
- friends
- quiet
- class
- name
- boys
- Hill

狀態規則：

- `level`：從 1 開始。
- `stars`：從 0 開始。
- 每完成一個單字：`stars` 加 1。
- 每累積 3 粒星星：`level` 加 1。
- 每次升級顯示對應故事頁。
- URL 必須保留並更新 `level`、`stars`，必要時保留 `word`。
- 返回 `game_mode.html` 時，必須帶回最新 `level` 與 `stars`。

URL 範例：

```text
game_mode.html?level=3&stars=7
game05_whack_a_mole.html?level=3&stars=7&word=notebook
```

### UI 與行動裝置

- Header 必須顯示遊戲標題、Mode 按鈕、Level 與 Stars。
- `gameHeading` 與 `game_mode` 不可放在 `display: none` 的舊 panel 內，否則會消失。
- Mode 按鈕應導向 `game_mode.html?level=...&stars=...`。
- 禁止文字選取、長按選單、點擊藍色高亮及頁面拖動回彈。
- 使用 `100dvh`、safe-area insets、大按鈕與大觸控目標。
- Canvas 或遊戲區應佔滿可用高度，且不可被 header 或 footer 遮擋。
- 遊戲區內容可放大，但不得遮擋重要 UI。

### 音效與語音

- 使用 Web Audio API 產生正確、錯誤、勝利與升級音效。
- 使用 SpeechSynthesis 朗讀單字與提示。
- 使用者第一次互動後才建立或恢復 AudioContext。
- 錯誤時不應朗讀答案，避免直接透露目標。
- 正確完成時可朗讀完整單字。

## 《The Lost School Colours》故事

故事共 100 頁，每頁不超過 260 字，適合兒童閱讀。

- Page 0：Momo 與 Bolt 發現神秘書包，內有 notebook、crayons、pencils、eraser、ruler 及散亂字母。
- Page 1：邀請玩家成為 Spelling Explorer，每答對一個 word 得一顆星；每 3 顆星升級並解鎖新故事。
- Page 2–11：黃色蠟筆寶藏、紫色彩虹路、飛行鉛筆、大笑橡皮擦、黑色夜晚筆記本、蠟筆火箭、跳舞書包、秘密鉛筆訊息、白板雪山、彩虹拼字遊行。
- Page 12–99：11 個原創章節，每章 8 頁，共 88 頁。

章節包括：

1. The Whispering Window  
2. The Paper Boat River  
3. The Clockwork Caterpillar  
4. The Library of Lost Letters  
5. The Musical Chalkboard  
6. The Glue That Would Not Stick  
7. The Puzzle Piece Garden  
8. The Cloudy Reading Corner  
9. The Shiny Stapler Castle  
10. The Mirror Maze  
11. The Colourful Compass  

每章應有不同場景、問題、朋友、解決方法與正面訊息，避免重複。

故事等級對應：

- Level 1 → Page 0
- Level 2 → Page 1
- Level 100 → Page 99

## Game 02: Whack-a-Word

檔案名稱保留：

```text
game02_fishing.html
```

這是 3 × 3 打地鼠遊戲，共 9 個洞。

### 版圖與流程

- 3 行 × 3 列，共 9 個地鼠洞。
- 每輪彈出 3 隻地鼠：
  - 1 隻顯示正確目標 word。
  - 2 隻顯示不同干擾 word。
- 玩家必須點擊**整個目標 word**，不是逐個字母。
- 正確地鼠停留約 2.4 秒後降下；約 0.3 秒後出現下一輪。
- 若錯過目標，目標會在之後的輪次再次出現，不可卡關。

### 開始 Popup

- 每個新 word 開始時，彈出完整目標 word。
- 同時朗讀：「Find the word notebook. Notebook.」
- Popup 在 5 秒後自動關閉。
- Popup 關閉後，地鼠才開始出現。
- 不得在遊戲區另行顯示目標提示。

### 隱藏 UI

隱藏以下元素，但保留 DOM 以避免舊程式碼錯誤：

```html
<div id="miniWord"></div>
<div id="bonusStatus"></div>
```

使用 CSS：

```css
#miniWord,
#bonusStatus {
  display: none !important;
}
```

### 保留 Hear the Word

保留「Hear the Word」按鈕。

- 按下後朗讀完整目標 word。
- 不重新彈出開始 popup。
- 不顯示目標 word 於遊戲區。

### 正確與錯誤回饋

- 點中正確 word：播放勝利音效，地鼠播放壓扁動畫並降下。
- 點錯 word：播放錯誤音效，地鼠壓扁並降下，但不結束遊戲。
- 正確後：先降下所有地鼠，停止計時器，再延遲約 450 毫秒進入完成流程。
- 完成後：加 1 粒星星；每 3 粒星星升 1 級。
- 防止同一地鼠重複點擊或重複計分。

## Game 04: Bolt’s Letter Adventure

檔案名稱：

```text
game04_racing.html
```

這是橫向自動前進的平台跳躍拼字遊戲。

### 角色與畫面

- Bolt 必須固定在畫面左側。
- 鏡頭跟隨 Bolt，使其保持在畫面左邊約三分之一位置。
- 遊戲內容放大 50%。
- Bolt 自動向右前進，玩家只控制跳躍。
- 跳躍初速為 820。
- 地圖長度約為 24,000 像素，或依單字長度自動延長。

### 字母規則

- 每個字母段落應有約一半正確、一半錯誤的字母。
- 正確字母可以出現在平台或地面。
- 錯誤字母也可以出現在平台或地面。
- 玩家必須按單字順序收集正確字母。
- 碰到錯誤字母時，Bolt 被困 0.5 秒。
- 錯誤字母有 1.2 秒冷卻時間，避免重複觸發。
- 若正確字母被錯過，應在 Bolt 前方重新生成，避免無法完成單字。

### 平台

- 增加多個可跳上的平台。
- 平台必須有由上而下的碰撞判定。
- Bolt 可以從上方落在平台並站立。
- 平台不應阻擋 Bolt 的水平自動前進。

### 完成與城堡

- 只有收集完所有字母後，終點城堡 🏰 才會出現。
- 完成單字後，城堡出現並播放勝利音效。
- Bolt 走向城堡，約 2.5 秒後顯示完成畫面。
- 完成後加 1 粒星星；每 3 粒星星升 1 級。

### 順滑度與除錯

- 使用固定物理步長，例如 `1/120` 秒。
- 渲染跟隨螢幕刷新率，物理更新使用時間累積器。
- 限制單幀最多處理 0.05 秒。
- 頁面切到背景或返回時重設 `lastTime` 與 `accumulator`。
- Canvas 只在實際尺寸改變時重設。
- 限制 `devicePixelRatio` 最高為 2。
- 使用 `alpha: false` 減少透明度重繪。
- 新單字開始時必須完整重設 `trappedUntil`、`clock`、`lastTime`、`accumulator`、`index`、玩家位置、字母與平台。
- 修復「第一個字答對後，下一個字卡住不動」的問題。

## Game 05: Whack-a-Word

檔案名稱：

```text
game05_whack_a_mole.html
```

這是根據打地鼠遊戲改成的「找整個 word」版本。

### 版圖

- 3 行 × 3 列，共 9 個洞。
- 每輪彈出 3 隻地鼠：
  - 1 隻顯示正確目標 word。
  - 2 隻顯示不同干擾 word。
- 地鼠顯示完整 word，不是單一字母。

### 開始 Popup

- 每題開始時彈出完整目標 word。
- 同時朗讀完整 word。
- Popup 在 5 秒後自動關閉。
- Popup 關閉後，地鼠才開始出現。
- 不得在遊戲區另行顯示目標提示。

### 隱藏 UI

隱藏：

```html
<div id="miniWord"></div>
<div id="bonusStatus"></div>
```

但保留 DOM 元素，避免舊有 JavaScript 引用錯誤。

### 保留 Hear the Word

保留「Hear the Word」按鈕：

- 可再次朗讀完整目標 word。
- 不重新彈出開始 popup。
- 不重新顯示答案提示。

### 正確與錯誤

- 點中正確 word：播放勝利音效，全部地鼠降下，完成該 word。
- 點錯 word：播放錯誤音效，地鼠降下，但不結束遊戲。
- 不因點錯而重新朗讀或顯示答案。
- 防止重複點擊與重複計分。
- 完成後加 1 粒星星；每 3 粒星星升 1 級。

## 共通除錯要求

開發或修改任何模式時，必須檢查：

- Header 的 `gameHeading` 與 `game_mode` 是否可見。
- `level` 與 `stars` 是否正確更新及傳遞。
- 完成單字後是否能正常進入下一個單字。
- 計時器是否在完成、暫停、切換模式或離開頁面時清除。
- 錯誤字母或錯誤 word 是否會造成卡關。
- 正確目標是否可能被錯過而無法再出現。
- 重複點擊是否會重複計分。
- 頁面切到背景再返回時，是否會出現大跳、卡頓或計時異常。
- 是否仍保留原有 `words`、`level`、`stars`、升級故事與 URL 參數。
- JavaScript 是否通過語法檢查。
- 是否適合 iPad Safari 觸控操作。

## 開發指令

請依以下規則繼續開發：

1. 保留單一 HTML 檔案結構，不引入外部遊戲引擎或圖片資源。
2. 保留原有 `words`、`level`、`stars`、升級故事與 URL 參數。
3. 所有遊戲模式都必須適合兒童，並提供清晰音效、動畫與正向回饋。
4. 不要在遊戲區長期顯示答案；目標 word 只在開始 popup 顯示 5 秒。
5. 保留「Hear the Word」按鈕，讓兒童可重聽完整目標 word。
6. 打地鼠遊戲必須找整個 word，而不是逐個字母。
7. 賽跑遊戲必須找字母，但正確字母被錯過後要能重新出現。
8. 所有互動必須有防重複點擊保護。
9. 所有計時器必須在完成、暫停、切換模式或離開頁面時清除。
10. 每次修改後，檢查語法、狀態重設、移動順滑度、行動裝置觸控及 UI 是否完整。
