import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import HeroRailCard from './render.js';

function toKebabCase(str = '') {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function findPropEl(base, propName) {
  const kebab = toKebabCase(propName);
  return base.querySelector(`[data-aue-prop="${propName}"]`)
    || base.querySelector(`[data-aue-prop="${kebab}"]`);
}

function getCells(row) {
  const direct = [...row.children];
  if (direct.length === 1 && direct[0]?.children?.length) {
    return [...direct[0].children];
  }
  return direct;
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('hero-rail-card--author');
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const row = rows[0];
  const cells = getCells(row);

  const imageCell = findPropEl(block, 'image') || cells[0];
  const altCell = findPropEl(block, 'imageAlt') || findPropEl(block, 'alt') || findPropEl(block, 'alt text') || findPropEl(block, 'string') || cells[1];
  const tagCell = findPropEl(block, 'urgency tag') || findPropEl(block, 'urgencyTag') || findPropEl(block, 'tag') || cells[2];
  const titleCell = findPropEl(block, 'title') || cells[3];
  const descriptionCell = findPropEl(block, 'description') || cells[4];
  const ctaLabelCell = findPropEl(block, 'ctaLabel') || cells[5];
  const ctaLinkCell = findPropEl(block, 'ctaLink') || cells[6];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a') || ctaLabelCell?.querySelector('a');

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  const props = {
    image: imageOptimized,
    imageAlt: altCell?.textContent?.trim() || imgEl?.alt || '',
    tagLabel: tagCell?.textContent?.trim() || '',
    title: titleCell?.textContent?.trim() || '',
    descriptionHTML: descriptionCell?.innerHTML?.trim() || '',
    ctaLabel: ctaLabelCell?.textContent?.trim() || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  render(h(HeroRailCard, props), block);
}
