"use strict";

var gCanvas;
var gElCanvas;
var gCtx;
var gTxtSize = 16;
var gCurrImgDataUrl = null;
var gCurrAddPos = "up";
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
      family: "impact",
      paintColor: "red",
      borderColor: "black",
      x: 50,
      y: 50,
      pos: "up",
      customPos: false
    },
    {
      txt: "testtttt",
      size: 50,
      align: "center",
      paintColor: "red",
      borderColor: "black",
      x: 60,
      y: 80,
      pos: "center",
      customPos: false
    },
    {
      txt: "the bottom line",
      size: 40,
      align: "right",
      paintColor: "red",
      borderColor: "black",
      x: 100,
      y: 120,
      pos: "down",
      customPos: false
    }
  ]
};

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
function onAddText() {
  var elTxtbox = document.querySelector("#meme-text");

  var txt = elTxtbox.value;

  var size = 20;
  var family = "Impact";

  var canvasXCenter = gElCanvas.width / 2;

  var canvasYCenter = gElCanvas.height / 2;

  gCtx.font = `${size}px ${family}`;
  var ctxTextMetrics = gCtx.measureText(txt);

  var txtSize =
    Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
    Math.abs(ctxTextMetrics.actualBoundingBoxRight);

  var centerOfText = txtSize / 2;

  var alignedTextXStart = canvasXCenter - centerOfText;

  // drawText(alignedTextXStart, gElCanvas.height / 2, txt);
  var x = alignedTextXStart;
  var y = gElCanvas.height / 2;
  addLine(txt, size, "center", family, "black", "black", x, y);
  renderMeme(gMeme);
}


function addLine(
  txt,
  size = 16,
  align = center,
  family = "Impact",
  paintColor = "black",
  borderColor = "black",
  x = null,
  y = null
) {
  var line = {
    txt: txt,
    size: size,
    align: align,
    family: family,
    paintColor: paintColor,
    borderColor: borderColor,
    x: x,
    y: y,
    pos: "up",
    customPos: false
  };
  if (x !== null && y !== null) {
    line.customPos = true;
  }
  gMeme.selectedLineIdx = gMeme.lines.push(line) - 1;
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


//return a text line obj if the user clicked on one
function textClicked(pos) {
  var line;
  var sizeList;
  var txtPos;
  for (var i = 0; i < gMeme.lines.length; i++) {
    line = gMeme.lines[i];
    txtPos = getTextLineSizeList(line);
    // console.log(line)

    if (!txtPos) return
    if (pos.x > txtPos.startX && pos.x < txtPos.endX) {
      if (pos.y < txtPos.startY && pos.y > txtPos.endY) {
        console.log("clicked the selected!");

        var foundObj = {
          line:line,
          id:i
        };
        return foundObj
      }
    }
  }
    return null;
  }
  //return obj with size of width height etc
  function getTextLineSizeList(line = gMeme.lines[gMeme.selectedLineIdx]) {
    // if (gMeme.selectedLineIdx === -1) return;

    //current line in the meme's lines
    // var line = gMeme.lines[gMeme.selectedLineIdx];

    //center of the canvas x
    var canvasXCenter = gElCanvas.width / 2;

    //center of the canvas y
    var canvasYCenter = gElCanvas.height / 2;

    //measure the text how many pixels by size and font family
    gCtx.font = `${line.size}px ${line.family}`;
    var ctxTextMetrics = gCtx.measureText(line.txt);

    //text size from right to left
    var txtSize =
      Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
      Math.abs(ctxTextMetrics.actualBoundingBoxRight);

    //center of the text width
    var centerOfText = txtSize / 2;

    var startX = line.x;
    var startY = line.y;

    var endX = line.x + txtSize;
    var endY = line.y - line.size;

    //start x for text to be in the center of the canvas x
    var alignedTextXStart = canvasXCenter - centerOfText;

    var textLineSizeList = {
      canvasXCenter,
      canvasYCenter,
      ctxTextMetrics,
      txtSize,
      centerOfText,
      alignedTextXStart,
      startX,
      startY,
      endX,
      endY
    };

    return textLineSizeList;
  }


  function init() {
    console.log("app is ready");

    gElCanvas = document.querySelector("#my-canvas");
    gCtx = gElCanvas.getContext("2d");

    addCanvasListeners();
    clearCanvas();
    window.addEventListener("resize", resizeCanvas);
    gCurrAddPos = "up";

    renderMeme(gMeme);
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
    if (!gDrag) return;

    const pos = getEventPosition(ev);

    gMeme.lines[gMeme.selectedLineIdx].customPos = true;
    gMeme.lines[gMeme.selectedLineIdx].x = pos.x;
    gMeme.lines[gMeme.selectedLineIdx].y = pos.y;

    renderMeme(gMeme);
    // console.log(ev)
    // console.log(pos)
  }
  function onDown(ev) {
    // console.log("mouse down");
    const pos = getEventPosition(ev);


    console.log("on mouse down")

    // console.log("txtPos startX", txtPos.startX);
    // console.log("txtPos endX", txtPos.endX);
    // console.log("txtPos startY", txtPos.startY);
    // console.log("txtPos endY", txtPos.endY);

    // console.log("pos.x", pos.x);
    // console.log("pos.y", pos.y);

    var foundLineObj = textClicked(pos);

    if (foundLineObj === null) return;

    console.log(foundLineObj.line);
    console.log(foundLineObj);
    gMeme.selectedLineIdx = foundLineObj.id;
    gDrag = true;
    renderMeme(gMeme);
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
  if (!gDrag) return;
  gDrag = false;
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
  family,
  fontSize = gTxtSize,
  paintColor = gPaintColor,
  borderColor = gBorderColor
) {
  // console.log("draw text");
  gCtx.fillStyle = paintColor;
  gCtx.strokeStyle = borderColor;
  gCtx.lineWidth = 1;
  gCtx.lineCap = "square";
  gCtx.font = `${fontSize}px ${family}`;
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
  gCurrAddPos = pos;
  gMeme.pos = pos;
}

function onTextChangePosX(pos) {
  if (gMeme.selectedLineIdx === -1) return;
  //go by specific x y and not align var
  gMeme.lines[gMeme.selectedLineIdx].customPos = true;

  console.log(gMeme.lines[gMeme.selectedLineIdx].x);
  gMeme.lines[gMeme.selectedLineIdx].x += parseInt(pos);
  console.log(gMeme.lines[gMeme.selectedLineIdx].x);
  renderMeme(gMeme);
}
function onTextChangePosY(pos) {
  if (gMeme.selectedLineIdx === -1) return;
  //go by specific x y and not align var
  gMeme.lines[gMeme.selectedLineIdx].customPos = true;

  gMeme.lines[gMeme.selectedLineIdx].y += parseInt(pos);
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

function onAlign(dir) {
  if (gMeme.selectedLineIdx === -1) return;
  //go by align var and not specific x y
  gMeme.lines[gMeme.selectedLineIdx].customPos = false;
  gMeme.lines[gMeme.selectedLineIdx].align = dir;
  renderMeme(gMeme);
}

function onSelectFontFamily(elSelect) {
  if (gMeme.selectedLineIdx === -1) return;
  var family = elSelect.value;
  gMeme.lines[gMeme.selectedLineIdx].family = family;
  renderMeme(gMeme);
  console.log(gMeme.lines[gMeme.selectedLineIdx].family);
}

function onChangeTxtSize(num) {
  if (gMeme.selectedLineIdx === -1) return;
  gMeme.lines[gMeme.selectedLineIdx].size += parseInt(num);
  console.log("text size=", gMeme.lines[gMeme.selectedLineIdx].size);
  renderMeme(gMeme);
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
function onDeleteLine() {
  if (gMeme.selectedLineIdx === -1) return;
  var deleted = gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  console.log("deleted=", deleted);
  renderMeme(gMeme);
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
  var family;
  for (var i = 0; i < meme.lines.length; i++) {
    line = meme.lines[i];
    // console.log(line);
    txt = line.txt;
    size = line.size;
    txtPos = line.align;
    paintColor = line.paintColor;
    borderColor = line.borderColor;
    family = line.family;

    canvasXCenter = gElCanvas.width / 2;

    canvasYCenter = gElCanvas.height / 2;

    gCtx.font = `${size}px ${family}`;
    ctxTextMetrics = gCtx.measureText(txt);

    txtSize =
      Math.abs(ctxTextMetrics.actualBoundingBoxLeft) +
      Math.abs(ctxTextMetrics.actualBoundingBoxRight);

    centerOfText = txtSize / 2;

    alignedTextXStart = canvasXCenter - centerOfText;

    // if (txtPos === "up") {
    //   x = alignedTextXStart;
    //   y = 30
    //   if (line.selectedLineIdx === i) {
    //     drawRectEmpty(x - 5, y - 5,txtSize, 40)
    //   }
    //   drawText(x, y, txt, size, paintColor, borderColor);
    // }

    if (line.customPos === false) {
      // console.log("customPos= false i=", i);
      if (txtPos === "center") {
        x = alignedTextXStart;
        y = line.y;

        gMeme.lines[i].x = x;
        gMeme.lines[i].y = y;
      }
      if (txtPos === "left") {
        x = 10;
        y = line.y;

        gMeme.lines[i].x = x;
        gMeme.lines[i].y = y;
      }
      if (txtPos === "right") {
        x = gElCanvas.width - txtSize - 15;
        y = line.y;

        gMeme.lines[i].x = x;
        gMeme.lines[i].y = y;
      }
    } else {
      x = line.x;
      y = line.y;
    }
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
    drawText(x, y, txt, family, size, paintColor, borderColor);
    if (meme.selectedLineIdx === i) {
      // console.log("foundddd---------------------");

      drawRectEmpty(x - 5, y + 10, txtSize + 15, -(size + 15));
    }
    // meme.lines[i].x = x;
    // meme.lines[i].y = x;
  }

  // loadImgFromDataUrl(gCurrImgDataUrl, 0, 0);
}