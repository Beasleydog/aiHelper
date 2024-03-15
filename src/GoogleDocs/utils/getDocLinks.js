const sendKeyToDoc = require("./sendKeyToDoc.js");

function getDocLinks() {
    //USING THIS CLEARS THE CURRENT SELECTION
    sendKeyToDoc("keydown", "ArrowRight", 39);

    //If you do the ctrl+alt+n+l shortcut with no link Google Docs just dies. Google devs are so good.
    const specialUrl = "https://samiscool.com/"

    sendKeyToDoc("keypress", " ", 32);
    for (let i = 0; i < specialUrl.length; i++) {
        sendKeyToDoc("keypress", specialUrl[i], specialUrl.charCodeAt(i));
    }
    sendKeyToDoc("keypress", " ", 32);



    let urls = [];
    let countInARow = 0;
    while (true) {
        let selectedUrl = nextLink();
        if (!selectedUrl) break;

        if (urls.includes(selectedUrl)) {
            countInARow++;
            if (countInARow == urls.length) {
                break;
            }
        } else {
            urls.push(selectedUrl);
            countInARow = 0;
        }
    }

    urls = urls.filter(x => x !== specialUrl);

    //Undo the typing of the special URL and the spaces
    //This moves the cursor back to the og spot
    for (let i = 0; i < specialUrl.length + 2; i++) {
        sendKeyToDoc("keydown", "Delete", 46);
    }

    return urls;
}
function nextLink() {
    sendKeyToDoc("keydown", "n", 78, {
        altKey: true,
        ctrlKey: true
    });
    sendKeyToDoc("keyup", "n", 78, {
        altKey: true,
        ctrlKey: true
    });
    sendKeyToDoc("keydown", "l", 78, {
        altKey: true,
        ctrlKey: true
    });
    sendKeyToDoc("keyup", "l", 78, {
        altKey: true,
        ctrlKey: true
    });
    let e = document.getElementById("docs-linkbubble-link-text");
    return e && e.href
}
module.exports = getDocLinks;