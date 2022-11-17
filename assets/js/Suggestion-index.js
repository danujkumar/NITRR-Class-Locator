import searching from "./json/searchTool.json" assert { type: "json" };
let id = [];
let name = new Map();
let dept = new Map();
let details = new Map();
let start,end;
let divControl;

//Assigning all the names, details and department information into the array id;
for (let k in searching) {
  name.set(searching[k]["name"], k);
  dept.set(searching[k]["dept"], k);
  details.set(searching[k]["details"], k);
  id.push(searching[k]["name"], searching[k]["dept"]);
}

//Getting the element of input current, input final and search box
let current = document.getElementById("current");
let final = document.getElementById("final");
let search = document.getElementById("search");
let body = document.getElementsByTagName("html");

//Method to delete all the child elements of the given parameter
const removal = (element) => {
  let e = element.lastElementChild;
  while (e) {
    element.removeChild(e);
    e = element.lastElementChild;
  }
}

//Searching filter is defined here
const pointsSE = (textId) => {
  
  let currentText = document.getElementById(textId);
  //Here we will control the divs for current and final location based on the input box id.
  if(textId=="current")
  {
    divControl = document.getElementById('currentdiv');
  }
  else if(textId=="final")
  {
    divControl = document.getElementById('finaldiv');
  }

  //Removing all the pre-filled divs for both current and final
  removal(divControl);

  //Searching is done here
  for (let i = 0; i < id.length; i++) {
    let fromId = id[i];

    if (fromId != undefined) {
      let fromIds = fromId.toUpperCase();
      if (fromIds.indexOf(currentText.value.toUpperCase()) > -1) {
        
        //Creating element here para with innerHTML as its array text, adding class of ibutton for css and appending under test div.
        const para = document.createElement("button");
        para.innerHTML = id[i];
        para.classList.add("ibutton");
        divControl.appendChild(para);

        //Onclick is handled here for each element it found
          para.onclick = () =>{
          document.getElementById(textId).value = id[i];
          removal(divControl); 
        }
      }
      }
    }

    if (!currentText.value.replace(/\s/g, "").length) {
        removal(divControl);
  };
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
try {
  search.onclick = ()=>{
  const fetchId = (Id)=>{
    if(name.get(Id.value) != undefined)
      return name.get(Id.value);
    else if(dept.get(Id.value) != undefined)
      return dept.get(Id.value);
  }

  
  start = fetchId(current)
  end = fetchId(final)
  if(start == undefined || start == null)
  {
    alert("Please select the current location.");
    search.removeAttribute("href");
  }
  else
  {
    search.setAttribute("href","./inner-page.html")
  }
  sessionStorage.setItem('start',start);
  sessionStorage.setItem('end',end);
}
} catch (error) {
  
}