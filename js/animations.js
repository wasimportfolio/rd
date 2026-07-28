/* ============================================================
   ANIMATIONS — intro text reveal + scroll-triggered site motion
   ============================================================ */
gsap.registerPlugin(ScrollTrigger);

/* ---------- Intro text load-in ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const introTl = gsap.timeline({ delay:0.3 });
  introTl
    .to('.intro-logo', { opacity:1, duration:0.8, ease:'power2.out' })
    .to('.intro-r', { opacity:1, y:0, duration:1.1, ease:'power3.out' }, '-=0.4')
    .to('.intro-p', { opacity:1, y:0, duration:0.9, ease:'power3.out' }, '-=0.7')
    .to('.intro-tagline', { opacity:1, duration:1, ease:'power2.out' }, '-=0.4')
    .to('.enter-btn', { opacity:1, duration:0.9, ease:'power2.out' }, '-=0.5');

  // Floating dust particles behind the camera
  const dustWrap = document.getElementById('dust');
  for (let i=0;i<28;i++){
    const s = document.createElement('span');
    const size = Math.random()*2 + 1;
    s.style.width = s.style.height = size+'px';
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*100+'%';
    s.style.opacity = (Math.random()*0.5+0.15).toFixed(2);
    dustWrap.appendChild(s);
    gsap.to(s, {
      y: `+=${Math.random()*80+40}`,
      x: `+=${(Math.random()-0.5)*40}`,
      duration: Math.random()*10+8,
      repeat:-1, yoyo:true, ease:'sine.inOut'
    });
  }
});

/* ---------- Hero reveal (triggered right after camera-enter sequence) ---------- */
window.__revealHero = function(){
  gsap.timeline()
    .to('.hero-title [data-reveal], .eyebrow[data-reveal]', { opacity:1, y:0, duration:0.9, stagger:0.12, ease:'power3.out' })
    .to('.hero-sub[data-reveal]', { opacity:1, y:0, duration:0.8, ease:'power2.out' }, '-=0.4')
    .to('.hero-ctas[data-reveal]', { opacity:1, y:0, duration:0.8, ease:'power2.out' }, '-=0.5');

  gsap.to('.hero-media', { scale:1, duration:2.2, ease:'power2.out' });
};

/* ---------- Generic reveal-on-scroll for [data-reveal] ---------- */
document.addEventListener('DOMContentLoaded', () => {
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    if (el.closest('.hero')) return; // hero handled by reveal sequence above
    gsap.to(el, {
      opacity:1, y:0, duration:0.9, ease:'power3.out',
      scrollTrigger: { trigger: el, start:'top 88%' }
    });
  });

  gsap.utils.toArray('.tl-step').forEach((el,i) => {
    gsap.fromTo(el, { opacity:0, y:26 }, {
      opacity:1, y:0, duration:0.8, delay:i*0.05, ease:'power3.out',
      scrollTrigger:{ trigger: el, start:'top 90%' }
    });
  });

  /* Nav becomes solid on scroll */
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 60, end: 99999,
    onUpdate: self => nav.classList.toggle('solid', self.scroll() > 60)
  });

  /* About section parallax */
  gsap.to('[data-parallax-slow]', {
    yPercent: 12, ease:'none',
    scrollTrigger: { trigger:'.about', start:'top bottom', end:'bottom top', scrub:true }
  });

  /* Story section — layered parallax scroll storytelling */
  gsap.utils.toArray('[data-story-speed]').forEach(layer => {
    const speed = parseFloat(layer.dataset.storySpeed);
    gsap.to(layer, {
      yPercent: -40*speed, ease:'none',
      scrollTrigger: { trigger:'.story', start:'top bottom', end:'bottom top', scrub:true }
    });
  });
  gsap.fromTo('.story-text', { opacity:0, scale:0.92 }, {
    opacity:1, scale:1, duration:1,
    scrollTrigger:{ trigger:'.story', start:'top 60%', end:'top 20%', scrub:true }
  });

  /* Services rows subtle background image swap via data-bg (color tint only, no real photos) */
  document.querySelectorAll('.service-row').forEach(row => {
    row.addEventListener('mouseenter', () => gsap.to(row, { backgroundColor:'rgba(255,255,255,0.02)', duration:0.4 }));
    row.addEventListener('mouseleave', () => gsap.to(row, { backgroundColor:'transparent', duration:0.4 }));
  });
});
