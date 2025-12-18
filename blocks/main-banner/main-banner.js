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
  // eslint-disable-next-line max-len
  const [imgCell, altOrTitleCell, maybeDescriptionCell, maybeCtaLabelCell, maybeCtaLinkCell] = cells;

  const imgEl = imgCell?.querySelector('img');

  // Some authoring outputs include a dedicated Alt cell; others only set the img alt.
  const hasExplicitAlt = cells.length >= 6;
  const altCell = hasExplicitAlt ? altOrTitleCell : null;
  const titleCell = hasExplicitAlt ? cells[2] : altOrTitleCell;
  const descriptionCell = hasExplicitAlt ? cells[3] : maybeDescriptionCell;
  const ctaLabelCell = hasExplicitAlt ? cells[4] : maybeCtaLabelCell;
  const ctaLinkCell = hasExplicitAlt ? cells[5] : maybeCtaLinkCell;

  // Link may be in the link cell or embedded in the label cell
  const ctaLink = ctaLinkCell?.querySelector('a') || ctaLabelCell?.querySelector('a');

  const imageWidth = Number(imgEl?.width) || 1440;
  const rawImage = imgEl?.src || '';
  const imageDesktopOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });
  const imageMobileOptimized = generateOptimizedImageUrl(rawImage, { width: 900 });

  const props = {
    image: imageDesktopOptimized,
    imageMobile: imageMobileOptimized,
    imageAlt: getText(altCell) || imgEl?.alt || '',
    title: getText(titleCell),
    descriptionHTML: descriptionCell?.innerText?.trim() || '',
    ctaLabel: getText(ctaLabelCell),
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(MainBanner, props), block);
}
