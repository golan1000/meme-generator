'use strict'
function init() {
  console.log("app is ready");

  initGelCanvas()
  gCtx = gElCanvas.getContext("2d");

  addCanvasListeners();
  clearCanvas();
  window.addEventListener("resize", resizeCanvas);
  gCurrAddPos = "up";

  renderMeme();
  renderGallery();
  renderKeywordCloud();
  onSwitchToGallery();
}
