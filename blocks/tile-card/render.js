import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Tag({ text, textColor, backgroundColor }) {
  if (!text) return null;
  return html` <span className="tile-card__tag" style=${{ color: textColor || undefined, backgroundColor: backgroundColor || undefined }}> ${text} </span> `;
}

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="tile-card__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html`<a className="tile-card__cta" href=${ctaHref} draggable="false">${ctaLabel}</a>`;
}

export default function TileCard({
  image,
  imageAlt,
  tagText,
  tagTextColor,
  tagBackgroundColor,
  title,
  description,
  bgColor,
  ctaLabel,
  ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const card = html`
    <section className="tile-card" aria-label=${imageAlt || title || undefined} style=${{ backgroundColor: bgColor }}>
      <div className="tile-card__content-wrapper">
        ${image
    ? html`
              <picture className="tile-card__image-container">
                <img src=${image} alt=${imageAlt || ''} loading="lazy" className="tile-card__image" />
              </picture>
            `
    : null}
        <div className="tile-card__body">
          <${Tag} text=${tagText} textColor=${tagTextColor} backgroundColor=${tagBackgroundColor} />
          ${title ? html`<h3 className="tile-card__title">${title}</h3>` : null} ${description ? html`<p className="tile-card__description">${description}</p>` : null}
          <${Cta} ctaLabel=${ctaLabel} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
        </div>
      </div>
    </section>
  `;

  if (hasLink) {
    return html`<a className="tile-card__link" href=${ctaHref} aria-label=${title || imageAlt || undefined}>${card}</a>`;
  }

  return card;
}
