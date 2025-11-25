export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv) {
    block.classList.add('fwcb');
    return;
  }

  const rows = [...block.children];
  if (!rows.length) return;

  const configRow = rows[0];
  // Temporarily hide child buttons; only render background, badge, title, subtitle
  const buttonRows = [];
  const cells = [...configRow.children];

  const backgroundCell = cells[0];
  const bgMedia = backgroundCell?.querySelector('img, picture source, video, a');
  const bgSrc = bgMedia?.src || bgMedia?.getAttribute?.('srcset') || bgMedia?.getAttribute?.('href');

  const badgeText = cells[1]?.textContent || '';
  const titleText = cells[2]?.textContent || '';
  const subtitleCell = cells[3];
  const subtitleHTML = subtitleCell ? subtitleCell.innerHTML : '';
  const alignment = (cells[4]?.textContent || 'center').trim().toLowerCase();

  block.textContent = '';
  block.classList.add('fwcb');
  if (bgSrc) {
    block.style.setProperty('--fwcb-bg-image', `url("${bgSrc}")`);
  }

  const content = document.createElement('div');
  content.className = `fwcb-content fwcb-align-${['left', 'right'].includes(alignment) ? alignment : 'center'}`;

  if (cells[1]) {
    const badge = document.createElement('span');
    badge.className = 'fwcb-badge';
    badge.textContent = badgeText.trim();
    content.append(badge);
  }

  if (cells[2]) {
    const title = document.createElement('h2');
    title.className = 'fwcb-title';
    title.textContent = titleText.trim();
    content.append(title);
  }

  if (subtitleCell) {
    const subtitle = document.createElement('div');
    subtitle.className = 'fwcb-subtitle';
    subtitle.innerHTML = subtitleHTML;
    content.append(subtitle);
  }

  const btnWrap = document.createElement('div');
  btnWrap.className = 'fwcb-buttons';

  buttonRows.forEach((row) => {
    const btnCells = [...row.children];
    const label = btnCells[0]?.textContent.trim();
    const linkAnchor = btnCells[1]?.querySelector('a');
    if (!label || !linkAnchor?.href) return;
    const btn = document.createElement('a');
    btn.className = 'fwcb-button';
    btn.textContent = label;
    btn.href = linkAnchor.href;
    btn.setAttribute('draggable', 'false');
    btnWrap.append(btn);
  });

  if (btnWrap.childElementCount) {
    content.append(btnWrap);
  }

  block.append(content);
}
