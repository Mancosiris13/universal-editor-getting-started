/* eslint-disable max-len */
import { h, render } from '@dropins/tools/preact.js';
import { generateOptimizedImageUrl } from '../../scripts/aem.js';
import HeroRailCard from '../hero-rail-card/render.js';
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
  const tagCell = findPropEl(row, 'urgency tag') || findPropEl(row, 'urgencyTag') || findPropEl(row, 'tag') || cells[2];
  const titleCell = findPropEl(row, 'title') || cells[3];
  const descriptionCell = findPropEl(row, 'description') || cells[4];
  const ctaLabelCell = findPropEl(row, 'ctaLabel') || cells[5];
  const ctaLinkCell = findPropEl(row, 'ctaLink') || cells[6];

  const imgEl = imageCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a') || ctaLabelCell?.querySelector('a');

  const imageWidth = Number(imgEl?.width) || 900;
  const rawImage = imgEl?.src || '';
  const imageOptimized = generateOptimizedImageUrl(rawImage, { width: imageWidth });

  return {
    image: imageOptimized,
    imageAlt: altCell?.textContent?.trim() || imgEl?.alt || '',
    tagLabel: tagCell?.textContent?.trim() || '',
    title: titleCell?.textContent?.trim() || '',
    descriptionHTML: descriptionCell?.innerHTML?.trim() || '',
    ctaLabel: ctaLabelCell?.textContent?.trim() || '',
    ctaHref: ctaLink?.href || '',
  };
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  let config = {
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: true,
    pagination: true,
    autoplay: false,
    autoplayDelay: 6000,
    loop: true,
    centeredSlides: false,
  };

  let slideRows = rows;
  const maybeConfigRow = rows[0];
  if (maybeConfigRow && !maybeConfigRow.querySelector('img') && maybeConfigRow.children.length >= 3) {
    config = readConfig(maybeConfigRow);
    slideRows = rows.slice(1);
  }

  const nestedHeroBlocks = [...block.querySelectorAll(':scope > div[data-block-name="hero-rail-card"], :scope > div.hero-rail-card')];
  if (nestedHeroBlocks.length) {
    slideRows = nestedHeroBlocks;
  }

  const slides = slideRows.map(buildSlide).filter((s) => s.image);
  if (!slides.length) return;

  block.textContent = '';
  block.classList.add('carousel-hero-rail-cards');

  const slidesContent = slides.map((props, idx) => h(HeroRailCard, { ...props, key: idx }));

  const swiperConfigs = {
    slidesPerView: config.slidesPerView,
    spaceBetween: config.spaceBetween,
    centeredSlides: config.centeredSlides,
    loop: slides.length > 1 && config.loop,
    navigation: slides.length > 1 && config.navigation,
    pagination: slides.length > 1 && config.pagination,
    autoplay: config.autoplay ? { delay: config.autoplayDelay, disableOnInteraction: false } : false,
    breakpoints: {
      768: { spaceBetween: config.spaceBetween + 4 },
      1024: { spaceBetween: config.spaceBetween + 8 },
    },
  };

  render(h(CustomCarousel, { swiperConfigs, slides: slidesContent }), block);
}
