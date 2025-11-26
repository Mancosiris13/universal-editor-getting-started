export default function decorate(block) {
  const isUE = document.documentElement.hasAttribute('data-aue-version');
  if (window.xwalk?.isAuthorEnv || isUE) {
    block.classList.add('fwcbwcc');
    return;
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const extractCells = (row) => {
    const direct = [...row.children];
    if (direct.length === 1 && direct[0]?.children?.length) {
      return [...direct[0].children];
    }
    return direct;
  };

  const configRows = rows.slice(0, 6);
  const cells = configRows.flatMap(extractCells).filter(Boolean);
  const textVals = cells.map((c) => c?.textContent?.trim()).filter(Boolean);
  const hexLike = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

  if (!cells.length) return;

  let paletteClass = textVals[0] || '';
  let bgColor = textVals[1] || '';
  let badgeText = textVals[2] || '';
  let titleText = textVals[3] || '';
  let descriptionHTML = cells[4]?.innerHTML || '';

  // If style is not in cells[0] (e.g., first value is hex), shift values
  if (paletteClass && hexLike.test(paletteClass)) {
    bgColor = paletteClass;
    paletteClass = '';
    badgeText = textVals[1] || '';
    titleText = textVals[2] || '';
    descriptionHTML = cells[3]?.innerHTML || '';
  }

  const ctaLabel = cells[4]?.innerHTML || '';
  const ctaCell = cells[5];
  const getLink = (cell) => cell?.querySelector('a');
  const ctaAnchor = getLink(ctaCell) || (ctaCell?.classList?.contains('button-container') ? ctaCell.querySelector('a') : null);

  const remainingRows = rows.slice(6);
  const existingCarousel = block.querySelector('.inner-fwcbwcc-cards-carousel');
  if (existingCarousel) existingCarousel.remove();

  block.textContent = '';
  block.classList.add('fwcbwcc');
  if (paletteClass) block.classList.add(paletteClass);
  if (bgColor) block.style.setProperty('--fwcbwcc-bg', bgColor);

  const wrapper = document.createElement('div');
  wrapper.className = 'fwcbwcc-wrapper';

  const content = document.createElement('div');
  content.className = 'fwcbwcc-content';

  if (badgeText) {
    const badge = document.createElement('span');
    badge.className = 'fwcbwcc-badge';
    badge.textContent = badgeText;
    content.append(badge);
  }

  if (titleText) {
    const title = document.createElement('h2');
    title.className = 'fwcbwcc-title';
    title.textContent = titleText;
    content.append(title);
  }

  if (descriptionHTML) {
    const desc = document.createElement('div');
    desc.className = 'fwcbwcc-description';
    desc.innerHTML = descriptionHTML;
    content.append(desc);
  }

  if (ctaAnchor?.href && ctaLabel) {
    const cta = document.createElement('a');
    cta.className = 'fwcbwcc-cta';
    cta.href = ctaAnchor.href;
    cta.textContent = ctaLabel;
    cta.setAttribute('draggable', 'false');
    content.append(cta);
  }

  wrapper.append(content);

  const carouselSlot = document.createElement('div');
  carouselSlot.className = 'fwcbwcc-carousel-slot';
  if (existingCarousel) {
    carouselSlot.append(existingCarousel);
  } else {
    remainingRows.forEach((row) => carouselSlot.append(row));
  }

  wrapper.append(carouselSlot);

  block.append(wrapper);
}
