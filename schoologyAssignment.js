window.addEventListener("load", () => {
    //Only run on Schoology discussions
    if (window != window.top) return;

    const DEFAULT_MAGIC_TEXT = "Magic 🪄";
    let PARENT = document.getElementsByClassName("right-block-big")[0];
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

    async function askAI(text, streamHook) {
        const MAX_TOKENS = 1000;
        const SYTEM_PROMPT = "Make sure to use \n to signify a line break in your response. Keep all sentences in your response short. Use mostly sentence fragments, don't focus too much on proper sentences.";

        text = SYTEM_PROMPT + text;

        const data = {
            stream: true,
            inputs: text,
            parameters: {
                max_new_tokens: MAX_TOKENS,
                return_full_text: false,
            },
        }

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${window.HELPER_TOKEN}`
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const reader = response.body.getReader();
            let indexsAdded = [];
            while (true) {
                const { done, value } = await reader.read();


                let newData = new TextDecoder("utf-8").decode(value);
                console.log(newData);
                newData.split("}\n\n").forEach((chunk) => {
                    chunk = chunk.replace("data:", "");
                    if (chunk.charAt(chunk.length - 1) != "}") {
                        chunk = chunk + "}";
                    }
                    try {
                        chunk = JSON.parse(chunk);
                        if (!indexsAdded.includes(chunk.index)) {
                            indexsAdded.push(chunk.index);
                            streamHook(chunk.token.text, chunk.generated_text);
                        }
                    } catch { };
                });
                if (done) {
                    break;
                }
            }
        }
    }
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
        askAI(QUESTION_TEXT, async (t, fullText) => {
            returned++;
            MAGIC_BUTTON.innerText = returned;
            console.log(t, fullText);
            if (fullText && !docYet) {

                //Have to preserve the line breaks because they get lost in the url otherwise
                fullText = fullText.replaceAll("\n", "NLCGRH");

                docYet = true;
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
                }, 500);
            }
        });
    }
});