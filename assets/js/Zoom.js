let key = sessionStorage.getItem("map_no");
import {room_click} from './G-Map.js';
let svgMap = document.querySelectorAll("#removal div svg");

switch (key) {
  case "1":
    svgMap = svgMap[1];
    break;
  case "2":
    svgMap = svgMap[2];
    break;
  default:
    svgMap = svgMap[0];
    break;
}

document.getElementsByTagName("html")[0].addEventListener("onload",function(e){
    svgMap.onpointerup = pointerupHandler;
    svgMap.onpointercancel = pointerupHandler;
    svgMap.onpointerout = pointerupHandler;
    svgMap.onpointerleave = pointerupHandler;
})

//Enabling two finger touch gestures 
let evCache = [];
let prevDiff = -1;
let scaless = 1,pannings = false, pointXX = 0, pointYY = 0,starts = {x:0,y:0};
let touchCount,midPointX,midPointY;

function setTransform(pointX,pointY,scales) {
  svgMap.style.transform = "translate(" + pointX + "px," + pointY + "px) scale(" + scales + ")";
}

function pointerupHandler(ev) {
  ev.preventDefault();
  document.getElementsByTagName("html")[0].style.touchAction="auto";
  function removeEvent(ev) {
      const index = evCache.findIndex((cachedEv) => cachedEv.pointerId === ev.pointerId);
      evCache.splice(index,1);   
  }
  removeEvent(ev);
  if(evCache.length < 2){
    prevDiff = -1;
  }    
  pannings = false;
}

const onclicked = (e)=>{
    for(let i in e.path)
    {
        if(e.path[i].classList == "room")
            room_click(e.path[i].id);
    }
}

svgMap.onpointerdown = function(e){
  e.preventDefault();
  if(e.pointerType == "mouse")  
    touchStart(e,300);
  document.getElementsByTagName("html")[0].style.touchAction="none";
  evCache.push(e);
  starts = {x:e.clientX - pointXX, y:e.clientY - pointYY};
  pannings = true;
}

svgMap.onpointerup = function(ev){
    if(ev.pointerType == "mouse")
      touchEnd(ev);
    pointerupHandler(ev);
}

let onlongtouch = ()=>{timer=null};
let timer = null;

const touchStart = (e,tTime)=>{
  if(timer == null){ timer = setTimeout(onlongtouch,tTime); }
    e.preventDefault();
    try {
      touchCount = e.touches.length;
    } catch (error) {
      touchCount = 1;
    }
    
    if(touchCount == 2){
      midPointX = (e.touches[0].clientX + e.touches[1].clientX)/2;
      midPointY = (e.touches[0].clientY + e.touches[1].clientY)/2;
    }    
}

const touchEnd=(e)=>{
  if(timer!=null){
        clearTimeout(timer);
        timer = null;
        onclicked(e);
    }
}

svgMap.addEventListener('touchstart',function(e){
    touchStart(e,150);
})

svgMap.addEventListener('touchend',function(e){
    touchEnd(e);
});

svgMap.onwheel = function(e){
    e.preventDefault();
    let xs = (e.clientX - pointXX)/scaless,
    ys = (e.clientY - pointYY)/scaless;
    let delta = (e.deltaY ? -e.deltaY : +e.deltaY);
    if(delta > 0)
    {
      scaless += 0.1;
      pointXX = e.clientX - xs * scaless;
      pointYY = e.clientY - ys * scaless;
    }
    else
    {
      if(scaless == 1)
        {scaless = 1;pointXX = 0;pointYY = 0;}
      else
        {
          scaless -= 0.1;
          pointXX = e.clientX - xs * scaless;
          pointYY = e.clientY - ys * scaless;
        }
    }
    setTransform(pointXX,pointYY,scaless);
}

// svgMap.onmousemove = function(e){
//     e.preventDefault();
//     if(!pannings){
//         return;
//     }
//     pointXX = (e.clientX-starts.x);
//     pointYY = (e.clientY-starts.y);
//     setTransform(pointXX,pointYY,scaless);
// }

svgMap.onpointermove = function(ev){
  ev.preventDefault();
  if(touchCount == 2){
      const index = evCache.findIndex((cachedEv) => cachedEv.pointerId === ev.pointerId);
      evCache[index] = ev;    
      if(evCache.length === 2){
        const curDiff = Math.round(Math.sqrt((evCache[0].clientX - evCache[1].clientX)*(evCache[0].clientX - evCache[1].clientX)+ 
          (evCache[0].clientY - evCache[1].clientY) *(evCache[0].clientY - evCache[1].clientY)));
        if(prevDiff>0){
          var xs = (midPointX - pointXX)/scaless,
          ys = (midPointY - pointYY)/scaless;
          if(curDiff > prevDiff){
            scaless += 0.05;
          }
          else if(curDiff < prevDiff && scaless>1){
            scaless -= 0.05;
          }
          pointXX = midPointX - xs*scaless;
          pointYY = midPointY - ys*scaless; 
          if(scaless == 1)
            {pointXX = 0;pointYY=0;}
          setTransform(pointXX,pointYY,scaless);
        }
        prevDiff = curDiff;
      }  
  }
  else if(touchCount == 1 && scaless != 1)
  {
    if(!pannings){return;}
    pointXX = (ev.clientX - starts.x);
    pointYY = (ev.clientY - starts.y);
    setTransform(pointXX,pointYY,scaless);
  }
}