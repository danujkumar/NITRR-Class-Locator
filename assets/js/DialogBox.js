import { serviceUse } from "./G-Map.js";

//Implementing the new popup service
export function createPopup(id,para,serviceRequired){
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector(".overlay");
    let closeBtn = popupNode.querySelector(".close-btn");
    let info = popupNode.querySelector(".popup-content p");
    let stairService = popupNode.querySelector("#services1");
    let liftService = popupNode.querySelector("#services2");
    let ltoiletService = popupNode.querySelector("#services3");
    let gtoiletService = popupNode.querySelector("#services4");
    let exitService = popupNode.querySelector("#services5");
    let serviceEnability = popupNode.querySelector(".popup-content .service")
    info.innerHTML = para;
    !serviceRequired ? serviceEnability.classList.add('noservice') : serviceEnability.classList.remove('noservice');
    function openPopup(){
      popupNode.classList.add('active');
    }
    function closePopup(){
      popupNode.classList.remove('active');
    }
    stairService.addEventListener('click',()=>{
      serviceUse("S");
      closePopup();
    })
    liftService.addEventListener('click',()=>{
      serviceUse("L");
      closePopup();
    })
    ltoiletService.addEventListener('click',()=>{
      serviceUse("LT");
      closePopup();
    })
    gtoiletService.addEventListener('click',()=>{
      serviceUse("GT");
      closePopup();
    })
    exitService.addEventListener('click',()=>{
      serviceUse("G");
      closePopup();
    })
    overlay.addEventListener('click',closePopup);
    closeBtn.addEventListener('click',closePopup);
    return openPopup;
  }