function pageText(){
    opener.postMessage(document.body.innerText, '*');
}
module.exports = pageText;