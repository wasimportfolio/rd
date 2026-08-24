/* ============================================================
   CAMERA INTRO — extracted verbatim from legacy build.
   Sequence, timings and triggers are UNCHANGED.
   UPDATE: enter() now crossfades the intro out while the site
   fades in (instead of an abrupt display:none), removing the
   flash between intro end and site appearing.
   ============================================================ */
const HAS_GSAP = typeof gsap !== 'undefined';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (HAS_GSAP) gsap.registerPlugin(ScrollTrigger);

(function(){
  const intro = document.getElementById('rdIntro');
  const enterBtn = document.getElementById('introEnterBtn');
  const camImg = document.getElementById('introCamImg');
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
    // gsap.to(camImg, {scale:1.09, filter:'brightness(0.6) saturate(0.95) blur(0px)', duration:4.5, ease:'sine.inOut', yoyo:true, repeat:-1});
    // gsap.to(camImg, {y:-9, rotate:0.35, duration:5.2, ease:'sine.inOut', yoyo:true, repeat:-1});
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

  function enter() {
    if (entered) return;

    entered = true;
    clearTimeout(autoTimer);

    if (breathe) clearInterval(breathe);

    enterBtn.disabled = true;

    try {
        sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}

    if (HAS_GSAP) {

        // Stop every existing camera animation
        gsap.killTweensOf(camImg);

        // Hide all intro UI immediately and smoothly
        gsap.to(introContent, {
            opacity: 0,
            y: -15,
            duration: 0.25,
            ease: "power2.out"
        });

        gsap.to([focusBox, hud, glow].filter(Boolean), {
            opacity: 0,
            duration: 0.2,
            ease: "power1.out"
        });

        // Make sure there is NO glow/flash during the transition
        if (glow) {
            glow.classList.remove("show");
            glow.style.opacity = "0";
        }

        // Make the site available underneath
        site.classList.add("site-visible");
        document.body.style.overflow = "auto";

        if (typeof ScrollTrigger !== "undefined") {
            ScrollTrigger.refresh();
        }

        document.dispatchEvent(new Event("rdIntroDone"));

        /*
         * ONE SINGLE CONTINUOUS CAMERA ZOOM
         *
         * No:
         * 1.35
         * 2.05
         * 3.8
         *
         * Just one continuous movement.
         */
        gsap.to(camImg, {
            scale: 4.8,
            y: 0,
            rotate: 0,
            filter: "brightness(0.62) saturate(1.02) contrast(1.08)",
            duration: 1.8,
            ease: "power3.in",
            overwrite: true
        });

        /*
         * Fade the intro only after the zoom has already
         * moved significantly.
         */
        gsap.to(intro, {
            opacity: 0,
            duration: 0.65,
            delay: 1.15,
            ease: "power2.inOut",
            onComplete: () => {
                intro.style.display = "none";
            }
        });

    } else {

        // Non-GSAP fallback
        introContent.style.transition =
            "opacity .3s ease, transform .3s ease";

        introContent.style.opacity = "0";
        introContent.style.transform = "translateY(-15px)";

        camImg.style.transition =
            "transform 1.8s cubic-bezier(.22,.61,.36,1), filter 1.8s ease";

        camImg.style.transform = "scale(4.8)";
        camImg.style.filter =
            "brightness(.62) saturate(1.02) contrast(1.08)";

        site.classList.add("site-visible");
        document.body.style.overflow = "auto";

        document.dispatchEvent(new Event("rdIntroDone"));

        setTimeout(() => {
            intro.style.transition = "opacity .65s ease";
            intro.style.opacity = "0";

            setTimeout(() => {
                intro.style.display = "none";
            }, 650);

        }, 1150);
    }
}

  enterBtn.addEventListener('click', enter);
  intro.addEventListener('click', enter);
  intro.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });
})();