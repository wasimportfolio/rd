/* ============================================================
   RD PHOTOGRAPHY — REDESIGN
   Phase 1: nav state, mobile menu, hero entrance + parallax
   ============================================================ */
(function(){
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  function onScroll(){ nav.classList.toggle('scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScroll);
  onScroll();

  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : 'auto';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = 'auto';
  }));

  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HAS_GSAP = typeof gsap !== 'undefined';

  function runHeroEntrance(){
    if (HAS_GSAP && !REDUCED_MOTION){
      const tl = gsap.timeline({defaults:{ease:'power3.out'}});
      tl.from('.hero-eyebrow', {opacity:0, y:16, duration:0.7})
        .from('.hero-title', {opacity:0, y:26, duration:0.9}, '-=0.45')
        .from('.hero-desc', {opacity:0, y:18, duration:0.7}, '-=0.55')
        .from('.hero-ctas', {opacity:0, y:14, duration:0.6}, '-=0.45')
        .from('.hero-stats', {opacity:0, y:14, duration:0.6}, '-=0.4')
        .from('.hero-frame', {opacity:0, scale:0.96, duration:1}, '-=0.9')
        .from('.hero-badge', {opacity:0, y:14, duration:0.6}, '-=0.4');

      gsap.to('.hero-visual', {
        yPercent:-4, ease:'none',
        scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
      });
    } else {
      document.querySelectorAll('.hero-copy, .hero-visual').forEach(el => el.style.opacity = 1);
    }
  }

  // Run entrance once the camera intro has revealed the site
  // (or immediately, if the intro was already shown this session).
  if (document.getElementById('site').classList.contains('site-visible')) {
    runHeroEntrance();
  } else {
    document.addEventListener('rdIntroDone', runHeroEntrance, {once:true});
  }

  // ---- shared scroll reveal, used by every section from Phase 2 onward ----
  function initReveals(){
    const items = document.querySelectorAll('.reveal, .reveal-stagger');
    if (HAS_GSAP && !REDUCED_MOTION){
      items.forEach(el => {
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter: () => el.classList.add('visible')
        });
      });
    } else {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, {threshold:0.12});
      items.forEach(el => obs.observe(el));
    }
  }
  initReveals();

  // count-up on hero stat numbers once visible
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const valueEl = el.querySelector('.num-val');
    const run = () => {
      if (!valueEl) return;
      if (HAS_GSAP && !REDUCED_MOTION){
        gsap.fromTo({v:0}, {v:target}, {v:target, duration:1.3, ease:'power1.out',
          onUpdate: function(){ valueEl.textContent = Math.round(this.targets()[0].v); }});
      } else {
        valueEl.textContent = target;
      }
    };
    new IntersectionObserver((entries, obs) => {
      entries.forEach(e => { if (e.isIntersecting){ run(); obs.disconnect(); } });
    }, {threshold:0.6}).observe(el);
  });
})();

/* ============================================================
   Phase 3 — portfolio filters + lightbox
   ============================================================ */
(function(){
  const filterBtns = document.querySelectorAll('.pf-btn');
  const items = document.querySelectorAll('.pf-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCat = document.getElementById('lightboxCat');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCat.textContent = item.dataset.category;
      lightboxTitle.textContent = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
})();

/* ============================================================
   Phase 4 — wedding films carousel + video modal
   ============================================================ */
(function(){
  const track = document.getElementById('filmsTrack');
  if (!track) return;

  const prevBtn = document.getElementById('filmsPrev');
  const nextBtn = document.getElementById('filmsNext');
  const scrollAmt = () => (track.querySelector('.film-card')?.offsetWidth || 300) + 22;
  prevBtn?.addEventListener('click', () => track.scrollBy({left: -scrollAmt(), behavior:'smooth'}));
  nextBtn?.addEventListener('click', () => track.scrollBy({left: scrollAmt(), behavior:'smooth'}));

  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('videoModalPlayer');
  const modalClose = document.getElementById('videoModalClose');

  document.querySelectorAll('.film-card').forEach(card => {
    card.addEventListener('click', () => {
      const src = card.dataset.src;
      const poster = card.querySelector('img')?.src;
      if (src) modalVideo.src = src;
      if (poster) modalVideo.poster = poster;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalVideo.play().catch(() => {});
    });
  });

  function closeVideoModal(){
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
    modalVideo.pause();
  }
  modalClose?.addEventListener('click', closeVideoModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeVideoModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal?.classList.contains('open')) closeVideoModal(); });
})();
/* ============================================================
   Phase 9 — FAQ accordion
   ============================================================ */
(function(){
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // close any other open item (single-open accordion)
      items.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-a').style.maxHeight = null;
        }
      });

      if (isOpen) {
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // keep open answer's max-height accurate if the viewport is resized
  window.addEventListener('resize', () => {
    const openAnswer = document.querySelector('.faq-q[aria-expanded="true"] + .faq-a');
    if (openAnswer) openAnswer.style.maxHeight = openAnswer.scrollHeight + 'px';
  });
})();

/* ============================================================
   Phase 10 — contact form (client-side only — no backend wired
   up yet; shows an inline success message and resets the form)
   ============================================================ */
(function(){
  const form = document.getElementById('contactForm');
  if (!form) return;
  const success = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    success.classList.add('show');
    form.reset();

    clearTimeout(form._successTimer);
    form._successTimer = setTimeout(() => success.classList.remove('show'), 6000);
  });
})();

/* ============================================================
   Phase 11 — footer: dynamic copyright year + newsletter signup
   (client-side only — no backend wired up yet)
   ============================================================ */
(function(){
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const form = document.getElementById('newsletterForm');
  if (!form) return;
  const success = document.getElementById('newsletterSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    success.classList.add('show');
    form.reset();

    clearTimeout(form._successTimer);
    form._successTimer = setTimeout(() => success.classList.remove('show'), 6000);
  });
})();