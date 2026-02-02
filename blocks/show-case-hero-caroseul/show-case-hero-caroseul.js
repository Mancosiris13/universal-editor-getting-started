import { loadBlock, loadCSS } from '../../scripts/aem.js';

const PROMO_CARD_BLOCK = 'promo-card-compact';
const assetBase = window.hlx?.codeBasePath || '';
const SWIPER_JS = `${assetBase}/libs/swiper/swiper-bundle.min.mjs`;
const SWIPER_CSS = `${assetBase}/libs/swiper/swiper-bundle.min.css`;
const ARROW_ICON = `${assetBase}/icons/arrow.svg`;

let swiperPromise;
function ensureSwiper() {
  if (!swiperPromise) {
    swiperPromise = Promise.all([loadCSS(SWIPER_CSS), import(SWIPER_JS)])
      .then(([, mod]) => mod?.default || mod);
  }
  return swiperPromise;
}

function getCells(row) {
  const direct = [...row.children];
  if (direct.length === 1 && direct[0]?.children?.length) {
    return [...direct[0].children];
  }
  return direct;
}

function collectPromoCards(row) {
  if (!row) return [];
  if (row.matches(`[data-block-name="${PROMO_CARD_BLOCK}"], .${PROMO_CARD_BLOCK}`)) return [row];

  const direct = [...row.querySelectorAll(`:scope > div[data-block-name="${PROMO_CARD_BLOCK}"], :scope > div.${PROMO_CARD_BLOCK}`)];
  if (direct.length) return direct;

  const cells = getCells(row);
  const candidates = (cells.length === 1 && cells[0]?.children?.length)
    ? [...cells[0].children]
    : cells;

  return candidates.filter((cell) => cell.matches(`[data-block-name="${PROMO_CARD_BLOCK}"], .${PROMO_CARD_BLOCK}`));
}

function getPromoCardItems(block) {
  const nested = [...block.querySelectorAll(`:scope > div[data-block-name="${PROMO_CARD_BLOCK}"], :scope > div.${PROMO_CARD_BLOCK}`)];
  if (nested.length) return nested;

  const rows = [...block.children];
  return rows.flatMap(collectPromoCards);
}

async function loadPromoCards(items) {
  const tasks = items
    .map((item) => {
      const blockName = item.dataset.blockName || item.getAttribute('data-block-name');
      if (blockName && blockName !== PROMO_CARD_BLOCK) return null;
      if (!blockName) item.dataset.blockName = PROMO_CARD_BLOCK;
      if (!item.classList.contains(PROMO_CARD_BLOCK)) item.classList.add(PROMO_CARD_BLOCK);
      return loadBlock(item);
    })
    .filter(Boolean);

  await Promise.all(tasks);
}

function buildNavButton(direction) {
  const button = document.createElement('div');
  button.className = `swiper-button-${direction}`;
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  button.setAttribute('aria-label', direction === 'next' ? 'Next' : 'Previous');

  const icon = document.createElement('img');
  icon.src = ARROW_ICON;
  icon.alt = direction === 'next' ? 'Next' : 'Previous';
  icon.width = 20;
  icon.height = 20;
  if (direction === 'prev') icon.style.transform = 'rotate(180deg)';

  button.append(icon);
  return button;
}

export default async function decorate(block) {
  block.classList.add('show-case-hero-caroseul');
  const items = getPromoCardItems(block).filter(Boolean);
  if (!items.length) return;

  const isAuthor = window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version');
  if (isAuthor) {
    block.classList.add('show-case-hero-caroseul--author');
    await loadPromoCards(items);
    return;
  }

  const root = document.createElement('div');
  root.className = 'show-case-hero-caroseul__carousel';

  const prev = buildNavButton('prev');
  const next = buildNavButton('next');
  root.append(prev, next);

  const swiperEl = document.createElement('div');
  swiperEl.className = 'swiper show-case-hero-caroseul__swiper';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  items.forEach((item) => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.append(item);
    wrapper.append(slide);
  });

  const pagination = document.createElement('div');
  pagination.className = 'swiper-pagination';

  swiperEl.append(wrapper, pagination);
  root.append(swiperEl);

  block.textContent = '';
  block.append(root);
  await loadPromoCards(items);

  const Swiper = await ensureSwiper();
  const swiperConfigs = {
    slidesPerView: 'auto',
    spaceBetween: 16,
    navigation: {
      nextEl: next,
      prevEl: prev,
    },
    pagination: {
      el: pagination,
      clickable: true,
    },
    breakpoints: {
      768: {
        spaceBetween: 24,
      },
    },
  };

  const swiperInstance = new Swiper(swiperEl, swiperConfigs);
  block.dataset.swiperInstance = swiperInstance ? 'ready' : '';
}
