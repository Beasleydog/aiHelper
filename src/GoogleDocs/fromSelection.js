const askAI = require("../AI/askAI");
const getSelectedText = require("./utils/getSelectedText.js");
const getDocText = require("./utils/getDocText.js");
const TypingEffect = require("../utils/typingEffect.js");
const sendKeyToDoc = require("./utils/sendKeyToDoc.js");
const { fromSelectionPrompt, determineIfModifyPrompt } = require("./prompts.js");
const { setRobotShowing } = require("../utils/robotIcon.js");
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
        if (extraInstructions && extraInstructions.length > 0) {
            const modifyPrompt = determineIfModifyPrompt(extraInstructions);
            const modifyResponse = await askAI(modifyPrompt);
            console.log("MODIFY RESPONSE", modifyResponse);
            modify = modifyResponse.includes("<MODIFY>");
        }

        const promptText = fromSelectionPrompt(fullText, selectedText, extraInstructions);

        console.log(!modify);
        if (!modify) {
            //Move cursor to a new line
            sendKeyToDoc("keydown", "ArrowRight", 39);
            sendKeyToDoc("keydown", "Enter", 13);
            sendKeyToDoc("keydown", "Enter", 13);
        }

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