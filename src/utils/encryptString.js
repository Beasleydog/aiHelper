function encryptString(s) {
    return s.split('').map(c => c.charCodeAt(0)).join(' ');
}
module.exports = encryptString;