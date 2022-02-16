"use strict";

var gCanvas;
var gElCanvas;
var gCtx;
var gTxtSize = 16;
var gCurrImgDataUrl = null;
var gCurrPos = "up";
var gCurrLine = 0;
var gImgsDB = [
  {
    id: 1,
    src: "img/1.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 2,
    src: "img/2.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 3,
    src: "img/3.jpg",
    keywords: ["baby", "yes", "no"]
  }
];
var gPaintColor = "black";
var gBorderColor = "black";
var gMeme = {
  selectedImgId: 2,
  selectedLineIdx: 0,
  lines: [
    {
      txt: "I sometimes eat Falafel",
      size: 20,
      align: "left",
      paintColor: "red",
      borderColor: "black",
      x: 0,
      y: 0,
      pos: "up"
    },
    {
      txt: "testtttt",
      size: 50,
      align: "left",
      paintColor: "red",
      borderColor: "black",
      x: 0,
      y: 0,
      pos: "center"
    },
    {
      txt: "the bottom line",
      size: 40,
      align: "left",
      paintColor: "red",
      borderColor: "black",
      x: 0,
      y: 0,
      pos: "down"
    }
  ]
};

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
function addText() {
  var elTxtbox = document.querySelector("#meme-text");

  var text = elTxtbox.value;

  console.log({ text });
  gMeme.pos;

  drawText(0, 0, text);
  if (gCurrPos === "up") {
    drawText(10, 30, text);
    return;
  }
  if (gCurrPos === "center") {
    drawText(10, gElCanvas.height / 2, text);
    return;
  }
  if (gCurrPos === "down") {
    drawText(10, gElCanvas.height - 30, text);
    return;
  }
}

function initgMeme() {
  var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: -1,
    lines: [
      {
        txt: "",
        size: 16,
        align: null,
        color: black,
        x: 0,
        y: 0,
        pos: null
      }
    ]
  };
}
function fastBtn() {
  // renderMeme();
}
function renderMeme(meme=gMeme) {
  loadImgById(gMeme.selectedImgId, meme);
}
function renderMemeDetails(meme) {
  var txtPos;
  if (!meme) return;
  var canvasXCenter;
  var canvasYCenter;

  var currLine;
  var txtSize;
  var centerOfText;
  var txt;
  var size;
  var ctxTextMetrics;
  var alignedTextXStart;
  var paintColor;
  var borderColor;

  for (var i = 0; i < meme.lines.length; i++) {
    currLine = meme.lines[i];
    console.log(currLine);
    txt = currLine.txt;
    size = currLine.size;
    txtPos = currLine.pos;
    paintColor = currLine.paintColor
    borderColor = currLine.borderColor

    canvasXCenter = gElCanvas.width / 2;

    canvasYCenter = gElCanvas.height / 2;

    // console.log("canvasXCenter=",canvasXCenter)

    gCtx.font = `${size}px serif`;
    ctxTextMetrics = gCtx.measureText(txt);
    txtSize =
      Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
      Math.abs(ctxTextMetrics.actualBoundingBoxRight);

    centerOfText = txtSize / 2;

    // console.log(centerOfText);

    // console.log({currTxt})
    console.log("center text=", canvasXCenter - centerOfText);
    alignedTextXStart = canvasXCenter - centerOfText;

    if (txtPos === "up") {
      drawText(alignedTextXStart, 30, txt, size, paintColor, borderColor);
      continue
    }
    if (txtPos === "center") {
      drawText(alignedTextXStart, gElCanvas.height/2, txt, size, paintColor, borderColor);
      continue
    }
    if (txtPos === "down") {
      drawText(alignedTextXStart, gElCanvas.height-30, txt, size, paintColor, borderColor);
      continue
    }

  }

  // loadImgFromDataUrl(gCurrImgDataUrl, 0, 0);
}

function loadImgById(id, meme) {
  var foundImgIdx = gImgsDB.findIndex((img) => {
    return img.id === id;
  });

  if (foundImgIdx === -1) {
    return null;
  }
  // console.log({foundImgIdx});

  var foundImg = gImgsDB[foundImgIdx];

  loadImgToCanvas(foundImg.src, 0, 0, meme);
}
function init() {
  console.log("app is ready");

  gElCanvas = document.querySelector("#my-canvas");
  gCtx = gElCanvas.getContext("2d");

  addCanvasListeners();
  clearCanvas();
  window.addEventListener("resize", resizeCanvas);
  gCurrPos = "up";

  renderMeme(gMeme);
}

function onChangeTxtSize(num) {
  gTxtSize += num;
  console.log("text size=", gTxtSize);
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

function loadImgToCanvas(imgPath, x = 0, y = 0, meme) {
  var img = new Image();

  img.onload = () => {
    gCtx.drawImage(img, 0, 0);
    renderMemeDetails(meme);
  };
  img.src = imgPath;
}

function loadImgFromDataUrl(dataUrl, x = 0, y = 0) {
  var img = new Image();

  img.onload = () => {
    gCtx.drawImage(img, x, y);
    // console.log("bla200")
  };
  img.src = dataUrl;

  //   console.log("bla100");
}

//for img elements
function loadElImg(elImg, x = 0, y = 0) {
  var canvasWidth = gElCanvas.width;

  var canvasHeight = gElCanvas.height;

  var elImgWidth = elImg.width;

  var elImgHeight = elImg.height;

  gElCanvas.width = elImg.width;
  gElCanvas.height = elImg.height;
  gCtx.drawImage(elImg, x, y);
  catchCanvas();
}

function catchCanvas() {
  gCurrImgDataUrl = gElCanvas.toDataURL("image/jpeg");
}
function resizeCanvas() {
  var elCanvasCon = document.querySelector(".canvas-container");

  catchCanvas();

  //   console.log(gCurrImgDataUrl);
  clearCanvas();
  //   gElCanvas.width = elCanvasCon.offsetWidth;
  //   gElCanvas.height = elCanvasCon.offsetHeight;

  console.log("resize activated!!!");
  renderMeme(gMeme);
}

// function onSelectImg(elImg) {

//   loadElImg(elImg);
// }


function onSelectImg(id) {

  gMeme.selectedImgId = id;
  renderMeme(gMeme)
}

function onChangePaintColor(ev) {
  ev.preventDefault();
  const elColorSelectorValue = document.querySelector(
    '[name="paintColor"]'
  ).value;
  console.log(elColorSelectorValue);

  gPaintColor = elColorSelectorValue;
}

function onChangeBorderColor(ev) {
  ev.preventDefault();
  const elColorSelectorValue = document.querySelector(
    '[name="borderColor"]'
  ).value;
  console.log(elColorSelectorValue);

  gBorderColor = elColorSelectorValue;
}

function onClearCanvas() {
  clearCanvas();
}
function drawText(
  x,
  y,
  text,
  fontSize = gTxtSize,
  paintColor = gPaintColor,
  borderColor = gBorderColor
) {
  console.log("draw text");
  gCtx.fillStyle = paintColor;
  gCtx.strokeStyle = borderColor;
  gCtx.lineWidth = 1;
  gCtx.lineCap = "square";
  gCtx.font = `${fontSize}px serif`;
  // console.log(gCtx);
  gCtx.fillText(text, x, y);
  gCtx.strokeText(text, x, y);
}

function onSelectPos(elSelect) {
  var pos = elSelect.value;
  console.log(pos);
  gCurrPos = pos;
  gMeme.pos = pos;
}
