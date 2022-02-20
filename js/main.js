'use strict'
function init() {
  console.log("app is ready");

  gElCanvas = document.querySelector("#my-canvas");
  gCtx = gElCanvas.getContext("2d");

  addCanvasListeners();
  clearCanvas();
  window.addEventListener("resize", resizeCanvas);
  gCurrAddPos = "up";

  renderMeme(gMeme);
  renderGallery();
  renderKeywordCloud();
  onSwitchToGallery();
}

