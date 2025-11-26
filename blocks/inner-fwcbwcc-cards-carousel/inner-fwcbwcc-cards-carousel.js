import decorateCardsCarousel from '../cards-carousel/cards-carousel.js';

export default function decorate(block) {
  const isUE = document.documentElement.hasAttribute('data-aue-version');
  if (window.xwalk?.isAuthorEnv || isUE) {
    // block.classList.add('cards-carousel');
    return;
  }
  decorateCardsCarousel(block);
}
