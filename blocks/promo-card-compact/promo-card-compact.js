/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import PromoCardCompact from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('promo-card-compact--author');
  }

  const cells = [...block.children];

  const imageCell = cells[0];
  const altCell = cells[1];
  const titleCell = cells[2];
  const descriptionCell = cells[3];
  const backgroundColorCell = cells[4];
  const ctaLinkCell = cells[5];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a') || '/';

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  const props = {
    image: imageOptimized,
    imageAlt: getText(altCell) || 'Banner con Imagen',
    title: getText(titleCell) || '',
    descriptionHTML: getText(descriptionCell) || '',
    bgColor: getText(backgroundColorCell) || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(PromoCardCompact, props), block);
}
