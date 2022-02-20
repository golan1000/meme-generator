"use strict";


function onClickCloudKeyword(keyword) {
  var foundImgs = getPicturesByKeyword(keyword);
  if (foundImgs.length !== 0) {
    var strHTML = createGalleryHTML(foundImgs);

    renderGallery(strHTML);
  }
}

function renderKeywordCloud() {
  var elKeywordCloud = document.querySelector(".search-keyword-cloud");

  elKeywordCloud.innerHTML = getKeywordCloudHTML();
}
function renderGallery(imgsHTMLStr = createGalleryHTML()) {
  var elGalleryCon = document.querySelector(".gallery-layout");

  elGalleryCon.innerHTML = imgsHTMLStr;
}
function createGalleryHTML(imgsDB = getImgsDB()) {
  var strHTMLItems = imgsDB.map((img) => {
    var str = `<img class="galleryImg" id="${img.id}" onclick="onSelectImg(${img.id})" src="img/${img.id}.jpg"/>`;

    return str;
  });

  var strHTML = strHTMLItems.join(" ");

  return strHTML;
}


//update the droplist of the keywords on gallery page
function updateKeywordDropList() {
  var img;
  var listOfWords = updateKeywordMap()
  //make it unique
  listOfWords = new Set(listOfWords);
  //to regular array
  listOfWords = Array.from(listOfWords);

  var elOptions = document.querySelector(".cloud-options");
  var options = "";

  //add items to the dropdown list
  for (var i = 0; i < listOfWords.length; i++) {
    keyword = listOfWords[i];
    options += `<option value="${keyword}"></option>`;
  }

  elOptions.innerHTML = options;
}

function onChangeSearchKeyword(elDatalist) {
  var foundImgs = getPicturesByKeyword(elDatalist.value);

  var strHTML = createGalleryHTML(foundImgs);

  renderGallery(strHTML);
}

function findMaxWordOccur() {
  updateKeywordMap();
  var keyword;
  var max = -Infinity;
  var maxWord = null;
  var currValue;
  for (var i = 0; i < Object.keys(gKeywordSearchCountMap).length; i++) {
    keyword = Object.keys(gKeywordSearchCountMap)[i];
    currValue = gKeywordSearchCountMap[keyword];
    if (currValue > max) {
      max = currValue;
      maxWord = keyword;
    }
  }
  return { maxWord: maxWord, maxCount: max };
}

function onSelectImg(id) {
  setMemeProperty("selectedImgId",id)
  onSwitchToMeme()
  renderMeme();
}
