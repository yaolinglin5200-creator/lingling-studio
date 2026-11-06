'use strict';
(function(root){
  const orders=Object.freeze([
    {title:'工地的點心時間',budget:60,items:[{name:'麵包',icon:'🥖',price:8,need:3},{name:'果汁',icon:'🧃',price:6,need:2}]},
    {title:'驛站的補給清單',budget:100,items:[{name:'飯糰',icon:'🍙',price:12,need:4},{name:'水壺',icon:'💧',price:9,need:3}]},
    {title:'村莊的野餐準備',budget:150,items:[{name:'便當',icon:'🍱',price:18,need:5},{name:'蘋果',icon:'🍎',price:7,need:6}]}
  ].map(o=>Object.freeze({...o,items:Object.freeze(o.items.map(Object.freeze))})));
  function tally(order,counts){if(!Array.isArray(counts)||counts.length!==order.items.length||counts.some(n=>!Number.isSafeInteger(n)||n<0||n>12))return null;const costs=counts.map((n,i)=>n*order.items[i].price),total=costs.reduce((a,b)=>a+b,0);return {costs,total,left:order.budget-total,exact:counts.every((n,i)=>n===order.items[i].need)};}
  function check(order,counts,raw){const bill=tally(order,counts);if(!bill)return 'invalid';if(!bill.exact)return 'quantity';if(bill.left<0)return 'budget';const text=String(raw??'').trim(),n=Number(text);if(!text||!Number.isSafeInteger(n)||n<0||n>999)return 'invalid';return n===bill.left?'correct':'change';}
  root.LLShopMath={orders,tally,check};
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id);let index=0,counts=[0,0],done=false;
  function render(){
    const order=orders[index];$('shop-title').textContent=order.title;$('shop-step').textContent=`採買 ${index+1} / ${orders.length} · 可自由離開，不花真錢`;$('shop-budget').textContent=order.budget;
    $('shop-items').replaceChildren();order.items.forEach((item,i)=>{
      const row=document.createElement('section');row.className='shop-item';const title=document.createElement('h4');title.textContent=`${item.icon} ${item.name}`;
      const info=document.createElement('p');info.textContent=`每份 ${item.price} 枚 · 清單需要 ${item.need} 份`;
      const controls=document.createElement('div');controls.className='shop-controls';
      const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label',`減少${item.name}`);minus.disabled=done||counts[i]===0;
      const value=document.createElement('output');value.textContent=`籃中 ${counts[i]} 份`;value.setAttribute('aria-live','polite');
      const plus=document.createElement('button');plus.type='button';plus.textContent='＋';plus.setAttribute('aria-label',`增加${item.name}`);plus.disabled=done||counts[i]===12;
      const adjust=delta=>{counts[i]+=delta;$('shop-change').value='';$('shop-hint').hidden=true;$('shop-feedback').textContent='採買籃改好了，再看看清單和剩下的金幣。';render();};minus.addEventListener('click',()=>adjust(-1));plus.addEventListener('click',()=>adjust(1));controls.append(minus,value,plus);row.append(title,info,controls);$('shop-items').append(row);
    });$('shop-check').disabled=done;$('shop-change').disabled=done;$('shop-next').hidden=!done;
  }
  $('shop-form').addEventListener('submit',e=>{e.preventDefault();if(done)return;const order=orders[index],result=check(order,counts,$('shop-change').value);const feedback={quantity:'先核對採買清單：每種物品的份數都要剛好，可以把多拿的放回去。',budget:'金幣不夠了，先調整採買籃再試試。',invalid:'請填剩下的金幣數，用 0～999 的整數；不用急。',change:'份數都對了！再算每種物品各花多少、合計多少，最後從帶來的金幣扣掉。',correct:'採買完成！物品份數和剩下的金幣都核對好了，村民可以安心收到補給。'};$('shop-feedback').textContent=feedback[result];if(result==='correct'){done=true;hint();render();}});
  function hint(){const o=orders[index],costs=o.items.map(i=>i.price*i.need),sum=costs.reduce((a,b)=>a+b,0);$('shop-hint').textContent=o.items.map((i,n)=>`${i.name}：${i.price} × ${i.need} = ${costs[n]} 枚。`).join(' ')+`合計 ${costs.join(' + ')} = ${sum} 枚；剩下 ${o.budget} − ${sum} = ${o.budget-sum} 枚。`;$('shop-hint').hidden=false;}
  $('shop-help').addEventListener('click',hint);
  $('shop-next').addEventListener('click',()=>{index=(index+1)%orders.length;counts=[0,0];done=false;$('shop-change').value='';$('shop-hint').hidden=true;$('shop-feedback').textContent='曜靈：新的清單來了。先把需要的物品放進採買籃吧。';render();});
  $('shop-form').addEventListener('submit',()=>{if(done)document.dispatchEvent(new Event('ll:shop-success'));});
  render();
})(typeof window==='undefined'?globalThis:window);
