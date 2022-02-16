"use strict";

var gCanvas;
var gElCanvas;
var gCtx;
var gImgDB = [
    {
    }
]
var gPaintColor = "black";
var gBorderColor = "black";
var gMeme = {
  selectedImgId: 5,
  selectedLineIdx: 0,
  lines: [
    {
      txt: "I sometimes eat Falafel",
      size: 20,
      align: "left",
      color: "red",
      x: 0,
      y:0
    }
  ]
};
function drawText(x, y,text) {
  gCtx.fillStyle = gPaintColor;
  gCtx.strokeStyle = gBorderColor;
  gCtx.lineWidth = 1;
  gCtx.lineCap = "square";
  gCtx.font = "48px serif";
  gCtx.fillText(text, 10, 50);
  gCtx.strokeText(text, 10, 50);
}

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };

var gImgs = [{ id: 1, url: "img/1.jpg", keywords: ["funny", "cat"] }];


function fastBtn() {
    renderMeme();
}

function renderMeme(gMeme) {
    loadImgByIdx(5)
}

function loadImgByIdx(idx) {

}
function init() {
  console.log("app is ready");

  gElCanvas = document.querySelector("#my-canvas");
  gCtx = gElCanvas.getContext("2d");

  addCanvasListeners();
  clearCanvas();
  window.addEventListener('resize', resizeCanvas);
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

function onMove() {}
function onDown() {}
function onUp() {}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData();
  formData.append("img", imgDataUrl);

  fetch("//ca-upload.com/here/upload.php", {
    method: "POST",
    body: formData
  })
    .then((res) => res.text())
    .then((url) => {
      console.log("Got back live url:", url);
      onSuccess(url);
    })
    .catch((err) => {
      console.error(err);
    });
}

function uploadImg() {
  var gElCanvas = document.querySelector("#my-canvas");
  const imgDataUrl = gElCanvas.toDataURL("image/jpeg");

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);
    console.log(encodedUploadedImgUrl);
    document.querySelector(
      ".user-msg"
    ).innerText = `Your photo is available here: ${uploadedImgUrl}`;

    document.querySelector(".share-container").innerHTML = `
          <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             Share   
          </a>`;
  }

  doUploadImg(imgDataUrl, onSuccess);
}
function downloadCanvas(elLink) {
  const data = gElCanvas.toDataURL();
  elLink.href = data;
  elLink.download = "canvas-output.jpg";
}

function clearCanvas() {
  gCtx.beginPath();
  gCtx.rect(0, 0, gElCanvas.width, gElCanvas.height);
  gCtx.fillStyle = "white";
  gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
  gCtx.strokeStyle = "white";
  gCtx.stroke();
}

function loadImgToCanvas(imgPath) {
  var img = new Image();
  img.src = imgPath;
  img.onload = () => {
    gCtx.drawImage();
  };
}

function loadImgToCanvas(imgPath, x = 0, y = 0) {
  var img = new Image();
  img.src = imgPath;
  img.onload = () => {
    gCtx.drawImage(img, x, y);
  };
}

//for img elements
function loadElImg(elImg, x = 0, y = 0) {
  var canvasWidth = gElCanvas.width;

  var canvasHeight = gElCanvas.height;

  var elImgWidth = elImg.width;

  var elImgHeight = elImg.height;

  gElCanvas.width = elImg.width
  gElCanvas.height = elImg.height
  gCtx.drawImage(elImg, x, y);

  
}
function resizeCanvas() {
    var elCanvasCon = document.querySelector(".canvas-container")
    gElCanvas.width = elCanvasCon.offsetWidth
    gElCanvas.height = elCanvasCon.offsetHeight
}
function onSelectImg(elImg) {
  loadElImg(elImg);
}

function onChangePaintColor(ev) {
    ev.preventDefault();
    const elColorSelectorValue = document.querySelector('[name="paintColor"]').value;
    console.log(elColorSelectorValue)

    gPaintColor = elColorSelectorValue
}

function onChangeBorderColor(ev) {
    ev.preventDefault();
    const elColorSelectorValue = document.querySelector('[name="borderColor"]').value;
    console.log(elColorSelectorValue)

    gBorderColor = elColorSelectorValue
}
