import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="deal-card__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html`<a className="deal-card__cta" href=${ctaHref} draggable="false">${ctaLabel}</a>`;
}

export default function DealCard({
  image, imageAlt, tagLabel, title, descriptionHTML, offerPrice, regularPrice, bgColor, ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const card = html`
    <section className="deal-card" aria-label=${imageAlt || title || undefined} style=${{ backgroundColor: bgColor }}>
      <div className="deal-card__content-wrapper">
        ${image
    ? html`
              <picture className="deal-card__image">
                <img src=${image} alt=${imageAlt || ''} loading="lazy" />
              </picture>
            `
    : null}
        <div className="deal-card__body">
          ${tagLabel ? html`<span className="deal-card__tag">${tagLabel}</span>` : null} ${title ? html`<h3 className="deal-card__title">${title}</h3>` : null}
          ${descriptionHTML ? html`<p className="deal-card__description">${descriptionHTML}</p>` : null}
          <${Cta} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
          <p>${offerPrice}</p>
          <p>${regularPrice}</p>
        </div>
      </div>
    </section>
  `;

  if (hasLink) {
    return html`<a className="deal-card__link" href=${ctaHref} aria-label=${title || imageAlt || undefined}>${card}</a>`;
  }

  return card;
}
