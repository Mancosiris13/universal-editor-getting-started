import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);
export default function ContentTextCenter() {
  const bleed = html`
        <section className="content-text-center">
            <h1>Content Text Center<h1>
        </section>
        `;
  return bleed;
}
