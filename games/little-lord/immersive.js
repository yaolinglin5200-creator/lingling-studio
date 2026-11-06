'use strict';
(() => {
  const $=id=>document.getElementById(id),game=$('game');
  document.body.classList.add('immersive');
  const make=(tag,className,text)=>{const e=document.createElement(tag);if(className)e.className=className;if(text)e.textContent=text;return e;};
  function panel(id,title){const d=make('dialog','rpg-panel');d.id=id;const h=make('header','rpg-panel-header');const label=make('h2','',title);label.id=id+'-title';d.setAttribute('aria-labelledby',label.id);const close=make('button','rpg-close','回村莊 ×');close.type='button';close.addEventListener('click',()=>d.close());h.append(label,close);d.append(h);game.append(d);d.addEventListener('close',()=>$('viewport').focus({preventScroll:true}));return d;}
  const journal=document.querySelector('.journal');
  const quest=make('details','rpg-quest'),summary=make('summary','','任務日誌 · 點開查看');quest.append(summary,document.querySelector('.quest'));game.append(quest);
  document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]:not(#delivery)')&&['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].includes(e.key))e.stopPropagation();},true);
  const map=panel('rpg-map','村莊地圖 · 選擇目的地');map.append(document.querySelector('.places'));
  map.addEventListener('click',e=>{if(e.target.closest('.place-button'))map.close();});
  const menu=panel('rpg-settings','冒險選單');menu.append(document.querySelector('.journal-foot'));const note=make('p','','V0.8.4 公開試玩／開發中：點地標或角色前往，方向鍵／WASD或左下方向鈕沿道路移動。點右下「互動」會前往最近的地點。名字與部分進度只保存在目前瀏覽器。');menu.append(note);
  const shop=panel('rpg-shop','曜靈的小商店');const shopLayout=make('div','rpg-shop-layout'),portrait=make('aside','rpg-shop-portrait');portrait.innerHTML='<div class="sprite" style="--actor:2" aria-hidden="true"></div><h3>曜靈</h3><p>歡迎光臨！先照清單把物品放進籃子，再一起核對剩下的金幣。</p>';
  const card=document.querySelector('.shop-card:not(.supplies-card)');card.open=true;card.querySelector('summary').hidden=true;shopLayout.append(portrait,card);shop.append(shopLayout);
  const shopReturn=make('button','primary rpg-shop-return','採買先到這裡，回村莊 →');shopReturn.addEventListener('click',()=>shop.close());shop.append(shopReturn);
  const supply=panel('rpg-supplies','大魔王的補給與護送');document.querySelectorAll('.supplies-card').forEach(c=>supply.append(c));
  const arcade=panel('rpg-arcade','休息時間 · 曜靈送貨車');arcade.append(document.querySelector('.play-card'));$('delivery-launch').addEventListener('click',()=>arcade.close());
  journal.hidden=true;
  const bar=make('nav','rpg-tools');bar.setAttribute('aria-label','遊戲工具');
  for(const [title,d] of [['地圖',map],['補給',supply],['小遊戲',arcade],['選單',menu]]){const b=make('button','',title);b.type='button';b.addEventListener('click',()=>{document.dispatchEvent(new Event('ll:stop'));d.showModal();});bar.append(b);}game.append(bar);
  const pad=make('nav','rpg-pad');pad.setAttribute('aria-label','沿村莊道路移動');
  for(const [symbol,key,label] of [['↑','ArrowUp','向上移動'],['←','ArrowLeft','向左移動'],['↓','ArrowDown','向下移動'],['→','ArrowRight','向右移動']]){const b=make('button','',symbol);b.type='button';b.dataset.direction=key;b.setAttribute('aria-label',label);b.addEventListener('click',()=>b.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true})));pad.append(b);}game.append(pad);
  const interact=make('button','rpg-interact','✦ 互動');interact.id='rpg-interact';interact.addEventListener('click',()=>document.dispatchEvent(new Event('ll:interact')));game.append(interact);
  const rotate=make('div','rpg-rotate','↻ 橫著玩更舒服｜請將手機轉成橫式；也可先直式查看。');game.append(rotate);
  window.LLImmersive={openShop(){shop.showModal();},openSupplies(){supply.showModal();}};
  document.addEventListener('ll:shop-success',()=>{shopReturn.textContent='物資核對完成，回村莊 →';summary.textContent='任務日誌 · 採買完成 ✓';});
  for(const input of shop.querySelectorAll('input'))input.addEventListener('input',()=>{shopReturn.textContent='採買先到這裡，回村莊 →';});
  shop.addEventListener('click',e=>{if(e.target.closest('#shop-next,.shop-controls button'))shopReturn.textContent='採買先到這裡，回村莊 →';});
})();
