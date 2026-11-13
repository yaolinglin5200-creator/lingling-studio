'use strict';
(function(root){
  const WIDTH=800,HEIGHT=480,DURATION=120,HZ=120;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function create(seed=Date.now()){
    let s,randomState,accumulator;
    function reset(){randomState=seed>>>0;accumulator=0;s={mode:'ready',ticks:0,x:150,y:240,parcels:0,bumps:0,grace:0,objects:[],wave:0};return snapshot();}
    function random(){randomState=(Math.imul(1664525,randomState)+1013904223)>>>0;return randomState/4294967296;}
    function snapshot(){return {...s,seconds:s.ticks/HZ,remaining:Math.max(0,DURATION-s.ticks/HZ),objects:s.objects.map(o=>({...o}))};}
    function start(){if(s.mode==='ready')s.mode='playing';}
    function pause(){if(s.mode==='playing')s.mode='paused';accumulator=0;}
    function resume(){if(s.mode==='paused')s.mode='playing';}
    function spawn(){const lane=Math.floor(random()*3),other=(lane+1+Math.floor(random()*2))%3,wave=++s.wave;
      s.objects.push({kind:'cloud',x:830,y:100+lane*140,wave,resolved:false},{kind:'parcel',x:830,y:100+other*140,wave,resolved:false});}
    function step(delta,input={}){
      if(s.mode!=='playing'||!Number.isFinite(delta)||delta<=0)return [];
      let dx=Number.isFinite(input.x)?clamp(input.x,-1,1):0,dy=Number.isFinite(input.y)?clamp(input.y,-1,1):0;
      const magnitude=Math.hypot(dx,dy);if(magnitude>1){dx/=magnitude;dy/=magnitude;}
      accumulator+=Math.min(delta,.25);const events=[];
      while(accumulator+1e-10>=1/HZ&&s.mode==='playing'){
        accumulator=Math.max(0,accumulator-1/HZ);s.ticks++;
        s.x=clamp(s.x+dx*220/HZ,40,WIDTH-40);s.y=clamp(s.y+dy*220/HZ,40,HEIGHT-40);
        s.grace=Math.max(0,s.grace-1);
        if(s.ticks%192===0&&s.ticks<(DURATION-8)*HZ)spawn();
        for(const o of s.objects){o.x-=130/HZ;
          if(!o.resolved&&Math.hypot((o.x-s.x)/1.2,o.y-s.y)<30){o.resolved=true;
            if(o.kind==='parcel'){s.parcels++;events.push('parcel');}
            else if(s.grace===0){s.bumps++;s.grace=HZ;events.push('bump');}
          }
        }
        s.objects=s.objects.filter(o=>o.x>-40&&!(o.resolved&&o.kind==='parcel'));
        if(s.ticks>=DURATION*HZ){s.mode='finished';accumulator=0;events.push('finish');}
      }
      return events;
    }
    reset();return {reset,start,pause,resume,step,snapshot};
  }
  const api={WIDTH,HEIGHT,DURATION,create};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LLFlight=api;
})(typeof window==='undefined'?globalThis:window);
