/* Robo-Monster Spelling Academy - mode data
   Structure: mode_id, mode, label, title, filename, mode_story
*/
(function (global) {
  'use strict';
  
  const MODE_LIST = [
	{ mode_id: '01', mode: 'spell', label: 'Spelling', title: 'game01_spelling',     filename: 'game01_spelling.html',     mode_story: 'The Word Workshop Story. Momo and Bolt opened a workshop full of mixed-up letters. Put each letter in the correct order to repair the school words and make the workshop lights shine.' },
	{ mode_id: '02', mode: 'fish', label: 'Fish',  title: 'game02_fishing',      filename: 'game02_fishing.html',      mode_story: 'The Poor Dock Fish Story. At the old poor dock, hungry little letter fish could not find their way to the warm water garden. Every correct letter you catch repairs the dock and helps the fish swim home.' },
	{ mode_id: '03', mode: 'ghost', label: 'Ghosts',  title: 'game03_ghost_maze',   filename: 'game03_ghost_maze.html',   mode_story: 'The Friendly Ghost Story. In the school library, tiny letter ghosts floated out of an old black notebook. Bolt built a gentle zapper to send the correct letter ghosts safely back to their word homes.' },
	{ mode_id: '04', mode: 'race', label: 'Race',  title: 'game04_racing',       filename: 'game04_racing.html',       mode_story: 'The Rainbow Race Story. A speedy word sprite raced through the school playground, carrying mixed-up letters. Catch each correct letter to chase the sprite along the rainbow track and recover the colours.' },
	{ mode_id: '05', mode: 'mole', label: 'Mole',  title: 'game05_whack_a_mole', filename: 'game05_whack_a_mole.html', mode_story: '...' },
	{ mode_id: '06', mode: 'blank', label: 'Blank',  title: 'game06_fill_blank',   filename: 'game06_fill_blank.html',   mode_story: '...' },
  ];

  function getModeByText(text) {
    return MODE_LIST.find((item) => item.mode.toLowerCase() === String(text).toLowerCase());
  }

  function getModeById(text) {
    return MODE_LIST.find((item) => item.mode_id.toLowerCase() === String(text).toLowerCase());
  }

  global.RoboModes = {
    MODE_LIST,
    getModeByText,
    getModeById
  };
})(window);
