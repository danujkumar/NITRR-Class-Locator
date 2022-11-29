import searching from "./json/searchTool.json" assert { type: "json" };
let id = [];
let name = new Map();
let start,end;
let divControl;

//Assigning all the names, details and department information into the array id;
for (let k in searching) {
  name.set(searching[k]["name"], k);
  id.push(searching[k]["name"]);
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
    let fromId = id[i];
    if (fromId != undefined && newWord != undefined) {
      let fromIds = refinedString(fromId.toUpperCase());

      if (fromIds.indexOf(newWord.toUpperCase()) > -1) {
        
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
try {
  search.onclick = ()=>{
  const fetchId = (Id)=>{
    if(name.get(Id.value) != undefined)
      return name.get(Id.value);
  }

  start = fetchId(current)
  end = fetchId(final)
  if(start == undefined || start == null)
  {
    alert("Please first select the nearest room.");
    search.removeAttribute("href");
  }
  else
  {
    if(Number.parseInt(start) >= 204)
      sessionStorage.setItem('map_no',"1")
    else if(Number.parseInt(start) >= 115 && Number.parseInt(start) <= 203)
      sessionStorage.setItem("map_no","2")
    else 
      sessionStorage.setItem("map_no","0")
    search.setAttribute("href","./inner-page.html")
  }
  sessionStorage.setItem('start',start);
  sessionStorage.setItem('end',end);
}
} catch (error) {
  
}