/* ============================================================
   ABHISHEK RAJ — script.js  (FINAL)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. CURSOR ── */
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function tickRing() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(tickRing);
  })();

  document.querySelectorAll('a, button, .stat-box, .exp-card, .tool-card, .cert-pill, .skill-list li, .edu-item, .conn-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovered');  ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '0.4'; });


  /* ── 2. NAVBAR scroll + active link ── */
  const navbar   = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNav() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ── 3. MOBILE MENU ── */
  const burger  = document.getElementById('burgerBtn');
  const mobMenu = document.getElementById('mobMenu');
  const mobClose = document.getElementById('mobClose');

  function openMenu()  { mobMenu.classList.add('open');    burger.classList.add('active');    document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobMenu.classList.remove('open'); burger.classList.remove('active'); document.body.style.overflow = ''; }

  burger.addEventListener('click', openMenu);
  mobClose.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-nav a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


  /* ── 4. SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


  /* ── 5. HERO PARALLAX ── */
  const ghost = document.querySelector('.hero-ghost');
  window.addEventListener('scroll', () => {
    if (!ghost) return;
    const y = window.scrollY;
    ghost.style.transform = `translate(-50%, calc(-50% + ${y * 0.22}px))`;
    ghost.style.opacity   = Math.max(0, 1 - y / 500);
  }, { passive: true });


  /* ── 6. STAT COUNTER ANIMATION ── */
  const countObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el   = entry.target;
      const text = el.textContent.trim();
      const num  = parseFloat(text);

      if (isNaN(num)) {
        // Typewriter for non-numeric e.g. "1st", "3mo"
        el.textContent = '';
        let i = 0;
        const iv = setInterval(() => {
          el.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) clearInterval(iv);
        }, 60);
      } else {
        const suffix   = text.replace(/[0-9.]/g, '');
        const duration = 1200;
        const start    = performance.now();
        const step = now => {
          const p = Math.min((now - start) / duration, 1);
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(e * num) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => countObs.observe(el));


  /* ── 7. EXP CARD 3D TILT ── */
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      card.style.transform  = `perspective(800px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg) translateZ(4px)`;
      card.style.transition = 'transform .08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) translateZ(0)';
      card.style.transition = 'transform .45s ease';
    });
  });


  /* ── 8. TOOL CARD MAGNETIC DRIFT ── */
  document.querySelectorAll('.tool-card').forEach(card => {
    const img = card.querySelector('img');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 8;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 8;
      if (img) img.style.transform = `translate(${x}px,${y}px) scale(1.1)`;
    });
    card.addEventListener('mouseleave', () => {
      if (img) img.style.transform = 'translate(0,0) scale(1)';
    });
  });


  /* ── 9. "LET'S TALK" SCRAMBLE EFFECT ── */
  const connectBig = document.querySelector('.connect-big');
  let   scrambleDone = false;

  if (connectBig) {
    new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || scrambleDone) return;
      scrambleDone = true;
      const original = connectBig.textContent;
      const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';
      let   iter     = 0;
      const iv = setInterval(() => {
        connectBig.textContent = original.split('').map((c, i) => {
          if (c === ' ' || c === '.') return c;
          if (i < iter) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        if (iter >= original.length) clearInterval(iv);
        iter += 0.6;
      }, 40);
    }, { threshold: 0.5 }).observe(connectBig);
  }


  /* ── 10. MARQUEE SPEED ON SCROLL ── */
  const track = document.querySelector('.marquee-track');
  let lastY   = window.scrollY;
  window.addEventListener('scroll', () => {
    const vel   = Math.abs(window.scrollY - lastY);
    lastY       = window.scrollY;
    if (track) track.style.animationDuration = Math.max(6, 22 - vel * 0.5) + 's';
  }, { passive: true });


  /* ── 11. SMOOTH ANCHOR SCROLL (offset for navbar) ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16,
        behavior: 'smooth'
      });
    });
  });

});
