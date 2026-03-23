import { h, render } from '@dropins/tools/preact.js';
import HybridHalfImage from './render.js';

export default function decorate(block) {
  render(h(HybridHalfImage), block);
}
