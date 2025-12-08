import { h, render } from '@dropins/tools/preact.js';

function Banner({
  imgSrc, imgAlt, title, descriptionHTML, ctaLabel, ctaHref,
}) {
  const media = imgSrc ? h('div', { className: 'main-banner__media' }, h('img', { src: imgSrc, alt: imgAlt || '' })) : null;

  const body = h(
    'div',
    { className: 'main-banner__body' },
    [
      title && h('h2', { className: 'main-banner__title' }, title),
      descriptionHTML
        && h('div', {
          className: 'main-banner__description',
          dangerouslySetInnerHTML: { __html: descriptionHTML },
        }),
      ctaLabel
        && ctaHref
        && h(
          'a',
          {
            className: 'main-banner__cta',
            href: ctaHref,
            draggable: 'false',
          },
          ctaLabel,
        ),
    ].filter(Boolean),
  );

  return h('section', { className: 'main-banner' }, [media, body].filter(Boolean));
}

export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv || document.documentElement.hasAttribute('data-aue-version')) {
    block.classList.add('main-banner--author');
    return;
  }

  const cells = [...block.children];
  const [imgCell, titleCell, descriptionCell, ctaLabelCell, ctaLinkCell] = cells;

  const imgEl = imgCell?.querySelector('img');
  const ctaLink = ctaLinkCell?.querySelector('a');

  const props = {
    imgSrc: imgEl?.src || '',
    imgAlt: imgEl?.alt || '',
    title: titleCell?.textContent?.trim() || '',
    descriptionHTML: descriptionCell?.innerHTML?.trim() || '',
    ctaLabel: ctaLabelCell?.textContent?.trim() || '',
    ctaHref: ctaLink?.href || '',
  };

  block.textContent = '';
  const root = document.createElement('div');
  block.append(root);
  render(h(Banner, props), root);
}
