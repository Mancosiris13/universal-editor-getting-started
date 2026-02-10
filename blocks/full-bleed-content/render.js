import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export default function FullBleedContent({
  imgDesk,
  imgMob,
  background,
  alt,
  title,
  description,
  href,
  leftAlign,
}) {
  const bleed = html`
        <section className="full-bleed-content" style=${{ backgroundColor: background }}>
            <div className="full-bleed-content_father-container" style=${leftAlign ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }}>
                <div className="full-bleed-content_text-container">
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
                <div className="full-bleed-content_image-container">
                    <a href=${href}>
                        <img className="full-bleed-content_image-desktop" src=${imgDesk} alt=${alt} />
                        <img className="full-bleed-content_image-mobile" src=${imgMob} alt=${alt} />
                    </a>
                </div>
            </div>
        </section>
        `;
  return bleed;
}
