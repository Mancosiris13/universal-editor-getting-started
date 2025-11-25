export default function decorate(block) {
  if (window.xwalk?.isAuthorEnv) {
    block.classList.add('cards-carousel');
    return;
  }

  const rows = [...block.children];
  block.textContent = '';

  block.classList.add('cards-carousel');

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'cc-btn cc-btn-prev';
  prev.setAttribute('aria-label', 'Previous cards');

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'cc-btn cc-btn-next';
  next.setAttribute('aria-label', 'Next cards');

  const track = document.createElement('div');
  track.className = 'cc-track';

  rows.forEach((row) => {
    const cells = [...row.children];
    const badgeText = cells[0]?.textContent.trim();
    const mediaCell = cells[1];
    const titleText = cells[2]?.textContent.trim();
    const subtitleCell = cells[3];
    const subtitleText = subtitleCell?.textContent.trim();
    const ctaLink = subtitleCell?.querySelector('a');
    const card = document.createElement(ctaLink ? 'a' : 'article');
    card.className = 'cc-card';
    if (ctaLink) {
      card.href = ctaLink.href;
      card.setAttribute('aria-label', ctaLink.textContent || titleText || badgeText || 'Card link');
    }

    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = 'cc-badge';
      badge.textContent = badgeText;
      card.append(badge);
    }

    const hasMedia = mediaCell && mediaCell.querySelector('img, picture, video, source');
    if (hasMedia) {
      const media = document.createElement('div');
      media.className = 'cc-media';
      while (mediaCell.firstChild) media.append(mediaCell.firstChild);
      card.append(media);
    }

    if (titleText) {
      const title = document.createElement('h3');
      title.className = 'cc-title';
      title.textContent = titleText;
      card.append(title);
    }

    if (subtitleText) {
      const subtitle = document.createElement('p');
      subtitle.className = 'cc-subtitle';
      subtitle.textContent = subtitleText;
      card.append(subtitle);
    }

    track.append(card);
  });

  block.append(prev, track, next);

  const scrollByCard = (direction) => {
    const cardWidth = track.querySelector('.cc-card')?.getBoundingClientRect().width || 240;
    const gap = 12;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  };

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
}
