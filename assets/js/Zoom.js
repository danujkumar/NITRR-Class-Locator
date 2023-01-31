let key = sessionStorage.getItem("map_no");
import {room_click} from './G-Map.js';
import {map_no,map0,map1,map2} from './G-Map.js'
let svgMap = document.querySelectorAll("#removal div svg");
let initialRotate = parseInt(sessionStorage.getItem("rotate"));
let scaless = 1,pannings = false, pointXXOld=0, pointYYOld=0, pointXX = 0, pointYY = 0,starts = {x:0,y:0};

if(Object.is(initialRotate,NaN))
    initialRotate = 0;
  
document.getElementsByTagName("html")[0].addEventListener("onload",function(e){
    svgMap.onpointerup = pointerupHandler;
    svgMap.onpointercancel = pointerupHandler;
    svgMap.onpointerout = pointerupHandler;
    svgMap.onpointerleave = pointerupHandler;
})

window.addEventListener("load", () => {
    initialRotate = initialRotate - Math.floor(initialRotate/360)*360;
    initialRotate >= 270 ? initialRotate = initialRotate - 360 : initialRotate;
    rotateDeg(initialRotate);
});

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

const rotateDeg = (degree,isCounter)=>{
  if(map_no == 1) map1.style.transform = `rotate(${degree}deg)`;
  else if(map_no == 2) map2.style.transform = `rotate(${degree}deg)`;
  else map0.style.transform = `rotate(${degree}deg)`;
  if(isCounter)
  {
    pointXX = -pointYYOld;
    pointYY = pointXXOld; 
  }
  else
  {
    pointXX = pointYYOld;
    pointYY = -pointXXOld;
  }
    pointXXOld = pointXX;
    pointYYOld = pointYY;
    sessionStorage.setItem("rotate",`${degree}`)
}

document.getElementById("counterclock").onclick = ()=>{
  rotateDeg(initialRotate -= 90,false)
}

document.getElementById("clock").onclick = ()=>{
  rotateDeg(initialRotate += 90,true)
}

//Enabling two finger touch gestures 
let evCache = [];
let prevDiff = -1;
let touchCount,midPointX,midPointY;

function setTransform(pointX,pointY,scales) {
  let initialRotate = parseInt(sessionStorage.getItem("rotate"));
  let rotate = initialRotate - Math.floor(initialRotate/360)*360;
  switch (rotate) {
    case 90:
      svgMap.style.transform = `translate(${pointY}px,${-pointX}px) scale(${scales})`;
      break;
    case 180:
      svgMap.style.transform = `translate(${-pointX}px,${-pointY}px) scale(${scales})`;
      break;
    case 270:
      svgMap.style.transform = `translate(${-pointY}px,${pointX}px) scale(${scales})`;
      break;
    case -90:
      svgMap.style.transform = `translate(${-pointY}px,${pointX}px) scale(${scales})`;
      break;
    case -180:
      svgMap.style.transform = `translate(${-pointX}px,${-pointY}px) scale(${scales})`;
      break;
    case -270:
      svgMap.style.transform = `translate(${pointY}px,${-pointX}px) scale(${scales})`;
      break;
    default:
      svgMap.style.transform = `translate(${pointX}px,${pointY}px) scale(${scales})`;
      break;
  }
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
  //Updated code for Google version 109 and above.
  let gSelector = e.srcElement.parentElement;
  if(gSelector.nodeName == "text")
    gSelector = gSelector.parentElement;

  if(gSelector.classList == "room")
      room_click(gSelector.id)

    /* for(let i in e.path)
    {
        if(e.path[i].classList == "room")
            room_click(e.path[i].id);
    } // this section of code will not work after updating the Google version to 109 and above*/
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
    ys = (e.clientY- pointYY)/scaless;
    let delta = (e.deltaY ? -e.deltaY : +e.deltaY);
    if(delta > 0)
    {
      scaless += 0.05;
      pointXXOld = pointXX = (e.clientX - xs * scaless);
      pointYYOld = pointYY = (e.clientY - ys * scaless);
    }
    else
    {
      if(scaless == 1)
        {scaless = 1;pointXXOld = pointXX = 0;pointYYOld = pointYY = 0;}
      else
        {
          scaless -= 0.05;
          pointXXOld = pointXX = e.clientX - xs * scaless;
          pointYYOld = pointYY = e.clientY - ys * scaless;
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
          pointXXOld = pointXX = midPointX - xs*scaless;
          pointYYOld = pointYY = midPointY - ys*scaless; 
          if(scaless == 1)
            {pointXXOld = pointXX = 0;pointYYOld = pointYY=0;}
          setTransform(pointXX,pointYY,scaless);
        }
        prevDiff = curDiff;
      }  
  }
  else if(touchCount == 1 && scaless != 1)
  {
    if(!pannings){return;}
    pointXXOld = pointXX = (ev.clientX - starts.x);
    pointYYOld = pointYY = (ev.clientY - starts.y);
    setTransform(pointXX,pointYY,scaless);
  }
}