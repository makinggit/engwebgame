/* Robo-Monster Spelling Academy - central word list */
(function (global) {
  'use strict';

  const WORD_LIST = [
    { word: 'notebook', emoji: '📓', clue: 'You write notes and drawings in it.', difficulty: 1, chapter: 1 },
    { word: 'yellow', emoji: '💛', clue: 'It is the colour of a banana.', difficulty: 1, chapter: 1 },
    { word: 'purple', emoji: '💜', clue: 'It is a colour made by mixing red and blue.', difficulty: 1, chapter: 1 },
    { word: 'crayon', emoji: '🖍️', clue: 'You use it to draw colourful pictures.', difficulty: 1, chapter: 1 },
    { word: 'eraser', emoji: '🧽', clue: 'It rubs away pencil mistakes.', difficulty: 1, chapter: 1 },
    { word: 'pencil', emoji: '✏️', clue: 'You use it to write and draw.', difficulty: 1, chapter: 1 },
    { word: 'school', emoji: '🏫', clue: 'A place where children learn.', difficulty: 1, chapter: 1 },
    { word: 'white', emoji: '⬜', clue: 'The colour of a clean blank page.', difficulty: 1, chapter: 1 },
    { word: 'black', emoji: '⬛', clue: 'A very dark colour.', difficulty: 1, chapter: 1 },
    { word: 'ruler', emoji: '📏', clue: 'You use it to draw straight lines.', difficulty: 1, chapter: 1 },
    { word: 'bag', emoji: '🎒', clue: 'You carry school things in it.', difficulty: 1, chapter: 1 },
    { word: 'friends', emoji: '🧑‍🤝‍🧑', clue: 'We are friends.', difficulty: 1, chapter: 1 },
    { word: 'quiet', emoji: '🤫', clue: 'It is no noise, being calm.', difficulty: 1, chapter: 1 },
    { word: 'class', emoji: '👩🏻‍🏫', clue: 'Students are taught together in the same room.', difficulty: 1, chapter: 1 },
    { word: 'name', emoji: '📛', clue: 'This is used to refer to a person.', difficulty: 1, chapter: 1 },
    { word: 'boys', emoji: '👦', clue: 'They are a group of male children.', difficulty: 1, chapter: 1 },
    { word: 'Hill', emoji: '🏔️', clue: 'This is a small mountain, a raised area of land.', difficulty: 1, chapter: 1 }
  ];

  function getWordByText(text) {
    return WORD_LIST.find((item) => item.word.toLowerCase() === String(text).toLowerCase());
  }

  function getWordsByDifficulty(difficulty) {
    return WORD_LIST.filter((item) => item.difficulty === difficulty);
  }

  global.RoboWords = {
    WORD_LIST,
    getWordByText,
    getWordsByDifficulty
  };
})(window);
