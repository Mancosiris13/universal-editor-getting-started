import { loadBlock } from '../../scripts/aem.js';

const DEAL_CARD_BLOCK = 'deal-card';

function getDealCardItems(block) {
  const nested = [...block.querySelectorAll(`:scope > div[data-block-name="${DEAL_CARD_BLOCK}"], :scope > div.${DEAL_CARD_BLOCK}`)];
  if (nested.length) return nested;

  const rows = [...block.children];
  if (rows.length === 1 && rows[0]?.children?.length) {
    return [...rows[0].children];
  }
  return rows;
}

async function loadDealCards(items) {
  const tasks = items.map((item) => {
    const blockName = item.dataset.blockName || item.getAttribute('data-block-name');
    if (blockName && blockName !== DEAL_CARD_BLOCK) return null;
    if (!blockName) item.dataset.blockName = DEAL_CARD_BLOCK;
    item.classList.add(DEAL_CARD_BLOCK);
    return loadBlock(item);
  }).filter(Boolean);

  await Promise.all(tasks);
}

export default async function decorate(block) {
  block.classList.add('deals-grid');
  if (block.querySelector(':scope > .deals-grid__content')) return;

  const items = getDealCardItems(block).filter(Boolean);
  if (!items.length) return;

  const grid = document.createElement('div');
  grid.className = 'deals-grid__content';

  items.forEach((item) => {
    grid.append(item);
  });

  block.replaceChildren(grid);
  await loadDealCards(items);
}
