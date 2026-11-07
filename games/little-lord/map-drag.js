'use strict';
// One pointer owns a gesture; only a drag (not a tap) consumes the following click.
function attachLLMapDrag(viewport, host = window) {
  // Scene labels are controls, not document text. Keep this scoped to the map.
  for (const type of ['contextmenu','selectstart','dragstart']) {
    viewport.addEventListener(type, e => e.preventDefault());
  }
  let drag = null, suppressUntil = 0;
  const now = () => Date.now();
  const finish = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const id = drag.id;
    if (drag.moved) suppressUntil = now() + 500;
    drag = null;
    viewport.classList.remove('dragging');
    if (viewport.hasPointerCapture(id)) viewport.releasePointerCapture(id);
  };
  viewport.addEventListener('pointerdown', e => {
    if (drag || (e.pointerType === 'mouse' && e.button !== 0) || !e.isPrimary) return;
    suppressUntil = 0;
    drag = {id:e.pointerId, x:e.clientX, y:e.clientY, left:viewport.scrollLeft, top:viewport.scrollTop, moved:false};
  });
  viewport.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) > 8) {
      drag.moved = true;
      viewport.classList.add('dragging');
      viewport.setPointerCapture(e.pointerId);
    }
    if (drag.moved) {
      e.preventDefault();
      viewport.scrollLeft = drag.left - dx;
      viewport.scrollTop = drag.top - dy;
    }
  });
  host.addEventListener('pointerup', finish);
  host.addEventListener('pointercancel', finish);
  viewport.addEventListener('lostpointercapture', finish);
  host.addEventListener('blur', () => { if (drag) finish({pointerId:drag.id}); });
  viewport.addEventListener('click', e => {
    if (now() < suppressUntil) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);
}
if (typeof module !== 'undefined') module.exports = {attachLLMapDrag};
