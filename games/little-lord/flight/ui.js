'use strict';
(() => {
  const $=id=>document.getElementById(id),canvas=$('sky'),ctx=canvas.getContext('2d');
  if(!ctx){$('description').textContent='這個瀏覽器無法顯示飛行畫面。';$('start').disabled=true;return;}
  const run=LLFlight.create(),keyboard=new Set(),pointers=new Map();let last=0,frame=0,lastHud='',lastNotice=-10;
  const aliases={a:'ArrowLeft',A:'ArrowLeft',d:'ArrowRight',D:'ArrowRight',w:'ArrowUp',W:'ArrowUp',s:'ArrowDown',S:'ArrowDown'};
  function clear(){keyboard.clear();pointers.clear();}
  function draw(){const s=run.snapshot();ctx.fillStyle='#c6deda';ctx.fillRect(0,0,800,480);
    ctx.fillStyle='#8ca98b';ctx.beginPath();ctx.moveTo(0,440);for(let x=0;x<=800;x+=20)ctx.lineTo(x,410+Math.sin(x/90)*24);ctx.lineTo(800,480);ctx.lineTo(0,480);ctx.fill();
    // Original code-drawn clouds, boxes and plane; no borrowed artwork or flashing.
    for(const o of s.objects){ctx.save();ctx.translate(o.x,o.y);if(o.kind==='cloud'){ctx.fillStyle='#f6f5e8';ctx.beginPath();ctx.ellipse(0,0,35,21,0,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(-8,-12,20,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7f9690';ctx.lineWidth=2;ctx.stroke();}else{ctx.fillStyle='#b78b50';ctx.fillRect(-17,-17,34,34);ctx.fillStyle='#f7dba0';ctx.fillRect(-3,-17,6,34);ctx.strokeStyle='#735a38';ctx.strokeRect(-17,-17,34,34);}ctx.restore();}
    ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle='#e4c77d';ctx.beginPath();ctx.moveTo(-8,-33);ctx.lineTo(15,-5);ctx.lineTo(-8,33);ctx.lineTo(-16,30);ctx.lineTo(-8,0);ctx.lineTo(-16,-30);ctx.closePath();ctx.fill();ctx.fillStyle='#315f50';ctx.beginPath();ctx.ellipse(0,0,33,11,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#91c1bd';ctx.fillRect(4,-7,12,8);ctx.fillStyle='#e4c77d';ctx.fillRect(-29,-17,7,34);ctx.restore();
    const key=[s.mode,s.parcels,Math.ceil(s.remaining)].join('|');if(key!==lastHud){$('hud').textContent=`補給箱 ${s.parcels} · 剩餘 ${Math.ceil(s.remaining)} 秒`;lastHud=key;}
  }
  function overlay(){const s=run.snapshot();$('overlay').hidden=s.mode==='playing';$('pause').disabled=s.mode==='ready'||s.mode==='finished';$('pause').textContent=s.mode==='paused'?'繼續':'暫停';
    if(s.mode==='paused'){$('title').textContent='先休息，天空也會等你。';$('description').textContent='按繼續就能接著飛，時間與補給都保留。';$('start').textContent='繼續飛行';}
    if(s.mode==='finished'){$('title').textContent='平安抵達！';$('description').textContent=`帶回 ${s.parcels} 箱補給。途中碰到 ${s.bumps} 次雲團，貨物沒有被扣掉。`;$('start').textContent='再飛一趟';}
  }
  function pause(){run.pause();clear();if(frame){cancelAnimationFrame(frame);frame=0;}overlay();draw();}
  const embedded=window.parent!==window&&new URLSearchParams(location.search).get('embedded')==='1';
  if(embedded){
    document.body.classList.add('embedded');
    function exit(){pause();window.parent.postMessage({type:'ll-flight-exit'},location.origin);}
    document.querySelector('a[href="../"]').addEventListener('click',e=>{e.preventDefault();exit();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();exit();}});
    window.addEventListener('message',e=>{if(e.source===window.parent&&e.origin===location.origin&&e.data?.type==='ll-flight-pause')pause();});
  }
  function loop(now){frame=0;const keys=new Set([...keyboard,...pointers.values()]),input={x:Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),y:Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp'))};
    const events=run.step(last?Math.min((now-last)/1000,.1):0,input);last=now;const s=run.snapshot();
    if(events.includes('parcel')&&s.seconds-lastNotice>.8){$('notice').textContent='收好一箱補給！';lastNotice=s.seconds;}
    if(events.includes('bump')){$('notice').textContent='穿過雲團了，慢慢飛就好。';lastNotice=s.seconds;}
    if(s.seconds-lastNotice>2)$('notice').textContent='';draw();
    if(s.mode==='playing')frame=requestAnimationFrame(loop);else{clear();overlay();}
  }
  function start(){const s=run.snapshot();if(s.mode==='paused')run.resume();else{if(s.mode==='finished')run.reset();run.start();}clear();last=0;lastNotice=-10;$('notice').textContent='';overlay();if(!frame)frame=requestAnimationFrame(loop);canvas.focus();}
  $('start').addEventListener('click',start);$('pause').addEventListener('click',()=>run.snapshot().mode==='paused'?start():pause());
  document.querySelectorAll('[data-key]').forEach(b=>{
    for(const type of ['contextmenu','selectstart'])b.addEventListener(type,e=>e.preventDefault());
    b.addEventListener('pointerdown',e=>{if(run.snapshot().mode!=='playing'||!e.isPrimary&&e.pointerType==='mouse')return;e.preventDefault();pointers.set(e.pointerId,b.dataset.key);b.setPointerCapture(e.pointerId);});
    for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,e=>pointers.delete(e.pointerId));
  });
  document.addEventListener('keydown',e=>{const key=aliases[e.key]||e.key;if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key)||run.snapshot().mode!=='playing'||e.target.closest('a,button,input,textarea'))return;e.preventDefault();keyboard.add(key);});
  document.addEventListener('keyup',e=>keyboard.delete(aliases[e.key]||e.key));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});window.addEventListener('blur',pause);window.addEventListener('pagehide',pause);draw();
})();
