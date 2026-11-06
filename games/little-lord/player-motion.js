'use strict';
// Sheet rows: down, left, right, up. Column zero is the resting pose.
const LLPlayerMotion = {
  direction(dx,dy,previous=0){
    if(Math.hypot(dx,dy)<1e-8)return previous;
    return Math.abs(dx*1.5)>Math.abs(dy)?(dx<0?1:2):(dy<0?3:0);
  },
  pose(elapsed,walking,reduced=false){
    return !walking||reduced?0:[1,2,3,0][Math.floor(Math.max(0,elapsed)/.18)%4];
  }
};
if(typeof module!=='undefined')module.exports=LLPlayerMotion;
