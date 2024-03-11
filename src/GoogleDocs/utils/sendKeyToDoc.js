function sendKeyToDoc(type, key, keyCode, mods) {
    const keyEvent = document.createEvent('Event')
    keyEvent.initEvent(type, true, true)
    keyEvent.key = key;
    keyEvent.keyCode = keyCode
    if (mods) {
        Object.keys(mods).forEach(mod => {
            keyEvent[mod] = mods[mod];
        });
    }
    document.querySelector('.docs-texteventtarget-iframe')
        .contentDocument.activeElement
        .dispatchEvent(keyEvent);
}

module.exports = sendKeyToDoc;