import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import FullBleedContent from './render.js';

function getText(element) {
  return element?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('full-bleed-content--author');
  }
  const cells = [...block.children];

  const [
    imgDeskCell,
    imgMobCell,
    backgroundCell,
    altCell,
    titleCell,
    descriptionCell,
    linkToCell,
    alingLeftCell,
  ] = cells;

  const imgDeskAux = imgDeskCell?.querySelector('img');
  const imgMobAux = imgMobCell?.querySelector('img');
  const linkAux = linkToCell?.querySelector('a') || '/';

  const imgDeskWidth = Number(imgDeskAux?.width) || 800;
  const imgMobWidth = Number(imgMobAux?.width) || 800;

  const rawDeskImage = imgDeskAux?.src || '';
  const rawMobImage = imgMobAux?.src || '';

  const imgDeskOpt = generateOptimizedImageUrl(rawDeskImage, { width: imgDeskWidth });
  const imgMobOpt = generateOptimizedImageUrl(rawMobImage, { width: imgMobWidth });

  const props = {
    imgDesk: imgDeskOpt,
    imgMob: imgMobOpt === '' ? imgDeskOpt : imgMobOpt,
    background: getText(backgroundCell) || '',
    alt: getText(altCell) || '',
    title: getText(titleCell) || '',
    description: getText(descriptionCell) || '',
    href: linkAux?.href || '/',
    leftAlign: getText(alingLeftCell) === 'true',
  };
  block.textContent = '';
  render(h(FullBleedContent, props), block);
}
