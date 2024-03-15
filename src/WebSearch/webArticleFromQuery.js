const getGoogleLinks = require("./getGoogleLinks.js");
const requestContent = require("../Scraping/requestContent.js");
async function webArticleFromQuery(q) {
    q = q.replaceAll(`"`, "");
    const googleLinks = await getGoogleLinks(q);
    const firstLink = googleLinks[0];
    const pageInfo = await requestContent(firstLink);
    // const pageInfo = await requestContent(`https://www.removepaywall.com/${firstLink}`);
    console.log(pageInfo);
    return pageInfo;
}
module.exports = webArticleFromQuery;