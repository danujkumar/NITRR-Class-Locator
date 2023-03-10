import mapping from "./json/bluetoGreen.json" assert { type: "json" };
import mappingf from "./json/bluetoGreen1.json" assert { type: "json" };
import mappings from "./json/bluetoGreen2.json" assert { type: "json" };
import exceptions from "./json/exceptionPaths.json" assert { type: "json" };
import searching from "./json/searchTool.json" assert { type: "json" };
import floorsConnect from "./json/floorsConnection.json" assert { type: "json" };
import { createPopup } from "./DialogBox.js";

let starting;
let ending, map_no;
let mapUse;
let starts, endd;
let inUse = [];
let id = [];
let additionalInfo = [];
let name = new Map();
let bluetoblue = new Set();
let xstartss,
  ystartss,
  xgreenendss,
  ygreenendss,
  xgreenstartss,
  ygreenstartss,
  xintersectss,
  yintersectss;
let divControl;
let alertt = document.getElementById("alertt");
let current = document.getElementById("current");
let final = document.getElementById("final");
let body = document.getElementsByTagName("html");
let details = document.getElementsByClassName("card-text");
let namecard = document.getElementsByClassName("card-title");
let makecurrent = document.getElementById("makecurrent");
let makefinal = document.getElementById("makefinal");
let map0 = document.getElementById("groundd");
let map1 = document.getElementById("firstt");
let map2 = document.getElementById("secondd");
let buttonCon = document.querySelectorAll(".containerharsh a");
let removals = document.getElementById("removal");
let modes = document.getElementById("lift");
let swap = document.getElementById("swap");
let initialFloor;
let preinfo;
let serviceUsed = sessionStorage.getItem("serviceUse");

export { map_no, map0, map1, map2 };

if (sessionStorage.getItem("mode") == null) sessionStorage.setItem("mode", "S");

if (
  sessionStorage.getItem("serviceUse") == null ||
  sessionStorage.getItem("serviceUse") == undefined
) {
  sessionStorage.setItem("serviceUse", "X");
}

const clearMap = () => {
  if (map_no == "1") {
    removals.removeChild(map0);
    removals.removeChild(map2);
    map1.style.opacity = 1;
    map1.style.overflow = "clip";
  } else if (map_no == "2") {
    removals.removeChild(map0);
    removals.removeChild(map1);
    map2.style.opacity = 1;
    map2.style.overflow = "clip";
  } else {
    removals.removeChild(map1);
    removals.removeChild(map2);
    map0.style.opacity = 1;
    map0.style.overflow = "clip";
  }
};

const butControl = () => {
  if (map_no == "1") {
    buttonCon[0].classList.remove("active1");
    buttonCon[1].classList.add("active1");
    buttonCon[2].classList.remove("active1");
  } else if (map_no == "2") {
    buttonCon[1].classList.remove("active1");
    buttonCon[2].classList.add("active1");
    buttonCon[0].classList.remove("active1");
  } else {
    buttonCon[2].classList.remove("active1");
    buttonCon[0].classList.add("active1");
    buttonCon[1].classList.remove("active1");
  }
};

window.addEventListener("load", () => {
  // try {
    map_no = sessionStorage.getItem("map_no");
    if (map_no == null) {
      map_no = "0";
    }
    butControl();
    clearMap();
    starts = starting = sessionStorage.getItem("start");
    if (serviceUsed != "X") {
      mapUse = mapUses();
      serviceUse(serviceUsed);
      sessionStorage.setItem("serviceUse", "X");
    } else {
      endd = ending = sessionStorage.getItem("end");
      setter();
      getsetGoo();
    }
  // } catch (error) {
    //Remember this is under try section, so for debugging always disable this try section first.
    // console.log(error)
  // }
});

buttonCon[0].onclick = () => {
  sessionStorage.setItem("map_no", "0");
  location.reload();
};
buttonCon[1].onclick = () => {
  sessionStorage.setItem("map_no", "1");
  location.reload();
};
buttonCon[2].onclick = () => {
  sessionStorage.setItem("map_no", "2");
  location.reload();
};

const Information = (buttonClicked) => {
  if (preinfo != undefined) {
    if (preinfo != starting && preinfo != ending) {
      let element = document.getElementById(preinfo);
      if (element.querySelector("rect") != undefined)
        element.querySelector("rect").style.fill = "rgb(212,212,212)";
      else element.querySelector("path").style.fill = "rgb(219,219,219)";
    }
    if (preinfo == buttonClicked) {
      preinfo = undefined;
      namecard[0].innerHTML = "Information";
      details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
    } else {
      preinfo = buttonClicked;
      info(buttonClicked);
    }
  } else {
    preinfo = buttonClicked;
    info(buttonClicked);
  }
};

for (let k in searching) {
  if (searching[k]["details"] == "")
    searching[k]["details"] = searching[k]["name"];
  name.set(searching[k]["name"], k);
  id.push([searching[k]["name"], searching[k]["details"]]);
}

const removal = (element) => {
  let e = element.lastElementChild;
  while (e) {
    element.removeChild(e);
    e = element.lastElementChild;
  }
};

const detectFloor = () => {
  if (Number.parseInt(starts) >= 205) sessionStorage.setItem("map_no", "1");
  else if (Number.parseInt(starts) >= 115 && Number.parseInt(starts) <= 204)
    sessionStorage.setItem("map_no", "2");
  else sessionStorage.setItem("map_no", "0");
};

const refinedString = (word) => {
  let newWord;
  for (let i = 0; i < word.length; i++) {
    if (
      (word[i] < "A" || word[i] > "Z") &&
      (word[i] < "a" || word[i] > "z") &&
      (word[i] < "0" || word[i] > "9")
    ) {
      word = word.substring(0, i) + word.substring(i + 1);
      i--;
    }
    newWord = word;
  }
  return newWord;
};

const pointsSE = (textId) => {
  //Getting the current text id
  let currentText = document.getElementById(textId);
  let newWord = refinedString(currentText.value);

  if (textId == "current") divControl = document.getElementById("currentdiv");
  else if (textId == "final") divControl = document.getElementById("finaldiv");
  removal(divControl);

  for (let i = 0; i < id.length; i++) {
    let fromIdName = id[i][0];
    let fromIdDetails = id[i][1];
    if (
      fromIdName != undefined &&
      newWord != undefined &&
      fromIdDetails != undefined
    ) {
      let fromIdsName = refinedString(fromIdName.toUpperCase());
      let fromIdsDetails = refinedString(fromIdDetails.toUpperCase());
      if (
        fromIdsName.indexOf(newWord.toUpperCase()) > -1 ||
        fromIdsDetails.indexOf(newWord.toUpperCase()) > -1
      ) {
        const para = document.createElement("button");
        para.innerHTML = `${id[i][0]} (${currentText.value})`;
        para.classList.add("ibutton");
        divControl.appendChild(para);
        para.onclick = () => {
          document.getElementById(textId).value = id[i][0];
          if (textId == "current") {
            if (name.get(current.value) != null) {
              starts = starting = name.get(id[i][0]);
              sessionStorage.setItem("start", starting);
            }
            detectFloor();
            location.reload();
          } else {
            if (name.get(final.value) != null) {
              endd = ending = name.get(id[i][0]);
              sessionStorage.setItem("end", ending);
              if (
                starting != undefined &&
                starting != "undefined" &&
                starting != "null" &&
                starting != null
              ) {
                detectFloor();
                location.reload();
              } else {
                let popup = createPopup(
                  "#popup",
                  "Please first select the nearest room.",
                  false
                );
                popup();
                sessionStorage.removeItem("end");
              }
            }
          }
          removal(divControl);
        };
      }
    }
  }
  try {
    if (!newWord.replace(/\s/g, "").length) {
      removal(divControl);
    }
  } catch (error) {}
};

current.onkeyup = () => {
  pointsSE(current.id);
};

final.onkeyup = () => {
  pointsSE(final.id);
};

swap.addEventListener("click", () => {
  let temp = (starts = sessionStorage.getItem("end"));
  sessionStorage.setItem("end", (endd = sessionStorage.getItem("start")));
  sessionStorage.setItem("start", temp);
  if (
    starts >= 205 &&
    endd < 205 &&
    endd != null &&
    map_no != "1" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "1");
  } else if (
    starts >= 115 &&
    starts <= 204 &&
    !(endd >= 115 && endd <= 204) &&
    endd != null &&
    map_no != "2" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "2");
  } else if (
    starts <= 114 &&
    endd > 114 &&
    endd != null &&
    map_no != "0" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "0");
  }
  location.reload();
});

body[0].onclick = () => {
  try {
    removal(divControl);
  } catch (err) {}
};

function setter() {
  if (
    starting != undefined &&
    starting != "undefined" &&
    starting != "null" &&
    starting != null
  ) {
    current.value = searching[starting]["name"];
    namecard[1].innerHTML = "FROM : " + searching[starting]["name"];
    details[1].innerHTML = searching[starting]["details"];
  }
  if (
    ending != undefined &&
    ending != "undefined" &&
    ending != "null" &&
    ending != null
  ) {
    final.value = searching[ending]["name"];
    namecard[2].innerHTML = "TO : " + searching[ending]["name"];
    details[2].innerHTML = searching[ending]["details"];
  }
}

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
  if (map_no == "1") line.style.width = distance + 4 + "px";
  else if (map_no == "2") line.style.width = distance + 15 + "px";
  else line.style.width = distance + 3 + "px";
}

const intersectionGreen = (x, y) => {
  let foundx, foundy;
  let yintersect, xintersect;
  if (
    map_no != null &&
    map_no != "null" &&
    map_no != "undefined" &&
    map_no != undefined
  ) {
    if (map_no == "1") {
      xintersect = {
        x11: ["rect887", "rect917", "rect855", "rect837"],
        x22: ["rect913", "rect947", "rect867", "rect975"],
        x33: ["rect903", "rect937", "rect971"],
      };
      yintersect = {
        y11: ["rect887", "rect913", "rect903"],
        y22: ["rect917", "rect947", "rect937"],
        y33: ["rect855", "rect867", "rect971"],
        y44: ["rect837", "rect975"],
      };
    } else if (map_no == "2") {
      xintersect = {
        x11: ["rect765", "rect823", "rect825", "rect907"],
        x22: ["rect785", "rect813", "rect891", "rect853"],
        x33: ["rect801", "rect811"],
      };
      yintersect = {
        y11: ["rect765", "rect785", "rect801"],
        y22: ["rect823", "rect813", "rect811"],
        y33: ["rect825", "rect891"],
        y44: ["rect907", "rect853"],
      };
    } else {
      yintersect = {
        y11: ["p34", "p85", "p53"],
        y22: ["p86", "p87", "p63"],
        y33: ["p70", "p79", "p88", "p111"],
        y44: ["p110", "p90", "p108"],
      };
      xintersect = {
        x11: ["p111", "p110"],
        x22: ["p34", "p86", "p88", "p90"],
        x33: ["p85", "p87", "p79", "p108"],
        x44: ["p53", "p63", "p70"],
      };
    }
  }

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
  let startl, endl;
  if (map_no == "1") {
    (startl = 205), (endl = 302);
  } else if (map_no == "2") {
    (startl = 115), (endl = 204);
  } else {
    (startl = 1), (endl = 114);
  }

  for (let i = startl; i <= endl; i++) {
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
    ) {
      let element = document.getElementById(i.toString());
      if (element.querySelector("rect") != undefined)
        element.querySelector("rect").style.fill = "rgb(212,212,212)";
      else element.querySelector("path").style.fill = "rgb(219,219,219)";
    }
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
  if (id != starting && id != ending) {
    let element = document.getElementById(id);
    if (element.querySelector("rect") != null)
      element.querySelector("rect").style.fill = "#6e6969";
    else element.querySelector("path").style.fill = "#6e6969";
  }
  namecard[0].innerHTML = searching[id]["name"];
  details[0].innerHTML = searching[id]["details"];
};

const removeinfo = () => {
  try {
    let element = document.getElementById(preinfo);
    if (element.querySelector("rect") != undefined)
      element.querySelector("rect").style.fill = "rgb(212,212,212)";
    else element.querySelector("path").style.fill = "rgb(219,219,219)";
  } catch (error) {}
  preinfo = undefined;
};

const reset = () => {
  sessionStorage.removeItem("start");
  sessionStorage.removeItem("end");
  sessionStorage.removeItem("Stair");
  sessionStorage.removeItem("rotate");
  sessionStorage.removeItem("mode");
  removeAlll();
  removeDestinationAll();
  removeinfo();
  namecard[0].innerHTML = "Information";
  namecard[1].innerHTML = "Current Location";
  namecard[2].innerHTML = "Final Location";
  details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
  details[1].innerHTML =
    "Type and Choose Your Current Location in the First Search Box.";
  details[2].innerHTML =
    "Type and Choose Your Final Location in the Second Search Box.";
  current.value = "";
  final.value = "";
  starts = starting = undefined;
  endd = ending = undefined;
};

document.getElementById("reset").onclick = () => {
  reset();
};

const greenDecider = () => {
  let greenStart = [];
  let start;
  let greenEnd = [];
  let end;
  let transport = [];
  let flags = true;

  const mappp = () => {
    for (let i in mapUse[starting]) {
      greenStart.push(document.getElementById(i));
      start = document.getElementById(mapUse[starting][i]);
      bluetoblue.add(i);
    }
    for (let j in mapUse[ending]) {
      greenEnd.push(document.getElementById(j));
      end = document.getElementById(mapUse[ending][j]);
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
  let startsss = infoReceived[3];
  let greenStarts = infoReceived[2];
  let ends = infoReceived[1];
  let greenEnds = infoReceived[0];
  xstartss = startsss.getAttribute("x");
  ystartss = startsss.getAttribute("y");

  xgreenstartss = greenStarts.getAttribute("x");
  ygreenstartss = greenStarts.getAttribute("y");

  let xend = ends.getAttribute("x");
  let yend = ends.getAttribute("y");
  xgreenendss = greenEnds.getAttribute("x");
  ygreenendss = greenEnds.getAttribute("y");

  let intersecteds = intersectionGreen(greenStarts.id, greenEnds.id);
  if (intersecteds == null)
    intersecteds = intersectionGreen(greenEnds.id, greenStarts.id);

  let xintersecteds = Number.parseInt(intersecteds.getAttribute("x"));
  let yintersecteds = Number.parseInt(intersecteds.getAttribute("y"));

  let a = [];
  if (bluetoblue.size <= 2 && (xstartss == xend || ystartss == yend)) {
    createLine(
      Number.parseFloat(xstartss),
      Number.parseFloat(ystartss),
      Number.parseFloat(xend),
      Number.parseFloat(yend),
      startsss.id
    );
    xintersectss = intersecteds.getAttribute("x");
    yintersectss = intersecteds.getAttribute("y");
    a.push(startsss);
  } else {
    createLine(
      Number.parseFloat(xstartss),
      Number.parseFloat(ystartss),
      Number.parseFloat(xgreenstartss),
      Number.parseFloat(ygreenstartss),
      startsss.id
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
    a.push(startsss, greenStarts, intersecteds, greenEnds);
  }
  turnUp(a);
  inUse[0] = startsss;
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

export function room_click(id_num) {
  let exceptions;
  exceptions = Number.parseInt(id_num).toString();
  if (
    !(
      exceptions == "NaN" ||
      exceptions == "6" ||
      exceptions == "71" ||
      exceptions == "5" ||
      exceptions == "39" ||
      exceptions == "4" ||
      exceptions == "3" ||
      exceptions == "102" ||
      exceptions == "82"
    )
  ) {
    Information(id_num);
  }
}

modes.addEventListener("click", () => {
  modes.innerText == "From lift"
    ? sessionStorage.setItem("mode", "L")
    : sessionStorage.setItem("mode", "S");
});

const mapUses = () => {
  if (map_no == "1") return mappingf;
  else if (map_no == "2") return mappings;
  else return mapping;
};

export const serviceUse = (service_Id) => {
  let toStairs;

  if (map_no == "1") {
    toStairs = floorsConnect[service_Id]["1"];
  } else if (map_no == "2") {
    toStairs = floorsConnect[service_Id]["2"];
  } else {
    toStairs = floorsConnect[service_Id]["0"];
  }

  ending = endd = nearestDist(toStairs)[0];
  infoo();
  finalEnd();
};

const nearestDist = (toStairs) => {
  let distance,
    x = Number.MAX_VALUE,
    starterss,
    felement,
    key;
  for (let i in mapUse[starting]) {
    starterss = document.getElementById(mapUse[starting][i]);
  }
  for (let i in toStairs) {
    let star = document.getElementById(toStairs[i][1]);
    distance = distanceCalculator(
      starterss.getAttribute("x"),
      starterss.getAttribute("y"),
      star.getAttribute("x"),
      star.getAttribute("y")
    );
    if (x > distance) {
      x = distance;
      //This two parameters needs to be exported
      felement = toStairs[i][0];
      key = i;
    }
  }
  return [felement, key];
};

const getsetGoo = () => {
  removeAlll();
  removeDestinationAll();
  sessionStorage.getItem("mode") == "L"
    ? (modes.innerText = "From stairs")
    : (modes.innerText = "From lift");

  mapUse = mapUses();
  const startToStairs = () => {
    let toStairs;

    if (map_no == "1") {
      toStairs = floorsConnect[sessionStorage.getItem("mode")]["1"];
    } else if (map_no == "2") {
      toStairs = floorsConnect[sessionStorage.getItem("mode")]["2"];
    } else {
      toStairs = floorsConnect[sessionStorage.getItem("mode")]["0"];
    }

    let exportt = nearestDist(toStairs);
    sessionStorage.setItem("Stair", exportt[1]);
    return exportt[0];
  };

  const detectfinalFloor = () => {
    if (endd >= 205) return "First";
    else if (endd >= 115 && endd <= 204) return "Second";
    else return "Ground";
  };

  const moveToFloors = () => {
    if (detectfinalFloor() == "First") {
      sessionStorage.setItem("map_no", "1");
      location.reload();
    } else if (detectfinalFloor() == "Second") {
      sessionStorage.setItem("map_no", "2");
      location.reload();
    } else {
      sessionStorage.setItem("map_no", "0");
      location.reload();
    }
  };

  const detectInterFloorStarts = () => {
    if (
      starts >= 205 &&
      endd < 205 &&
      endd != null &&
      endd != undefined &&
      map_no == "1" &&
      endd != "null" &&
      endd != "undefined"
    ) {
      starting = starts;
      ending = startToStairs();
      alertt.style.display = "block";
      modes.style.display = "inline";
      initialFloor = "First";
      return true;
    } else if (
      starts >= 115 &&
      starts <= 204 &&
      !(endd >= 115 && endd <= 204) &&
      endd != undefined &&
      endd != null &&
      map_no == "2" &&
      endd != "null" &&
      endd != "undefined"
    ) {
      starting = starts;
      ending = startToStairs();
      alertt.style.display = "block";
      modes.style.display = "inline";
      initialFloor = "Second";
      return true;
    } else if (
      starts <= 114 &&
      endd > 114 &&
      endd != null &&
      endd != undefined &&
      map_no == "0" &&
      endd != "null" &&
      endd != "undefined"
    ) {
      starting = starts;
      ending = startToStairs();
      alertt.style.display = "block";
      modes.style.display = "inline";
      initialFloor = "Ground";
      return true;
    }
    modes.style.display = "none";
    return false;
  };

  alertt.querySelector("a").onclick = () => {
    moveToFloors();
  };

  const detectInterFloorEnds = () => {
    if (starts < 205 && endd >= 205 && map_no == "1") {
      ending = endd;
      starting =
        floorsConnect[sessionStorage.getItem("mode")][map_no][
          sessionStorage.getItem("Stair")
        ][0];
    } else if (
      !(starts >= 115 && starts <= 204) &&
      endd >= 115 &&
      endd <= 204 &&
      map_no == "2"
    ) {
      ending = endd;
      starting =
        floorsConnect[sessionStorage.getItem("mode")][map_no][
          sessionStorage.getItem("Stair")
        ][0];
    } else if (starts > 114 && endd <= 114 && map_no == "0") {
      ending = endd;
      starting =
        floorsConnect[sessionStorage.getItem("mode")][map_no][
          sessionStorage.getItem("Stair")
        ][0];
    }
  };

  if (detectInterFloorStarts() == false) detectInterFloorEnds();
  else {
    document.getElementById("finalFloor").innerHTML =
      detectfinalFloor() + " floor";
    document.getElementById("initialFloor").innerHTML = initialFloor + " floor";
  }

  if (
    starting != null &&
    starting != "null" &&
    starting != "undefined" &&
    starting != undefined
  ) {
    let getsetRoom1 = document.getElementById(starting);
    if (
      getsetRoom1.querySelector("rect") != undefined &&
      getsetRoom1.querySelector("rect") != null
    ) {
      getsetRoom1.querySelector("rect").setAttribute("fill-opacity", "0.5");
      getsetRoom1.querySelector("rect").style.fill = "#63e6beff";
    } else {
      getsetRoom1.querySelector("path").setAttribute("fill-opacity", "0.5");
      getsetRoom1.querySelector("path").style.fill = "#63e6beff";
    }
    starting = getsetRoom1.id;
  }

  if (
    ending != null &&
    ending != "null" &&
    ending != "undefined" &&
    ending != undefined
  ) {
    let getsetRoom2 = document.getElementById(ending);
    if (
      getsetRoom2.querySelector("rect") != undefined &&
      getsetRoom2.querySelector("rect") != null
    ) {
      getsetRoom2.querySelector("rect").setAttribute("fill-opacity", "0.7");
      getsetRoom2.querySelector("rect").style.fill = "#ffd43cff";
    } else {
      getsetRoom2.querySelector("path").setAttribute("fill-opacity", "0.7");
      getsetRoom2.querySelector("path").style.fill = "#ffd43cff";
    }
    ending = getsetRoom2.id;
  }

  if (
    starting != null &&
    ending != null &&
    starting != "null" &&
    ending != "null" &&
    starting != "undefined" &&
    ending != "undefined" &&
    starting != undefined &&
    ending != undefined
  )
    locates();
};

makecurrent.onclick = () => {
  if (
    preinfo != "undefined" &&
    preinfo != "null" &&
    preinfo != null &&
    preinfo != undefined
  ) {
    namecard[0].innerHTML = "Information";
    details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
    starts = starting = preinfo;
    sessionStorage.setItem("start", starting);
    setter();
    getsetGoo();
    preinfo = undefined;
  } else {
    // alert("Please first select the room, you want to make as current location.")
    let popup = createPopup(
      "#popup",
      "Please first select the room, you want to make as current location.",
      false
    );
    popup();
  }
};

const infoo = () => {
  namecard[0].innerHTML = "Information";
  details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
  sessionStorage.setItem("end", ending);
};

const finalEnd = () => {
  if (
    starts >= 205 &&
    endd < 205 &&
    endd != null &&
    map_no != "1" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "1");
    location.reload();
  } else if (
    starts >= 115 &&
    starts <= 204 &&
    !(endd >= 115 && endd <= 204) &&
    endd != null &&
    map_no != "2" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "2");
    location.reload();
  } else if (
    starts <= 114 &&
    endd > 114 &&
    endd != null &&
    map_no != "0" &&
    endd != undefined &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "0");
    location.reload();
  } else {
    setter();
    getsetGoo();
    alertt.style.display = "none";
  }
};

makefinal.onclick = () => {
  if (starting != null) {
    if (
      preinfo != "undefined" &&
      preinfo != "null" &&
      preinfo != null &&
      preinfo != undefined
    ) {
      namecard[0].innerHTML = "Information";
      details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
      endd = ending = preinfo;
      sessionStorage.setItem("end", ending);
      finalEnd();
      preinfo = undefined;
    } else {
      // alert("Please first select the room, you want to make as final location.");
      let popup = createPopup(
        "#popup",
        "Please first select the room, you want to make as final location, quick actions are given below.",
        true
      );
      popup();
    }
  } else {
    // alert("Please first select the current location.");
    let popup = createPopup(
      "#popup",
      "Please first select the nearest room.",
      false
    );
    popup();
  }
};