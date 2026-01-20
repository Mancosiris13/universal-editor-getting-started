import { h } from '@dropins/tools/preact.js';
import htm from '../../scripts/htm.js';

const html = htm.bind(h);

function normalizeSize(value) {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  return /^\d+(\.\d+)?$/.test(trimmed) ? `${trimmed}px` : trimmed;
}

export default function Separator({ heightDesktop, heightMobile, bgColor }) {
  const style = {
    backgroundColor: bgColor || undefined,
    '--separator-height-desktop': normalizeSize(heightDesktop) || undefined,
    '--separator-height-mobile': normalizeSize(heightMobile) || undefined,
  };

  return html`<div className="separator__spacer" role="presentation" style=${style}></div>`;
}
