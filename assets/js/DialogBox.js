//Implementing the new popup service
export function createPopup(id,para){
    let popupNode = document.querySelector(id);
    let overlay = popupNode.querySelector(".overlay");
    let closeBtn = popupNode.querySelector(".close-btn");
    let info = popupNode.querySelector(".popup-content p");
    info.innerHTML = para;
    function openPopup(){
      popupNode.classList.add('active');
    }
    function closePopup(){
      popupNode.classList.remove('active');
    }
    overlay.addEventListener('click',closePopup);
    closeBtn.addEventListener('click',closePopup);
    return openPopup;
  }