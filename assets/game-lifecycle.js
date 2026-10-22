/* Robo-Monster Spelling Academy
   Shared game lifecycle and timer management.

   Usage:
     const timers = RoboGame.createTimerManager();
     const game = RoboGame.createGameLifecycle({
       name: 'whack-a-word',
       timers,
       hooks: {
         initGame() {},
         startRound() {},
         handleCorrect() {},
         handleWrong() {},
         completeWord() {},
         cleanup() {}
       }
     });
*/

(function (global) {
  'use strict';

  class TimerManager {
    constructor() {
      this.timeouts = new Set();
      this.intervals = new Set();
      this.frames = new Set();
      this.listeners = [];
    }

    setTimeout(fn, delay, ...args) {
      const id = global.setTimeout(() => {
        this.timeouts.delete(id);
        fn(...args);
      }, delay);
      this.timeouts.add(id);
      return id;
    }

    setInterval(fn, delay, ...args) {
      const id = global.setInterval(fn, delay, ...args);
      this.intervals.add(id);
      return id;
    }

    requestAnimationFrame(fn) {
      const id = global.requestAnimationFrame((time) => {
        this.frames.delete(id);
        fn(time);
      });
      this.frames.add(id);
      return id;
    }

    clearTimeout(id) {
      global.clearTimeout(id);
      this.timeouts.delete(id);
    }

    clearInterval(id) {
      global.clearInterval(id);
      this.intervals.delete(id);
    }

    cancelAnimationFrame(id) {
      global.cancelAnimationFrame(id);
      this.frames.delete(id);
    }

    addEventListener(target, type, listener, options) {
      target.addEventListener(type, listener, options);
      this.listeners.push({ target, type, listener, options });
    }

    clearAll() {
      this.timeouts.forEach((id) => global.clearTimeout(id));
      this.intervals.forEach((id) => global.clearInterval(id));
      this.frames.forEach((id) => global.cancelAnimationFrame(id));
      this.listeners.forEach(({ target, type, listener, options }) => {
        target.removeEventListener(type, listener, options);
      });
      this.timeouts.clear();
      this.intervals.clear();
      this.frames.clear();
      this.listeners.length = 0;
    }
  }

  function createGameLifecycle({ name = 'game', timers, hooks = {} }) {
    if (!timers) throw new Error('createGameLifecycle requires a TimerManager');

    const state = {
      initialized: false,
      roundActive: false,
      completed: false
    };

    function cleanup() {
      timers.clearAll();
      state.roundActive = false;
      if (typeof hooks.cleanup === 'function') hooks.cleanup();
    }

    function initGame(...args) {
      cleanup();
      state.initialized = true;
      state.completed = false;
      if (typeof hooks.initGame === 'function') hooks.initGame(...args);
    }

    function startRound(...args) {
      if (!state.initialized) initGame();
      state.roundActive = true;
      if (typeof hooks.startRound === 'function') hooks.startRound(...args);
    }

    function handleCorrect(...args) {
      if (!state.roundActive) return;
      state.roundActive = false;
      if (typeof hooks.handleCorrect === 'function') hooks.handleCorrect(...args);
    }

    function handleWrong(...args) {
      if (!state.roundActive) return;
      if (typeof hooks.handleWrong === 'function') hooks.handleWrong(...args);
    }

    function completeWord(...args) {
      if (state.completed) return;
      state.completed = true;
      state.roundActive = false;
      timers.clearAll();
      if (typeof hooks.completeWord === 'function') hooks.completeWord(...args);
    }

    global.addEventListener('pagehide', cleanup);
    global.addEventListener('beforeunload', cleanup);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') cleanup();
    });

    return {
      name,
      state,
      timers,
      initGame,
      startRound,
      handleCorrect,
      handleWrong,
      completeWord,
      cleanup
    };
  }

  global.RoboGame = {
    TimerManager,
    createTimerManager: () => new TimerManager(),
    createGameLifecycle
  };
})(window);
