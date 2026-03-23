import { h, render } from '@dropins/tools/preact.js';
import ContentTextCenter from './render.js';

export default function decorate(block) {
  render(h(ContentTextCenter), block);
}
