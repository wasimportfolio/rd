/* ============================================================
   RD PHOTOGRAPHY — CAMERA INTRO (real photo version)
   The hero visual is a real, brand-neutral camera photograph
   (assets/images/camera-intro.jpg) rather than a 3D model, so
   this file drives: subtle mouse-parallax on the photo, and the
   "Enter the Camera" cinematic sequence — push-in zoom, aperture
   blades closing, shutter click, flash, then the site reveals.

   TO SET THE REAL PHOTO:
   Add a photo at assets/images/camera-intro.jpg. Pick one with no
   visible brand name/logo on the body — a tight angle on the lens
   barrel, or a matte/blacked-out body, works best. The CSS rule
   is in css/style.css under .intro-camera-photo.
   ============================================================ */

const RD = { mouse: { x: 0, y: 0 } };

function initCameraParallax(){
  const photo = document.getElementById('cameraPhoto');
  if (!photo) return;

  window.addEventListener('mousemove', e => {
    RD.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    RD.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    gsap.to(photo, {
      x: RD.mouse.x * 16,
      y: RD.mouse.y * 10,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Gentle idle breathing zoom so the photo never feels static
  gsap.to(photo, { scale: 1.09, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
}

/* ============================================================
   ENTER-THE-CAMERA CINEMATIC SEQUENCE
   photo push-in -> aperture close -> shutter -> flash -> reveal
   ============================================================ */
function playEnterSequence(){
  const btn = document.getElementById('enterBtn');
  btn.disabled = true;

  const shutter = document.getElementById('shutterSound');
  const photo = document.getElementById('cameraPhoto');
  const tl = gsap.timeline();

  tl.to('.intro-content', { opacity:0, y:-30, duration:0.6, ease:'power2.in' });
  tl.to(photo, { scale:2.4, filter:'saturate(1) contrast(1.15)', duration:1.15, ease:'power3.in' }, 0.1);

  tl.set('#aperture', { opacity:1 }, 1.0);
  tl.fromTo('.blade', {
      scale:1.6, opacity:0
    }, {
      scale:1, opacity:1, duration:0.5, stagger:0.04, ease:'power2.out',
      onStart:() => { try{ shutter.currentTime = 0; shutter.play().catch(()=>{}); }catch(e){} }
    }, 1.0);

  tl.to('.blade', { scale:0.3, duration:0.18, ease:'power4.in' }, 1.55);
  tl.to('#flash', { opacity:1, duration:0.08, ease:'none' }, 1.7);

  tl.to('#flash', { opacity:1, duration:0.05 }, 1.78);
  tl.to('#intro', { opacity:0, duration:0.01 }, 1.85);
  tl.set('#intro', { display:'none' }, 1.86);

  tl.set('#site', { display:'block' }, 1.86);
  tl.to('#flash', { opacity:0, duration:0.9, ease:'power2.out' }, 1.9);
  tl.to('#site', { opacity:1, duration:1.0, ease:'power2.out' }, 1.95);
  tl.fromTo('.nav', { y:-30, opacity:0 }, { y:0, opacity:1, duration:0.8, ease:'power2.out' }, 2.1);

  tl.call(() => { document.body.style.overflow = 'auto'; window.__revealHero && window.__revealHero(); });
}

window.addEventListener('DOMContentLoaded', () => {
  initCameraParallax();
  document.getElementById('enterBtn').addEventListener('click', playEnterSequence);
});
