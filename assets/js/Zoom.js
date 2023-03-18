import {room_click} from './G-Map.js';
import { map0,map1,map2 } from './G-Map.js';
let svgMaps = document.querySelectorAll("#removal div svg");
let mapRotateCache = [0,0,0];
let mapScaleCache = [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]];
let scaless = 1,pointXXOld = 0,pointYYOld = 0,pointXX = 0,pointYY = 0;

function setTransform(pointX,pointY,scales,svgMap,maps_no) {
  let rotate = mapRotateCache[maps_no] - Math.floor(mapRotateCache[maps_no]/360)*360;
  pointX == 0 && pointY == 0 ? svgMap.style.transition = 'transform 0.5s' : svgMap.style.transition = '';
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

function rotater(svgMap,degree) {
  if(svgMap == 1)
    map1.style.transform = `rotate(${degree}deg)`;
  else if(svgMap == 2)
    map2.style.transform = `rotate(${degree}deg)`;
  else
    map0.style.transform = `rotate(${degree}deg)`;
}

function switchMapScaleCache(maps_no) {
  scaless = mapScaleCache[maps_no][2]
  pointXXOld=mapScaleCache[maps_no][0], 
  pointYYOld=mapScaleCache[maps_no][1], 
  pointXX = mapScaleCache[maps_no][3], 
  pointYY = mapScaleCache[maps_no][4];
}

export const resetCache = ()=> {
  mapRotateCache = [0,0,0];
  mapScaleCache = [[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]];
  scaless = 1;pointXX = 0;pointYY = 0;pointXXOld = 0;pointYYOld = 0;
  setTransform(0,0,1,svgMaps[0],0);
  setTransform(0,0,1,svgMaps[1],1);
  setTransform(0,0,1,svgMaps[2],2);
  rotater(0,0);
  rotater(1,0);
  rotater(2,0);
}

const reloades = (svgMap,maps_no)=> {

let starts = {x:0,y:0};
let pannings = false;
setTransform(pointXX,pointYY,scaless,svgMap,maps_no);
svgMap.onpointercancel = pointerupHandler;
svgMap.onpointerout = pointerupHandler;
svgMap.onpointerleave = pointerupHandler;

//Enabling two finger touch gestures 
let evCache = [];
let prevDiff = -1;
let touchCount,midPointX,midPointY;

const rotateDeg = (degree,isCounter,map,svgMap)=>{
  rotater(map,degree);
  if(isCounter)
  {
    mapScaleCache[map][0] = pointXX = -pointYYOld;
    mapScaleCache[map][1] = pointYY = pointXXOld; 
  }
  else
  {
    mapScaleCache[map][0] = pointXX = pointYYOld;
    mapScaleCache[map][1] = pointYY = -pointXXOld;
  }
    mapScaleCache[map][3] = pointXXOld = pointXX;
    mapScaleCache[map][4] = pointYYOld = pointYY;
    mapRotateCache[map] = degree;
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
  
  console.log(gSelector);
}

document.getElementById("counterclock").onclick = ()=>{
  rotateDeg(mapRotateCache[maps_no] -= 90,false,maps_no,svgMap)
}

document.getElementById("clock").onclick = ()=>{
  rotateDeg(mapRotateCache[maps_no] += 90,true,maps_no,svgMap)
}

svgMap.onpointerdown = function(e) {
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
      mapScaleCache[maps_no][2] = scaless += 0.05;
      mapScaleCache[maps_no][3] = pointXXOld = pointXX = (e.clientX - xs * scaless);
      mapScaleCache[maps_no][4] = pointYYOld = pointYY = (e.clientY - ys * scaless);
    }
    else
    {
      if(scaless == 1)
        {mapScaleCache[maps_no][2] = scaless = 1;mapScaleCache[maps_no][3] = pointXXOld = pointXX = 0;
         mapScaleCache[maps_no][4] = pointYYOld = pointYY = 0;}
      else
        {
          mapScaleCache[maps_no][2] = scaless -= 0.05;
          mapScaleCache[maps_no][3] = pointXXOld = pointXX = e.clientX - xs * scaless;
          mapScaleCache[maps_no][4] = pointYYOld = pointYY = e.clientY - ys * scaless;
        }
    }
    setTransform(pointXX,pointYY,scaless,svgMap,maps_no);
}

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
            mapScaleCache[maps_no][2] = scaless += 0.05;
          }
          else if(curDiff < prevDiff && scaless>1){
            mapScaleCache[maps_no][2] = scaless -= 0.05;
          }
          mapScaleCache[maps_no][3] = pointXXOld = pointXX = midPointX - xs*scaless;
          mapScaleCache[maps_no][4] = pointYYOld = pointYY = midPointY - ys*scaless; 
          if(scaless == 1)
            { mapScaleCache[maps_no][2] = scaless =1 ;
              mapScaleCache[maps_no][3] = pointXXOld = pointXX = 0;
              mapScaleCache[maps_no][4] = pointYYOld = pointYY = 0;}
          setTransform(pointXX,pointYY,scaless,svgMap,maps_no);
        }
        prevDiff = curDiff;
      }  
  }
  else if(touchCount == 1 && scaless != 1)
  {
    if(!pannings){return;}
    mapScaleCache[maps_no][3] = pointXXOld = pointXX = (ev.clientX - starts.x);
    mapScaleCache[maps_no][4] = pointYYOld = pointYY = (ev.clientY - starts.y);
    setTransform(pointXX,pointYY,scaless,svgMap,maps_no);
  }
}
}

export const switching = (maps_no)=>{
  if(maps_no == 1)
    switchMapScaleCache(1);
  else if(maps_no == 2)
    switchMapScaleCache(2);
  else
    switchMapScaleCache(0);
}

export const switchMap = ()=> {
  reloades(svgMaps[0],0);//Command for ground floor map is loaded
  reloades(svgMaps[1],1);//Command for first floor map is loaded
  reloades(svgMaps[2],2);//Command for second floor map is loaded
}