/* ============================================================
   CUSTOM CURSOR
   Small dot + trailing ring, expands and labels on hover targets.
   Disabled automatically on touch devices via CSS + this check.
   ============================================================ */
(function(){
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  if (isTouch) { document.body.classList.add('no-custom-cursor'); return; }

  const cursor = document.getElementById('cursor');
  const dot = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');
  const label = document.getElementById('cursorLabel');

  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function loop(){
    // dot: instant, ring: trailing/eased
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    label.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  function setHover(active, text){
    cursor.classList.toggle('hover', active);
    label.textContent = text || '';
  }

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('a, button, .g-item, .play-btn, .filter');
    if (!t) { setHover(false); return; }
    if (t.classList.contains('g-item')) setHover(true, 'OPEN');
    else if (t.classList.contains('play-btn')) setHover(true, 'PLAY');
    else if (t.tagName === 'IMG' || t.classList.contains('ph-image')) setHover(true, 'VIEW');
    else setHover(true, '');
  });
  document.addEventListener('mouseout', e => {
    const t = e.target.closest('a, button, .g-item, .play-btn, .filter');
    if (t) setHover(false);
  });
})();
