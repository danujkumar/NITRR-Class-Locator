import mapping from "./json/bluetoGreen.json" assert { type: "json" };
import exceptions from "./json/exceptionPaths.json" assert { type: "json" };
import searching from "./json/searchTool.json" assert{type:"json"};
let starting;
let ending ;
let inUse = [];
let id = [];
let additionalInfo = [];
let name = new Map();
let detailss = new Map();
let bluetoblue = new Set();
let xstartss,ystartss,xgreenendss,ygreenendss,xgreenstartss,ygreenstartss,xintersectss,yintersectss;
let divControl;
let current = document.getElementById("current");
let final = document.getElementById("final");
let body = document.getElementsByTagName("html");
let details = document.getElementsByClassName("card-text");
let namecard = document.getElementsByClassName("card-title");
let makecurrent = document.getElementById("makecurrent");
let makefinal = document.getElementById("makefinal");
let preinfo;

const Information = (buttonClicked)=>{
  document.getElementById(buttonClicked)
  if(preinfo != undefined)
        {
          if(preinfo != starting && preinfo != ending)
            document.getElementById(preinfo).querySelector('path').style.fill = "#d3d3d3"
            
          if(preinfo == buttonClicked)
          {
            preinfo = undefined;
            namecard[0].innerHTML = "Information"
            details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here."
          }
          else
          {
            preinfo = buttonClicked;
            info(buttonClicked);
          }
        }
        else
        { 
          preinfo = buttonClicked
          info(buttonClicked)
        }
}

for (let k in searching) {
  name.set(searching[k]["name"], k);
  detailss.set(searching[k]["details"], k);
  id.push(searching[k]["name"]);
}

const removal = (element) => {
  let e = element.lastElementChild;
  while (e) {
    element.removeChild(e);
    e = element.lastElementChild;
  }
}

const pointsSE = (textId) => {
  //Getting the current text id
  let currentText = document.getElementById(textId);

  if(textId=="current")
    divControl = document.getElementById('currentdiv');
  else if(textId=="final")
    divControl = document.getElementById('finaldiv');
  removal(divControl);

  for (let i = 0; i < id.length; i++) {
    let fromId = id[i];
    if (fromId != undefined) {
      let fromIds = fromId.toUpperCase();
      if (fromIds.indexOf(currentText.value.toUpperCase()) > -1) {
        const para = document.createElement("button");
        para.innerHTML = id[i];
        para.classList.add("ibutton");
        divControl.appendChild(para);
            para.onclick = () =>{
              document.getElementById(textId).value = id[i];
              if(textId == "current")
              {
                if(name.get(current.value) != null)
                {
                  starting = name.get(id[i]);
                  sessionStorage.setItem('start',starting);
                }
                setter();
                getsetGoo();
              }
              else
              {
                if(name.get(final.value) != null)
                {
                  ending = name.get(id[i]);
                  sessionStorage.setItem('end',ending);
                  if(starting != undefined && starting != "undefined" && starting != "null" && starting != null)
                    {
                      setter();
                      getsetGoo();
                    }
                    else
                    {
                      alert("Please give the current location.")
                    }
                }
              }
          removal(divControl); 
        }
      }
      }
    }

    if (!currentText.value.replace(/\s/g, "").length) {
        removal(divControl);
  };
}

current.onkeyup = ()=>{
  pointsSE(current.id);
}

final.onkeyup= ()=>{
  pointsSE(final.id);
}

body[0].onclick = ()=>{
  try {
    removal(divControl);
  }
  catch(err) {
  }
}

function setter() {
  if(starting != undefined && starting != "undefined" && starting != "null" && starting != null)
  {
    current.value = searching[starting]['name'];
    namecard[1].innerHTML = ("FROM : ") + searching[starting]['name'];
    details[1].innerHTML = searching[starting]['details'];
  }
  if(ending != undefined && ending != "undefined" && ending != "null" && ending != null)
  {
    final.value = searching[ending]['name'];
    namecard[2].innerHTML = "TO : " + searching[ending]['name'];
    details[2].innerHTML = searching[ending]['details'];
  }
}

window.addEventListener("load", () => {
  try {
    starting = sessionStorage.getItem('start').toString();
  ending = sessionStorage.getItem('end').toString();
  setter();
  getsetGoo();
  } catch (error) {

  }
  
});

const distanceCalculator = (x1, y1, x2, y2) => {
  return Number.parseInt(
    Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)).toString()
  );
};

function createLine(x1, y1, x2, y2, lineId) {
  let distance = distanceCalculator(x1, y1, x2, y2);
  let xMid = (x1 + x2) / 2;
  let yMid = (y1 + y2) / 2;
  let salopeInRadian = Math.atan2(y1 - y2, x1 - x2);
  let salopeInDegrees = (salopeInRadian * 180) / Math.PI;
  let line = document.getElementById(lineId);
  line.setAttribute("fill", "#00A3FF");
  line.setAttribute("y", yMid.toString());
  line.setAttribute("x", (xMid - distance / 2).toString());
  line.style.transform = `rotate(${salopeInDegrees}deg)`;
  line.style.width = distance + 3 + "px";
}

const sdhfiusdhfsiadufhlinterg = (x, y) => {
  let foundx, foundy;

  let yintersect = {
    y11: ["p34", "p85", "p53"],
    y22: ["p86", "p87", "p63"],
    y33: ["p70", "p79", "p88", "p111"],
    y44: ["p110", "p90", "p108"],
  };

  let xintersect = {
    x11: ["p111", "p110"],
    x22: ["p34", "p86", "p88", "p90"],
    x33: ["p85", "p87", "p79", "p108"],
    x44: ["p53", "p63", "p70"],
  };

  for (let i in yintersect) {
    if (yintersect[i].includes(y)) {
      foundy = yintersect[i];
      break;
    }
  }
  for (let i in xintersect) {
    if (xintersect[i].includes(x)) {
      foundx = xintersect[i];
      break;
    }
  }

  function intersect(a, b) {
    let t;
    if (b.length > a.length) (t = b), (b = a), (a = t);
    return a.filter(function (e) {
      return b.indexOf(e) > -1;
    });
  }

  let test = document.getElementById(intersect(foundx, foundy)[0]);
  return test;
};
function removeDestinationAll() {
  for (let i = 1; i <= 114; i++) {
    if (
      i != preinfo &&
      i != "6" &&
      i != "72" &&
      i != "71" &&
      i != "5" &&
      i != "39" &&
      i != "50" &&
      i != "4" &&
      i != "1"
    )
      document.getElementById(i.toString()).querySelector('path').style.fill = "#d4d4d4";
  }
}

const removeAlll = () => {
  if (
    xstartss != null &&
    ystartss != null &&
    xgreenendss != null &&
    ygreenendss != null &&
    xgreenstartss != null &&
    ygreenstartss != null &&
    xintersectss != null &&
    yintersectss != null
  ) {
    for (let i in inUse) {
      inUse[i].style.transform = null;
      inUse[i].style.width = null;
      inUse[i].style.opacity = 0;
    }
    inUse[3].setAttribute("x", xgreenendss);
    inUse[3].setAttribute("y", ygreenendss);
    inUse[2].setAttribute("x", xintersectss);
    inUse[2].setAttribute("y", yintersectss);
    inUse[1].setAttribute("x", xgreenstartss);
    inUse[1].setAttribute("y", ygreenstartss);
    inUse[0].setAttribute("x", xstartss);
    inUse[0].setAttribute("y", ystartss);
  }
};

const info = (id) => {
  console.log(document.getElementById(id));
  if(id != starting && id != ending)
    document.getElementById(id).querySelector('path').style.fill = "#6e6969"
  namecard[0].innerHTML = searching[id]['name'];
  details[0].innerHTML = searching[id]['details'];
};

const removeinfo = ()=>{
  try {
      document.getElementById(preinfo).querySelector('path').style.fill = "#d3d3d3"
  } catch (error) {
    
  }
  preinfo = undefined;
}

const reset = ()=>{
  sessionStorage.removeItem("start");
  sessionStorage.removeItem("end");
  removeAlll();
  removeDestinationAll();
  removeinfo();
  namecard[0].innerHTML = "Information"
  namecard[1].innerHTML = "Current Location"
  namecard[2].innerHTML = "Final Location"
  details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here."
  details[1].innerHTML =  "Type and Choose Your Current Location in the First Search Box."
  details[2].innerHTML = "Type and Choose Your Final Location in the Second Search Box."
  current.value = '';
  final.value = '';
  starting = undefined;
  ending = undefined;
}

document.getElementById("reset").onclick = ()=>{
  reset();
}

const greenDecider = () => {
  let greenStart = [];
  let start;
  let greenEnd = [];
  let end;
  let transport = [];
  let flags = true;
    
  const mappp = () => {
    for (let i in mapping[starting]) {
      greenStart.push(document.getElementById(i));
      start = document.getElementById(mapping[starting][i]);
      bluetoblue.add(i);
    }
    for (let j in mapping[ending]) {
      greenEnd.push(document.getElementById(j));
      end = document.getElementById(mapping[ending][j]);
      bluetoblue.add(j);
    }
  };

  const comparison = () => {
    let xblueEnd = Number.parseInt(end.getAttribute("x"));
    let yblueEnd = Number.parseInt(end.getAttribute("y"));
    let xblueStart = Number.parseInt(start.getAttribute("x"));
    let yblueStart = Number.parseInt(start.getAttribute("y"));
    let distanceStart = [Number.MAX_VALUE, Number.MAX_VALUE];
    let distanceEnd = [Number.MAX_VALUE, Number.MAX_VALUE];
    for (let k = 0; k < greenStart.length; k++) {
      let xgreenStart = Number.parseInt(greenStart[k].getAttribute("x"));
      let ygreenStart = Number.parseInt(greenStart[k].getAttribute("y"));
      distanceStart[k] = distanceCalculator(
        xblueEnd,
        yblueEnd,
        xgreenStart,
        ygreenStart
      );
    }
    for (let l = 0; l < greenEnd.length; l++) {
      let xgreenEnd = Number.parseInt(greenEnd[l].getAttribute("x"));
      let ygreenEnd = Number.parseInt(greenEnd[l].getAttribute("y"));
      distanceEnd[l] = distanceCalculator(
        xblueStart,
        yblueStart,
        xgreenEnd,
        ygreenEnd
      );
    }

    if (distanceEnd[0] > distanceEnd[1]) {
      if (greenEnd[0] == null) additionalInfo[0] = greenEnd[1];
      else additionalInfo[0] = greenEnd[0];
      transport.push(greenEnd[1]);
    } else {
      if (greenEnd[1] == null) additionalInfo[0] = greenEnd[0];
      else additionalInfo[0] = greenEnd[1];
      transport.push(greenEnd[0]);
    }
    transport.push(end);

    if (distanceStart[0] > distanceStart[1]) {
      if (greenStart[0] == null) additionalInfo[1] = greenStart[1];
      else additionalInfo[1] = greenStart[0];
      transport.push(greenStart[1]);
    } else {
      if (greenStart[1] == null) additionalInfo[1] = greenStart[0];
      else additionalInfo[1] = greenStart[1];
      transport.push(greenStart[0]);
    }
    transport.push(start);
  };

  mappp();
  for (let k in exceptions) {
    if (starting == k) {
      for (let l in exceptions[k]) {
        if (ending == l) {
          transport.push(document.getElementById(exceptions[k][l][1]));
          transport.push(end);
          transport.push(document.getElementById(exceptions[k][l][0]));
          transport.push(start);
          flags = false;
          break;
        }
      }
    }
  }
  if (flags) {
    comparison();
  }
  return transport;
};

const locates = () => {
  let infoReceived = greenDecider();
  let starts = infoReceived[3];
  let greenStarts = infoReceived[2];
  let ends = infoReceived[1];
  let greenEnds = infoReceived[0];
  xstartss = starts.getAttribute("x");
  ystartss = starts.getAttribute("y");

  xgreenstartss = greenStarts.getAttribute("x");
  ygreenstartss = greenStarts.getAttribute("y");

  let xend = ends.getAttribute("x");
  let yend = ends.getAttribute("y");
  xgreenendss = greenEnds.getAttribute("x");
  ygreenendss = greenEnds.getAttribute("y");

  let intersecteds = sdhfiusdhfsiadufhlinterg(greenStarts.id, greenEnds.id);
  if (intersecteds == null)
    intersecteds = sdhfiusdhfsiadufhlinterg(greenEnds.id, greenStarts.id);

  let xintersecteds = Number.parseInt(intersecteds.getAttribute("x"));
  let yintersecteds = Number.parseInt(intersecteds.getAttribute("y"));

  let a = [];
  if (bluetoblue.size <= 2 && (xstartss == xend || ystartss == yend)) {
    createLine(
      Number.parseFloat(xstartss),
      Number.parseFloat(ystartss),
      Number.parseFloat(xend),
      Number.parseFloat(yend),
      starts.id
    );
    xintersectss = intersecteds.getAttribute("x");
    yintersectss = intersecteds.getAttribute("y");
    a.push(starts);
  } else {
    createLine(
      Number.parseFloat(xstartss),
      Number.parseFloat(ystartss),
      Number.parseFloat(xgreenstartss),
      Number.parseFloat(ygreenstartss),
      starts.id
    );
    greenAttachment(
      greenStarts.id,
      greenEnds.id,
      intersecteds,
      xintersecteds,
      yintersecteds
    );
    createLine(
      Number.parseFloat(xgreenendss),
      Number.parseFloat(ygreenendss),
      Number.parseFloat(xend),
      Number.parseFloat(yend),
      greenEnds.id
    );
    a.push(starts, greenStarts, intersecteds, greenEnds);
  }
  turnUp(a);
  inUse[0] = starts;
  inUse[1] = greenStarts;
  inUse[2] = intersecteds;
  inUse[3] = greenEnds;
  inUse[4] = ends;
  bluetoblue.clear();
};

function turnUp(parameters) {
  for (let i in parameters) parameters[i].style.opacity = 1;
}

function greenAttachment(
  green_start,
  green_end,
  intersected,
  xintersect,
  yintersect
) {
  //First we will move the starting point's green element to the nearest element along y-axis
  let start = document.getElementById(green_start);
  let end = document.getElementById(green_end);
  let xstart = Number.parseFloat(start.getAttribute("x"));
  let ystart = Number.parseFloat(start.getAttribute("y"));
  let xend = Number.parseFloat(end.getAttribute("x"));
  let yend = Number.parseFloat(end.getAttribute("y"));
  xintersectss = intersected.getAttribute("x");
  yintersectss = intersected.getAttribute("y");
  createLine(xstart, ystart, xintersect, yintersect, green_start);
  createLine(xintersect, yintersect, xend, yend, intersected.id);
}


const places = document.getElementsByClassName("room");
for (let button of places) {
  let exceptions = Number.parseInt(button.id);
  if (
    !(
      exceptions == 6 ||
      exceptions == 71 ||
      exceptions == 5 ||
      exceptions == 39 ||
      exceptions == 4 ||
      exceptions == 3 ||
      exceptions == 102 ||
      exceptions == 82
    )
  ) {

    let infobut = document.getElementById(button.id);
    infobut.onclick = ()=>{
        Information(infobut.id);
    }
  }
}

const getsetGoo = () => {
  removeAlll();
  removeDestinationAll();
  if(starting!=null && starting!="null" && starting !="undefined" && starting != undefined)
  {
    let getsetRoom1 = document.getElementById(starting);
  getsetRoom1.querySelector('path').setAttribute("fill-opacity", "0.5");
  getsetRoom1.querySelector('path').style.fill = "#63e6beff";
  starting = getsetRoom1.id;
  }
  if(ending!=null && ending!="null" && ending!="undefined" && ending!=undefined)
  {
    let getsetRoom2 = document.getElementById(ending);
  getsetRoom2.querySelector('path').setAttribute("fill-opacity", "0.5");
  getsetRoom2.querySelector('path').style.fill = "#ffd43cff";
  ending = getsetRoom2.id;
  }
  if(starting != null && ending != null && starting !="null" && ending != "null" && starting != "undefined" && ending != "undefined"
    && starting !=undefined && ending != undefined)
    locates();
};

makecurrent.onclick = ()=>{
  if(preinfo != "undefined" && preinfo != "null" && preinfo != null && preinfo != undefined)
  {
    starting = preinfo;
    sessionStorage.setItem("start",starting);
    setter();
    getsetGoo();
    namecard[0].innerHTML = "Information"
    details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here."
    preinfo = undefined;
  }
  else
  {
    alert("Please first select the room, you want to make as current location.")
  }
}
makefinal.onclick = ()=>{
  if(preinfo != "undefined" && preinfo != "null" && preinfo != null && preinfo != undefined)
  {
    if(starting != null)
    {
      ending = preinfo;
      sessionStorage.setItem("end",ending);
      setter();
      getsetGoo();
      namecard[0].innerHTML = "Information"
      details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here."
      preinfo = undefined;
    }
    else
    {
      alert("Please first select the current location.");
    }
  }
  else
  {
    alert("Please first select the room, you want to make as final location.")
  }
}