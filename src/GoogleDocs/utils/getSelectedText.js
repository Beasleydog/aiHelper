const getDocText = require('./getDocText');
const sendKeyToDoc = require('./sendKeyToDoc');
const diffStrings = require('../../utils/diffStrings');

function getSelectedText() {
    //Get text. Send space key. Get text again. Send ctrl+z. Find the difference between the two texts
    let firstText = getDocText();
    sendKeyToDoc("keypress", ' ', 32);
    let secondText = getDocText();
    sendKeyToDoc("keydown", 'z', 90, { ctrlKey: true });
    //Find difference between the two texts using plain javascript
    let [start, end, end2] = diffStrings(firstText, secondText);
    //return difference
    return (firstText.slice(start, end + 1));
}

module.exports = getSelectedText;