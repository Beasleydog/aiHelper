const askAI = require("../AI/askAI");
const { setRobotShowing } = require("../utils/robotIcon.js");
function assignment() {
    //Add Magic button
    const DEFAULT_MAGIC_TEXT = "Magic 🪄";
    let PARENT = document.getElementsByClassName("right-block-big")[0];

    if (!PARENT) return false;

    let MAGIC_BUTTON = document.createElement("div");
    MAGIC_BUTTON.classList.add("link-btn");
    MAGIC_BUTTON.classList.add("add");
    MAGIC_BUTTON.classList.add("dropbox-submit");
    MAGIC_BUTTON.classList.add("popups-processed");
    MAGIC_BUTTON.classList.add("sExtlink-processed");
    MAGIC_BUTTON.style.marginTop = "4px";
    MAGIC_BUTTON.innerText = DEFAULT_MAGIC_TEXT;
    MAGIC_BUTTON.onclick = doTheMagic;
    PARENT.appendChild(MAGIC_BUTTON);


    async function createDoc(title, content) {
        const APPSCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBjAiL4xyomwuzfl06bCvcRnzCC8nQ_eA9M_K48-DFajyLBWFTRp-r3XPuDsc18Sbq/exec";
        let url = await fetch(`${APPSCRIPT_URL}?title=${title}&content=${content}`);
        url = await url.text();
        return url;
    }

    async function doTheMagic() {
        const QUESTION_TEXT = document.getElementsByClassName("info-container")[1].innerText;

        let docYet = false;
        let returned = 0;

        setRobotShowing(true);

        askAI(QUESTION_TEXT, async (t, fullText) => {
            //Update button text so user sees something is happening
            returned++;
            MAGIC_BUTTON.innerText = returned;

            if (fullText && !docYet) {
                docYet = true;

                //Have to preserve the line breaks because they get lost in the url otherwise
                fullText = fullText.replaceAll("\n", "NLCGRH");

                const QUESTION_TITLE = document.getElementsByClassName("page-title")[0].innerText;
                const NAME = document.querySelectorAll(`div[data-sgy-sitenav="header-my-account-menu"]`)[0].children[0].children[0].children[0].children[0].alt;
                const DOC_NAME = `${NAME} - ${QUESTION_TITLE}`;
                const DOC_URL = await createDoc(DOC_NAME, fullText);
                MAGIC_BUTTON.innerText = DEFAULT_MAGIC_TEXT;

                //Open submit popup
                document.getElementsByClassName("submit-assignment")[0].children[0].click();

                //Navigate to create tab
                (await new Promise((res) => {
                    let int = setInterval(() => {
                        const CREATE_BUTTON = document.getElementById("dropbox-submit-create-tab");
                        if (CREATE_BUTTON) {
                            setTimeout(() => {
                                res(CREATE_BUTTON);
                            }, 500);
                        }
                    }, 100);
                })).click();

                //Schoology is kinda slow, give it some time to load
                setTimeout(() => {
                    tinyMCE.activeEditor.execCommand('mceInsertContent', false, DOC_URL);

                    setRobotShowing(false);
                }, 500);
            }
        });
    }

    return true;
}

module.exports = assignment;