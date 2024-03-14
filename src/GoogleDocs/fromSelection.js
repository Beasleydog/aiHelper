const askAI = require("../AI/askAI");
const getSelectedText = require("./utils/getSelectedText.js");
const getDocText = require("./utils/getDocText.js");
const TypingEffect = require("../utils/typingEffect.js");
const sendKeyToDoc = require("./utils/sendKeyToDoc.js");
const { fromSelectionPrompt, determineIfModifyPrompt } = require("./prompts.js");
const { setRobotShowing } = require("../utils/robotIcon.js");
const { webSearchFromContextAndSelectionPrompt } = require("../WebSearch/prompts.js");
const webArticleFromQuery = require("../WebSearch/webArticleFromQuery");
function fromSelection() {
    window.sendKeyToDoc = sendKeyToDoc;
    console.log(getDocText());


    const Typer = new TypingEffect((char) => {
        setRobotShowing(true);
        sendKeyToDoc("keypress", char, char.charCodeAt(0));
    }, () => {
        setRobotShowing(true);
        sendKeyToDoc("keydown", "Enter", 13);
    });

    Typer.onFinish = () => {
        setRobotShowing(false);
    };

    async function handleShortcut() {
        const selectedText = getSelectedText();
        const fullText = getDocText();
        const extraInstructions = prompt("Extra instructions?");

        setRobotShowing(true);

        let modify = false;
        let context = fullText;

        if (extraInstructions && extraInstructions.length > 0) {
            const modifyPrompt = determineIfModifyPrompt(extraInstructions);
            const modifyResponse = await askAI(modifyPrompt);
            modify = modifyResponse.includes("<MODIFY>");
        }
        console.log(extraInstructions, extraInstructions.includes("web"));
        if (extraInstructions.includes("web")) {
            console.log("Getting web background knowledge");
            //Get some web background knowledge
            const webQuery = await askAI(webSearchFromContextAndSelectionPrompt(fullText, selectedText));
            const webArticle = await webArticleFromQuery(webQuery);
            console.log(webArticle);
            context += webArticle.text;
        }

        const promptText = fromSelectionPrompt(context, selectedText, extraInstructions);

        console.log(!modify);
        if (!modify) {
            //Move cursor to a new line
            sendKeyToDoc("keydown", "ArrowRight", 39);
            sendKeyToDoc("keydown", "Enter", 13);
            sendKeyToDoc("keydown", "Enter", 13);
        }
        console.log("PROMPT");
        console.log(promptText);
        askAI(promptText, (text) => {
            Typer.addWord(text);
        });
    }

    document.querySelector('.docs-texteventtarget-iframe')
        .contentDocument.addEventListener("keydown", function (e) {
            if (e.key === "a" && e.ctrlKey && e.altKey) {
                handleShortcut();
            }
        });

    return true;
}
module.exports = fromSelection;