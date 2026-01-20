/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import Separator from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('separator--author');
  }

  const cells = [...block.children];

  const heightDesktop = cells[0];
  const heightMobile = cells[1];
  const backgroundColorCell = cells[2];

  const props = {
    heightDesktop: getText(heightDesktop) || '',
    heightMobile: getText(heightMobile) || '',
    bgColor: getText(backgroundColorCell) || '',
  };

  block.textContent = '';
  render(h(Separator, props), block);
}
