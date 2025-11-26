import decorateCardsCarousel from '../cards-carousel/cards-carousel.js';

export default function decorate(block) {
  const isUE = document.documentElement.hasAttribute('data-aue-version');
  if (window.xwalk?.isAuthorEnv || isUE) {
    // Keep instrumentation for UE; styling comes from cards-carousel CSS.
    block.classList.add('inner-fwcbwcc-cards-carousel');
    return;
  }

  decorateCardsCarousel(block);
}
