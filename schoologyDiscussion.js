window.addEventListener("load",()=>{
    //Only run on Schoology discussions
    if(!document.getElementsByClassName("discussion-content")[0])return;
    if(window!=window.top)return;
   
    const LAUNCH_STRING = "???";
    let LAST_KEYS = [];
    tinyMCE.activeEditor.contentDocument.addEventListener("keydown",(e)=>{
        LAST_KEYS =[e.key].concat(LAST_KEYS);
        if(LAST_KEYS.length>LAUNCH_STRING.length){
            LAST_KEYS.pop();
        }
        console.log(LAST_KEYS.reverse().join(""),LAUNCH_STRING);
        if(LAST_KEYS.reverse().join("")===LAUNCH_STRING){
            setTimeout(()=>{
            for(var i = 0;i<LAUNCH_STRING.length;i++){
                tinymce.activeEditor.execCommand("Delete");
            }
            doTheMagic();
        },0);
        }
    });

    async function askAI(text, streamHook) {
        const MAX_TOKENS = 1000;
        const SYTEM_PROMPT = "I have attatched background context for you to consider and reference. I have alo attatched sample responses for you to model, emulate their length and style. I have also highlighted a question for you to answer.";

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
                if (done) {
                    break;
                }
                let newData = new TextDecoder("utf-8").decode(value);
                newData.split("\n\n").forEach((chunk) => {
                    chunk = chunk.replace("data:", "");
                    try {
                        console.log(chunk);
                        chunk = JSON.parse(chunk);
                        if (!chunk.token.special && !indexsAdded.includes(chunk.index)) {
                            indexsAdded.push(chunk.index);
                            streamHook(chunk.token.text);
                        }
                    } catch { };
                });
            }
        }
    }

    function doTheMagic(){
        const OTHER_RESPONSE_TEXT = Array.from(document.querySelectorAll(".comment-more-wrapper")).map(x=>x.innerText);
        const QUESTION_TEXT = document.getElementsByClassName("discussion-prompt")[0].innerText;
    
        let text= `${OTHER_RESPONSE_TEXT.join("\n")} [INST]${QUESTION_TEXT}[/INST]`;

        askAI(text,(t)=>{
            const PLACEHOLDER = document.getElementById("comment-placeholder")
            if(getComputedStyle(PLACEHOLDER).display=="block")PLACEHOLDER.click();

            if (t === "\n") {
                tinymce.activeEditor.execCommand('mceInsertLineBreak',true);
                return;
            }
            tinyMCE.activeEditor.execCommand('mceInsertContent', false, t); 
        })
    }
});