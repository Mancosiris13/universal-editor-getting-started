/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import DealCard from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('deal-card--author');
  }

  const cells = [...block.children];

  const imageCell = cells[0];
  const altCell = cells[1];
  const tagCell = cells[2];
  const titleCell = cells[3];
  const descriptionCell = cells[4];
  const offerPriceCell = cells[5];
  const regularPriceCell = cells[6];
  const backgroundColorCell = cells[7];
  const ctaLinkCell = cells[8];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a') || '/';

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  const props = {
    image: imageOptimized,
    imageAlt: getText(altCell) || 'Banner con Imagen',
    tagLabel: getText(tagCell) || '',
    title: getText(titleCell) || '',
    descriptionHTML: getText(descriptionCell) || '',
    offerPrice: getText(offerPriceCell) || '',
    regularPrice: getText(regularPriceCell) || '',
    bgColor: getText(backgroundColorCell) || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(DealCard, props), block);
}
