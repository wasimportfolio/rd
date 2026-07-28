/* ============================================================
   GALLERY — portfolio filters + lightbox, testimonials, video modal
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Portfolio filtering ---------- */
  const filters = document.querySelectorAll('.filter');
  const items = Array.from(document.querySelectorAll('.g-item'));

  filters.forEach(f => f.addEventListener('click', () => {
    filters.forEach(x => x.classList.remove('active'));
    f.classList.add('active');
    const cat = f.dataset.filter;
    items.forEach(it => {
      const show = cat === 'all' || it.dataset.cat === cat;
      it.classList.toggle('hidden', !show);
      if (show) gsap.fromTo(it, { opacity:0, y:16 }, { opacity:1, y:0, duration:0.5, ease:'power2.out' });
    });
  }));

  document.getElementById('viewAllBtn')?.addEventListener('click', e => {
    e.preventDefault();
    filters[0].click();
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImage = document.getElementById('lbImage');
  const lbCounter = document.getElementById('lbCounter');
  let visibleItems = [];
  let lbIndex = 0;

  function openLightbox(index){
    visibleItems = items.filter(it => !it.classList.contains('hidden'));
    lbIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function updateLightbox(){
    const it = visibleItems[lbIndex];
    if (!it) return;
    const cat = it.querySelector('.g-cat').textContent;
    lbImage.className = 'ph-image lb-image';
    lbCounter.textContent = `${lbIndex+1} / ${visibleItems.length} — ${cat}`;
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = 'auto';
  }

  items.forEach(it => it.addEventListener('click', () => {
    const shown = items.filter(x => !x.classList.contains('hidden'));
    openLightbox(shown.indexOf(it));
  }));

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', () => { lbIndex = (lbIndex-1+visibleItems.length)%visibleItems.length; updateLightbox(); });
  document.getElementById('lbNext').addEventListener('click', () => { lbIndex = (lbIndex+1)%visibleItems.length; updateLightbox(); });
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
  });

  // Basic touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => touchStartX = e.touches[0].clientX);
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) dx > 0 ? document.getElementById('lbPrev').click() : document.getElementById('lbNext').click();
  });

  /* ---------- Testimonial slider ---------- */
  const testis = document.querySelectorAll('.testi');
  const dotsWrap = document.getElementById('testiDots');
  testis.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => showTesti(i));
    dotsWrap.appendChild(dot);
  });
  let testiIndex = 0;
  function showTesti(i){
    testis[testiIndex].classList.remove('active');
    dotsWrap.children[testiIndex].classList.remove('active');
    testiIndex = i;
    testis[testiIndex].classList.add('active');
    dotsWrap.children[testiIndex].classList.add('active');
  }
  setInterval(() => showTesti((testiIndex+1)%testis.length), 6000);

  /* ---------- Video modal ---------- */
  const videoModal = document.getElementById('videoModal');
  const vmVideo = document.getElementById('vmVideo');
  document.getElementById('playBtn').addEventListener('click', () => {
    videoModal.classList.add('open');
    vmVideo.play().catch(()=>{});
  });
  document.getElementById('vmClose').addEventListener('click', () => {
    videoModal.classList.remove('open');
    vmVideo.pause();
  });
});
