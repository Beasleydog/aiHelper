//Display robot imports
const { initRobotIcon, setRobotShowing } = require("./utils/robotIcon");

//Schoology imports
const assignment = require("./Schoology/assignment.js");
const discussion = require("./Schoology/discussion.js");

//Google Docs imports
const fromSelection = require("./GoogleDocs/fromSelection.js");
const fullAuto = require("./GoogleDocs/fullAuto.js");

//CodeHS imports
const quizHints = require("./CodeHS/quizHints.js");
console.log("what");

//Exposed functions import
const askAI = require("./AI/askAI.js");

const encryptString = require("./utils/encryptString.js");

//Scrape import
const shouldInjectScraper = require("./Scraping/shouldInjectScraper.js");
const pageContent = require("./Scraping/pageContent.js");
const requestContent = require("./Scraping/requestContent.js");
const getGoogleLinks = require("./WebSearch/getGoogleLinks.js");

//Note that we have to do it right away incase the url gets overwritten by the webpage like wiht a google search
const shouldScrape = shouldInjectScraper(location.href);
const ogOpener = window.opener;
window.getGoogleLinks = getGoogleLinks;
window.addEventListener("load", () => {
    if (encryptString(window.HELPER_PASSWORD) != "100 104 115 111 102 104 111") return;

    if (window.top != window) return;

    if (shouldScrape) {
        window.opener = ogOpener;
        pageContent();
    }

    let injected = false;
    switch (location.origin) {
        case "https://example.com":
            window.askAI = askAI;
            injected = true;
            break;
        case "https://docs.google.com":
            if (fromSelection()) {
                injected = true;
            }
            break;
        case "https://ud.schoology.com":
            if (location.pathname.includes("/discussion/")) {
                if (discussion()) {
                    injected = true;
                }
            } else if (location.pathname.includes("/assignment/")) {
                if (assignment()) {
                    injected = true;
                }
            }
            // console.log(1);

            break;
        case "https://codehs.com":
            if (location.pathname.includes("/assignment/")) {
                console.log("trying to inject");
                if (quizHints()) {
                    injected = true;
                }
            }
        default:
            break;
    }
    console.log("inected?", injected);
    if (injected) {
        initRobotIcon();
        setRobotShowing(true);
        setTimeout(() => {
            setRobotShowing(false);
        }, 1000);
    };
});

// fetch("https://quizlet.com/webapi/3.2/suggestions/word?clientId=-1692779200083616130&limit=3&localTermId=-1&prefix=Consider%20the%20code%20segment&wordLang=en")

//Add little robot emoji popup in corner of screen when we inject something

//add function to handle "contexts": scrape urls and get youtube transcripts