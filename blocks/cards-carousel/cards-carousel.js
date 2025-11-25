export default function decorate(block) {
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
    const card = document.createElement('article');
    card.className = 'cc-card';

    const badgeText = cells[0]?.textContent.trim();
    if (badgeText) {
      const badge = document.createElement('span');
      badge.className = 'cc-badge';
      badge.textContent = badgeText;
      card.append(badge);
    }

    const mediaCell = cells[1];
    if (mediaCell && mediaCell.textContent.trim()) {
      const media = document.createElement('div');
      media.className = 'cc-media';
      while (mediaCell.firstChild) media.append(mediaCell.firstChild);
      card.append(media);
    }

    const titleText = cells[2]?.textContent.trim();
    if (titleText) {
      const title = document.createElement('h3');
      title.className = 'cc-title';
      title.textContent = titleText;
      card.append(title);
    }

    const subtitleText = cells[3]?.textContent.trim();
    if (subtitleText) {
      const subtitle = document.createElement('p');
      subtitle.className = 'cc-subtitle';
      subtitle.textContent = subtitleText;
      card.append(subtitle);
    }

    const ctaCell = cells[4];
    const ctaLink = ctaCell?.querySelector('a');
    if (ctaLink) {
      const cta = document.createElement('a');
      cta.className = 'cc-cta';
      cta.href = ctaLink.href;
      cta.textContent = ctaLink.textContent || 'Learn more';
      card.append(cta);
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
