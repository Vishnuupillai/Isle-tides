/* ── Nav scroll state ──────────────────────────────────── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ── Mobile menu ───────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ── Intersection reveal ───────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings inside the same parent
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ── Parallax on quote section ─────────────────────────── */
const quoteBg = document.querySelector('.quote-section__bg');

if (quoteBg) {
  window.addEventListener('scroll', () => {
    const section = quoteBg.parentElement;
    const rect    = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const pct = rect.top / window.innerHeight;
    quoteBg.style.transform = `scale(1.08) translateY(${pct * 28}px)`;
  }, { passive: true });
}

/* ── Lightbox ──────────────────────────────────────────── */
const IMAGES = [
  'Images/Main/IMG-20260118-WA0002.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0025.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0042.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0046.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0052.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0054.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0058.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0060.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0062.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0064.jpg.jpeg',
  'Images/Main/IMG-20260423-WA0066.jpg.jpeg',
  'Images/Main/IMG-20260521-WA0017.jpg.jpeg',
  'Images/Main/IMG-20260521-WA0019.jpg.jpeg',
  'Images/Main/IMG-20260521-WA0022.jpg.jpeg',
  'Images/Main/IMG-20260522-WA0010.jpg.jpeg',
  'Images/Main/IMG-20260522-WA0017.jpg.jpeg',
  'Images/Main/IMG-20260522-WA0022.jpg.jpeg',
  'Images/Main/IMG-20260609-WA0041.jpg.jpeg',
  'Images/Main/IMG-20260609-WA0045.jpg.jpeg',
  'Images/Main/IMG-20260609-WA0046.jpg.jpeg',
  'Images/Main/IMG-20260609-WA0047.jpg.jpeg',
  'Images/Main/IMG-20260615-WA0029.jpg.jpeg',
  'Images/Main/IMG-20260615-WA0031.jpg.jpeg',
  'Images/Main/IMG-20260615-WA0039.jpg.jpeg',
  'Images/Main/IMG-20260615-WA0045.jpg.jpeg',
  'Images/Main/IMG-20260615-WA0047.jpg.jpeg',
  'Images/Main/IMG-20260616-WA0013.jpg.jpeg',
  'Images/Main/IMG-20260616-WA0029.jpg.jpeg',
  'Images/Main/IMG-20260616-WA0032.jpg.jpeg',
  'Images/Main/IMG-20260616-WA0033.jpg.jpeg',
  'Images/Main/SAVE_20260529_201956.jpg.jpeg',
  'Images/Main/SAVE_20260529_202010.jpg.jpeg',
  'Images/Main/SAVE_20260529_202348.jpg.jpeg',
];

const lb        = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbCounter = document.getElementById('lbCounter');
const lbThumbs  = document.getElementById('lbThumbs');
const lbClose   = document.getElementById('lbClose');
const lbPrev    = document.getElementById('lbPrev');
const lbNext    = document.getElementById('lbNext');
const viewAllBtn = document.getElementById('viewAllBtn');

let current = 0;

// Build thumbnails once
IMAGES.forEach((src, i) => {
  const t = document.createElement('div');
  t.className = 'lb__thumb';
  t.style.backgroundImage = `url('${src}')`;
  t.dataset.index = i;
  t.addEventListener('click', () => lbGoto(i));
  lbThumbs.appendChild(t);
});

function lbOpen(index) {
  current = index;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
  lbRender();
}

function lbClose_fn() {
  lb.hidden = true;
  document.body.style.overflow = '';
}

function lbGoto(index) {
  current = (index + IMAGES.length) % IMAGES.length;
  lbRender();
}

function lbRender() {
  lbImg.classList.add('lb--loading');
  const src = IMAGES[current];
  const tmp = new Image();
  tmp.onload = () => {
    lbImg.src = src;
    lbImg.classList.remove('lb--loading');
  };
  tmp.src = src;

  lbCounter.textContent = `${current + 1} / ${IMAGES.length}`;

  // Update thumb highlight & scroll active thumb into view
  lbThumbs.querySelectorAll('.lb__thumb').forEach((t, i) => {
    t.classList.toggle('active', i === current);
  });
  const activeThumb = lbThumbs.children[current];
  if (activeThumb) {
    activeThumb.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
  }
}

// Click on gallery items
document.querySelectorAll('.gallery__item[data-lb-index]').forEach(item => {
  item.addEventListener('click', () => lbOpen(parseInt(item.dataset.lbIndex, 10)));
  item.style.cursor = 'pointer';
});

// "View All" button opens at index 0
if (viewAllBtn) viewAllBtn.addEventListener('click', () => lbOpen(0));

lbClose.addEventListener('click', lbClose_fn);
lbPrev.addEventListener('click', () => lbGoto(current - 1));
lbNext.addEventListener('click', () => lbGoto(current + 1));

// Keyboard navigation
window.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape')     lbClose_fn();
  if (e.key === 'ArrowLeft')  lbGoto(current - 1);
  if (e.key === 'ArrowRight') lbGoto(current + 1);
});

// Swipe support (touch)
let touchStartX = 0;
lb.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) lbGoto(dx < 0 ? current + 1 : current - 1);
}, { passive: true });

// Click on backdrop (outside image) closes
lb.addEventListener('click', e => {
  if (e.target === lb) lbClose_fn();
});

/* ── Contact form → WhatsApp ───────────────────────────── */
const form = document.querySelector('.contact__form');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const date    = form.querySelector('#date').value.trim();
    const venue   = form.querySelector('#venue').value.trim();
    const message = form.querySelector('#message').value.trim();

    const text = [
      '👋 Hi Isles & Tides! I found you through your website.',
      '',
      `💑 Names: ${name || '—'}`,
      `📧 Email: ${email || '—'}`,
      `📅 Wedding Date: ${date || '—'}`,
      `📍 Venue / Location: ${venue || '—'}`,
      '',
      `💬 ${message || '—'}`,
    ].join('\n');

    const phone = '917594088243';
    const url   = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  });
}
