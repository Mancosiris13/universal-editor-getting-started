import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import TileCard from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('tile-card--author');
  }

  const cells = [...block.children];

  const imageCell = cells[0];
  const altCell = cells[1];
  const tagTextCell = cells[2];
  const tagTextColorCell = cells[3];
  const tagBackgroundColorCell = cells[4];
  const titleCell = cells[5];
  const descriptionCell = cells[6];
  const backgroundColorCell = cells[7];
  const ctaLinkCell = cells[8];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a');
  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  const props = {
    image: imageOptimized,
    imageAlt: getText(altCell) || imgEl?.alt || '',
    tagText: getText(tagTextCell) || '',
    tagTextColor: getText(tagTextColorCell) || '',
    tagBackgroundColor: getText(tagBackgroundColorCell) || '',
    title: getText(titleCell) || '',
    description: getText(descriptionCell) || '',
    bgColor: getText(backgroundColorCell) || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(TileCard, props), block);
}
