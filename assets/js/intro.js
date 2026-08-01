/* ============================================================
   CAMERA INTRO — extracted verbatim from legacy build.
   Sequence, timings and triggers are UNCHANGED.
   ============================================================ */
const HAS_GSAP = typeof gsap !== 'undefined';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

function playShutter(){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const t = ctx.currentTime;
    [0, 0.09].forEach((delay, i) => {
      const bufferSize = ctx.sampleRate * 0.03;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = (Math.random()*2-1) * (1 - j/bufferSize);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.value = i === 0 ? 0.35 : 0.5;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass'; filter.frequency.value = 1200;
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      src.start(t + delay);
    });
  }catch(e){ /* audio not available — silent, non-blocking */ }
}

(function(){
  const intro = document.getElementById('rdIntro');
  const enterBtn = document.getElementById('introEnterBtn');
  const camImg = document.getElementById('introCamImg');
  const aperture = document.getElementById('rdAperture');
  const blades = aperture.querySelectorAll('.blade');
  const flash = document.getElementById('rdFlash');
  const site = document.getElementById('site');
  const introContent = document.querySelector('.intro-content');
  const glow = document.getElementById('introGlow');
  const focusBox = document.getElementById('introFocus');
  const hud = document.getElementById('introHud');
  const particleHost = document.getElementById('introParticles');
  const SESSION_KEY = 'rdIntroPlayed';

  let alreadySeen = false;
  try { alreadySeen = sessionStorage.getItem(SESSION_KEY) === '1'; } catch(e){}
  if (alreadySeen) {
    intro.style.display = 'none';
    site.classList.add('site-visible');
    document.body.style.overflow = 'auto';
    document.dispatchEvent(new Event('rdIntroDone'));
    return;
  }

  document.body.style.overflow = 'hidden';

  let breathe;
  if (HAS_GSAP && !REDUCED_MOTION){
    gsap.to(camImg, {scale:1.09, filter:'brightness(0.6) saturate(0.95) blur(0px)', duration:4.5, ease:'sine.inOut', yoyo:true, repeat:-1});
    gsap.to(camImg, {y:-9, rotate:0.35, duration:5.2, ease:'sine.inOut', yoyo:true, repeat:-1});
    if (particleHost) {
      const DUST_COUNT = window.innerWidth < 700 ? 8 : 16;
      for (let i=0;i<DUST_COUNT;i++){
        const d = document.createElement('div');
        d.className = 'ip';
        d.style.left = Math.random()*100+'%';
        d.style.bottom = (Math.random()*40)+'%';
        particleHost.appendChild(d);
        const rise = 5+Math.random()*5, delay = Math.random()*4, drift=(Math.random()*30-15);
        gsap.to(d, {y:-160-Math.random()*120, x:drift, opacity:0.5, duration:rise, delay, repeat:-1, ease:'sine.inOut',
          onRepeat:()=>{ d.style.left = Math.random()*100+'%'; }});
        gsap.to(d, {opacity:0, duration:rise*0.35, delay:delay+rise*0.65, repeat:-1, repeatDelay:rise*0.65, ease:'sine.in'});
      }
    }
  } else if (!REDUCED_MOTION) {
    let dir = 1, scale = 1.03;
    breathe = setInterval(() => {
      scale += 0.0006 * dir;
      if (scale > 1.09) dir = -1;
      if (scale < 1.03) dir = 1;
      camImg.style.transform = `scale(${scale})`;
    }, 40);
  }

  const beat = REDUCED_MOTION
    ? {glow:0, focus:0, hud:0, lock:100, auto:500}
    : {glow:200, focus:450, hud:650, lock:1250, auto:2300};
  setTimeout(()=>{ if(glow) glow.classList.add('show'); }, beat.glow);
  setTimeout(()=>{ if(focusBox) focusBox.classList.add('show'); }, beat.focus);
  setTimeout(()=>{ if(hud) hud.classList.add('show'); }, beat.hud);
  setTimeout(()=>{ if(focusBox) focusBox.classList.add('locked'); }, beat.lock);

  let entered = false;
  let autoTimer = setTimeout(enter, beat.auto);

  function enter(){
    if (entered) return;
    entered = true;
    clearTimeout(autoTimer);
    if (breathe) clearInterval(breathe);
    enterBtn.disabled = true;
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch(e){}
    playShutter();

    if (HAS_GSAP){
      gsap.killTweensOf(camImg);
      const tl = gsap.timeline();
      tl.to(introContent, {opacity:0, y:-20, duration:0.45, ease:'power2.in'})
        .to([focusBox, hud, glow], {opacity:0, duration:0.3, ease:'power1.in'}, 0)
        .to(camImg, {filter:'contrast(1.05) saturate(1.05) blur(6px)', duration:0.25, ease:'power1.in'}, 0)
        .to(camImg, {filter:'contrast(1.25) saturate(1.1) blur(0px)', scale:2.35, rotate:0.6, duration:0.95, ease:'power3.inOut'}, 0.2)
        .to(aperture, {opacity:1, duration:0.01}, 0.75)
        .to(blades, {
          scale:1, duration:0.5, ease:'power2.out', stagger:0.045
        }, 0.75)
        .to(blades, {scale:0.28, duration:0.16, ease:'power4.in', stagger:0.02}, 1.35)
        .to(flash, {opacity:1, duration:0.06}, 1.5)
        .call(()=>{
          intro.style.display = 'none';
          site.classList.add('site-visible');
          document.body.style.overflow = 'auto';
          if (HAS_GSAP && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
          document.dispatchEvent(new Event('rdIntroDone'));
        }, null, 1.56)
        .to(flash, {opacity:0, duration:0.9, ease:'power2.out'}, 1.56);
    } else {
      introContent.style.transition = 'opacity .5s ease, transform .5s ease';
      introContent.style.opacity = '0'; introContent.style.transform = 'translateY(-20px)';
      camImg.style.transition = 'transform 1.1s cubic-bezier(.4,0,.2,1), filter 1.1s ease';
      camImg.style.transform = 'scale(2.3)'; camImg.style.filter = 'contrast(1.2) saturate(1.05)';
      setTimeout(() => {
        aperture.style.opacity = '1';
        blades.forEach((b, i) => { b.style.transition = `transform .5s ease ${i*0.04}s`; b.style.transform = b.dataset.rot+' scale(1)'; });
      }, 900);
      setTimeout(() => { blades.forEach(b => { b.style.transition = 'transform .18s cubic-bezier(.7,0,.84,0)'; b.style.transform = b.dataset.rot+' scale(0.3)'; }); }, 1450);
      setTimeout(() => { flash.style.transition = 'opacity .08s'; flash.style.opacity = '1'; }, 1620);
      setTimeout(() => {
        intro.style.display = 'none'; site.classList.add('site-visible');
        flash.style.transition = 'opacity .9s ease'; flash.style.opacity = '0';
        document.body.style.overflow = 'auto';
        document.dispatchEvent(new Event('rdIntroDone'));
      }, 1700);
    }
  }

  enterBtn.addEventListener('click', enter);
  intro.addEventListener('click', enter);
  intro.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });
})();