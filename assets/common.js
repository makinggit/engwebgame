/* Robo-Monster Spelling Academy - shared utilities */
(function (global) {
	'use strict';

const $ = (id) => document.getElementById(id);
const STORAGE_KEY = 'roboMonsterProgress';

function getParams() {
	return new URLSearchParams(global.location.search);
}

function saveProgress(level, stars) {
	try {
		global.localStorage.setItem(STORAGE_KEY, JSON.stringify({
			level: Math.max(1, Math.floor(level)),
			stars: Math.max(0, Math.floor(stars)),
		}));
	} catch (error) {
		/* localStorage may be unavailable in private browsing. */
	}
}

function readProgress() {
	const params = getParams();
	let saved = { level: 1, stars: 0 };
	try {
		const raw = global.localStorage.getItem(STORAGE_KEY);
		if (raw) {
			const parsed = JSON.parse(raw);
			if (Number.isFinite(parsed.level) && parsed.level >= 1) saved.level = Math.floor(parsed.level);
			if (Number.isFinite(parsed.stars) && parsed.stars >= 0) saved.stars = Math.floor(parsed.stars);
		}
	} catch (error) {
		/* Ignore invalid or unavailable saved data. */
	}

	const urlLevel = Number(params.get('level'));
	const urlStars = Number(params.get('stars'));
	const hasUrlLevel = Number.isFinite(urlLevel) && urlLevel >= 1;
	const hasUrlStars = Number.isFinite(urlStars) && urlStars >= 0;

	if (hasUrlLevel) saved.level = Math.floor(urlLevel);
	if (hasUrlStars) saved.stars = Math.floor(urlStars);

	// URL values are useful for testing and intentionally overwrite saved progress.
	if (hasUrlLevel || hasUrlStars) saveProgress(saved.level, saved.stars);

	return { level: saved.level, stars: saved.stars };
}

function buildProgressQuery(level, stars, extra) {
	const params = new URLSearchParams();
	params.set('level', String(level));
	params.set('stars', String(stars));
	if (extra) {
		Object.keys(extra).forEach((key) => params.set(key, String(extra[key])));
	}
	return params.toString();
}

function goTo(path, level, stars, extra) {
	global.location.assign(path + '?' + buildProgressQuery(level, stars, extra));
}

let audioCtx;

function tone(f = 440, d = 0.08, t = 'sine', v = 0.05) {
	try {
		audioCtx ||= new (global.AudioContext || global.webkitAudioContext)();
		if (audioCtx.state === 'suspended') audioCtx.resume();
		const o = audioCtx.createOscillator();
		const g = audioCtx.createGain();
		o.type = t;
		o.frequency.setValueAtTime(f, audioCtx.currentTime);
		o.frequency.exponentialRampToValueAtTime(Math.max(1, f), audioCtx.currentTime + d);
		g.gain.setValueAtTime(v, audioCtx.currentTime);
		g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + d);
		o.connect(g);
		g.connect(audioCtx.destination);
		o.start();
		o.stop(audioCtx.currentTime + d);
	} catch (e) {
		/* audio is optional */
	}
}

function managedTimeout(fn, delay, ...args) {
	if (typeof timers !== 'undefined' && timers && typeof timers.setTimeout === 'function') {
		return timers.setTimeout(fn, delay, ...args);
	}
	return global.setTimeout(fn, delay, ...args);
}

const sounds = {
	click: () => tone(520, 0.06, 'square'),
	undo: () => tone(280, 0.1, 'triangle'),
	hear: (text) => {
		tone(660, 0.08);
		if (text) say(text);
		else managedTimeout(() => tone(880, 0.1), 85);
	},
	wrong: () => {
		tone(190, 0.12, 'sawtooth');
		managedTimeout(() => tone(160, 0.16, 'sawtooth'), 120);
	},
	win: () => [523, 659, 784, 1047].forEach((f, i) => managedTimeout(() => tone(f, 0.13, 'sine', 0.07), i * 110)),
	level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => managedTimeout(() => tone(f, 0.17, 'triangle', 0.08), i * 100)),
    pop: () => { if (audioCtx && audioCtx.state === "running") tone(740, 0.055, "triangle", 0.035); },
	star: () => [880, 1175, 1568].forEach((f, i) => managedTimeout(() => tone(f, 0.12, 'triangle', 0.06), i * 90)),
	sticker: () => [660, 880, 1100].forEach((f, i) => managedTimeout(() => tone(f, 0.12, 'triangle', 0.06), i * 90)),
};

function say(text, stop = true) {
	if (!('speechSynthesis' in global)) return;
	if (stop) global.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'en-GB';
	utterance.rate = 0.82;
	utterance.pitch = 1.08;
	global.speechSynthesis.speak(utterance);
}

function speak(text, stop = true) {
	if (!('speechSynthesis' in global)) return;
	if (stop) global.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'en-US';
	utterance.rate = 0.9;
	utterance.pitch = 1.2;
	global.speechSynthesis.speak(utterance);
}

function spellWord(word) {
	return word + '. ' + word.split('').join(',') + ' . ' + word + '. ';
}

function shuffle(items) {
	const copy = [...items];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (copy.length - i));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

const funnyColors = [
	'#d8f7ff', '#ffe0f0', '#fff0b6', '#dff8d1', '#e7dcff',
	'#ffd9b8', '#c9f4ee', '#dce6ff', '#ffd5dc', '#e8f7c8'
];

const modeStories = {
	spell: "The Word Workshop Story. Momo and Bolt opened a workshop full of mixed-up letters. Put each letter in the correct order to repair the school words and make the workshop lights shine.",
	fish: "The Poor Dock Fish Story. At the old poor dock, hungry little letter fish could not find their way to the warm water garden. Every correct letter you catch repairs the dock and helps the fish swim home.",
	ghost: "The Friendly Ghost Story. In the school library, tiny letter ghosts floated out of an old black notebook. Bolt built a gentle zapper to send the correct letter ghosts safely back to their word homes.",
	race: "The Rainbow Race Story. A speedy word sprite raced through the school playground, carrying mixed-up letters. Catch each correct letter to chase the sprite along the rainbow track and recover the colours.",
	mole: "The mole in the hole.",
	blank: "Fill in blank",
};

const modeLabels = { spell: "Spelling", fish: "Fish", ghost: "Ghosts", race: "Race", mole: "Mole", blank: "Blank" };
const gamePaths = {
	spell: "game01_spelling.html",
	fish: "game02_fishing.html",
	ghost: "game03_ghost_maze.html",
	race: "game04_racing.html",
	mole: "game05_whack_a_mole.html",
	blank: "game06_fill_blank.html",
};
let nextGamePath = "game_mode.html";

const STICKER_POOL = [
	{ emoji: "🦖", name: "T-Rex" },
	{ emoji: "🚀", name: "Rocket" },
	{ emoji: "🤖", name: "Robot" },
	{ emoji: "🐉", name: "Dragon" },
	{ emoji: "🏎️", name: "Race Car" },
	{ emoji: "🥷", name: "Ninja" },
	{ emoji: "⚽", name: "Football" },
	{ emoji: "🏅", name: "Medal" },
];

function getSticker(levelNumber) {
	const base = STICKER_POOL[levelNumber % STICKER_POOL.length];
	if (levelNumber > 0 && levelNumber % 50 === 0) {
		return { emoji: "👑", name: "Legendary " + base.name, rarity: "Legendary" };
	}
	if (levelNumber > 0 && levelNumber % 25 === 0) {
		return { emoji: "🌈", name: "Rainbow " + base.name, rarity: "Rainbow" };
	}
	if (levelNumber > 0 && levelNumber % 10 === 0) {
		return { emoji: "✨", name: "Golden " + base.name, rarity: "Golden" };
	}
	return { ...base, rarity: "" };
}

function randomBg() {
	document.body.style.background = funnyColors[Math.floor(Math.random() * funnyColors.length)];
}
	
function setPrompt(t, read = true) {
	speech.textContent = t;
	if (read) say(t);
}
function updateProgress() {
	const n = stars % 3;
	if (typeof starsEl !== 'undefined' && starsEl) starsEl.textContent = stars;
	bar.style.width = (n / 3) * 100 + '%';
	starTrack.textContent = '★'.repeat(n) + '☆'.repeat(3 - n);
	progressNumber.textContent = n + ' / 3 stars to Level ' + (level + 1);
}
function closeWordPopup() {
	clearTimeout(popupTimer);
	$('wordPop').classList.remove('show');
}
function showWordPopup() {
	if (!current) return;
	clearTimeout(popupTimer);
	$("popWord").textContent = current.word;
	$("wordPop").classList.add("show");
	tone(660, 0.08);
	say(current.word + ". " + current.word);
	popupTimer = managedTimeout(closeWordPopup, 5000);
}
function nextWord() {
	if (!wordDeck.length) wordDeck = shuffle(words);
	return wordDeck.pop();
}
function renderMiniWord(matchedIndex = -1) {
    const target = $("miniWord");
    target.innerHTML = "";
    [...bonusWord].forEach((letter, i) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = i <= matchedIndex ? "matched-letter" : "";
        target.appendChild(span);
    });
}
function startBonusMode(mode) {
    console.log('common startBonusMode 00:' + mode);
    bonusWord = nextWord().word;
    bonusRemaining = bonusWord.split("");
    $("bonusTitle").textContent = {
        fish: "🐟 Fish for Letters",
        ghost: "👻 Ghost Letter Zap",
        race: "🏃 Rainbow Race and Chase",
    }[mode];
	console.log("mode:" + mode);
    $("bonusStory").textContent = modeStories[mode];
	console.log("modeStories[mode]:" + modeStories[mode]);
    renderMiniWord(-1);
    $("bonusStatus").textContent = "Find the first letter: " + bonusRemaining[0];
    say($("bonusTitle").textContent + ". The word is " + bonusWord + ".");
    console.log($("bonusTitle").textContent + ". The word is " + bonusWord + ".")
    buildBonus();
}
function activateMode(mode) {
	console.log('activateMode ' + mode);
	if (typeof timers !== 'undefined' && timers && typeof timers.clearAll === 'function') {
		timers.clearAll();
	}
	closeWordPopup();
	activeMode = mode;
	$('spellingView').style.display = mode === 'spell' ? 'block' : 'none';
	$('bonusView').classList.toggle('active', mode !== 'spell');
	randomBg();
	if (mode === 'spell') {
		chooseWord();
	} else {
		startBonusMode(mode);
	}
}
function showStarEffect() {
	const star = document.createElement('div');
	star.textContent = '⭐';
	star.style.cssText = 'position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);font-size:80px;z-index:9999;pointer-events:none;';
	document.body.appendChild(star);
	if (star.animate) {
		star.animate([
			{ transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
			{ transform: 'translate(-50%,-50%) scale(1.2)', opacity: 1 },
			{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }
		], { duration: 500, easing: 'ease-out' });
	}
	managedTimeout(() => star.remove(), 600);
}
function showStickerPopup(sticker, levelNumber) {
	const overlay = document.createElement('div');
	overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;z-index:10000;';
	const card = document.createElement('div');
	card.style.cssText = 'background:#fffdf5;border:6px solid #7c5cff;border-radius:28px;padding:24px;text-align:center;box-shadow:0 20px 45px rgba(0,0,0,.25);max-width:min(92vw,360px);';
	card.innerHTML = `
		<div style="font-size:72px;line-height:1;">${sticker.emoji}</div>
		<div style="font:900 24px 'Trebuchet MS',sans-serif;color:#5b2a86;margin-top:8px;">${sticker.name}</div>
		<div style="font:800 16px 'Trebuchet MS',sans-serif;color:#666;margin-top:4px;">Level ${levelNumber} reward</div>
		<button id="stickerGiftBtn" type="button" style="margin-top:16px;border:0;border-radius:999px;padding:14px 22px;font:900 18px 'Trebuchet MS',sans-serif;background:#ffd166;color:#333;cursor:pointer;box-shadow:0 6px 0 rgba(0,0,0,.16);">🎁 Go to Gift Page</button>
	`;
	overlay.appendChild(card);
	document.body.appendChild(overlay);
	if (card.animate) {
		card.animate([
			{ transform: 'scale(.6)', opacity: 0 },
			{ transform: 'scale(1.08)', opacity: 1 },
			{ transform: 'scale(1)', opacity: 1 }
		], { duration: 500, easing: 'ease-out' });
	}
	sounds.sticker();
	card.querySelector('#stickerGiftBtn').onclick = () => {
		sounds.click();
		overlay.remove();
		goTo('gift.html', level, stars);
	};
	managedTimeout(() => overlay.remove(), 6000);
}
function awardWin(word) {
	stars++;
	const levelUp = stars % 3 === 0;
	if (levelUp) level++;
	saveProgress(level, stars);
	starsEl.textContent = stars;
	updateProgress();
	message.textContent = '🎉 ZAP! Correct! You spelled ' + word + '.';
	setPrompt('Hooray! You are a super speller!');
	showStarEffect();
	sounds.star();
	if (levelUp) {
		showStickerPopup(getSticker(level), level);
		levelEl.textContent = level;
		managedTimeout(showLevelUp, 1450);
	} else if (activeMode !== 'mole') {
		// Mole mode manages its own next-round flow through initMole().
		managedTimeout(() => {
			if (activeMode === 'spell') chooseWord();
			else startBonusMode(activeMode);
		}, 2150);
	}
}
function showLevelUp() {
	sounds.level();
	const story = RoboStory.getStoryPage(level).text;
	nextMode = ['spell', 'fish', 'ghost', 'race', 'mole', 'blank'][Math.floor(Math.random() * 6)];
	nextGamePath = gamePaths[nextMode];
	$('levelMessage').textContent = 'You collected 3 stars and reached Level ' + level + '!';
	$('levelStory').textContent = story;
	$('nextModeMessage').textContent = 'Next adventure: ' + modeLabels[nextMode] + ' mode!';
	$('levelModal').style.display = 'grid';
	say('Level up! You reached level ' + level + '. ' + story + ' Next adventure: ' + modeLabels[nextMode] + ' mode.');
}
function startNextGame() {
	goTo(nextGamePath, level, stars);
}
function openLevelStory() {
	goTo('story.html', level, stars);
}

// Level Up's Start button goes directly to the assigned next game,
// rather than returning to game_mode.html.
document.addEventListener('click', (event) => {
	const button = event.target.closest('#game_mode_next');
	if (!button) return;
	event.preventDefault();
	event.stopImmediatePropagation();
	sounds.hear();
	startNextGame();
}, true);

// The Level badge in every game header opens the story for the current level.
const levelBadge = $('level')?.closest('.badge');
if (levelBadge) {
	levelBadge.style.cursor = 'pointer';
	levelBadge.setAttribute('role', 'button');
	levelBadge.setAttribute('tabindex', '0');
	levelBadge.setAttribute('aria-label', 'Open the story for Level ' + level);
	levelBadge.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		sounds.hear();
		openLevelStory();
	});
	levelBadge.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			sounds.hear();
			openLevelStory();
		}
	});
}

// The Stars badge in every game header opens the gift page.
const starsBadge = $('stars')?.closest('.badge');
if (starsBadge) {
	starsBadge.style.cursor = 'pointer';
	starsBadge.setAttribute('role', 'button');
	starsBadge.setAttribute('tabindex', '0');
	starsBadge.setAttribute('aria-label', 'Go to gift page');
	starsBadge.addEventListener('click', (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		sounds.hear();
		goTo('gift.html', level, stars);
	});
	starsBadge.addEventListener('keydown', (event) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopImmediatePropagation();
			sounds.hear();
			goTo('gift.html', level, stars);
		}
	});
}

global.RoboCommon = {
	$,
	getParams,
	readProgress,
	saveProgress,
	buildProgressQuery,
	goTo,
	tone,
	managedTimeout,
	sounds,
	say,
	spellWord,
	shuffle,
	randomBg,
	updateProgress,
	setPrompt,
	closeWordPopup,
	showWordPopup,
	nextWord,
	activateMode,
	awardWin,
	showLevelUp,
	startNextGame,
	openLevelStory,
};
})(window);