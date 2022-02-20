"use strict";
//v
function uploadImg() {
  gUploadMode = true;
  const imgDataUrl = getCanvasData()

  // A function to be called if request succeeds
  function onSuccess(uploadedImgUrl) {
    const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl);

    var uploadedLinkStr = `Your photo is available here: ${uploadedImgUrl}`;
    renderUploadedLink(uploadedLinkStr);

    var shareFBHTML = `
          <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
             <button class="share-box-button">Share</button>   
          </a>`;
    renderShareFB(shareFBHTML);
  }
  doUploadImg(imgDataUrl, onSuccess);
}
//v
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
