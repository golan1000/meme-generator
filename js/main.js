"use strict";

var gCanvas;
var gElCanvas;
var gCtx;
var gTxtSize = 16;
var gCurrImgDataUrl = null;
var gCurrPos = "up";
var gSelectedLineIdx = 0;
var gDrag = false;
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

var gTouchEvs = ["touchstart", "touchmove", "touchend"];
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
      x: 50,
      y: 50,
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
  var size = 50;
  var txt = "blablabla";
  gCtx.font = `${size}px serif`;
  var ctxTextMetrics = gCtx.measureText(txt);

  drawText(20, 20, txt, size);
  // txtSize =
  //   Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
  //   Math.abs(ctxTextMetrics.actualBoundingBoxRight);
  var pos = {
    xTop: Math.abs(ctxTextMetrics.actualBoundingBoxLeft)
  };
}
function renderMeme(meme = gMeme) {
  loadImgById(gMeme.selectedImgId, meme);
}
function renderMemeDetails(meme) {
  var txtPos;
  if (!meme) return;
  var canvasXCenter;
  var canvasYCenter;

  var x;
  var y;
  var line;
  var txtSize;
  var centerOfText;
  var txt;
  var size;
  var ctxTextMetrics;
  var alignedTextXStart;
  var paintColor;
  var borderColor;

  for (var i = 0; i < meme.lines.length; i++) {
    line = meme.lines[i];
    console.log(line);
    txt = line.txt;
    size = line.size;
    txtPos = line.pos;
    paintColor = line.paintColor;
    borderColor = line.borderColor;

    canvasXCenter = gElCanvas.width / 2;

    canvasYCenter = gElCanvas.height / 2;

    // console.log("canvasXCenter=",canvasXCenter)

    gCtx.font = `${size}px Impact`;
    ctxTextMetrics = gCtx.measureText(txt);
    // console.log("text width=",gCtx.measureText(txt).width)
    // console.log({size})
    // console.log({ctxTextMetrics})
    txtSize =
      Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
      Math.abs(ctxTextMetrics.actualBoundingBoxRight);

    //   console.log({txtSize})
    // centerOfText = txtSize / 2;

    // console.log(centerOfText);

    // console.log({currTxt})
    // console.log("center text=", canvasXCenter - centerOfText);
    alignedTextXStart = canvasXCenter - centerOfText;

    // if (txtPos === "up") {
    //   x = alignedTextXStart;
    //   y = 30
    //   if (line.selectedLineIdx === i) {
    //     drawRectEmpty(x - 5, y - 5,txtSize, 40)
    //   }
    //   drawText(x, y, txt, size, paintColor, borderColor);
    // }
    // if (txtPos === "center") {
    //   x = alignedTextXStart;
    //   y = gElCanvas.height / 2
    //   if (line.selectedLineIdx === i) {
    //     drawRectEmpty(x - 5, y - 5,txtSize, 40)
    //   }
    //   drawText(
    //     x,
    //     y,
    //     txt,
    //     size,
    //     paintColor,
    //     borderColor
    //   );
    // }
    // if (txtPos === "down") {
    //   x = alignedTextXStart;
    //   y = gElCanvas.height - 30

    //   if (line.selectedLineIdx === i) {
    //     drawRectEmpty(alignedTextXStart - 5, y + 5,txtSize, 40)
    //   }
    //   drawText(
    //     x,
    //     y,
    //     txt,
    //     size,
    //     paintColor,
    //     borderColor
    //   );
    // }
    drawText(line.x, line.y, txt, size, paintColor, borderColor);
    if (meme.selectedLineIdx === i) {
      console.log("foundddd---------------------")
      console.log(txtSize)
      drawRectEmpty(line.x - 10 , line.y + 10, txtSize + 20, -(size + 15));
    }
    // meme.lines[i].x = x;
    // meme.lines[i].y = x;
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

function onMove(ev) {
  // console.log("mouse move")
  const pos = getEventPosition(ev);
  // console.log(ev)
  // console.log(pos)
}
function onDown(ev) {
  // console.log("mouse down");
  const pos = getEventPosition(ev);
  // console.log(ev);
  // console.log(pos);
}

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
function onUp(ev) {
  // console.log("mouse up")
  const pos = getEventPosition(ev);
  // console.log(ev)
  // console.log(pos)
}

function getEventPosition(ev) {
  var pos = {
    x: ev.offsetX,
    y: ev.offsetY
  };
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault();
    ev.changedToTouches[0];
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
    };
  }
  return pos;
}

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
function drawRect(x, y, lenX, lenY) {
  gCtx.beginPath();
  gCtx.rect(x, y, lenX, lenY);
  gCtx.fillStyle = gPaintColor;
  gCtx.fillRect(x, y, lenX, lenY);
  gCtx.strokeStyle = gBorderColor;
  gCtx.stroke();
}

function drawRectEmpty(x, y, lenX, lenY) {
  gCtx.beginPath();
  gCtx.rect(x, y, lenX, lenY);
  gCtx.strokeStyle = "black";
  gCtx.stroke();
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
  renderMeme(gMeme);
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
  gCtx.font = `${fontSize}px Impact`;
  // console.log(gCtx);
  gCtx.fillText(text, x, y);
  gCtx.strokeText(text, x, y);

  // var ctxTextMetrics = gCtx.measureText(text);
  // console.log("text width=============",gCtx.measureText(text).width)
  // console.log({fontSize})
  // console.log({ctxTextMetrics})
  // var txtSize =
  //   Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
  //   Math.abs(ctxTextMetrics.actualBoundingBoxRight);
  //   console.log({txtSize})

}

function onSelectPos(elSelect) {
  var pos = elSelect.value;
  console.log(pos);
  gCurrPos = pos;
  gMeme.pos = pos;
}

function onTextChangePosX(pos) {
  gMeme.lines[gSelectedLineIdx].x += parseInt(pos);
  renderMeme(gMeme);
}
function onTextChangePosY(pos) {
  gMeme.lines[gSelectedLineIdx].y += parseInt(pos);
  renderMeme(gMeme);
}

function onChangeSelectedLine() {
  if (gMeme.selectedLineIdx >= 2) {
    gMeme.selectedLineIdx = 0;
  } else {
    gMeme.selectedLineIdx += 1;
  }

  renderMeme(gMeme);
}
