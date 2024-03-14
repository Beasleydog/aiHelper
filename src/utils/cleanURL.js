function cleanURL(u) {
    return u.split(":~:")[0]
}
module.exports = cleanURL;