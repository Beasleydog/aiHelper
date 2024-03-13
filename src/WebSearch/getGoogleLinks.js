const requestContent = require("../Scraping/requestContent.js");
async function getGoogleLinks(query){
    let targetURL = `https://www.google.com/search?q=${query}`;
    let pageInfo = await requestContent(targetURL);
    console.log(pageInfo);
    let queryHTML = pageInfo;
    let target = document.createElement("div");
    target.innerHTML = queryHTML;
    console.log(queryHTML);
    let URLs = [...target.querySelectorAll("cite")].map(x=>x.parentElement.parentElement.parentElement.parentElement.parentElement.href).filter(x=>x);
    console.log(URLs);
    return URLs;    
}
module.exports = getGoogleLinks;