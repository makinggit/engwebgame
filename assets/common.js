/* Robo-Monster Spelling Academy - shared utilities */
(function (global) {
  'use strict';

  // Accepts either a bare id ('storyTitle') or a selector ('#game', '.mole-hole').
  const $ = (sel) => {
    if (typeof sel !== 'string') return null;
    if (sel.startsWith('#') || sel.startsWith('.') || sel.includes('[')) {
      return document.querySelector(sel);
    }
    return document.getElementById(sel);
  };

  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function getParams() {
    return new URLSearchParams(global.location.search);
  }

  function readProgress() {
    const params = getParams();
    const level = Math.max(1, Number(params.get('level') || 1));
    const stars = Math.max(0, Number(params.get('stars') || 0));
    return { level, stars };
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

  const sounds = {
    click: () => tone(520, 0.06, 'square'),
    undo: () => tone(280, 0.1, 'triangle'),
    hear: () => {
      tone(660, 0.08);
      setTimeout(() => tone(880, 0.1), 85);
    },
    wrong: () => {
      tone(190, 0.12, 'sawtooth');
      setTimeout(() => tone(160, 0.16, 'sawtooth'), 120);
    },
    win: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, 0.13, 'sine', 0.07), i * 110)),
    level: () => [523, 659, 784, 1047, 1319].forEach((f, i) => setTimeout(() => tone(f, 0.17, 'triangle', 0.08), i * 100))
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

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * copy.length);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const GAME_WORDS = [
    'cat', 'dog', 'sun', 'hat', 'bus', 'red', 'big', 'cup',
    'notebook', 'yellow', 'purple', 'crayon', 'eraser', 'pencil',
    'school', 'white', 'black', 'ruler', 'bag', 'friends'
  ];

  function wordsForLevel(level, mode) {
    const bank = (global.RoboWords && global.RoboWords.WORD_LIST)
      ? global.RoboWords.WORD_LIST.map((item) => String(item.word).toLowerCase())
      : [];
    const words = bank.length ? bank : GAME_WORDS;
    const maxLen = level <= 1 ? 6 : level <= 2 ? 8 : 99;
    const filtered = words.filter((w) => w.length <= maxLen);
    return filtered.length ? filtered : GAME_WORDS;
  }

  function letterPool(word, level) {
    const target = String(word).toLowerCase();
    const letters = target.split('');
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const extras = Math.max(3, Math.min(6, 8 - letters.length));
    const pool = [...letters];
    while (pool.length < letters.length + extras) {
      pool.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    return shuffle(pool);
  }

  function sentencesForLevel(level, mode) {
    const words = wordsForLevel(level, mode);
    return words.map((w) => ({
      word: w,
      blanks: 1,
      parts: ['I have a ', '.']
    }));
  }

  const funnyColors = [
    '#d8f7ff', '#ffe0f0', '#fff0b6', '#dff8d1', '#e7dcff',
    '#ffd9b8', '#c9f4ee', '#dce6ff', '#ffd5dc', '#e8f7c8'
  ];

  function randomBg() {
    document.body.style.background = funnyColors[Math.floor(Math.random() * funnyColors.length)];
  }

  function updateProgress(level, stars) {
    const bar = $('bar');
    const progressNumber = $('progressNumber');
    const starTrack = $('starTrack');
    if (!bar || !progressNumber || !starTrack) return;
    const starsInLevel = stars % 3;
    bar.style.width = (starsInLevel / 3) * 100 + '%';
    starTrack.textContent = '★'.repeat(starsInLevel) + '☆'.repeat(3 - starsInLevel);
    progressNumber.textContent = starsInLevel + ' / 3 stars to Level ' + (level + 1);
  }

  global.RoboCommon = {
    $,
    $$,
    getParams,
    readProgress,
    buildProgressQuery,
    goTo,
    tone,
    sounds,
    say,
    shuffle,
    randomBg,
    wordsForLevel,
    letterPool,
    sentencesForLevel,
    updateProgress
  };
})(window);
