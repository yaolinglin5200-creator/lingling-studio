'use strict';
(function(root){
  const missions=Object.freeze([
    {title:'陪曜靈送物資到山丘',swords:3,bows:4,days:2},
    {title:'巡查村外的舊道路',swords:5,bows:2,days:3},
    {title:'護送工人修復驛站',swords:4,bows:6,days:4}
  ].map(Object.freeze));
  function needs(m){if(!m||!['swords','bows','days'].every(k=>Number.isSafeInteger(m[k])&&m[k]>=1&&m[k]<=12))return null;const swords=m.swords*4,bows=m.bows*2;return {swords,bows,daily:swords+bows,total:(swords+bows)*m.days};}
  function check(m,dayRaw,totalRaw){const n=needs(m);if(!n)return 'invalid';const parse=v=>{const s=String(v??'').trim(),n=Number(s);return s&&Number.isSafeInteger(n)&&n>=0&&n<=9999?n:null;};const day=parse(dayRaw),total=parse(totalRaw);if(day===null||total===null)return 'invalid';if(day!==n.daily)return 'daily';if(total!==n.total)return total===n.daily?'days':'total';return 'correct';}
  root.LLSupplies={missions,needs,check};
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id);let index=0,complete=false;
  function render(){const m=missions[index];$('supplies-title').textContent=m.title;$('supplies-step').textContent=`補給計畫 ${index+1} / ${missions.length}`;$('supplies-roster').textContent=`劍兵 ${m.swords} 人 · 弓兵 ${m.bows} 人 · 外出 ${m.days} 天`;$('supplies-check').disabled=complete;$('supplies-daily').disabled=complete;$('supplies-total').disabled=complete;$('supplies-next').hidden=!complete;}
  function help(){const m=missions[index],n=needs(m);$('supplies-hint').textContent=`劍兵每天：${m.swords} × 4 = ${n.swords} 份；弓兵每天：${m.bows} × 2 = ${n.bows} 份。全隊每天：${n.swords} + ${n.bows} = ${n.daily} 份。${m.days} 天共：${n.daily} × ${m.days} = ${n.total} 份。併式：（${m.swords} × 4 + ${m.bows} × 2）× ${m.days} = ${n.total}。`;$('supplies-hint').hidden=false;}
  $('supplies-form').addEventListener('submit',e=>{e.preventDefault();if(complete)return;const result=check(missions[index],$('supplies-daily').value,$('supplies-total').value);const messages={invalid:'請把每天和全程的糧食都填好，使用 0～9999 的整數。',daily:'先核對每天吃多少：劍兵人數乘4，弓兵人數乘2，再把兩種糧食加起來。',days:'全隊每天的份數對了！全程還要乘上外出的天數，不是只準備一天。',total:'每天的份數對了！再算「每天需要的份數 × 天數」，慢慢來。',correct:'補給裝好了！每天各有一箱足夠的糧食，可以安心交給隊伍。'};$('supplies-feedback').textContent=messages[result];if(result==='correct'){complete=true;help();const m=missions[index],n=needs(m);$('supplies-crates').replaceChildren();for(let d=1;d<=m.days;d++){const box=document.createElement('p');box.className='supplies-crate';box.textContent=`▣ 第 ${d} 天：${n.daily} 份`;$('supplies-crates').append(box);}render();$('supplies-next').focus();}});
  $('supplies-help').addEventListener('click',help);
  $('supplies-next').addEventListener('click',()=>{index=(index+1)%missions.length;complete=false;$('supplies-daily').value='';$('supplies-total').value='';$('supplies-hint').hidden=true;$('supplies-crates').replaceChildren();$('supplies-feedback').textContent='大魔王：先算一天吃多少，再準備整趟的糧食。';render();$('supplies-daily').focus();});
  render();
})(typeof window==='undefined'?globalThis:window);
