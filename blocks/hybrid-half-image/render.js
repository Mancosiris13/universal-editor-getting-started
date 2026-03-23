import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);
export default function HybridHalfImage() {
  const bleed = html`
        <section className="hybrid-half-image">
            <h1>Hybrid Half Imager<h1>
        </section>
        `;
  return bleed;
}
