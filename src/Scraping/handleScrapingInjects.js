const pageContent = require('./pageContent');
const amplifyScrapedContent = require('./amplifyScrapedContent');
function handleScrapingInjects() {
    const u = location.href;
    if (u.includes("AI_HELPER_SCRAPE")) {
        //We exist solely to scrape 😲💀
        console.log("GONNA SCRAPE");

        pageContent();
    } else if (u.includes("AI_HELPER_AMPLIFY_SCRAPE")) {
        //We exist just to amplify and thats somehow worse 💀☠️
        amplifyScrapedContent();
    }
}
module.exports = handleScrapingInjects;