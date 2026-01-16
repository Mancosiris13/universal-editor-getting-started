/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import GWPCard from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('gwp-card--author');
  }

  const cells = [...block.children];

  const imageCell = cells[0];
  const altCell = cells[1];
  const brandCell = cells[2];
  const titleCell = cells[3];
  const descriptionCell = cells[4];
  const backgroundColorCell = cells[5];
  const ctaLinkCell = cells[6];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a') || '/';

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  const props = {
    image: imageOptimized,
    imageAlt: getText(altCell) || 'Banner con Imagen',
    brandLabel: getText(brandCell) || '',
    title: getText(titleCell) || '',
    descriptionHTML: getText(descriptionCell) || '',
    bgColor: getText(backgroundColorCell) || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(GWPCard, props), block);
}
