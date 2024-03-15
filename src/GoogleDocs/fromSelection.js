const askAI = require("../AI/askAI");
const getSelectedText = require("./utils/getSelectedText.js");
const getDocText = require("./utils/getDocText.js");
const TypingEffect = require("../utils/typingEffect.js");
const sendKeyToDoc = require("./utils/sendKeyToDoc.js");
const getDocLinks = require("./utils/getDocLinks.js");
const { fromSelectionPrompt, determineIfModifyPrompt } = require("./prompts.js");
const { setRobotShowing } = require("../utils/robotIcon.js");
const { webSearchFromContextAndSelectionPrompt } = require("../WebSearch/prompts.js");
const webArticleFromQuery = require("../WebSearch/webArticleFromQuery");
const Context = require("../Context/context.js");
function fromSelection() {
    window.sendKeyToDoc = sendKeyToDoc;
    window.getDocLinks = getDocLinks;
    const DocContext = new Context();

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
        setRobotShowing(true);

        const selectedText = getSelectedText();
        const fullText = getDocText();
        let extraInstructions = prompt("Extra instructions?");

        DocContext.clear();

        const allLinks = getDocLinks();
        for (let i = 0; i < allLinks.length; i++) {
            await DocContext.addURL(allLinks[i]);
        }

        if (extraInstructions && extraInstructions.includes("web")) {
            //Get some web background knowledge
            const webQuery = await askAI(webSearchFromContextAndSelectionPrompt(fullText, selectedText));
            const webArticle = await webArticleFromQuery(webQuery);
            extraInstructions = extraInstructions.replace("web", "");
            DocContext.addContext(webArticle.text);
        }

        let modify = false;
        if (extraInstructions && extraInstructions.length > 0) {
            const modifyPrompt = determineIfModifyPrompt(extraInstructions);
            const modifyResponse = await askAI(modifyPrompt);
            modify = modifyResponse.includes("<MODIFY>");
        }

        DocContext.addContext(fullText);

        console.log("FULL CONTEXT", DocContext.fullContext());

        const promptText = fromSelectionPrompt(DocContext.fullContext(), selectedText, extraInstructions);

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