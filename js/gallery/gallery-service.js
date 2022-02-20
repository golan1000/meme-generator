"use strict";
var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 };
var gKeywordSearchCountMap = [];


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

  for (var i = 0; i < Object.keys(gKeywordSearchCountMap).length; i++) {
    keyword = Object.keys(gKeywordSearchCountMap)[i];
    currValue = gKeywordSearchCountMap[keyword];

    diff = maxCount - currValue;

    sizeFromMax = (maxCount - diff) * 3;

    fontSize = 20 + sizeFromMax;

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
