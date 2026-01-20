import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

export default function HeadersWithColors({ title, subtitle, bgColor }) {
  const headersWithColors = html`
    <div className="headers-with-colors" aria-label=${title || undefined} style=${{ backgroundColor: bgColor }}>
      ${title ? html`<h2 className="headers-with-colors__title">${title}</h2>` : null} ${subtitle ? html`<h3 className="headers-with-colors__subtitle">${subtitle}</h3>` : null}
    </div>
  `;
  return headersWithColors;
}
