const requestContent = require("../Scraping/requestContent.js");
const cleanURL = require("../utils/cleanURL.js");

async function getGoogleLinks(query) {
    const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", {
        createHTML: (to_escape) => to_escape
    })

    let targetURL = `https://www.google.com/search?q=${query}`;
    let pageInfo = await requestContent(targetURL);
    let queryHTML = pageInfo.html;
    let target = document.createElement("div");
    target.innerHTML = escapeHTMLPolicy.createHTML(queryHTML);

    //Remove "People also ask" questions, yucky!!
    [...target.getElementsByClassName("related-question-pair")].forEach(x => x.remove());

    let URLs = [...target.querySelectorAll("cite")].map(x => x.parentElement.parentElement.parentElement.parentElement.parentElement.href).filter(x => x);
    URLs = URLs.map(x => cleanURL(x));
    return URLs;
}
module.exports = getGoogleLinks;