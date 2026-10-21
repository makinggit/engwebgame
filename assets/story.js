/* Robo-Monster Spelling Academy - story data
   Structure: page, title, text, unlocksAtLevel
   Pages 0-1 are migrated from the existing game copy.
   Pages 2-99 should be migrated from the existing levelStories arrays.
*/
(function (global) {
  'use strict';

  const STORY_PAGES = [
    {
      page: 0,
      title: 'The Mysterious School Bag',
      text: 'One sunny morning, Momo the Monster and Bolt the Robot found a mysterious school bag. Inside were crayons, pencils, a notebook, an eraser, a ruler—and colourful words whose letters had jumped all over the place!',
      unlocksAtLevel: 1
    },
    {
      page: 1,
      title: 'Become a Spelling Explorer',
      text: 'We need a clever Spelling Explorer! said Bolt. Each correct word gives our academy a bright star. Collect three stars, unlock a new story, and help the school colours shine again. Are you ready?',
      unlocksAtLevel: 2
    }
    /* TODO: migrate pages 2-99 from the existing levelStories arrays.
       Each entry should follow the same structure:
       { page: 2, title: '...', text: '...', unlocksAtLevel: 3 }
    */
  ];

  function getStoryPage(level) {
    const pageNumber = Math.min(Math.max(level - 1, 0), STORY_PAGES.length - 1);
    return STORY_PAGES.find((item) => item.page === pageNumber) || STORY_PAGES[0];
  }

  function getStoryPageByNumber(pageNumber) {
    return STORY_PAGES.find((item) => item.page === pageNumber);
  }

  global.RoboStory = {
    STORY_PAGES,
    getStoryPage,
    getStoryPageByNumber
  };
})(window);
