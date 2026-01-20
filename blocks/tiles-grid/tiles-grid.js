import { loadBlock } from '../../scripts/aem.js';

const TILE_CARD_BLOCK = 'tile-card';

function getDealCardItems(block) {
  const nested = [...block.querySelectorAll(`:scope > div[data-block-name="${TILE_CARD_BLOCK}"], :scope > div.${TILE_CARD_BLOCK}`)];
  if (nested.length) return nested;

  const rows = [...block.children];
  if (rows.length === 1 && rows[0]?.children?.length) {
    return [...rows[0].children];
  }
  return rows;
}

async function loadDealCards(items) {
  const tasks = items
    .map((item) => {
      const blockName = item.dataset.blockName || item.getAttribute('data-block-name');
      if (blockName && blockName !== TILE_CARD_BLOCK) return null;
      if (!blockName) item.dataset.blockName = TILE_CARD_BLOCK;
      item.classList.add(TILE_CARD_BLOCK);
      return loadBlock(item);
    })
    .filter(Boolean);

  await Promise.all(tasks);
}

export default async function decorate(block) {
  block.classList.add('tiles-grid');
  if (block.querySelector(':scope > .tiles-grid__content')) return;

  const items = getDealCardItems(block).filter(Boolean);
  if (!items.length) return;

  const grid = document.createElement('div');
  grid.className = 'tiles-grid__content';

  items.forEach((item) => {
    grid.append(item);
  });

  block.replaceChildren(grid);
  await loadDealCards(items);
}
