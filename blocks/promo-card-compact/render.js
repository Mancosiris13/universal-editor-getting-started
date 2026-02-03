import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="promo-card-compact__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html`<a className="promo-card-compact__cta" href=${ctaHref} draggable="false">${ctaLabel}</a>`;
}

export default function PromoCardCompact({
  image, imageAlt, title, descriptionHTML, bgColor, ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const card = html`
    <section className="promo-card-compact" aria-label=${imageAlt || title || undefined} style=${{ backgroundColor: bgColor }}>
      <div className="promo-card-compact__content-wrapper">
        ${image
    ? html`
              <picture className="promo-card-compact__image-container">
                <img src=${image} alt=${imageAlt || ''} loading="lazy" className="promo-card-compact__image" />
              </picture>
            `
    : null}

        <div className="promo-card-compact__body">
          ${title ? html`<h3 className="promo-card-compact__title">${title}</h3>` : null} ${descriptionHTML ? html`<p className="promo-card-compact__description">${descriptionHTML}</p>` : null}
          <${Cta} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
        </div>
      </div>
    </section>
  `;

  if (hasLink) {
    return html`<a className="promo-card-compact__link" href=${ctaHref} aria-label=${title || imageAlt || undefined}>${card}</a>`;
  }

  return card;
}
