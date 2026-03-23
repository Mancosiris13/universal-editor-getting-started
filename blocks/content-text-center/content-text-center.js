import { h, render } from '@dropins/tools/preact.js';
import ContentTextCenter from './render.js';

function getText(element) {
  return element?.textContent?.trim() || '';
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('content-text-center--author');
  }
  const cells = [...block.children];

  const [
    backgroundCell,
    titleCell,
    headingTagCell,
    descriptionCell,
    linkToCell,
  ] = cells;

  const linkAux = linkToCell?.querySelector('a')?.href || '/';

  const props = {
    background: getText(backgroundCell) || '',
    title: getText(titleCell) || '',
    headingTag: getText(headingTagCell) || 'h1',
    description: getText(descriptionCell) || '',
    href: linkAux || ''
  }
  block.textContent = '';
  render(h(ContentTextCenter,props), block);
}

