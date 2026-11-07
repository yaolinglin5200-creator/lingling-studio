'use strict';
const LLCamera = {
  // The camera may reach the map border, never beyond it.
  layout(){return {x:0,y:0};},
  zoomRange(width,height){
    const min=Math.ceil(Math.max(.45,(width+1)/1600,(height+1)/1066.667)*1000)/1000;
    return {min,max:Math.max(1.6,min)};
  },
  target({width,height,worldWidth,worldHeight,position}){
    const clamp=(value,max)=>Math.max(0,Math.min(Math.max(0,max),value));
    return {left:clamp(position[0]*worldWidth-width/2,worldWidth-width),
      top:clamp(position[1]*worldHeight-height*.70,worldHeight-height)};
  },
  needsFollow({width,height,x,y}){
    return x<width*.35||x>width*.65||y<Math.min(200,height*.55)||y>height*.78;
  }
};
if(typeof module!=='undefined')module.exports=LLCamera;
