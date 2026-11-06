'use strict';
const LLCamera = {
  // Half-screen gutters let even map-edge characters reach the clear centre.
  layout(width,height){return {x:width/2,y:height/2};},
  target({width,height,worldWidth,worldHeight,position}){
    const pad=this.layout(width,height);
    return {left:pad.x+position[0]*worldWidth-width/2,
      top:Math.max(0,pad.y+position[1]*worldHeight-height*.70)};
  },
  needsFollow({width,height,x,y}){
    return x<width*.35||x>width*.65||y<Math.min(200,height*.55)||y>height*.78;
  }
};
if(typeof module!=='undefined')module.exports=LLCamera;
