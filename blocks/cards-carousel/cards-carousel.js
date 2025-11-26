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
      card.setAttribute('draggable', 'false');
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
      media.querySelectorAll('img, picture, video').forEach((el) => {
        el.setAttribute('draggable', 'false');
      });
      card.append(media);
    }

    const textWrap = document.createElement('div');
    textWrap.className = 'cc-text';

    if (titleText) {
      const title = document.createElement('h3');
      title.className = 'cc-title';
      title.textContent = titleText;
      textWrap.append(title);
    }

    if (subtitleText) {
      const subtitle = document.createElement('p');
      subtitle.className = 'cc-subtitle';
      subtitle.textContent = subtitleText;
      textWrap.append(subtitle);
    }

    if (textWrap.childElementCount) {
      card.append(textWrap);
    }

    // skip adding completely empty cards
    if (!card.childElementCount) return;

    track.append(card);
  });

  block.append(prev, track, next);

  const scrollByCard = (direction) => {
    const cardWidth = track.querySelector('.cc-card')?.getBoundingClientRect().width || 240;
    const gap = 12;
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  };

  // Mouse drag-to-scroll on desktop
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;
  let moved = false;

  const startDrag = (event) => {
    isDragging = true;
    moved = false;
    startX = event.clientX;
    startScrollLeft = track.scrollLeft;
    track.classList.add('cc-dragging');
  };

  const onDrag = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    if (Math.abs(delta) > 3) moved = true;
    track.scrollLeft = startScrollLeft - delta;
  };

  const endDrag = () => {
    isDragging = false;
    track.classList.remove('cc-dragging');
  };

  track.addEventListener('pointerdown', (e) => {
    // avoid dragging when clicking buttons
    if (e.target.closest('.cc-btn')) return;
    startDrag(e);
  });
  window.addEventListener('pointermove', onDrag);
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointerleave', endDrag);

  // Prevent link click if it was a drag gesture
  track.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    moved = false;
  }, true);

  prev.addEventListener('click', () => scrollByCard(-1));
  next.addEventListener('click', () => scrollByCard(1));
}
