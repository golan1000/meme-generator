"use strict";

//return pos element like this
// pos = {
//   xTop: 0,
//   yTop: 0,
//   xBottom: 60,
//   yBottom: 60,
// }
function getTextSizePos(meme) {
  gCtx.font = `${size}px serif`;
  var ctxTextMetrics = gCtx.measureText(txt);
  // txtSize =
  //   Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
  //   Math.abs(ctxTextMetrics.actualBoundingBoxRight);
  var pos = {
    xTop: Math.abs(ctxTextMetrics.actualBoundingBoxLeft)
  };
}

function initGelCanvas() {
  gElCanvas = document.querySelector("#my-canvas");
}
function getCanvas() {
  return gElCanvas;
}

function getCanvasData() {
  const imgDataUrl = gElCanvas.toDataURL("image/jpeg");
  return imgDataUrl;
}

function addCanvasListeners() {
  //mouse events
  gElCanvas.addEventListener("mousemove", onMove);
  gElCanvas.addEventListener("mousedown", onDown);
  gElCanvas.addEventListener("mouseup", onUp);

  //touch events
  gElCanvas.addEventListener("touchmove", onMove);
  gElCanvas.addEventListener("touchstart", onDown);
  gElCanvas.addEventListener("touchend", onUp);
}

function onClickMobileMenu() {
  document.querySelector(".mobile-menu-con").style.display = "block";
}

function onCloseMobileMenu() {
  document.querySelector(".mobile-menu-con").style.display = "none";
}
function onSwitchToGallery() {
  var elMemeTab = document.querySelector(".meme-edit-con");

  elMemeTab.style.display = "none";

  var elGalleryTab = document.querySelector(".gallery-layout-con");

  elGalleryTab.style.display = "block";

  var elAboutTab = document.querySelector(".about-con");

  elAboutTab.style.display = "none";
}

function onSwitchToMeme() {
  var elMemeTab = document.querySelector(".meme-edit-con");

  elMemeTab.style.display = "block";

  var elGalleryTab = document.querySelector(".gallery-layout-con");

  elGalleryTab.style.display = "none";

  var elAboutTab = document.querySelector(".about-con");

  elAboutTab.style.display = "none";
}

function onSwitchToAbout() {
  var elMemeTab = document.querySelector(".meme-edit-con");

  elMemeTab.style.display = "none";

  var elGalleryTab = document.querySelector(".gallery-layout-con");

  elGalleryTab.style.display = "none";

  var elAboutTab = document.querySelector(".about-con");

  elAboutTab.style.display = "block";
}
