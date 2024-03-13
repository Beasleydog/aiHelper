async function askAI(text, streamHook, extraParams) {
    return new Promise(async (res) => {
        const MAX_TOKENS = 1000;
        const SYTEM_PROMPT = "Make sure to use \n to signify a line break in your response. Keep all sentences in your response short. Use mostly sentence fragments, don't focus too much on proper sentences.";

        text = SYTEM_PROMPT + text;

        const data = {
            stream: true,
            inputs: text,
            parameters: {
                max_new_tokens: MAX_TOKENS,
                return_full_text: false,
                ...extraParams
            },
        }

        const response = await fetch(
            extraParams?.url || "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
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
            let bestFullText = "";
            while (true) {
                const { done, value } = await reader.read();


                let newData = new TextDecoder("utf-8").decode(value);
                newData.split("}\n\n").forEach((chunk) => {
                    chunk = chunk.replace("data:", "");
                    if (chunk.charAt(chunk.length - 1) != "}") {
                        chunk = chunk + "}";
                    }
                    try {
                        chunk = JSON.parse(chunk);
                        if (!indexsAdded.includes(chunk.index)) {
                            indexsAdded.push(chunk.index);

                            if (["<s>", "</s>"].includes(chunk.token.text)) {
                                chunk.token.text = "";
                            }
                            if (streamHook) streamHook(chunk.token.text, chunk.generated_text);
                            if (chunk.generated_text) {
                                bestFullText = chunk.generated_text;
                            }
                        }
                    } catch { };
                });
                if (done) {
                    res(bestFullText);
                    break;
                }
            }
        }
    });
}

module.exports = askAI;