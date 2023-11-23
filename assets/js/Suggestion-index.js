// import searching from "./json/searchTool.json" assert { type: "json" };
const jsonFileURL = new URL("./json/searchTool.json", import.meta.url);
const searching = await fetch(jsonFileURL).then(r => r.json());
import { createPopup } from "./mainDialogBox.js";
let id = [];
let name = new Map();
let start,end;
let divControl;

//Assigning all the names, details and department information into the array id;
for (let k in searching) {
  if(searching[k]["details"] == "")
    searching[k]["details"] = searching[k]["name"];
  name.set(searching[k]["name"], k);
  id.push([searching[k]["name"],searching[k]["details"]]);
}

//Getting the element of input current, input final and search box
let current = document.getElementById("current");
let final = document.getElementById("final");
let search = document.getElementById("search");
let body = document.getElementsByTagName("html");
let swap = document.getElementById("swap");

//Method to delete all the child elements of the given parameter
const removal = (element) => {
  let e = element.lastElementChild;
  while (e) {
    element.removeChild(e);
    e = element.lastElementChild;
  }
}

const refinedString = (word)=>{
  let newWord;
  for(let i=0;i<word.length;i++)
  {
    if((word[i]<'A' || word[i] > 'Z') && (word[i]<'a' || word[i]>'z') && (word[i]<'0' || word[i]>'9'))
      {
        word = word.substring(0,i)+word.substring(i+1);
        i--;
      }
      newWord = word;
  }
  return newWord;
}

//Searching filter is defined here
const pointsSE = (textId) => {
  
  let currentText = document.getElementById(textId);
  let newWord = refinedString(currentText.value);
  //Here we will control the divs for current and final location based on the input box id.
  if(textId=="current")
    divControl = document.getElementById('currentdiv');
  else if(textId=="final")
    divControl = document.getElementById('finaldiv');

  //Removing all the pre-filled divs for both current and final
  removal(divControl);

  //Searching is done here
  for (let i = 0; i < id.length; i++) {
    let fromIdName = id[i][0];
    let fromIdDetails = id[i][1];
    if (fromIdName != undefined && newWord != undefined && fromIdDetails != undefined) {
      let fromIdsNames = refinedString(fromIdName.toUpperCase());
      let fromIdsDetails = refinedString(fromIdDetails.toUpperCase());
      if ((fromIdsNames.indexOf(newWord.toUpperCase()) > -1) || (fromIdsDetails.indexOf(newWord.toUpperCase()) > -1)) {
        //Creating element here para with innerHTML as its array text, adding class of ibutton for css and appending under test div.
        const para = document.createElement("button");
        para.innerHTML = `${id[i][0]} (${currentText.value})`;
        para.classList.add("ibutton");
        divControl.appendChild(para);

        //Onclick is handled here for each element it found
          para.onclick = () =>{
            document.getElementById(textId).value = id[i][0];
            removal(divControl); 
        }
      }
      }
    }
      try {
        if (!newWord.replace(/\s/g, "").length) {
              removal(divControl);
        };
      } catch (error) {}
}

//Implementing the onkeyup event for all the input boxes
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

//Implementing the onclick for the search button
export function letsGoo() {
  if(Number.parseInt(start) >= 205)
      sessionStorage.setItem('map_no',"1")
    else if(Number.parseInt(start) >= 115 && Number.parseInt(start) <= 204)
      sessionStorage.setItem("map_no","2")
    else 
      sessionStorage.setItem("map_no","0")
    search.setAttribute("href","./maps.html")
    location.assign('./maps.html')
}
try {
  swap.addEventListener('click',()=>{
    let temp = final.value;
    final.value = current.value;
    current.value = temp;
  })
  
  search.onclick = ()=>{
  const fetchId = (Id)=>{
    if(name.get(Id.value) != undefined)
      return name.get(Id.value);
  }

  start = fetchId(current)
  end = fetchId(final)
  if(start == undefined || start == null)
  {
    let popup = createPopup("#popup","Please first select the nearest room.",false);
    popup();
    search.removeAttribute("href");
  }
  else
  {
    if(end == undefined || end == null)
    {
      let popup = createPopup("#popup","Quick actions for you, or click continue anyway to proceed without selecting any destination.",true);
      popup();
      search.removeAttribute("href");
    }
    else
    {
      sessionStorage.setItem('serviceUse','X');
      letsGoo();
    }
  }
  sessionStorage.setItem('start',start);
  sessionStorage.setItem('end',end);
}
} catch (error) {
  
}