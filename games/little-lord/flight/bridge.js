'use strict';
(function(root){
  function attach({host,frame,dialog}){
    const origin=host.location.origin;
    function pause(){if(frame.contentWindow)frame.contentWindow.postMessage({type:'ll-flight-pause'},origin);}
    function receive(event){if(event.origin!==origin||event.source!==frame.contentWindow||event.data?.type!=='ll-flight-exit')return;if(dialog.open)dialog.close();}
    host.addEventListener('message',receive);dialog.addEventListener('close',pause);
    return {open(){if(!frame.getAttribute('src'))frame.setAttribute('src','flight/?embedded=1');if(!dialog.open)dialog.showModal();},destroy(){pause();host.removeEventListener('message',receive);dialog.removeEventListener('close',pause);}};
  }
  if(typeof module!=='undefined'&&module.exports)module.exports=attach;else root.attachLLFlightBridge=attach;
})(typeof window==='undefined'?globalThis:window);
