//Add window load event listener
window.addEventListener('load', () => {
    if (window != window.top) return;
    function getDocText() {
        function le(e, t, n, o = Object.getOwnPropertyNames(e)) {
            const r = new Set
                , i = [];
            let s = 0;
            const a = (o, l, c, u = 0) => {
                if (s++,
                    "prototype" === o || l instanceof Window)
                    return;
                if (u > n)
                    return;
                const d = [...c, o];
                try {
                    if (t(o, l))
                        return void i.push({
                            path: d,
                            value: l
                        })
                } catch (e) { }
                var g;
                if (null != l && !r.has(l))
                    if (r.add(l),
                        Array.isArray(l))
                        l.forEach(((e, t) => {
                            try {
                                a(t.toString(), e, d, u + 1)
                            } catch (e) { }
                        }
                        ));
                    else if (l instanceof Object) {
                        ((g = l) && null !== g && 1 === g.nodeType && "string" == typeof g.nodeName ? Object.getOwnPropertyNames(e).filter((e => !J.has(e))) : Object.getOwnPropertyNames(l)).forEach((e => {
                            try {
                                a(e, l[e], d, u + 1)
                            } catch (e) { }
                        }
                        ))
                    }
            }
                ;
            return o.forEach((t => {
                try {
                    a(t, e[t], [])
                } catch (e) { }
            }
            )),
            {
                results: i,
                iterations: s
            }
        }
        return le(window.KX_kixApp, ((e, t) => t && "\x03" === t.toString().charAt(0)), 5).results[0].value
    }
    async function askAI(text, streamHook) {
        const MAX_TOKENS = 1000;
        const SYTEM_PROMPT = "I have attatched background context for you to consider and refernce. I have also highlighted a question for you to answer. Ignore any questions that are not the highlighted one.";

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
    function sendKey(type, key, keyCode, mods) {
        const keyEvent = document.createEvent('Event')
        keyEvent.initEvent(type, true, true)
        keyEvent.key = key;
        keyEvent.keyCode = keyCode
        if (mods) {
            Object.keys(mods).forEach(mod => {
                keyEvent[mod] = mods[mod];
            });
        }
        document.querySelector('.docs-texteventtarget-iframe')
            .contentDocument.activeElement
            .dispatchEvent(keyEvent);
    }
    function diffStrings(a, b) {
        let i = 0;
        while (i < a.length && a[i] === b[i]) {
            i++;
        }
        let j = a.length - 1;
        let k = b.length - 1;
        while (j >= 0 && k >= 0 && a[j] === b[k]) {
            j--;
            k--;
        }
        return [i, j, k];
    }
    function getSelectedText() {
        //Get text. Send space key. Get text again. Send ctrl+z. Find the difference between the two texts
        let firstText = getDocText();
        sendKey("keypress", ' ', 32);
        let secondText = getDocText();
        sendKey("keydown", 'z', 90, { ctrlKey: true });
        //Find difference between the two texts using plain javascript
        let [start, end, end2] = diffStrings(firstText, secondText);
        //return difference
        return (firstText.slice(start, end + 1));
    }
    function handleStartShortcut() {
        let selectedText = getSelectedText();
        let fullText = getDocText();

        fullText += `[INST]${selectedText}[/INST]`;

        sendKey("keydown", "ArrowRight", 39);
        sendKey("keydown", "Enter", 13);
        sendKey("keydown", "Enter", 13);

        askAI(fullText, (text) => {
            console.log(text);
            if (text === "\n") {
                sendKey("keydown", "Enter", 13);
                return;
            }
            text.split("").forEach((char) => {
                sendKey("keypress", char, char.charCodeAt(0));
            });
        });
    }
    function handleEditShortcut() {
        let selectedText = getSelectedText();
        let fullText = getDocText();
        let edits = prompt("What changes?");
        fullText += `[INST]Implement these changes "${edits}" on this text: ${selectedText}[/INST]`;
        askAI(fullText, (text) => {
            console.log(text);
            if (text === "\n") {
                sendKey("keydown", "Enter", 13);
                return;
            }
            text.split("").forEach((char) => {
                sendKey("keypress", char, char.charCodeAt(0));
            });
        });
    }

    document.querySelector('.docs-texteventtarget-iframe')
        .contentDocument.addEventListener("keydown", function (e) {
            if (e.key === "a" && e.ctrlKey && e.altKey) {
                handleStartShortcut();
            }
            if (e.key === "s" && e.ctrlKey && e.altKey) {
                handleEditShortcut();
            }
        });
});