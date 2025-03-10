import { additionalPaths, map, greenConnections } from "./json/constants.js";
import { services } from "./json/services.js";
import { searchTool } from "./json/searchTool.js";
import { createPopup } from "./DialogBox.js";

let starting;
let ending, map_no;
let starts, endd;
let inUse = [];
let id = [];
let name = new Map();
let xstartss,
  ystartss,
  xgreenendss,
  ygreenendss,
  xgreenstartss,
  ygreenstartss,
  xintersectss,
  yintersectss;
let oldAdditionalPaths = [];
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
let map3 = document.getElementById("backyardd"); //6th change added the backyard map
let buttonCon = document.querySelectorAll(".containerharsh a");
let removals = document.getElementById("removal");
let modes = document.getElementById("lift");
let swap = document.getElementById("swap");
let initialFloor;
let preinfo;
let serviceUsed = sessionStorage.getItem("serviceUse");

export { map_no, map0, map1, map2, map3 };

if (sessionStorage.getItem("mode") == null) sessionStorage.setItem("mode", "S");

if (
  sessionStorage.getItem("serviceUse") == null ||
  sessionStorage.getItem("serviceUse") == undefined
) {
  serviceUsed = "X";
  sessionStorage.setItem("serviceUse", "X");
}

//7th change added the backyard map
const clearMap = () => {
  if (map_no == "1") {
    removals.removeChild(map0);
    removals.removeChild(map2);
    removals.removeChild(map3);
    map1.style.opacity = 1;
    map1.style.overflow = "clip";
  } else if (map_no == "2") {
    removals.removeChild(map0);
    removals.removeChild(map1);
    removals.removeChild(map3);
    map2.style.opacity = 1;
    map2.style.overflow = "clip";
  } else if (map_no == "0") {
    removals.removeChild(map1);
    removals.removeChild(map2);
    removals.removeChild(map3);
    map0.style.opacity = 1;
    map0.style.overflow = "clip";
  } else {
    removals.removeChild(map1);
    removals.removeChild(map2);
    removals.removeChild(map0);
    map3.style.opacity = 1;
    map3.style.overflow = "clip";
  }
};

const butControl = async () => {
  //Second change here we have another button listed so its functionality added
  if (map_no == "1") {
    buttonCon[1].classList.add("active1");
    buttonCon[0].classList.remove("active1");
    buttonCon[2].classList.remove("active1");
    buttonCon[3].classList.remove("active1");
  } else if (map_no == "2") {
    buttonCon[2].classList.add("active1");
    buttonCon[1].classList.remove("active1");
    buttonCon[0].classList.remove("active1");
    buttonCon[3].classList.remove("active1");
  } else if (map_no == "0") {
    buttonCon[0].classList.add("active1");
    buttonCon[2].classList.remove("active1");
    buttonCon[1].classList.remove("active1");
    buttonCon[3].classList.remove("active1");
  } else {
    buttonCon[3].classList.add("active1");
    buttonCon[0].classList.remove("active1");
    buttonCon[1].classList.remove("active1");
    buttonCon[2].classList.remove("active1");
  }
};

window.addEventListener("load", async () => {
  try {
    for (let k in searchTool) {
      if (searchTool[k]["details"] == "")
        searchTool[k]["details"] = searchTool[k]["name"];
      name.set(searchTool[k]["name"], k);
      id.push([searchTool[k]["name"], searchTool[k]["details"]]);
    }
    map_no = sessionStorage.getItem("map_no");
    if (map_no == null) {
      map_no = "0";
    }
    await butControl()
      .then(() => {
        clearMap();
        starts = starting = sessionStorage.getItem("start");
        if (serviceUsed != "X") {
          serviceUse(serviceUsed);
          sessionStorage.setItem("serviceUse", "X");
        } else {
          endd = ending = sessionStorage.getItem("end");
          setter();
          getsetGoo();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    //Remember this is under try section, so for debugging always disable this try section first.
  }
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

//1st change here to have another button setting its sessionStorage to 3
buttonCon[3].onclick = () => {
  sessionStorage.setItem("map_no", "3");
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

const removal = (element) => {
  let e = element.lastElementChild;
  while (e) {
    element.removeChild(e);
    e = element.lastElementChild;
  }
};

//8th change we need to reconfigure the detectfloor to detect the backyard map
const detectFloor = () => {
  sessionStorage.setItem("map_no", detectfinalFloor(starts)[1]);
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

  for (const element of id) {
    let fromIdName = element[0];
    let fromIdDetails = element[1];
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
        para.innerHTML = `${element[0]} (${currentText.value})`;
        para.classList.add("ibutton");
        divControl.appendChild(para);
        para.onclick = () => {
          document.getElementById(textId).value = element[0];
          if (textId == "current") {
            if (name.get(current.value) != null) {
              starts = starting = name.get(element[0]);
              sessionStorage.setItem("start", starting);
            }
            detectFloor();
            location.reload();
          } else if (name.get(final.value) != null) {
            endd = ending = name.get(element[0]);
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

//9th change to reconfigure to detect the backyard map
swap.addEventListener("click", () => {
  let temps = (starts = sessionStorage.getItem("end"));
  let tempe = (endd = sessionStorage.getItem("start"));
  sessionStorage.setItem("end", tempe);
  sessionStorage.setItem("start", temps);
  if (
    starts >= 303 &&
    endd < 303 &&
    endd != null &&
    endd != undefined &&
    map_no != "3" &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "3");
  } else if (
    starts >= 205 &&
    starts <= 302 &&
    !(endd >= 205 && endd <= 302) &&
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
    current.value = searchTool[starting]["name"];
    namecard[1].innerHTML = "FROM : " + searchTool[starting]["name"];
    details[1].innerHTML = searchTool[starting]["details"];
  }
  if (
    ending != undefined &&
    ending != "undefined" &&
    ending != "null" &&
    ending != null
  ) {
    final.value = searchTool[ending]["name"];
    namecard[2].innerHTML = "TO : " + searchTool[ending]["name"];
    details[2].innerHTML = searchTool[ending]["details"];
  }
}

const displacementCalculator = (x1, y1, x2, y2) => {
  return Number.parseInt(
    Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)).toString()
  );
};

function createLine(x1, y1, x2, y2, lineId) {
  let distance = displacementCalculator(x1, y1, x2, y2);
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
  else if (map_no == "3") line.style.width = distance + 22 + "px";
  else line.style.width = distance + 3 + "px";
}

const intersectionGreenClone = (x, y) => {
  let foundx, foundy;
  let yintersect, xintersect;
  if (
    map_no != null &&
    map_no != "null" &&
    map_no != "undefined" &&
    map_no != undefined
  ) {
    xintersect = greenConnections[map_no]["x"];
    yintersect = greenConnections[map_no]["y"];
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

  function commonNode(a, b) {
    let t;
    if (b.length > a.length) {
      t = b;
      b = a;
      a = t;
    }
    return a.filter(function (e) {
      return b.indexOf(e) > -1;
    });
  }

  let test = document.getElementById(commonNode(foundx, foundy)[0]);
  return test;
};

//10th change configured starl and endl
function removeDestinationAll() {
  let startl, endl;
  if (map_no == "1") {
    startl = 205;
    endl = 302;
  } else if (map_no == "2") {
    startl = 115;
    endl = 204;
  } else if (map_no == "0") {
    startl = 1;
    endl = 114;
  } else {
    startl = 303;
    endl = 321;
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
    resetExtraLining();
  }
};

const resetExtraLining = () => {
  for (let room in oldAdditionalPaths) {
    oldAdditionalPaths[room][0]["p1"].style.transform = null;
    oldAdditionalPaths[room][0]["p1"].style.width = null;
    oldAdditionalPaths[room][0]["p1"].style.opacity = 0;
    oldAdditionalPaths[room][1]["p2"].style.transform = null;
    oldAdditionalPaths[room][1]["p2"].style.width = null;
    oldAdditionalPaths[room][1]["p2"].style.opacity = 0;
    oldAdditionalPaths[room][0]["p1"].setAttribute(
      "x",
      oldAdditionalPaths[room][0]["p1x"]
    );
    oldAdditionalPaths[room][0]["p1"].setAttribute(
      "y",
      oldAdditionalPaths[room][0]["p1y"]
    );
    oldAdditionalPaths[room][1]["p2"].setAttribute(
      "x",
      oldAdditionalPaths[room][1]["p2x"]
    );
    oldAdditionalPaths[room][1]["p2"].setAttribute(
      "y",
      oldAdditionalPaths[room][1]["p2y"]
    );
  }
};

const info = (id) => {
  if (id != starting && id != ending) {
    let element = document.getElementById(id);
    if (element.querySelector("rect") != null)
      element.querySelector("rect").style.fill = "#6e6969";
    else element.querySelector("path").style.fill = "#6e6969";
  }
  namecard[0].innerHTML = searchTool[id]["name"];
  details[0].innerHTML = searchTool[id]["details"];
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
  location.reload();
};

function additionalPathsLining(params) {
  for (let i in params) {
    const p1 = document.getElementById(params[i][0]);
    const p2 = document.getElementById(params[i][1]);
    p1.style.opacity = 1;
    p2.style.opacity = 1;
    const p1x = p1.getAttribute("x");
    const p1y = p1.getAttribute("y");
    const p2x = p2.getAttribute("x");
    const p2y = p2.getAttribute("y");
    oldAdditionalPaths.push([
      { p1, p1x, p1y },
      { p2, p2x, p2y },
    ]);
    createLine(
      Number.parseFloat(p1x),
      Number.parseFloat(p1y),
      Number.parseFloat(p2x),
      Number.parseFloat(p2y),
      params[i][0]
    );
  }
}

//Function to determine the distances
const nearestDistance = (source, destination) => {
  let start;
  let end;
  let distances = [];

  for (let i in map[map_no][source]) {
    for (let j in map[map_no][destination]) {
      start = document.getElementById(map[map_no][source][i]);
      end = document.getElementById(map[map_no][destination][j]);
      let ss = document.getElementById(i);
      let ee = document.getElementById(j);
      let intersecteds = intersectionGreenClone(i, j);
      if (intersecteds == null) intersecteds = intersectionGreenClone(j, i);

      let distance1 = displacementCalculator(
        start.getAttribute("x"),
        start.getAttribute("y"),
        ss.getAttribute("x"),
        ss.getAttribute("y")
      );
      let distance2 = displacementCalculator(
        ss.getAttribute("x"),
        ss.getAttribute("y"),
        intersecteds.getAttribute("x"),
        intersecteds.getAttribute("y")
      );
      let distance3 = displacementCalculator(
        intersecteds.getAttribute("x"),
        intersecteds.getAttribute("y"),
        ee.getAttribute("x"),
        ee.getAttribute("y")
      );
      distances.push({
        dist: distance1 + distance2 + distance3,
        gStart: ss,
        intersect: intersecteds,
        gEnd: ee,
      });
    }
  }

  const singleLine = new Set([
    ...Object.keys(map[map_no][source]),
    ...Object.keys(map[map_no][destination]),
  ]);

  distances.sort((a, b) => a.dist - b.dist);
  return {
    start: start,
    middle: distances[0],
    end: end,
    line: singleLine,
    distance: distances[0].dist,
  };
};

const greenDecider = () => {
  const info = nearestDistance(starting, ending);
  const transport = [];

  transport.push(info.start);
  transport.push(info.middle.gStart);
  transport.push(info.middle.intersect);
  transport.push(info.middle.gEnd);
  transport.push(info.end);
  transport.push(info.line);

  //Additional joinings which is not possible by original algorithm
  if (starting == "318" && ending == "319") {
    additionalPathsLining(additionalPaths["#318"]);
    return null;
  } else if (starting == "319" && ending == "318") {
    additionalPathsLining(additionalPaths["#319"]);
    return null;
  } else if (starting == "319" && ending == "319") {
    additionalPathsLining(additionalPaths["#319319"]);
    return null;
  } else if (starting == "318" && ending == "318") {
    additionalPathsLining(additionalPaths["#318318"]);
    return null;
  } else if (starting == "320" && ending == "320") {
    additionalPathsLining(additionalPaths["#320320"]);
    return null;
  } else {
    if (additionalPaths[starting] != undefined) {
      additionalPathsLining(additionalPaths[starting]);
    }
    if (additionalPaths[ending] != undefined) {
      additionalPathsLining(additionalPaths[ending]);
    }
    return transport;
  }
};

const locates = () => {
  let infoReceived = greenDecider();

  if (infoReceived == null) return;

  let startsss = infoReceived[0];
  let greenStarts = infoReceived[1];
  let intersecteds = infoReceived[2];
  let greenEnds = infoReceived[3];
  let ends = infoReceived[4];

  xstartss = startsss.getAttribute("x");
  ystartss = startsss.getAttribute("y");

  xgreenstartss = greenStarts.getAttribute("x");
  ygreenstartss = greenStarts.getAttribute("y");

  let xend = ends.getAttribute("x");
  let yend = ends.getAttribute("y");
  xgreenendss = greenEnds.getAttribute("x");
  ygreenendss = greenEnds.getAttribute("y");

  let xintersecteds = Number.parseInt(intersecteds.getAttribute("x"));
  let yintersecteds = Number.parseInt(intersecteds.getAttribute("y"));

  let a = [];
  if (infoReceived[5].size <= 2 && (xstartss == xend || ystartss == yend)) {
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
  location.reload();
});

//12th change configured the serviceUse to include the backyard map
//To be configured after we get the actual backyard map
export const serviceUse = (service_Id) => {
  const toStairs = services[service_Id][map_no];
  removeAlll();

  if (service_Id == "G" && (map_no == "1" || map_no == "2")) {
    ending = endd = services[service_Id]["0"][nearestDist(toStairs)[1]][0];
    sessionStorage.setItem("end", ending);
    location.reload();
  } else if ((service_Id == "S" || service_Id == "L") && map_no == "3") {
    ending = endd = services["B"][service_Id][nearestDist(toStairs)[0]];
    sessionStorage.setItem("end", ending);
    location.reload();
  } else {
    ending = endd = nearestDist(toStairs)[0];
    infoo();
    finalEnd();
  }
};

const nearestDist = (toStairs) => {
  let distance,
    x = Number.MAX_VALUE,
    felement,
    key;
  for (let i in toStairs) {
    distance = nearestDistance(starting, toStairs[i][0]).distance;
    if (x > distance) {
      x = distance;
      //These two parameters needs to be exported
      felement = toStairs[i][0];
      key = i;
    }
  }
  return [felement, key];
};

const detectfinalFloor = (value) => {
  if (value >= 303) return ["Back", "3"];
  else if (value >= 205 && value <= 302) return ["First", "1"];
  else if (value >= 115 && value <= 204) return ["Second", "2"];
  else return ["Ground", "0"];
};

//13th change configured the getsetGoo to include the backyard map
//To be configured after we get the actual backyard map
const getsetGoo = () => {
  removeAlll();
  removeDestinationAll();
  if (sessionStorage.getItem("mode") == "L") {
    modes.innerText = "From stairs";
  } else if(detectfinalFloor(endd)[1] == "3") {
    //Alternate room left for the backyard map
    modes.remove();
  } else {
    modes.innerText = "From lift";
  }

  const startToStairs = () => {
    const toStairs =
      detectfinalFloor(endd)[1] == "3"
        ? services["G"]["Back"][map_no]
        : services[sessionStorage.getItem("mode")][map_no];
    let exportt = nearestDist(toStairs);
    sessionStorage.setItem("Stair", exportt[1]);
    return exportt[0];
  };

  const detectInterFloorStarts = () => {
    if (
      starts >= 303 &&
      endd < 303 &&
      endd != null &&
      endd != undefined &&
      map_no == "3" &&
      endd != "null" &&
      endd != "undefined"
    ) {
      starting = starts;
      ending = startToStairs();
      alertt.style.display = "block";
      modes.style.display = "inline";
      initialFloor = "Back";
      return true;
    } else if (
      starts >= 205 &&
      starts <= 302 &&
      !(endd >= 205 && endd <= 302) &&
      endd != null &&
      map_no == "1" &&
      endd != undefined &&
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
    sessionStorage.setItem("map_no", detectfinalFloor(endd)[1]);
    location.reload();
  };

  const detectInterFloorEnds = () => {
    if (
      (!(starts >= 205 && starts <= 302) &&
        endd >= 205 &&
        endd <= 302 &&
        map_no == "1") ||
      (!(starts >= 115 && starts <= 204) &&
        endd >= 115 &&
        endd <= 204 &&
        map_no == "2") ||
      (starts > 114 && endd <= 114 && map_no == "0") ||
      (starts < 303 && endd >= 303 && map_no == "3")
    ) {
      ending = endd;
      starting =
        services[sessionStorage.getItem("mode")][map_no][
          sessionStorage.getItem("Stair")
        ][0];
    }
  };

  if (!detectInterFloorStarts()) detectInterFloorEnds();
  else {
    document.getElementById("finalFloor").innerHTML =
      detectfinalFloor(endd)[0] + " floor";
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
  ) {
    locates();
  }
};

const infoo = () => {
  namecard[0].innerHTML = "Information";
  details[0].innerHTML = "Press Any Room in the Map to Get It's Info Here.";
  sessionStorage.setItem("end", ending);
};

//14th change to reconfigure the finalEnd to include the backyard map
const finalEnd = () => {
  if (
    starts >= 303 &&
    endd < 303 &&
    endd != null &&
    endd != undefined &&
    map_no != "3" &&
    endd != "null" &&
    endd != "undefined"
  ) {
    sessionStorage.setItem("map_no", "3");
    location.reload();
  } else if (
    starts >= 205 &&
    starts <= 302 &&
    !(endd >= 205 && endd <= 302) &&
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

export function testUnitEnd(destination) {
  preinfo = destination;
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
      let popup = createPopup(
        "#popup",
        "Please first select the room, you want to make as final location, quick actions are given below.",
        true
      );
      popup();
    }
  } else {
    let popup = createPopup(
      "#popup",
      "Please first select the nearest room.",
      false
    );
    popup();
  }
}

export function testUnitStart(start) {
  preinfo = start;
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
}

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
      let popup = createPopup(
        "#popup",
        "Please first select the room, you want to make as final location, quick actions are given below.",
        true
      );
      popup();
    }
  } else {
    let popup = createPopup(
      "#popup",
      "Please first select the nearest room.",
      false
    );
    popup();
  }
};
