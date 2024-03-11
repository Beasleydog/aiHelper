const askAI = require("../AI/askAI");
const TypingEffect = require("../utils/typingEffect.js");
const { setRobotShowing } = require("../utils/robotIcon.js");

function discussion() {
    const Typer = new TypingEffect((char) => {
        setRobotShowing(true);
        tinyMCE.activeEditor.execCommand('mceInsertContent', false, char);
    }, () => {
        setRobotShowing(true);
        tinyMCE.activeEditor.execCommand('InsertLineBreak', true);
    });

    Typer.onFinish = () => {
        setRobotShowing(false);
    }

    const LAUNCH_STRING = "???";
    let LAST_KEYS = [];
    tinyMCE.activeEditor.contentDocument.addEventListener("keydown", (e) => {
        LAST_KEYS = [e.key].concat(LAST_KEYS);
        if (LAST_KEYS.length > LAUNCH_STRING.length) {
            LAST_KEYS.pop();
        }
        console.log(LAST_KEYS.reverse().join(""), LAUNCH_STRING);
        if (LAST_KEYS.reverse().join("") === LAUNCH_STRING) {
            setTimeout(() => {
                for (var i = 0; i < LAUNCH_STRING.length; i++) {
                    tinymce.activeEditor.execCommand("Delete");
                }
                doTheMagic();
            }, 0);
        }
    });


    function doTheMagic() {
        let OTHER_RESPONSE_TEXT = Array.from(document.querySelectorAll(".comment-more-wrapper")).map(x => x.innerText);
        OTHER_RESPONSE_TEXT = OTHER_RESPONSE_TEXT.map(x => x.replace("Show Less", ""));
        OTHER_RESPONSE_TEXT = OTHER_RESPONSE_TEXT.map(x => x.replace("Show More", ""));
        const QUESTION_TEXT = document.getElementsByClassName("discussion-prompt")[0].innerText;

        let text = `${OTHER_RESPONSE_TEXT.join("\n")} [INST]${QUESTION_TEXT}[/INST]`;

        askAI(text, (t) => {
            const PLACEHOLDER = document.getElementById("comment-placeholder")
            if (getComputedStyle(PLACEHOLDER).display == "block") PLACEHOLDER.click();

            Typer.addWord(t);
        })
    }

    return true;
}

module.exports = discussion;