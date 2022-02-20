"use strict";
var gSelectedLineIdx = 0;
var gCleanDownloadVersion = null;
var gUploadMode = false;
var gDownloadMode = false;

var gMeme = {
  selectedImgId: 2,
  selectedLineIdx: 0,
  lines: [
    {
      txt: "I sometimes eat Falafel",
      size: 20,
      align: "left",
      family: "Impact",
      paintColor: "red",
      borderColor: "black",
      x: 87,
      y: 86,
      pos: "up",
      customPos: true
    },
    {
      txt: "With Thina",
      size: 71,
      family: "Arial",
      align: "center",
      paintColor: "#0af512",
      borderColor: "black",
      x: 82,
      y: 433,
      pos: "center",
      customPos: true
    },
    {
      txt: "tell me more",
      size: 40,
      align: "right",
      family: "Verdana",
      paintColor: "white",
      borderColor: "black",
      x: 125,
      y: 233,
      pos: "down",
      customPos: true
    }
  ]
};

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
  return gMeme.selectedLineIdx;
}

//return a text line obj if the user clicked on one
function textClicked(pos) {
  var line;
  var sizeList;
  var txtPos;
  for (var i = 0; i < gMeme.lines.length; i++) {
    line = gMeme.lines[i];
    txtPos = getTextLineSizeList(line);

    if (!txtPos) return;
    if (pos.x > txtPos.startX && pos.x < txtPos.endX) {
      if (pos.y < txtPos.startY && pos.y > txtPos.endY) {
        //the user clicked on area of text, he want to select it
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
    text: line.txt,
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

//v
//delete selected line
function deleteLine() {
  if (gMeme.selectedLineIdx === -1) return;
  var deleted = gMeme.lines.splice(gMeme.selectedLineIdx, 1);
  gMeme.selectedLineIdx = -1;
}

function getCurrLineIdx() {
  return gMeme.selectedLineIdx;
}
function setCurrLineIdx(num) {
  gMeme.selectedLineIdx = num;
}
//v
//resize font size of selected line
function changeTxtSize(num) {
  if (gMeme.selectedLineIdx === -1) return;
  gMeme.lines[gMeme.selectedLineIdx].size += parseInt(num);
  renderMeme();
}

function setMemeLineProperty(lineNum, property, value) {
  gMeme.lines[lineNum][property] = value;
}

function getMemeLineProperty(lineNum, property) {
  return gMeme.lines[lineNum][property];
}
function getMemeProperty(property) {
  return gMeme[property];
}
function setMemeProperty(property,value) {
  gMeme[property] = value;
}
function getMeme() {
  return gMeme;
}