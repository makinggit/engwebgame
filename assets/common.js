/* Robo-Monster Spelling Academy - shared utilities */
(function (global) {
	'use strict';

const $ = (id) => document.getElementById(id);

function getParams() {
	return new URLSearchParams(global.location.search);
}

function readProgress() {
	const params = getParams();
	const level = Number(params.get('level'));
	const stars = Number(params.get('stars'));

	return {
		level: Number.isFinite(level) && level >= 1 ? Math.floor(level) : 1,
		stars: Number.isFinite(stars) && stars >= 0 ? Math.floor(stars) : 0
	};
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
		o.frequency.value = f;
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
};

function say(text, stop = true) {
	if (!('speechSynthesis' in global)) return;
	if (stop) global.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = 'en-UK';
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
		const j = Math.floor(Math.random() * (i + 1));
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

function randomBg() {
	document.body.style.background = funnyColors[Math.floor(Math.random() * funnyColors.length)];
}
	
function setPrompt(t, read = true) {
	speech.textContent = t;
	if (read) say(t);
}
function updateProgress() {
	const n = stars % 3;
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
	sounds.hear();
	say(". " + current.word + ". " + current.word);
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
function awardWin(word) {
	stars++;
	starsEl.textContent = stars;
	updateProgress();
	message.textContent = '🎉 ZAP! Correct! You spelled ' + word + '.';
	setPrompt('Hooray! You are a super speller!');
	if (stars % 3 === 0) {
		level++;
		levelEl.textContent = level;
		managedTimeout(showLevelUp, 950);
	} else if (activeMode !== 'mole') {
		// Mole mode manages its own next-round flow through initMole().
		managedTimeout(() => {
			if (activeMode === 'spell') chooseWord();
			else startBonusMode(activeMode);
		}, 1650);
	}
}
function showLevelUp() {
	sounds.level();
	const story = RoboStory.getStoryPage(level).text;
	nextMode = ['spell', 'fish', 'ghost', 'race'][Math.floor(Math.random() * 4)];
	$('levelMessage').textContent = 'You collected 3 stars and reached Level ' + level + '!';
	$('levelStory').textContent = story;
	$('nextModeMessage').textContent = 'Next adventure: ' + modeLabels[nextMode] + ' mode!';														 
	$('levelModal').style.display = 'grid';
	say('Level up! You reached level ' + level + '. ' + story + ' Next adventure: ' + modeLabels[nextMode] + ' mode.');
}

global.RoboCommon = {
	$,
	getParams,
	readProgress,
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
};
})(window);
