/* ═══════════════════════════════════════════════
   CYBER PORTFOLIO — script.js
   Particle BG · Typed Effect · Counters · Scroll
   Reveal · QR Code · vCard · Back-to-top
════════════════════════════════════════════════ */

'use strict';

/* ── 1. PRELOADER ──────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const app       = document.getElementById('app');

  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.transition = 'opacity 0.8s ease';
    setTimeout(() => {
      preloader.style.display = 'none';
      app.classList.remove('hidden');
      initReveal();
      initCounters();
      initTyped();
    }, 800);
  }, 1800);
});

/* ── 2. PARTICLE CANVAS ────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles, mouse = { x: null, y: null };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.r    = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
    };
    this.reset();
    this.update = function() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    };
  }

  const COUNT = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 14000));

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const MAX  = 120;
        if (dist < MAX) {
          const alpha = (1 - dist / MAX) * 0.18;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth   = 0.7;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
      // Mouse reaction
      if (mouse.x !== null) {
        const dx   = particles[i].x - mouse.x;
        const dy   = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const alpha = (1 - dist / 160) * 0.3;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,255,136,${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  // Touch
  window.addEventListener('touchmove', e => {
    mouse.x = e.touches[0].clientX;
    mouse.y = e.touches[0].clientY;
  }, { passive: true });

  init();
  draw();
})();

/* ── 3. TYPED TITLE EFFECT ─────────────────────── */
function initTyped() {
  const el     = document.getElementById('typed-title');
  const titles = ['Brand Designer', 'Graphic Designer', 'Social Media Marketer', 'Video Editor', 'Wordpress Designer'];
  let   ti = 0, ci = 0, deleting = false;

  function tick() {
    const current = titles[ti];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
}

/* ── 4. SCROLL REVEAL ──────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ── 5. ANIMATED COUNTERS ──────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.count);
        const dur    = 1800;
        const start  = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / dur, 1);
          const ease     = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(ease * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => obs.observe(c));
}

/* ── 6. BACK TO TOP ────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ── 7. SOCIAL RIPPLE ──────────────────────────── */
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect   = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(btn.offsetWidth, btn.offsetHeight);
    ripple.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top  - size/2}px;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ── 8. QR MODAL ───────────────────────────────── */
(function initQR() {
  const modal      = document.getElementById('qr-modal');
  const openBtn    = document.getElementById('qr-btn');
  const closeBtn   = document.getElementById('modal-close');
  const qrCanvas   = document.getElementById('qr-canvas');
  const ctx        = qrCanvas.getContext('2d');
  let   rendered   = false;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (!rendered) { renderQR(); rendered = true; }
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  // Minimal QR-like visual (decorative — real QR needs a lib)
  function renderQR() {
    const size = 180;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);

    const data = generateQRMatrix('https://');
    const cellSize = size / data.length;

    ctx.fillStyle = '#050505';
    for (let r = 0; r < data.length; r++) {
      for (let c = 0; c < data[r].length; c++) {
        if (data[r][c]) {
          ctx.fillRect(
            Math.round(c * cellSize),
            Math.round(r * cellSize),
            Math.ceil(cellSize),
            Math.ceil(cellSize)
          );
        }
      }
    }
  }

  // Simplified QR-style matrix generator (not real QR, decorative)
  function generateQRMatrix(text) {
    const N = 21;
    const m = Array.from({ length: N }, () => new Array(N).fill(0));

    // Finder patterns
    function finder(r, c) {
      for (let dr = 0; dr < 7; dr++) {
        for (let dc = 0; dc < 7; dc++) {
          if (r + dr < N && c + dc < N) {
            m[r + dr][c + dc] =
              dr === 0 || dr === 6 || dc === 0 || dc === 6 ||
              (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4) ? 1 : 0;
          }
        }
      }
    }
    finder(0, 0); finder(0, 14); finder(14, 0);

    // Timing
    for (let i = 8; i < 13; i++) {
      m[6][i] = i % 2 === 0 ? 1 : 0;
      m[i][6] = i % 2 === 0 ? 1 : 0;
    }

    // Seeded pseudo-random data fill (deterministic based on text)
    let seed = 0;
    for (let i = 0; i < text.length; i++) seed += text.charCodeAt(i);
    function seededRand() { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; }

    for (let r = 8; r < N; r++) {
      for (let c = 8; c < N; c++) {
        if (r < 14 && c < 14) continue;
        m[r][c] = seededRand() > 0.5 ? 1 : 0;
      }
    }

    return m;
  }
})();

/* ── 9. SAVE CONTACT (vCard) ────────────────────── */
document.getElementById('save-contact-btn').addEventListener('click', () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:NAZMUS SAKIB
N:Nazmus;Sakib;;;
ORG:Self Employed
TITLE:Graphics Designer
TEL;TYPE=WORK,VOICE:+8801540760401
EMAIL;TYPE=INTERNET:nsakib.sami@gmail.com
URL:https://nzsami.netlify.app
ADR;TYPE=WORK:;;Dhaka;Bangladesh
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'nzs-sami.vcf';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // Visual feedback
  const btn = document.getElementById('save-contact-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Saved!`;
  btn.style.background = '#00cc6a';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
});

/* ── 10. AMBIENT NEON CURSOR TRAIL ──────────────── */
(function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const dots = [];
  const COUNT = 10;
  for (let i = 0; i < COUNT; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998; border-radius:50%;
      background:rgba(0,255,136,${0.4 - i * 0.035});
      width:${6 - i * 0.4}px; height:${6 - i * 0.4}px;
      transform:translate(-50%,-50%); transition:none;
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: -100, y: -100 });
  }

  let mx = -100, my = -100;
  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animTrail() {
    let x = mx, y = my;
    dots.forEach((dot, i) => {
      dot.x += (x - dot.x) * (0.55 - i * 0.04);
      dot.y += (y - dot.y) * (0.55 - i * 0.04);
      dot.el.style.left = dot.x + 'px';
      dot.el.style.top  = dot.y + 'px';
      x = dot.x; y = dot.y;
    });
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();

/* ── 11. SECTION ACTIVE HIGHLIGHT on scroll ─────── */
(function initSectionGlow() {
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sections.forEach(s => s.classList.remove('active-section'));
        entry.target.classList.add('active-section');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => obs.observe(s));
})();
