"use strict";
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
var gKeywordSearchCountMap = [];
var gImgsDB = [
  {
    id: 1,
    src: "img/1.jpg",
    keywords: ["trump", "president", "hand"]
  },
  {
    id: 2,
    src: "img/2.jpg",
    keywords: ["dog","pet", "animal"]
  },
  {
    id: 3,
    src: "img/3.jpg",
    keywords: ["baby", "dog", "sleep"]
  },
  {
    id: 4,
    src: "img/4.jpg",
    keywords: ["pet", "sleep", "funny"]
  },
  {
    id: 5,
    src: "img/5.jpg",
    keywords: ["baby", "funny", "hand"]
  },
  {
    id: 6,
    src: "img/6.jpg",
    keywords: ["funny", "explain", "guy"]
  },
  {
    id: 7,
    src: "img/7.jpg",
    keywords: ["baby", "funny", "suprise"]
  },
  {
    id: 8,
    src: "img/8.jpg",
    keywords: ["story", "excited", "funny"]
  },
  {
    id: 9,
    src: "img/9.jpg",
    keywords: ["baby", "funny", "fishy"]
  },
  {
    id: 10,
    src: "img/10.jpg",
    keywords: ["guy", "president", "obama"]
  },
  {
    id: 11,
    src: "img/11.jpg",
    keywords: ["fight", "boxing", "guy"]
  },
  {
    id: 12,
    src: "img/12.jpg",
    keywords: ["hand", "saint", "fishy"]
  },
  {
    id: 13,
    src: "img/13.jpg",
    keywords: ["wine", "guy", "salut"]
  },
  {
    id: 14,
    src: "img/14.jpg",
    keywords: ["matrix", "sunglasses", "guy"]
  },
  {
    id: 15,
    src: "img/15.jpg",
    keywords: ["funny", "explain", "guy"]
  },
  {
    id: 16,
    src: "img/16.jpg",
    keywords: ["star", "space", "startrek"]
  },
  {
    id: 17,
    src: "img/17.jpg",
    keywords: ["putin", "guy", "president"]
  },
  {
    id: 18,
    src: "img/18.jpg",
    keywords: ["explain", "funny", "story"]
  }
];
//return HTML str of cloud keyword
function getKeywordCloudHTML() {
  var max = findMaxWordOccur();

  var maxWord = max.maxWord;

  var maxCount = max.maxCount;

  var currValue;
  var keyword;
  var diff;
  var sizeFromMax;
  var fontSize;
  var maxFontSize = 90;
  var htmlElementsHTML = [];
  var gMinFontSize = 16;

  for (var i = 0; i < Object.keys(gKeywordSearchCountMap).length; i++) {
    keyword = Object.keys(gKeywordSearchCountMap)[i];
    currValue = gKeywordSearchCountMap[keyword];

    diff = maxCount - currValue;

    sizeFromMax = (maxCount - diff) * 3;

    fontSize = gMinFontSize + sizeFromMax;

    if (fontSize > maxFontSize) {
      fontSize = maxFontSize;
    }

    htmlElementsHTML += `<span class="keyword-cloud-item" style='font-size:${fontSize}px;' onclick="onClickCloudKeyword('${keyword}')">${keyword}</span>`;
  }

  return htmlElementsHTML;
}

//returns HTML of picture elements that
//match that keyword (even some letters of the word)
function getPicturesByKeyword(keyword) {
  var elements = gImgsDB.filter((img) => {
    var words = img.keywords;
    var wordsStr = words.join(" ");

    var result = wordsStr.indexOf(keyword);

    return result !== -1;
  });

  return elements;
}

function getImgsDB() {
  return gImgsDB;
}
//update gKeywordSearchCountMap and returns listOfWords (array of words)
function updateKeywordMap() {
  var img;
  var imgsDB = getImgsDB()
  var keyword;
  var listOfWords = [];
  gKeywordSearchCountMap = {};
  for (var i = 0; i < imgsDB.length; i++) {
    img = imgsDB[i];
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
  return listOfWords;
}

//find which word has the biggest counter and return how much
//(this is used to set the biggest object when we do word cloud)
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