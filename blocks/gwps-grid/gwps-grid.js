import { loadBlock } from '../../scripts/aem.js';

const GWP_CARD_BLOCK = 'gwp-card';

function getGWPCardItems(block) {
  const nested = [...block.querySelectorAll(`:scope > div[data-block-name="${GWP_CARD_BLOCK}"], :scope > div.${GWP_CARD_BLOCK}`)];
  if (nested.length) return nested;

  const rows = [...block.children];
  if (rows.length === 1 && rows[0]?.children?.length) {
    return [...rows[0].children];
  }
  return rows;
}

async function loadGWPCards(items) {
  const tasks = items
    .map((item) => {
      const blockName = item.dataset.blockName || item.getAttribute('data-block-name');
      if (blockName && blockName !== GWP_CARD_BLOCK) return null;
      if (!blockName) item.dataset.blockName = GWP_CARD_BLOCK;
      item.classList.add(GWP_CARD_BLOCK);
      return loadBlock(item);
    })
    .filter(Boolean);

  await Promise.all(tasks);
}

export default async function decorate(block) {
  block.classList.add('gwps-grid');
  if (block.querySelector(':scope > .gwps-grid__content')) return;

  const items = getGWPCardItems(block).filter(Boolean);
  if (!items.length) return;

  const grid = document.createElement('div');
  grid.className = 'gwps-grid__content';

  items.forEach((item) => {
    grid.append(item);
  });

  block.replaceChildren(grid);
  await loadGWPCards(items);
}
