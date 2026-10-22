/* Robo-Monster Spelling Academy - central word list */
(function (global) {
	'use strict';

	const WORD_LIST = [
		{ chapter: 1, difficulty: 1, word: 'notebook', emoji: '📓', clue: 'You write notes and drawings in it.'},
		{ chapter: 1, difficulty: 1, word: 'yellow', emoji: '💛', clue: 'It is the colour of a banana.'},
		{ chapter: 1, difficulty: 1, word: 'purple', emoji: '💜', clue: 'It is a colour made by mixing red and blue.'},
		{ chapter: 1, difficulty: 1, word: 'crayon', emoji: '🖍️', clue: 'You use it to draw colourful pictures.'},
		{ chapter: 1, difficulty: 1, word: 'eraser', emoji: '🧽', clue: 'It rubs away pencil mistakes.'},
		{ chapter: 1, difficulty: 1, word: 'pencil', emoji: '✏️', clue: 'You use it to write and draw.'},
		{ chapter: 1, difficulty: 1, word: 'school', emoji: '🏫', clue: 'A place where children learn.'},
		{ chapter: 1, difficulty: 1, word: 'white', emoji: '⬜', clue: 'The colour of a clean blank page.'},
		{ chapter: 1, difficulty: 1, word: 'black', emoji: '⬛', clue: 'A very dark colour.'},
		{ chapter: 1, difficulty: 1, word: 'ruler', emoji: '📏', clue: 'You use it to draw straight lines.'},
		{ chapter: 1, difficulty: 1, word: 'bag', emoji: '🎒', clue: 'You carry school things in it.'},
		{ chapter: 1, difficulty: 1, word: 'friends', emoji: '🧑‍🤝‍🧑', clue: 'We are friends.'},
		{ chapter: 1, difficulty: 1, word: 'quiet', emoji: '🤫', clue: 'It is no noise, being calm.'},
		{ chapter: 1, difficulty: 1, word: 'class', emoji: '👩🏻‍🏫', clue: 'Students are taught together in the same room.'},
		{ chapter: 1, difficulty: 1, word: 'name', emoji: '📛', clue: 'This is used to refer to a person.'},
		{ chapter: 1, difficulty: 1, word: 'boys', emoji: '👦', clue: 'They are a group of male children.'},
		{ chapter: 1, difficulty: 1, word: 'Hill', emoji: '🏔️', clue: 'This is a small mountain, a raised area of land.'},
		{ chapter: 2, difficulty: 1, word: 'cousin', emoji: '🧑‍🤝‍🧑', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'sister', emoji: '🙋', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'aunt', emoji: '🧏‍♂️', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'grand', emoji: '👵', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'mother', emoji: '🤱', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'daughter', emoji: '👧', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'father', emoji: '👨‍🦱', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'brother', emoji: '👦', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'uncle', emoji: '👨‍🦰', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'parents', emoji: '👪', clue: ''},
		{ chapter: 2, difficulty: 1, word: 'son', emoji: '👨‍👦', clue: ''},
	];
	
	const SENTENCE_LIST = [
		{ chapter: 1, difficulty: 1, sentence: 'Hi! I am Mark!'},
		{ chapter: 1, difficulty: 1, sentence: 'What is your name?'},
		{ chapter: 1, difficulty: 1, sentence: 'Wait!'},
		{ chapter: 1, difficulty: 1, sentence: 'I am in Class 1A.'},
		{ chapter: 1, difficulty: 1, sentence: 'What class are you in?'},
		{ chapter: 2, difficulty: 1, sentence: 'Hello, Eric.'},
		{ chapter: 2, difficulty: 1, sentence: 'I am Miss Hill.'},
		{ chapter: 2, difficulty: 1, sentence: 'What is it?'},
		{ chapter: 2, difficulty: 1, sentence: 'It is a pencil case.'},
		{ chapter: 2, difficulty: 1, sentence: 'What are they?'},
		{ chapter: 2, difficulty: 1, sentence: 'They are erasers.'},
		{ chapter: 2, difficulty: 1, sentence: 'Oh, look!'},
		{ chapter: 2, difficulty: 1, sentence: 'I am Eric.'},
		{ chapter: 2, difficulty: 1, sentence: 'We are friends!'},
		{ chapter: 2, difficulty: 1, sentence: 'Be quiet, boys!'},
	]

	function getWordByText(text) {
		return WORD_LIST.find((item) => item.word.toLowerCase() === String(text).toLowerCase());
	}

	function getWordsByDifficulty(difficulty) {
		return WORD_LIST.filter((item) => item.difficulty === difficulty);
	}

	function getWordsByChapter(chapter) {
		return WORD_LIST.filter(item => item.chapter === chapter);
	}

	function getSentenceByText(text) {
		return SENTENCE_LIST.find((item) => item.sentence.toLowerCase() === String(text).toLowerCase());
	}

	function getSentencesByChapter(chapter) {
		return SENTENCE_LIST.filter(item => item.chapter === chapter).map(item => item.sentence);
	}

	global.RoboWords = {
		WORD_LIST,
		SENTENCE_LIST,
		getWordByText,
		getWordsByDifficulty,
		getWordsByChapter,
		getSentenceByText,
		getSentencesByChapter
	};
})(window);
