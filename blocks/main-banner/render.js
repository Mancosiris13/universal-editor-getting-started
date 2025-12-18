import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function Cta({ ctaLabel, ctaHref, isWrapped }) {
  if (!ctaLabel) return null;
  if (isWrapped) {
    return html`<span className="main-banner__cta" role="presentation">${ctaLabel}</span>`;
  }
  if (!ctaHref) return null;
  return html` <a className="main-banner__cta" href=${ctaHref} draggable="false"> ${ctaLabel} </a> `;
}

export default function MainBanner({
  image, imageMobile, imageAlt, title, descriptionHTML, ctaLabel, ctaHref,
}) {
  const hasLink = Boolean(ctaHref);

  const section = html`
    <section className="main-banner" aria-label=${imageAlt || undefined}>
      ${image || imageMobile
    ? html`
            <picture className="main-banner__image">
              <source srcset=${imageMobile || image} media="(max-width: 950px)" />
              <img src=${image || imageMobile} alt=${imageAlt || ''} loading="lazy" />
            </picture>
          `
    : null}
      <div className="main-banner__body">
        ${title ? html`<h2 className="main-banner__title">${title}</h2>` : null} ${descriptionHTML ? html`<p className="main-banner__description">${descriptionHTML}</p> ` : null}
        <${Cta} ctaLabel=${ctaLabel} ctaHref=${hasLink ? null : ctaHref} isWrapped=${hasLink} />
      </div>
    </section>
  `;

  if (hasLink) {
    return html` <a className="main-banner__link" href=${ctaHref} aria-label=${ctaLabel || title || imageAlt || undefined}> ${section} </a> `;
  }

  return section;
}
