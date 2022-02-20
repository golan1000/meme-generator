"use strict";

function onCloseShareDialog() {
  document.querySelector(".share-box").style.display = "none";
}
function onOpenShareDialog() {
  document.querySelector(".share-box").style.display = "block";
}
function onUploadCanvas() {
  gMeme.selectedLineIdx = -1;
  gUploadMode = true;
  renderMeme(gMeme);
}

function onDownloadCanvas() {
  gMeme.selectedLineIdx = -1;

  // elLink.href = data;
  // elLink.download = "canvas-output.jpg";

  gDownloadMode = true;

  //render again without "selection" of a line

  renderMeme(gMeme);

  // document.body.appendChild(a);
}

//v
function renderShareFB(strHTML) {
  var elFBshare = document.querySelector(".share-fb-con");

  elFBshare.innerHTML = strHTML;
}
//v
function renderUploadedLink(str) {
  var elUploadedLink = document.querySelector(".messages");

  elUploadedLink.innerText = str;
}
