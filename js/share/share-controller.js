"use strict";

function onCloseShareDialog() {
  document.querySelector(".share-box").style.display = "none";
}
function onOpenShareDialog() {
  document.querySelector(".share-box").style.display = "block";
}
function onUploadCanvas() {
  setMemeProperty("selectedLineIdx",-1)
  gUploadMode = true;
  renderMeme();
}

function onDownloadCanvas() {
  setMemeProperty("selectedLineIdx",-1)

  gDownloadMode = true;

  //render again without "selection" of a line
  renderMeme();
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
