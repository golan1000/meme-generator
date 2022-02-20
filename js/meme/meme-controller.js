"use strict";
var gElCanvas;
var gCtx;
var gDrag = false;
// var gTxtSize = 16;
var gCurrImgDataUrl = null;
var gCurrAddPos = "up";
var gImgTopX = null;
var gImgTopY = null;
var gTouchEvs = ["touchstart", "touchmove", "touchend"];
// var gPaintColor = "white";
// var gBorderColor = "black";

//v
function onDeleteLine() {
  deleteLine();
  renderMeme();
}
//v
function onChangeTxtSize(num) {
  changeTxtSize(num);
  renderMeme(gMeme);
}

function renderMemeDetails(meme) {
  var txtPos;
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

    console.log(line)
    //first line center up if customPos false
    if (i === 0 && line.customPos === false) {

      x = alignedTextXStart;
      y = 20 + size;

      setMemeLineProperty(i,'x',x)
      setMemeLineProperty(i,'y',y)
    }

    //second line center down
    if (i === 1 && line.customPos === false) {
      x = alignedTextXStart;
      y = gElCanvas.height - 20 - size;

      setMemeLineProperty(i,'x',x)
      setMemeLineProperty(i,'y',y)
    } 
    if (line.customPos === false && i > 1) {
      if (txtPos === "center") {
        x = alignedTextXStart;
        y = line.y;

        setMemeLineProperty(i,'x',x)
        setMemeLineProperty(i,'y',y)
      }
      if (txtPos === "left") {
        x = 10;
        y = line.y;

        setMemeLineProperty(i,'x',x)
        setMemeLineProperty(i,'y',y)
      }
      if (txtPos === "right") {
        x = gElCanvas.width - txtSize - 15;
        y = line.y;

        setMemeLineProperty(i,'x',x)
        setMemeLineProperty(i,'y',y)
      }
    } else {
      x = line.x;
      y = line.y;
    }

    drawText(x, y, txt, family, size, paintColor, borderColor);

    if (meme.selectedLineIdx === i) {
      //if download mode, draw "selection" on line after 5 secs,
      //else, do it now
      if (gDownloadMode === true || gUploadMode === true) {
        setTimeout(function () {
          drawRectEmpty(x - 5, y + 10, txtSize + 15, -(size + 15));
          gDownloadMode = false;
          gUploadMode = false;
        }, 5000);
      } else {
        drawRectEmpty(x - 5, y + 10, txtSize + 15, -(size + 15));
      }
    }
  }

  //download if download mode is on
  if (gDownloadMode === true) {
    gCleanDownloadVersion = gElCanvas.toDataURL();
    downloadCanvas()
  }
  //upload if upload mode is on
  if (gUploadMode === true) {
    uploadImg();
    
  }
}

//v
function downloadCanvas() {
    var tempLink = document.createElement("a");
    tempLink.title = "my title text";
    tempLink.href = gCleanDownloadVersion;
    tempLink.classList.add("temp-link");
    tempLink.download = "canvas-output.jpg";
    tempLink.click();
    gDownloadMode = false;
}

function loadImgById(id, meme) {
  var foundImgIdx = gImgsDB.findIndex((img) => {
    return img.id === id;
  });

  if (foundImgIdx === -1) {
    return null;
  }

  var foundImg = gImgsDB[foundImgIdx];

  loadImgToCanvas(foundImg.src, 0, 0, meme);
}
function onChangeSelectedLine() {
    var idx = getCurrLineIdx()
  if (idx === gMeme.lines.length) {
    idx = 0;
  } else {
    setCurrLineIdx(idx+1);
  }
  renderMeme();
}
function setInputAsSelectedLine(text) {
  var elTextbox = document.querySelector("#meme-text");

  elTextbox.value = text;
}

function saveCanvasWithoutMark(data) {}

function onAlign(dir) {
    var idx = getCurrLineIdx()
  if (idx === -1) return;
  //go by align var and not specific x y
  gMeme.lines[idx].customPos = false;
  gMeme.lines[idx].align = dir;
  renderMeme();
}

function onSelectFontFamily(elSelect) {
    var idx = getCurrLineIdx()
  if (idx === -1) return;
  var family = elSelect.value;
  gMeme.lines[idx].family = family;
  renderMeme();
}

function onTextChangePosX(pos) {
    var idx = getCurrLineIdx()
  if (idx === -1) return;
  //go by specific x y and not align var
  gMeme.lines[idx].customPos = true;

  gMeme.lines[idx].x += parseInt(pos);

  renderMeme();
}
function onTextChangePosY(pos) {
    var idx = getCurrLineIdx()
  if (idx === -1) return;
  //go by specific x y and not align var
  gMeme.lines[idx].customPos = true;

  gMeme.lines[idx].y += parseInt(pos);
  renderMeme();
}

function onChangePaintColor(ev) {
  ev.preventDefault();
  const elColorSelectorValue = document.querySelector(
    '[name="paintColor"]'
  ).value;

//   gPaintColor = elColorSelectorValue;

  //update if there is current selected line
  var idx = getCurrLineIdx()
  if (idx !== -1) {
    gMeme.lines[idx].paintColor = elColorSelectorValue;
    renderMeme();
  }
}

function onChangeBorderColor(ev) {
  ev.preventDefault();
  const elColorSelectorValue = document.querySelector(
    '[name="borderColor"]'
  ).value;
//   gBorderColor = elColorSelectorValue;

  //update if there is current selected line
  var idx = getCurrLineIdx()
  if (idx !== -1) {
    gMeme.lines[idx].borderColor = elColorSelectorValue;
    renderMeme(gMeme);
  }
}

function catchCanvas() {
  gCurrImgDataUrl = gElCanvas.toDataURL("image/jpeg");
}

function resizeCanvas() {
  var newCanvasSize = getNewCanvasSize();

  changeToGoodView();
  renderMeme();
}

function renderMeme(meme = gMeme) {
  loadImgById(gMeme.selectedImgId, meme);
}

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
function changeToGoodView() {
  var newCanvasSize = getNewCanvasSize();

  if (window.innerWidth < 650) {
    document.querySelector(".menu-button-con").style.display = "flex";
    document.querySelector(".header-menu-con").style.display = "none";

    document.querySelector(".meme-edit").style.flexDirection = "column";
    gElCanvas.width = newCanvasSize.x;
    gElCanvas.height = newCanvasSize.y;
  }
  if (window.innerWidth > 650) {
    document.querySelector(".menu-button-con").style.display = "none";
    document.querySelector(".header-menu-con").style.display = "flex";

    document.querySelector(".meme-edit").style.flexDirection = "row";
    gElCanvas.width = newCanvasSize.x;
    gElCanvas.height = newCanvasSize.y;
  }
}
function getNewCanvasSize() {
  var x;
  var y;
  var pos = getCanvasContainerSize();

  if (window.innerWidth < 900) {
    x = window.innerWidth - 100;
    y = x;
  } else {
    x = 500;
    y = x;
  }

  if (gImgTopX) {
    if (gImgTopX < x) {
      x = gImgTopX;
      y = x;
    }
  }

  var newSize = { x: x, y: y };

  return newSize;
}
function clearCanvas() {
  gCtx.beginPath();
  gCtx.rect(0, 0, gElCanvas.width, gElCanvas.height);
  gCtx.fillStyle = "white";
  gCtx.fillRect(0, 0, gElCanvas.width, gElCanvas.height);
  gCtx.strokeStyle = "white";
  gCtx.stroke();
}
//current load
function loadImgToCanvas(imgPath, x = 0, y = 0, meme) {
  var img = new Image();

  img.onload = () => {
    gImgTopX = img.width;
    gImgTopY = img.height;

    var newCanvasSize = getNewCanvasSize();

    gElCanvas.width = newCanvasSize.x;
    gElCanvas.height = newCanvasSize.y;

    gCtx.drawImage(img, 0, 0);
    renderMemeDetails(meme);
  };
  img.src = imgPath;
}

function loadImgFromDataUrl(dataUrl, x = 0, y = 0) {
  var img = new Image();

  img.onload = () => {
    gCtx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}

function getCanvasContainerSize() {
  var elCanvasCon = gElCanvas.parentElement;

  if (elCanvasCon.offsetWidth === 0) {
    var elCanvasCon = document.querySelector(".meme-edit");
  }

  var pos = {
    x: elCanvasCon.offsetWidth,
    y: elCanvasCon.offsetHeight
  };
  return pos;
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

function onClearCanvas() {
  clearCanvas();
}
//mouse handling funcs
function onMove(ev) {
  ev.preventDefault();
  const pos = getEventPosition(ev);
  var idx = getCurrLineIdx()
  if (gDrag) {
    gMeme.lines[idx].customPos = true;
    gMeme.lines[idx].x = pos.x;
    gMeme.lines[idx].y = pos.y;
    gElCanvas.parentElement.classList.add("grabbable");
    renderMeme(gMeme);
    return;
  }
  if (!gDrag) {
    var foundLineObj = textClicked(pos);

    if (foundLineObj === null) {
      gElCanvas.parentElement.style.cursor = "default";
    } else {
      gElCanvas.parentElement.style.cursor = "grab";
    }
  }
}
function onDown(ev) {
  ev.preventDefault();
  const pos = getEventPosition(ev);

  var foundLineObj = textClicked(pos);

  if (foundLineObj === null) {
    setCurrLineIdx(-1);
    renderMeme();
    clearMemeTextbox();

    return;
  }
  //update selected line
  setCurrLineIdx(foundLineObj.id);

  //update the meme input textbox

  var elTextbox = document.querySelector("#meme-text");
  elTextbox.value = foundLineObj.line.txt;
  elTextbox.focus();

  var elFontFamily = document.querySelector("#ffamily");
  elFontFamily.value = foundLineObj.line.family;

  gDrag = true;
  renderMeme(gMeme);
  gElCanvas.parentElement.classList.add("grabbable");
}
function clearMemeTextbox() {
  document.querySelector("#meme-text").value = "";
}
function onUp(ev) {
  if (!gDrag) return;
  gDrag = false;

  gElCanvas.parentElement.classList.remove("grabbable");
  const pos = getEventPosition(ev);
}

function updateMemeTextbox() {
      var idx = getCurrLineIdx()
  if (idx === -1) {
    document.querySelector("#meme-text").value = "";
  } else {
      var text = gMeme.lines[idx].txt;
  }
}

function onTextInput(elTextbox) {
  var text = elTextbox.value;

  var selectedLine = getCurrLineIdx()
  console.log({selectedLine})
  if (selectedLine === -1) {
    console.log('none!!!');
 
    var family = document.querySelector('#ffamily').value
    var paintColor = document.querySelector('#paintColor').value
    var borderColor = document.querySelector('#borderColor').value
    var lineID = addLine('',25,'center',family,paintColor,borderColor,gElCanvas.width/2,gElCanvas.height/2)
    setCurrLineIdx(lineID)

  } else {
    gMeme.lines[selectedLine].txt = text;
  }
  renderMeme(gMeme);
}

//draw funcs
function drawText(
  x,
  y,
  text,
  family,
  fontSize = 24,
  paintColor = "white",
  borderColor = "black"
) {
  gCtx.fillStyle = paintColor;
  gCtx.strokeStyle = borderColor;
  gCtx.lineWidth = 1;
  gCtx.lineCap = "square";
  gCtx.font = `${fontSize}px ${family}`;

  gCtx.fillText(text, x, y);
  gCtx.strokeText(text, x, y);
}
function drawRectEmpty(x, y, lenX, lenY) {
  gCtx.beginPath();
  gCtx.lineWidth = 2;
  gCtx.rect(x, y, lenX, lenY);
  gCtx.strokeStyle = "red";
  gCtx.stroke();
}

function onTextInputFocusOut() {
  var elTextbox = document.querySelector("#meme-text");
  console.log("focus out ");
  var text = elTextbox.value;
  var idx = getCurrLineIdx()
  if (idx !== -1) {
    if (text === "") {
      deleteLine();
      gMeme.selectedLineIdx = -1;
      clearMemeTextbox();
      renderMeme();
    }
  }
}
