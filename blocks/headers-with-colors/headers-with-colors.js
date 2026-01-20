/* eslint-disable no-console */
import { h, render } from '@dropins/tools/preact.js';
import HeadersWithColors from './render.js';

function getText(el) {
  return el?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('headers-with-colors--author');
  }

  const cells = [...block.children];

  const titleCell = cells[0];
  const subtitleCell = cells[1];
  const backgroundColorCell = cells[2];
  const props = {
    title: getText(titleCell) || '',
    subtitle: getText(subtitleCell) || '',
    bgColor: getText(backgroundColorCell) || '',
  };

  block.textContent = '';
  render(h(HeadersWithColors, props), block);
}
