/* eslint-disable max-len */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl, loadCSS } from '../../scripts/aem.js';
import PromoCardCompact from '../promo-card-compact/render.js';
import CustomCarousel from './custom-carousel.js';

function toKebabCase(str = '') {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function findPropEl(base, propName) {
  const kebab = toKebabCase(propName);
  return base.querySelector(`[data-aue-prop="${propName}"]`) || base.querySelector(`[data-aue-prop="${kebab}"]`);
}

function getCells(row) {
  const direct = [...row.children];
  if (direct.length === 1 && direct[0]?.children?.length) {
    return [...direct[0].children];
  }
  return direct;
}

function parseNumber(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function parseBoolean(value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  const val = String(value).trim().toLowerCase();
  if (['true', 'yes', '1'].includes(val)) return true;
  if (['false', 'no', '0'].includes(val)) return false;
  return fallback;
}

function readConfig(row) {
  const cells = getCells(row);
  const [rawSlidesPerView, rawSpaceBetween, rawNavigation, rawPagination, rawAutoplay, rawDelay, rawLoop, rawCentered] = cells.map((c) => c?.textContent?.trim());

  return {
    slidesPerView: rawSlidesPerView ? parseNumber(rawSlidesPerView, 'auto') || 'auto' : 'auto',
    spaceBetween: parseNumber(rawSpaceBetween, 24),
    navigation: parseBoolean(rawNavigation, true),
    pagination: parseBoolean(rawPagination, true),
    autoplay: parseBoolean(rawAutoplay, false),
    autoplayDelay: parseNumber(rawDelay, 6000),
    loop: parseBoolean(rawLoop, true),
    centeredSlides: parseBoolean(rawCentered, false),
  };
}

function buildSlide(row) {
  const cells = getCells(row);

  const imageCell = findPropEl(row, 'image') || cells[0];
  const altCell = findPropEl(row, 'imageAlt') || findPropEl(row, 'alt') || findPropEl(row, 'alt text') || findPropEl(row, 'string') || cells[1];
  const titleCell = findPropEl(row, 'title') || cells[2];
  const backgroundColorCell = findPropEl(row, 'background-color') || findPropEl(row, 'backgroundColor') || cells[3];
  const ctaLinkCell = findPropEl(row, 'ctaLink') || cells[4];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a');

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  return {
    image: imageOptimized,
    imageAlt: altCell?.textContent?.trim() || imgEl?.alt || '',
    title: titleCell?.textContent?.trim() || '',
    bgColor: backgroundColorCell?.textContent?.trim() || '',
    ctaHref: ctaLink?.href || '',
  };
}

function collectAuthorCardCells(row) {
  const cells = getCells(row);
  const imageCell = findPropEl(row, 'image') || cells[0];
  const altCell = findPropEl(row, 'imageAlt') || findPropEl(row, 'alt') || findPropEl(row, 'alt text') || findPropEl(row, 'string') || cells[1];
  const titleCell = findPropEl(row, 'title') || cells[2];
  const backgroundColorCell = findPropEl(row, 'background-color') || findPropEl(row, 'backgroundColor') || cells[3];
  const ctaLinkCell = findPropEl(row, 'ctaLink') || cells[4];

  return {
    imageCell,
    altCell,
    titleCell,
    backgroundColorCell,
    ctaLinkCell,
  };
}

function decorateAuthorCard(row) {
  if (!row || row.classList.contains('promo-card-compact')) return;

  const {
    imageCell, altCell, titleCell, backgroundColorCell, ctaLinkCell,
  } = collectAuthorCardCells(row);

  row.classList.add('promo-card-compact');
  if (imageCell) imageCell.classList.add('promo-card-compact__image');
  if (titleCell) titleCell.classList.add('promo-card-compact__title');
  const ctaLink = ctaLinkCell?.querySelector('a');
  if (ctaLink) ctaLink.classList.add('promo-card-compact__cta');

  if (altCell) altCell.hidden = true;
  if (backgroundColorCell) {
    const bgColor = backgroundColorCell.textContent?.trim();
    if (bgColor) row.style.backgroundColor = bgColor;
    backgroundColorCell.hidden = true;
  }
  if (ctaLinkCell) ctaLinkCell.hidden = true;

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'promo-card-compact__content-wrapper';

  const body = document.createElement('div');
  body.className = 'promo-card-compact__body';

  if (imageCell) contentWrapper.append(imageCell);

  const bodyCells = [titleCell, ctaLinkCell, altCell].filter(Boolean);
  [...new Set(bodyCells)].forEach((cell) => body.append(cell));

  if (body.childElementCount) contentWrapper.append(body);
  row.replaceChildren(contentWrapper);
}

async function buildAuthorCarousel(block, slideRows, config, configRow) {
  const assetBase = window.hlx?.codeBasePath || '';
  await loadCSS(`${assetBase}/blocks/promo-card-compact/promo-card-compact.css`);

  const carousel = document.createElement('div');
  carousel.className = 'show-case-hero-carousel swiper-ready';

  const swiper = document.createElement('div');
  swiper.className = 'swiper show-case-hero-carousel-swiper swiper-ready';

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';

  const space = Number(config.spaceBetween) || 0;

  slideRows.forEach((row) => {
    decorateAuthorCard(row);
    const slide = document.createElement('div');
    slide.className = 'swiper-slide inline-space';
    slide.style.setProperty('--space', `${space}px`);
    slide.append(row);
    wrapper.append(slide);
  });

  swiper.append(wrapper);
  carousel.append(swiper);

  if (configRow) {
    configRow.hidden = true;
  }

  block.replaceChildren(carousel);
  if (configRow) block.append(configRow);
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  let config = {
    slidesPerView: 6,
    spaceBetween: 16,
    navigation: true,
    pagination: true,
    autoplay: false,
    autoplayDelay: 6000,
    loop: true,
    centeredSlides: false,
  };

  let slideRows = rows;
  let configRow;
  const maybeConfigRow = rows[0];
  if (maybeConfigRow && !maybeConfigRow.querySelector('img') && maybeConfigRow.children.length >= 3) {
    config = readConfig(maybeConfigRow);
    slideRows = rows.slice(1);
    configRow = maybeConfigRow;
  }

  const nestedHeroBlocks = [...block.querySelectorAll(':scope > div[data-block-name="promo-card-compact"], :scope > div.promo-card-compact')];
  if (nestedHeroBlocks.length) {
    slideRows = nestedHeroBlocks;
  }

  const isAuthor = window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version');
  if (isAuthor) {
    block.classList.add('show-case-hero-carousel', 'show-case-hero-carousel--author');
    if (!slideRows.length) return;
    if (!block.querySelector(':scope > .show-case-hero-carousel')) {
      await buildAuthorCarousel(block, slideRows, config, configRow);
    }
    return;
  }

  const slides = slideRows.map(buildSlide).filter((s) => s.image);
  if (!slides.length) return;

  block.textContent = '';
  block.classList.add('show-case-hero-carousel');

  const slidesContent = slides.map((props, idx) => h(PromoCardCompact, { ...props, key: idx }));

  const baseSpace = config.spaceBetween;
  const swiperConfigs = {
    slidesPerView: config.slidesPerView,
    spaceBetween: baseSpace,
    centeredSlides: config.centeredSlides,
    loop: slides.length > 1 && config.loop,
    navigation: slides.length > 1 && config.navigation,
    pagination: slides.length > 1 && config.pagination,
    autoplay: config.autoplay ? { delay: config.autoplayDelay, disableOnInteraction: false } : false,
    breakpoints: {
      0: { slidesPerView: 1, spaceBetween: 12, centeredSlides: false },
      500: { slidesPerView: config.slidesPerView, spaceBetween: baseSpace, centeredSlides: config.centeredSlides },
      768: { spaceBetween: baseSpace + 4 },
      1024: { spaceBetween: baseSpace + 8 },
    },
  };

  render(h(CustomCarousel, { swiperConfigs, slides: slidesContent }), block);
}
