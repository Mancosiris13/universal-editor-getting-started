import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="hrc__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html`<a className="hrc__cta" href=${ctaHref} draggable="false">${ctaLabel}</a>`;
}

export default function HeroRailCard({
  image, imageAlt, tagLabel, title, descriptionHTML, ctaLabel, ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const card = html`
    <section className="hrc" aria-label=${imageAlt || title || undefined}>
        <div className="hrc__content-wrapper">
          ${image
    ? html`
                <picture className="hrc__image">
                  <img src=${image} alt=${imageAlt || ''} loading="lazy" />
                </picture>
              `
    : null}
          <div className="hrc__body">
            ${tagLabel ? html`<span className="hrc__tag">${tagLabel}</span>` : null}
            ${title ? html`<h3 className="hrc__title">${title}</h3>` : null}
            ${descriptionHTML ? html`<p className="hrc__description">${descriptionHTML}</p>` : null}
            <${Cta} ctaLabel=${ctaLabel} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
          </div>
        </div>
    </section>
  `;

  if (hasLink) {
    return html`<a className="hrc__link" href=${ctaHref} aria-label=${ctaLabel || title || imageAlt || undefined}>${card}</a>`;
  }

  return card;
}
