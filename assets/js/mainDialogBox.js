import { letsGoo } from "./Suggestion-index.js";

//Implementing the new popup service just for main index file
export function createPopup(id, para, serviceRequired) {
  let popupNode = document.querySelector(id);
  let overlay = popupNode.querySelector(".overlay");
  let closeBtn = popupNode.querySelector(".close-btn");
  let info = popupNode.querySelector(".popup-content p");
  let stairService = popupNode.querySelector("#services1");
  let liftService = popupNode.querySelector("#services2");
  let ltoiletService = popupNode.querySelector("#services3");
  let gtoiletService = popupNode.querySelector("#services4");
  let exitService = popupNode.querySelector("#services5");
  let serviceEnability = popupNode.querySelector(".popup-content .service");
  let continueAny = document.getElementById("continueAny");
  info.innerHTML = para;
  if (serviceRequired) {
    continueAny.style.display = "block";
    serviceEnability.classList.remove("noservice");
  } else {
    continueAny.style.display = "none";
    serviceEnability.classList.add("noservice");
  }
  function openPopup() {
    popupNode.classList.add("active");
  }
  function closePopup() {
    popupNode.classList.remove("active");
  }
  stairService.addEventListener("click", () => {
    sessionStorage.setItem("serviceUse", "S");
    letsGoo();
    closePopup();
  });
  liftService.addEventListener("click", () => {
    sessionStorage.setItem("serviceUse", "L");
    letsGoo();
    closePopup();
  });
  ltoiletService.addEventListener("click", () => {
    sessionStorage.setItem("serviceUse", "LT");
    letsGoo();
    closePopup();
  });
  gtoiletService.addEventListener("click", () => {
    sessionStorage.setItem("serviceUse", "GT");
    letsGoo();
    closePopup();
  });
  exitService.addEventListener('click',()=>{
    sessionStorage.setItem("serviceUse","G");
    letsGoo();
    closePopup();
  })
  

  continueAny.addEventListener("click", () => {
    sessionStorage.setItem("serviceUse", "X");
    letsGoo();
    closePopup();
  });

  overlay.addEventListener("click", closePopup);
  closeBtn.addEventListener("click", closePopup);
  return openPopup;
}