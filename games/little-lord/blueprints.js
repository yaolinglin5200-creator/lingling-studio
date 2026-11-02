'use strict';
(function(root){
  // Keep every slanted plan a true 3-4-5 parallelogram; only its base varies.
  const plans=Object.freeze([
    {shape:'rectangle',base:5,height:3,slant:0},
    {shape:'parallelogram',base:4,height:4,slant:5},
    {shape:'rectangle',base:6,height:3,slant:0},
    {shape:'parallelogram',base:7,height:4,slant:5},
    {shape:'rectangle',base:4,height:4,slant:0},
    {shape:'parallelogram',base:5,height:4,slant:5}
  ].map(Object.freeze));
  function check(task,raw){
    const text=String(raw??'').trim(),n=Number(text);
    if(!text||!Number.isSafeInteger(n)||n<1||n>99)return 'invalid';
    if(n===task.base*task.height)return 'correct';
    if(task.slant&&n===task.base*task.slant)return 'slant';
    return n<task.base*task.height?'short':'excess';
  }
  root.LLBlueprints={plans,check};
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id);
  let index=0,straight=false;
  function render(){
    const t=plans[index],svg=$('practice-plan'),ns='http://www.w3.org/2000/svg';
    svg.replaceChildren();
    const add=(tag,attrs,text)=>{const el=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));if(text!==undefined)el.textContent=text;svg.append(el);};
    const description=`${t.shape==='rectangle'?'長方形':'平行四邊形'}，底 ${t.base} 公尺，垂直高 ${t.height} 公尺${t.slant?`，斜邊 ${t.slant} 公尺`:''}`;
    add('title',{},description);svg.setAttribute('aria-label',description);
    for(let r=0;r<t.height;r++)for(let c=0;c<t.base;c++)add('polygon',{points:root.LLWorkshopMath.polygon(t,c,r,straight).map(p=>p.join(',')).join(' '),fill:'#f8fbf6',stroke:'#6e9281','stroke-width':1.5});
    add('text',{x:65+t.base*17,y:42+t.height*34+28,'text-anchor':'middle',class:'measure'},`底 ${t.base} 公尺`);
    const end=42+t.height*34;
    add('line',{x1:420,y1:42,x2:420,y2:end,class:'height-line'});
    add('path',{d:`M 410 ${end} v -10 h 10`,class:'height-line'});
    add('text',{x:420,y:24,'text-anchor':'end',class:'measure'},`垂直高 ${t.height} 公尺`);
    if(t.slant&&!straight)add('text',{x:45,y:105,class:'slant-label'},`斜邊 ${t.slant} 公尺`);
    $('practice-caption').textContent=`圖紙 ${index+1} / ${plans.length} · ${t.shape==='rectangle'?'長方形暖身（先備複習）':'小五：平行四邊形面積'}`;
    $('practice-straight').hidden=!t.slant;
    $('practice-straight').textContent=straight?'看原本斜圖紙':'整理圖紙，看底和高';
  }
  $('practice-form').addEventListener('submit',e=>{
    e.preventDefault();const t=plans[index],result=check(t,$('practice-count').value);
    const messages={invalid:'請填 1～99 片的整數，我們再一起確認。',correct:`剛剛好！底 ${t.base} × 垂直高 ${t.height} = ${t.base*t.height} 平方公尺，需要 ${t.base*t.height} 片木板。`,slant:'這個數量和「底 × 斜邊」相同。找找有直角記號的垂直高，或按「整理圖紙」看看。',short:'照這個數量，地板還會有空格。可以數數每排幾格、有幾排，再試一次。',excess:'這次會有木板多出來。看看底和垂直高，再試著準備剛好的片數。'};
    $('practice-feedback').textContent=messages[result];
    $('practice-next').hidden=result!=='correct';
  });
  $('practice-next').addEventListener('click',()=>{index=(index+1)%plans.length;straight=false;$('practice-count').value='';$('practice-next').hidden=true;$('practice-feedback').textContent='新圖紙到了！每格是 1 平方公尺，每片木板鋪 1 格。';render();$('practice-count').focus();});
  $('practice-straight').addEventListener('click',()=>{straight=!straight;render();$('practice-feedback').textContent='底和垂直高沒有改變；整理前後格數與面積都一樣。';});
  render();
})(typeof window==='undefined'?globalThis:window);
