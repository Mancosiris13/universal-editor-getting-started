import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="gwp-card__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html`<a className="gwp-card__cta" href=${ctaHref} draggable="false">${ctaLabel}</a>`;
}

export default function GWPCard({
  image, imageAlt, brandLabel, title, descriptionHTML, bgColor, ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const card = html`
    <section className="gwp-card" aria-label=${imageAlt || title || undefined} style=${{ backgroundColor: bgColor }}>
      <div className="gwp-card__content-wrapper">
        ${image
    ? html`
              <picture className="gwp-card__image-container">
                <img src=${image} alt=${imageAlt || ''} loading="lazy" className="gwp-card__image" />
              </picture>
            `
    : null}

        <div className="gwp-card__body">
          ${brandLabel ? html`<h3 className="gwp-card__brand-label">${brandLabel}</h3>` : null} ${title ? html`<h3 className="gwp-card__title">${title}</h3>` : null}
          ${descriptionHTML ? html`<p className="gwp-card__description">${descriptionHTML}</p>` : null}

          <${Cta} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
        </div>
      </div>
    </section>
  `;

  if (hasLink) {
    return html`<a className="gwp-card__link" href=${ctaHref} aria-label=${title || imageAlt || undefined}>${card}</a>`;
  }

  return card;
}
