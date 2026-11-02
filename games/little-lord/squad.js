'use strict';
(function(root){
  const challenges=Object.freeze([
    {title:'山丘護送隊',people:6,days:2,food:36,minSwords:1,minBows:1},
    {title:'舊道路巡查隊',people:8,days:3,food:72,minSwords:2,minBows:2},
    {title:'驛站修復護衛隊',people:10,days:4,food:112,minSwords:2,minBows:2}
  ].map(Object.freeze));
  function integer(raw,max){const s=String(raw??'').trim(),n=Number(s);return s&&Number.isSafeInteger(n)&&n>=0&&n<=max?n:null;}
  function assess(c,sRaw,bRaw,totalRaw){const swords=integer(sRaw,12),bows=integer(bRaw,12),total=integer(totalRaw,9999);if(swords===null||bows===null||total===null)return {code:'invalid'};if(swords+bows!==c.people)return {code:'people'};if(swords<c.minSwords||bows<c.minBows)return {code:'roles'};const n=root.LLSupplies.needs({swords,bows,days:c.days});if(!n)return {code:'invalid'};if(total!==n.total)return {code:'math',...n};if(n.total>c.food)return {code:'budget',...n,short:n.total-c.food};return {code:'correct',...n,left:c.food-n.total};}
  function solutions(c){const found=[];for(let s=0;s<=12;s++)for(let b=0;b<=12;b++){const total=(s*4+b*2)*c.days;if(assess(c,s,b,total).code==='correct')found.push({swords:s,bows:b,total});}return found;}
  root.LLSquad={challenges,assess,solutions};
  if(typeof document==='undefined')return;
  const $=id=>document.getElementById(id);let index=0;
  function render(){const c=challenges[index];$('squad-title').textContent=c.title;$('squad-rule').textContent=`計畫 ${index+1} / 3：全隊剛好 ${c.people} 人，劍兵至少 ${c.minSwords} 人、弓兵至少 ${c.minBows} 人，外出 ${c.days} 天。糧食上限 ${c.food} 份，可以有剩餘，不必剛好用完。`;}
  function invalidate(){ $('squad-next').hidden=true;$('squad-result').textContent='隊伍改好了，請重新計算全程糧食並核對。';$('squad-hint').hidden=true;}
  $('squad-form').addEventListener('input',invalidate);
  $('squad-form').addEventListener('submit',e=>{e.preventDefault();const c=challenges[index],a=assess(c,$('squad-swords').value,$('squad-bows').value,$('squad-total').value);const text={invalid:'請填完整的非負整數：兵種人數0～12、糧食0～9999。',people:`先核對總人數：兩種兵加起來必須剛好 ${c.people} 人。`,roles:`總人數對了！也需要劍兵至少 ${c.minSwords} 人、弓兵至少 ${c.minBows} 人一起幫忙。`,math:'人數與兵種符合任務。再算（劍兵人數×4＋弓兵人數×2）×天數，填入全程所需糧食。',budget:`算對了，但這隊還缺 ${a.short} 份糧食。試著在總人數不變時，調整兩種兵的比例。`,correct:`隊伍可以出發！全隊每天 ${a.daily} 份，全程 ${a.total} 份，剩下 ${a.left} 份。這不是唯一的答案，你也能改人數再試另一隊。`};$('squad-result').textContent=text[a.code];$('squad-next').hidden=a.code!=='correct';});
  $('squad-help').addEventListener('click',()=>{const c=challenges[index],s=integer($('squad-swords').value,12),b=integer($('squad-bows').value,12);$('squad-hint').textContent=s!==null&&b!==null?`你的隊伍共 ${s+b} 人；每天 ${s}×4＋${b}×2＝${s*4+b*2} 份，全程（${s}×4＋${b}×2）×${c.days}＝${(s*4+b*2)*c.days} 份。先核對人數與兵種下限，再比較糧食。把一名劍兵換成弓兵，每天會少吃2份。`:'先填兩種兵的人數。劍兵每人每天4份、弓兵2份，別忘了乘天數；不必把糧食全用完。';$('squad-hint').hidden=false;});
  $('squad-next').addEventListener('click',()=>{index=(index+1)%challenges.length;for(const id of ['squad-swords','squad-bows','squad-total'])$(id).value='';invalidate();render();$('squad-swords').focus();});render();
})(typeof window==='undefined'?globalThis:window);
