"use strict";
var gImgsDB = [
  {
    id: 1,
    src: "img/1.jpg",
    keywords: ["test1", "yes", "no"]
  },
  {
    id: 2,
    src: "img/2.jpg",
    keywords: ["baby", "yestest3", "no"]
  },
  {
    id: 3,
    src: "img/3.jpg",
    keywords: ["baby", "bad", "no"]
  },
  {
    id: 4,
    src: "img/4.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 5,
    src: "img/5.jpg",
    keywords: ["baby", "funny", "no"]
  },
  {
    id: 6,
    src: "img/6.jpg",
    keywords: ["baby", "baba", "no"]
  },
  {
    id: 7,
    src: "img/7.jpg",
    keywords: ["baby", "cold", "no"]
  },
  {
    id: 8,
    src: "img/8.jpg",
    keywords: ["baby", "yes", "hot"]
  },
  {
    id: 9,
    src: "img/9.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 10,
    src: "img/10.jpg",
    keywords: ["crazy", "yes", "no"]
  },
  {
    id: 11,
    src: "img/11.jpg",
    keywords: ["baby", "ball", "no"]
  },
  {
    id: 12,
    src: "img/12.jpg",
    keywords: ["baby", "yes", "no"]
  },
  {
    id: 13,
    src: "img/13.jpg",
    keywords: ["baby", "red", "no"]
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
//returns HTML
function getPicturesByKeyword(keyword) {
  var elements = gImgsDB.filter((img) => {
    var words = img.keywords;
    var wordsStr = words.join(" ");

    var result = wordsStr.indexOf(keyword);

    return result !== -1;
  });

  return elements;
}

function createGalleryHTML(imgsDB = gImgsDB) {
  var strHTMLItems = imgsDB.map((img) => {
    var str = `<img class="galleryImg" id="${img.id}" onclick="onSelectImg(${img.id})" src="img/${img.id}.jpg"/>`;

    return str;
  });

  var strHTML = strHTMLItems.join(" ");

  return strHTML;
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

  listOfWords = new Set(listOfWords);
  //to regular array
  listOfWords = Array.from(listOfWords);

  var elOptions = document.querySelector(".cloud-options");
  var options = "";
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
  gMeme.selectedImgId = id;
  renderMeme(gMeme);
}
