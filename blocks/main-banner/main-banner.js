/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import MainBanner from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  // Keep the block rendered in author as well so styles match UE/runtime.
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('main-banner--author');
  }

  const cells = [...block.children];
  const desktopImgCell = cells[0];
  const mobileImgEl = cells[1]?.querySelector('img');
  const altCellIndex = 2;
  const altCell = cells[altCellIndex];
  const titleCell = cells[altCellIndex + 1];
  const descriptionCell = cells[altCellIndex + 2];
  const ctaLabelCell = cells[altCellIndex + 3];
  const ctaLinkCell = cells[altCellIndex + 4];

  const imgEl = desktopImgCell?.querySelector('img');

  // Link may be in the link cell or embedded in the label cell
  const ctaLink = ctaLinkCell?.querySelector('a') || ctaLabelCell?.querySelector('a');

  const imageWidth = Number(imgEl?.width) || 1440;
  const rawImage = imgEl?.src || '';
  const rawImageMobile = mobileImgEl?.src || rawImage;
  const imageDesktopOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });
  const imageMobileOptimized = generateOptimizedImageUrl(rawImageMobile, { width: 900 });

  const props = {
    image: imageDesktopOptimized,
    imageMobile: imageMobileOptimized,
    imageAlt: getText(altCell) || 'Banner con imagen',
    title: getText(titleCell),
    descriptionHTML: descriptionCell?.innerText?.trim() || '',
    ctaLabel: getText(ctaLabelCell),
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(MainBanner, props), block);
}
