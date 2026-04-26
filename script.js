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
      this.x     = Math.random() * W;
      this.y     = Math.random() * H;
      this.vx    = (Math.random() - 0.5) * 0.4;
      this.vy    = (Math.random() - 0.5) * 0.4;
      this.r     = Math.random() * 1.6 + 0.4;
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

/* ── 8. QR MODAL — Pure JS, Zero dependencies ───── */
/*
 * No CDN, no external library. Works offline.
 * Encodes URL as a real scannable QR code on <canvas id="qr-canvas">.
 * Updated URL: https://nzs-sami.github.io/info.nzs/
 */
(function initQR() {
  const modal    = document.getElementById('qr-modal');
  const openBtn  = document.getElementById('qr-btn');
  const closeBtn = document.getElementById('modal-close');
  let   rendered = false;

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

  /* ── Draw QR to canvas ── */
  function renderQR() {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas) return;
    /* ── UPDATED URL ── */
    const matrix = encodeQR('https://nzs-sami.github.io/info.nzs/');
    if (!matrix) return;

    const N      = matrix.length;
    const QUIET  = 4;
    const CELL   = Math.floor(180 / (N + QUIET * 2));
    const SIZE   = (N + QUIET * 2) * CELL;
    canvas.width  = SIZE;
    canvas.height = SIZE;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = '#000000';
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (matrix[r][c]) {
          ctx.fillRect(
            (c + QUIET) * CELL,
            (r + QUIET) * CELL,
            CELL, CELL
          );
        }
      }
    }
  }

  /* ══════════════════════════════════════════════════
     Pure-JS QR Code Encoder
     Byte mode · Versions 1-10 · ECC Level M · Mask 0
  ══════════════════════════════════════════════════ */
  function encodeQR(text) {

    /* ── Galois Field GF(256) ── */
    const EXP = new Uint8Array(512);
    const LOG  = new Uint8Array(256);
    (function () {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP[i] = x; LOG[x] = i;
        x <<= 1; if (x & 0x100) x ^= 0x11d;
      }
      for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    })();

    const gfMul = (a, b) => (!a || !b) ? 0 : EXP[(LOG[a] + LOG[b]) % 255];

    function gfPolyMul(p, q) {
      const r = new Uint8Array(p.length + q.length - 1);
      for (let i = 0; i < p.length; i++)
        for (let j = 0; j < q.length; j++)
          r[i + j] ^= gfMul(p[i], q[j]);
      return r;
    }

    function gfPolyRem(msg, gen) {
      const r = new Uint8Array(msg);
      for (let i = 0; i < msg.length - gen.length + 1; i++) {
        const c = r[i];
        if (c) for (let j = 1; j < gen.length; j++) r[i + j] ^= gfMul(gen[j], c);
      }
      return r.slice(msg.length - gen.length + 1);
    }

    function makeGenerator(n) {
      let g = new Uint8Array([1]);
      for (let i = 0; i < n; i++)
        g = gfPolyMul(g, new Uint8Array([1, EXP[i]]));
      return g;
    }

    /* ── Version / ECC capacity table (ECC Level M) ── */
    // [dataCodewords, ecPerBlock, numBlocks]
    const CAP_M = {
       1: [16,  10, 1],  2: [28,  16, 1],  3: [44,  26, 1],
       4: [64,  18, 2],  5: [86,  24, 2],  6: [108, 16, 4],
       7: [124, 18, 4],  8: [154, 22, 2],  9: [182, 22, 3],
      10: [216, 26, 4],
    };

    /* ── UTF-8 encode text ── */
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c < 0x80) { bytes.push(c); }
      else if (c < 0x800) { bytes.push(0xc0|(c>>6), 0x80|(c&0x3f)); }
      else { bytes.push(0xe0|(c>>12), 0x80|((c>>6)&0x3f), 0x80|(c&0x3f)); }
    }

    /* ── Select version ── */
    let version = 0;
    for (let v = 1; v <= 10; v++) {
      if (CAP_M[v][0] >= bytes.length + 3) { version = v; break; }
    }
    if (!version) { console.error('QR: text too long'); return null; }

    const [dataCW, ecPerBlock, numBlocks] = CAP_M[version];

    /* ── Build data bit stream ── */
    const bits = [];
    const push = (v, n) => { for (let i = n-1; i >= 0; i--) bits.push((v>>i)&1); };

    push(0b0100, 4);                          // Byte mode indicator
    push(bytes.length, version < 10 ? 8 : 16); // Character count
    bytes.forEach(b => push(b, 8));           // Data bytes

    // Terminator + byte-align
    for (let i = 0; i < 4 && bits.length < dataCW*8; i++) bits.push(0);
    while (bits.length % 8) bits.push(0);

    // Padding codewords
    const PAD = [0xec, 0x11]; let pi = 0;
    while (bits.length < dataCW * 8) push(PAD[pi++ % 2], 8);

    // Bits → bytes
    const dataBytes = [];
    for (let i = 0; i < dataCW; i++) {
      let b = 0;
      for (let j = 0; j < 8; j++) b = (b << 1) | bits[i*8+j];
      dataBytes.push(b);
    }

    /* ── Split into blocks, compute ECC ── */
    const blockDataLen = Math.floor(dataCW / numBlocks);
    const longBlocks   = dataCW % numBlocks;
    const gen          = makeGenerator(ecPerBlock);
    const blocks = [];
    let off = 0;

    for (let b = 0; b < numBlocks; b++) {
      const len  = blockDataLen + (b >= numBlocks - longBlocks && longBlocks ? 1 : 0);
      const data = dataBytes.slice(off, off + len);
      const msg  = new Uint8Array(len + ecPerBlock);
      data.forEach((v, i) => { msg[i] = v; });
      const ec   = gfPolyRem(msg, gen);
      blocks.push({ data, ec: Array.from(ec) });
      off += len;
    }

    /* ── Interleave codewords ── */
    const codewords = [];
    const maxDL = Math.max(...blocks.map(b => b.data.length));
    for (let i = 0; i < maxDL;    i++) blocks.forEach(b => { if (i < b.data.length) codewords.push(b.data[i]); });
    for (let i = 0; i < ecPerBlock; i++) blocks.forEach(b => { if (i < b.ec.length)   codewords.push(b.ec[i]); });

    /* ── Build symbol matrix ── */
    const N   = 17 + version * 4;
    const mat = Array.from({length: N}, () => new Array(N).fill(0));
    const rsv = Array.from({length: N}, () => new Array(N).fill(false)); // reserved (functional) cells

    // Finder pattern + separator
    function placeFinder(tr, tc) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = tr+r, cc = tc+c;
          if (rr < 0 || rr >= N || cc < 0 || cc >= N) continue;
          rsv[rr][cc] = true;
          const inBox = r >= 0 && r <= 6 && c >= 0 && c <= 6;
          mat[rr][cc] = inBox && (r===0||r===6||c===0||c===6||(r>=2&&r<=4&&c>=2&&c<=4)) ? 1 : 0;
        }
      }
    }
    placeFinder(0, 0);
    placeFinder(0, N-7);
    placeFinder(N-7, 0);

    // Timing strips
    for (let i = 8; i < N-8; i++) {
      mat[6][i] = mat[i][6] = i%2===0 ? 1 : 0;
      rsv[6][i] = rsv[i][6] = true;
    }

    // Dark module
    mat[4*version+9][8] = 1;
    rsv[4*version+9][8] = true;

    // Alignment patterns (version ≥ 2)
    const APOS = {
      2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34],
      7:[6,22,38],8:[6,24,42],9:[6,26,46],10:[6,28,50]
    };
    if (version >= 2) {
      const pos = APOS[version];
      for (let a = 0; a < pos.length; a++) {
        for (let b = 0; b < pos.length; b++) {
          const row = pos[a], col = pos[b];
          if (rsv[row][col]) continue;
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              rsv[row+r][col+c] = true;
              mat[row+r][col+c] = (r===-2||r===2||c===-2||c===2||(r===0&&c===0)) ? 1 : 0;
            }
          }
        }
      }
    }

    // Reserve format info cells
    const FI = [
      [8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8],
      [N-1,8],[N-2,8],[N-3,8],[N-4,8],[N-5,8],[N-6,8],[N-7,8],[8,N-8],[8,N-7],[8,N-6],[8,N-5],[8,N-4],[8,N-3],[8,N-2],[8,N-1]
    ];
    FI.forEach(([r,c]) => { rsv[r][c] = true; });

    /* ── Place data bits (zigzag) ── */
    const dataBits = [];
    codewords.forEach(cw => { for (let i = 7; i >= 0; i--) dataBits.push((cw>>i)&1); });

    let di = 0, upward = true;
    for (let col = N-1; col >= 1; col -= 2) {
      if (col === 6) col = 5; // skip timing column
      for (let row = 0; row < N; row++) {
        const r = upward ? N-1-row : row;
        for (let dx = 0; dx <= 1; dx++) {
          const c = col - dx;
          if (!rsv[r][c]) mat[r][c] = di < dataBits.length ? dataBits[di++] : 0;
        }
      }
      upward = !upward;
    }

    /* ── Apply mask pattern 0: (row+col) % 2 === 0 ── */
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        if (!rsv[r][c] && (r+c)%2===0) mat[r][c] ^= 1;

    /* ── Write format information (ECC-M, mask 0) ── */
    // Pre-computed format string for M, mask 0 = 101010000010010
    const fmtWord = 0b101010000010010;
    const fmtBits = [];
    for (let i = 14; i >= 0; i--) fmtBits.push((fmtWord>>i)&1);

    const FI1 = [[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,7],[8,8],[7,8],[5,8],[4,8],[3,8],[2,8],[1,8],[0,8]];
    const FI2 = [[N-1,8],[N-2,8],[N-3,8],[N-4,8],[N-5,8],[N-6,8],[N-7,8],[8,N-8],[8,N-7],[8,N-6],[8,N-5],[8,N-4],[8,N-3],[8,N-2],[8,N-1]];
    for (let i = 0; i < 15; i++) {
      mat[FI1[i][0]][FI1[i][1]] = fmtBits[i];
      mat[FI2[i][0]][FI2[i][1]] = fmtBits[i];
    }

    return mat;
  }

})();

/* ── 9. SAVE CONTACT (vCard) ────────────────────── */
document.getElementById('save-contact-btn').addEventListener('click', () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:NAZMUS SAKIB SAMI
N:Nazmus;Sakib;Sami;;
ORG:Dhaka Songjog
TITLE:Content Editor & Graphics Designer
TEL;TYPE=WORK,VOICE:+8809658036993
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

  const btn  = document.getElementById('save-contact-btn');
  const orig = btn.innerHTML;
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Saved!`;
  btn.style.background = '#00cc6a';
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2500);
});

/* ── 10. AMBIENT NEON CURSOR TRAIL ──────────────── */
(function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dots  = [];
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
