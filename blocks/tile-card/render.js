import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Tag({ text, textColor, backgroundColor }) {
  if (!text) return null;
  return html` <span className="tile-card__tag" style=${{ color: textColor || undefined, backgroundColor: backgroundColor || undefined }}> ${text} </span> `;
}

export default function TileCard({
  image, imageAlt, tagText, tagTextColor, tagBackgroundColor, title, description, bgColor,
}) {
  return html`
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
        </div>
      </div>
    </section>
  `;
}
