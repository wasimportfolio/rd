/* ============================================================
   MAIN — smooth scroll, mobile menu, nav behaviour, form UX
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // Lock scroll during intro
  document.body.style.overflow = 'hidden';
  document.getElementById('site').style.display = 'none';

  /* ---------- Lenis smooth scroll ---------- */
  let lenis;
  try {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger && ScrollTrigger.update);
    if (window.gsap && window.ScrollTrigger){
      gsap.ticker.add((time) => { lenis.raf(time*1000); });
      gsap.ticker.lagSmoothing(0);
    }
  } catch(e){ /* Lenis unavailable — native scroll still works */ }

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('active');
    mobileMenu.classList.remove('open');
  }));

  /* ---------- Smooth anchor scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -20 });
      else target.scrollIntoView({ behavior:'smooth' });
    });
  });

  /* ---------- Enquiry form: floating labels handled by CSS, add light validation feedback ---------- */
  const form = document.getElementById('enquiryForm');
  form?.addEventListener('submit', () => {
    // Native "required" validation runs first; mailto opens the user's mail client.
    // Swap the form's action attribute for a Formspree/API endpoint to go fully live.
  });

  /* ---------- Pause showreel video off-screen to save resources ---------- */
  const showreel = document.getElementById('showreel');
  if (showreel && 'IntersectionObserver' in window){
    new IntersectionObserver(entries => {
      entries.forEach(en => en.isIntersecting ? showreel.play().catch(()=>{}) : showreel.pause());
    }, { threshold:0.25 }).observe(showreel);
  }
});
