/* eslint-disable max-len */
import { h } from '@dropins/tools/preact.js';
import { useEffect, useRef, useState } from '@dropins/tools/preact-hooks.js';
import htm from '../../scripts/htm.js';
import { loadCSS } from '../../scripts/aem.js';

const html = htm.bind(h);

const assetBase = window.hlx?.codeBasePath || '';
const SWIPER_JS = `${assetBase}/libs/swiper/swiper-bundle.min.mjs`;
const SWIPER_CSS = `${assetBase}/libs/swiper/swiper-bundle.min.css`;
const PROMO_CARD_COMPACT_CSS = `${assetBase}/blocks/promo-card-compact/promo-card-compact.css`;
const ARROW_ICON = `${assetBase}/icons/arrow.svg`;

let swiperPromise;
function ensureSwiper() {
  if (!swiperPromise) {
    swiperPromise = Promise.all([loadCSS(SWIPER_CSS), import(SWIPER_JS)]).then(([, mod]) => mod?.default || mod);
  }
  return swiperPromise;
}

let heroCssPromise;
function ensureHeroCss() {
  if (!heroCssPromise) {
    heroCssPromise = loadCSS(PROMO_CARD_COMPACT_CSS);
  }
  return heroCssPromise;
}

export default function CustomCarousel({ swiperConfigs, slides }) {
  const rootRef = useRef(null);
  const swiperRef = useRef(null);
  const swiperInstanceRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let observer;

    const initSwiper = async () => {
      if (!rootRef.current || !swiperRef.current || swiperInstanceRef.current) return;
      await ensureHeroCss();
      const Swiper = await ensureSwiper();
      const config = { ...swiperConfigs };

      if (swiperConfigs.navigation) {
        config.navigation = {
          nextEl: rootRef.current.querySelector('.swiper-button-next'),
          prevEl: rootRef.current.querySelector('.swiper-button-prev'),
        };
      }

      if (swiperConfigs.pagination) {
        config.pagination = {
          el: rootRef.current.querySelector('.swiper-pagination'),
          clickable: true,
        };
      }

      swiperInstanceRef.current = new Swiper(swiperRef.current, config);
      rootRef.current.classList.add('swiper-ready');
      swiperRef.current.classList.add('swiper-ready');
      setReady(true);
    };

    if (rootRef.current) {
      observer = new window.IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              initSwiper();
              obs.disconnect();
            }
          });
        },
        { root: null, rootMargin: '100px', threshold: 0 },
      );
      observer.observe(rootRef.current);
    }

    return () => {
      if (observer) observer.disconnect();
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy(true, true);
        swiperInstanceRef.current = null;
      }
    };
  }, [swiperConfigs]);

  return html`
    <div className="show-case-hero-carousel" ref=${rootRef}>
      ${swiperConfigs.navigation
    ? html`
            <div className="swiper-button-prev" role="button" tabindex="0" aria-label="Previous">
              <img src=${ARROW_ICON} alt="Previous" width="20" height="20" />
            </div>
            <div className="swiper-button-next" role="button" tabindex="0" aria-label="Next">
              <img src=${ARROW_ICON} alt="Next" width="20" height="20" />
            </div>
          `
    : null}
      <div className="swiper show-case-hero-carousel-swiper" ref=${swiperRef}>
        <div className="swiper-wrapper">${slides.map((slide) => html` <div className=${`swiper-slide ${!ready ? 'inline-space' : ''}`} style=${{ '--space': `${swiperConfigs.spaceBetween || 0}px` }}>${slide}</div> `)}</div>
        ${swiperConfigs.pagination ? html`<div className="swiper-pagination"></div>` : null}
      </div>
    </div>
  `;
}
