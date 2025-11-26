export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv) {
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

  // First rows hold config: 0 palette, 1 bg color, 2 badge, 3 title, 4 description, 5 CTA
  const configRows = rows.slice(0, 6);
  const cells = configRows.flatMap(extractCells).filter(Boolean);
  if (!cells.length) return;
  const paletteClass = cells[0]?.textContent?.trim();
  const bgColor = cells[1]?.textContent?.trim();
  const badgeText = cells[2]?.textContent?.trim();
  const titleText = cells[3]?.textContent?.trim();
  const descriptionHTML = cells[4]?.innerHTML || '';
  const ctaCell = cells[5];
  const ctaLink = ctaCell?.querySelector('a');
  const ctaLabel = ctaCell ? ctaCell.textContent.trim() : '';

  const remainingRows = rows.slice(6);

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

  if (ctaLink?.href && ctaLabel) {
    const cta = document.createElement('a');
    cta.className = 'fwcbwcc-cta';
    cta.href = ctaLink.href;
    cta.textContent = ctaLabel;
    cta.setAttribute('draggable', 'false');
    content.append(cta);
  }

  wrapper.append(content);

  remainingRows.forEach((row) => wrapper.append(row));

  block.append(wrapper);
}
