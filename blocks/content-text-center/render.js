import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);
export default function ContentTextCenter({
  background,
  title,
  headingTag,
  description,
  href,
}) {
  const text = html`
        <section className="content-text-center" style=${{ backgroundColor: background }}>
          <a href=${href}>  
            <div className="content-text-center_father-container">
              <${headingTag}>${title}</${headingTag}>
              <p>${description}</p>
            </div>
          </a>
        </section>
        `;
  return text;
}
