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
		{ chapter: 3, difficulty: 1, word: 'glue stick', emoji: '🧴', clue: 'You use it to stick paper together.'},
		{ chapter: 3, difficulty: 1, word: 'highlighter', emoji: '🖊️', clue: 'You use it to mark important words.'},
		{ chapter: 3, difficulty: 1, word: 'ball', emoji: '⚽', clue: 'You can throw, kick or bounce it.'},
		{ chapter: 3, difficulty: 1, word: 'balloon', emoji: '🎈', clue: 'It is filled with air and can float.'},
		{ chapter: 3, difficulty: 1, word: 'bicycle', emoji: '🚲', clue: 'It has two wheels and you pedal it.'},
		{ chapter: 3, difficulty: 1, word: 'doll', emoji: '🪆', clue: 'It is a small toy that looks like a person.'},
		{ chapter: 3, difficulty: 1, word: 'kite', emoji: '🪁', clue: 'You fly it in the wind with a string.'},
		{ chapter: 3, difficulty: 1, word: 'robot', emoji: '🤖', clue: 'It is a machine that can move and work.'},
		{ chapter: 3, difficulty: 1, word: 'teddy bear', emoji: '🧸', clue: 'It is a soft toy bear for cuddling.'},
		{ chapter: 3, difficulty: 1, word: 'toy', emoji: '🧸', clue: 'Children play with it.'},
		{ chapter: 3, difficulty: 1, word: 'car', emoji: '🚗', clue: 'It has four wheels and drives on roads.'},
		{ chapter: 3, difficulty: 1, word: 'plane', emoji: '✈️', clue: 'It flies in the sky and carries people.'},
		{ chapter: 3, difficulty: 1, word: 'one', emoji: '1️⃣', clue: 'It is the number after zero.'},
		{ chapter: 3, difficulty: 1, word: 'two', emoji: '2️⃣', clue: 'It is the number after one.'},
		{ chapter: 3, difficulty: 1, word: 'three', emoji: '3️⃣', clue: 'It is the number after two.'},
		{ chapter: 3, difficulty: 1, word: 'four', emoji: '4️⃣', clue: 'It is the number after three.'},
		{ chapter: 3, difficulty: 1, word: 'five', emoji: '5️⃣', clue: 'It is the number after four.'},
		{ chapter: 3, difficulty: 1, word: 'six', emoji: '6️⃣', clue: 'It is the number after five.'},
		{ chapter: 3, difficulty: 1, word: 'seven', emoji: '7️⃣', clue: 'It is the number after six.'},
		{ chapter: 3, difficulty: 1, word: 'eight', emoji: '8️⃣', clue: 'It is the number after seven.'},
		{ chapter: 3, difficulty: 1, word: 'nine', emoji: '9️⃣', clue: 'It is the number after eight.'},
		{ chapter: 3, difficulty: 1, word: 'ten', emoji: '🔟', clue: 'It is the number after nine.'},
		{ chapter: 3, difficulty: 1, word: 'zero', emoji: '0️⃣', clue: 'It means no things or nothing.'},
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
