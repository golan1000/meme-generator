"use strict";

var gCanvas;
var gElCanvas;
var gCtx;
var gTxtSize = 16;
var gCurrImgDataUrl = null;
var gCurrAddPos = "up";
var gSelectedLineIdx = 0;
var gDrag = false;
var gKeywordSearchCountMap = [];
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
  },
  {
    id: 4,
    src: "img/4.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 5,
    src: "img/5.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 6,
    src: "img/6.jpg",
    keywords: ["baby", "baba", "no"]
  },
  {
    id: 7,
    src: "img/7.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 8,
    src: "img/8.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 9,
    src: "img/9.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 10,
    src: "img/10.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 11,
    src: "img/11.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 12,
    src: "img/12.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 13,
    src: "img/13.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 14,
    src: "img/14.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 15,
    src: "img/15.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 16,
    src: "img/16.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 17,
    src: "img/17.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 18,
    src: "img/18.jpg",
    keywords: ["baby", "yes", "no"]
  }
];

var gCleanDownloadVersion = null;
var gTouchEvs = ["touchstart", "touchmove", "touchend"];
var gPaintColor = "white";
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
      paintColor: "white",
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

    if (!txtPos) return;
    if (pos.x > txtPos.startX && pos.x < txtPos.endX) {
      if (pos.y < txtPos.startY && pos.y > txtPos.endY) {
        console.log("clicked the selected!");

        var foundObj = {
          line: line,
          id: i
        };
        return foundObj;
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
  renderGallery();
  onSwitchToGallery();
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
  // ev.preventDefault();
  // console.log("mouse move")
  const pos = getEventPosition(ev);
  if (gDrag) {
    gMeme.lines[gMeme.selectedLineIdx].customPos = true;
    gMeme.lines[gMeme.selectedLineIdx].x = pos.x;
    gMeme.lines[gMeme.selectedLineIdx].y = pos.y;
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
  // console.log(ev)
  // console.log(pos)
}
function onDown(ev) {
  ev.preventDefault();
  // console.log("mouse down");
  const pos = getEventPosition(ev);

  // console.log("on mouse down");

  var foundLineObj = textClicked(pos);

  if (foundLineObj === null) return;

  gMeme.selectedLineIdx = foundLineObj.id;
  gDrag = true;
  renderMeme(gMeme);
  gElCanvas.parentElement.classList.add("grabbable");
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
  gElCanvas.parentElement.classList.remove("grabbable");
  const pos = getEventPosition(ev);
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
function onDownloadCanvas(elLink) {
  gMeme.selectedLineIdx = -1;
  renderMeme(gMeme);
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
    console.log("img height width", img.height, img.width);

    // //adjust canvas to img size
    // if (gElCanvas.width > img.width) gElCanvas.width = img.width
    // if (gElCanvas.height > img.height) gElCanvas.height = img.height

    // var elMenu = document.querySelector(".menu").height = gElCanvas.height

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
  // var elCanvasCon = document.querySelector(".canvas-container");

  // // catchCanvas();
  // // clearCanvas();

  // if (window.innerWidth < 400) {
  // gElCanvas.width = document.querySelector(".canvas-container").offsetWidth;
  // console.log("to 100% w")
  // } else {
  //   gElCanvas.width = '400'
  //   console.log("to 400 w")
  // }
  // if (window.innerHeight < 400) {
  //   console.log("to 100% h")
  //   gElCanvas.height = document.querySelector(".canvas-container").offsetHeight
  // } else {
  //   gElCanvas.height = '400'
  //   console.log("to 400 h")
  // }
  console.log("resize activated!!!");
  renderMeme(gMeme);
}

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

    if (line.customPos === false) {
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

    drawText(x, y, txt, family, size, paintColor, borderColor);
    gCleanDownloadVersion = gElCanvas.toDataURL();

    if (meme.selectedLineIdx === i) {
      drawRectEmpty(x - 5, y + 10, txtSize + 15, -(size + 15));
    }
  }
}

function saveCanvasWithoutMark(data) {}

function renderGallery(imgsHTMLStr = createGalleryHTML(gImgsDB)) {
  var elGalleryCon = document.querySelector(".gallery-layout");

  elGalleryCon.innerHTML = imgsHTMLStr;
}
function createGalleryHTML(imgsDB = gImgsDB) {
  var strHTMLItems = imgsDB.map((img) => {
    // console.log({img})
    var str = `<img class="galleryImg" id="${img.id}" onclick="onSelectImg(${img.id})" src="img/${img.id}.jpg"/>`;
    return str;
  });

  var strHTML = strHTMLItems.join(" ");

  return strHTML;
}

function onSwitchToGallery() {
  var elMemeEdit = document.querySelector(".meme-edit-con");

  elMemeEdit.style.display = "none";

  var elGallery = document.querySelector(".gallery-layout-con");

  elGallery.style.display = "block";
}

function onSwitchToMeme() {
  var elMemeEdit = document.querySelector(".meme-edit-con");

  elMemeEdit.style.display = "block";

  var elGallery = document.querySelector(".gallery-layout-con");

  elGallery.style.display = "none";
}

function onChangeSearchKeyword(elDatalist) {
  console.log(elDatalist);
  console.log(elDatalist.value);
  var foundImgs = getPicturesByKeyword(elDatalist.value);
  if (foundImgs.length !== 0) {
    console.log(foundImgs);
    var strHTML = createGalleryHTML(foundImgs);

    renderGallery(strHTML);
  }
}

//returns HTML
function getPicturesByKeyword(keyword) {
  var elements = gImgsDB.filter((img) => {
    var words = img.keywords;
    return words.includes(keyword);
  });

  return elements;
}

function updateKeywordMap() {
  var img;
  var keyword;
  var listOfWords = [];
  gKeywordSearchCountMap = {};
  for (var i = 0; i < gImgsDB.length; i++) {
    img = gImgsDB[i];
    for (var j = 0; j < img.keywords.length; j++) {
      keyword = img.keywords[j];
      listOfWords.push(keyword);
      if (!gKeywordSearchCountMap[keyword]) {
        gKeywordSearchCountMap[keyword] = 1;
      } else {
        gKeywordSearchCountMap[keyword]++;
      }
    }
  }
  console.log({ listOfWords });
  listOfWords = new Set(listOfWords);
  console.log({ listOfWords });
  console.log("listOfWords.length", listOfWords.size);
  console.log({ gKeywordSearchCountMap });
  for (var keyword of listOfWords) {
    console.log("word = ", keyword, " occur=", gKeywordSearchCountMap[keyword]);
  }
}

function findMaxWordOccur() {
  var keyword;
  var max = -Infinity;
  var maxWord = null;
  var currValue;
  for (var i = 0; i < Object.keys(gKeywordSearchCountMap).length; i++) {
    keyword = Object.keys(gKeywordSearchCountMap)[i];
    currValue = gKeywordSearchCountMap[keyword];
    console.log(currValue);
    if (currValue > max) {
      max = currValue;
      maxWord = keyword;
    }
  }
  return { max, maxWord}
}


