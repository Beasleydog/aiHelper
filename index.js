(() => {
    let CURRENT_HIGHLIGHTS = [];
    const CONTEXT_HIGHLIGHT_COLOR = "rgba(53, 206, 51, 0.63)";
    const PROMPT_HIGHLIGHT_COLOR = "rgba(107,124,230,0.77)";
    let HIGHLIGHTS_FLASHING = false;
    let CURRENT_ASKING = false;
    async function askAI(contexts, questions) {
        if (CURRENT_HIGHLIGHTS.length == 0) return;
        const MAX_TOKENS = 1000;
        const SYTEM_PROMPT = "";
        let query = "";

        query += SYTEM_PROMPT;

        query + '\nBackground context to consider:\n'
        for (let i = 0; i < contexts.length; i++) {
            query += contexts[i] + "\n";
        }
        for (let i = 0; i < questions.length; i++) {
            query += `[INST]${questions[i]}[/INST]`;
        }

        const data = {
            stream: true,
            inputs: query,
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
            let result = '';
            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                let newData = new TextDecoder("utf-8").decode(value);
                newData.split("\n\n").forEach((chunk) => {
                    chunk = chunk.replace("data:", "");
                    try {
                        chunk = JSON.parse(chunk);
                        if (!chunk.token.special && !indexsAdded.includes(chunk.index)) {
                            indexsAdded.push(chunk.index);
                            result += chunk.token.text;
                            console.log(result);
                        }
                    } catch { };
                });
            }
            return result;
        }
    }

    function spawnResponsePopup() {

    }

    function highlightRange(range, tagName = 'mark', attributes = {}) {
        if (range.collapsed) return;

        const nodes = textNodesInRange(range);

        const highlightElements = [];
        for (const nodeIdx in nodes) {
            const highlightElement = wrapNodeInHighlight(nodes[nodeIdx], tagName, attributes);
            highlightElements.push(highlightElement);
        }

        function removeHighlights() {
            for (const highlightIdx in highlightElements) {
                removeHighlight(highlightElements[highlightIdx]);
            }
        }
        return {
            remove: removeHighlights,
            highlightElements: highlightElements,
            id: Math.random()
        };
    }

    function textNodesInRange(range) {
        if (range.startContainer.nodeType === Node.TEXT_NODE && range.startOffset > 0) {
            const endOffset = range.endOffset;
            const createdNode = range.startContainer.splitText(range.startOffset);
            if (range.endContainer === range.startContainer) {
                range.setEnd(createdNode, endOffset - range.startOffset);
            }
            range.setStart(createdNode, 0);
        }
        if (
            range.endContainer.nodeType === Node.TEXT_NODE
            && range.endOffset < range.endContainer.length
        ) {
            range.endContainer.splitText(range.endOffset);
        }

        const walker = range.startContainer.ownerDocument.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            node => range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
        );
        walker.currentNode = range.startContainer;

        const nodes = [];
        if (walker.currentNode.nodeType === Node.TEXT_NODE)
            nodes.push(walker.currentNode);
        while (walker.nextNode() && range.comparePoint(walker.currentNode, 0) !== 1)
            nodes.push(walker.currentNode);
        return nodes;
    }

    function wrapNodeInHighlight(node, tagName, attributes) {
        const highlightElement = node.ownerDocument.createElement(tagName);
        Object.keys(attributes).forEach(key => {
            highlightElement.setAttribute(key, attributes[key]);
        });
        const tempRange = node.ownerDocument.createRange();
        tempRange.selectNode(node);
        tempRange.surroundContents(highlightElement);
        return highlightElement;
    }

    function removeHighlight(highlightElement) {
        if (highlightElement.childNodes.length === 1) {
            highlightElement.parentNode.replaceChild(highlightElement.firstChild, highlightElement);
        } else {
            while (highlightElement.firstChild) {
                highlightElement.parentNode.insertBefore(highlightElement.firstChild, highlightElement);
            }
            highlightElement.remove();
        }
    }


    function highlightSelection(color) {
        const selection = window.getSelection();
        if (selection.isCollapsed) return;

        const range = selection.getRangeAt(0);
        const highlight = highlightRange(range, 'customHighlight', {
            style: `border-color: transparent;border-width: 0px 0px 3px 0px;border-style: solid;transition: border-color .2s;`,
        });
        selection.removeAllRanges();

        highlight.highlightElements.forEach((element) => {
            element.style.borderColor = color;
            element.onclick = () => {
                removeSelection(highlight);
            };
        })

        return highlight;
    }
    function removeSelection(highlight) {
        highlight.highlightElements.forEach((element) => {
            element.style.borderColor = "transparent";
        });
        CURRENT_HIGHLIGHTS = CURRENT_HIGHLIGHTS.filter(x => x.id != highlight.id);

        setTimeout(() => {
            highlight.remove();
        }, 200);

        console.log(CURRENT_HIGHLIGHTS);
    }

    function handleContextShortcut() {
        if (CURRENT_ASKING) return;
        const text = window.getSelection().toString();
        const highlight = highlightSelection(CONTEXT_HIGHLIGHT_COLOR);
        CURRENT_HIGHLIGHTS.push({
            type: "context",
            id: highlight.id,
            text: text,
            remove: highlight.remove,
            highlight: highlight,
            highlightElements: highlight.highlightElements,
            color: CONTEXT_HIGHLIGHT_COLOR
        });
    }

    function handlePromptShortcut() {
        if (CURRENT_ASKING) return;
        const text = window.getSelection().toString();
        const highlight = highlightSelection(PROMPT_HIGHLIGHT_COLOR);

        CURRENT_HIGHLIGHTS.push({
            type: "prompt",
            id: highlight.id,
            text: text,
            remove: highlight.remove,
            highlight: highlight,
            highlightElements: highlight.highlightElements,
            color: PROMPT_HIGHLIGHT_COLOR
        });
    }

    function handleAskShortcut() {
        if (CURRENT_ASKING) return;
        const contexts = CURRENT_HIGHLIGHTS.filter(h => h.type === "context").map(h => h.text);
        const prompts = CURRENT_HIGHLIGHTS.filter(h => h.type === "prompt").map(h => h.text);
        HIGHLIGHTS_FLASHING = true;
        CURRENT_ASKING = true;
        askAI(contexts, prompts).then((response) => {
            CURRENT_ASKING = false;
            HIGHLIGHTS_FLASHING = false;
            navigator.clipboard.writeText(response[0].generated_text);
            CURRENT_HIGHLIGHTS.forEach((curHigh) => {
                removeSelection(curHigh.highlight);
            });
        });
    }


    setInterval(() => {
        if (HIGHLIGHTS_FLASHING) {
            CURRENT_HIGHLIGHTS.forEach((h) => {
                h.highlightElements.forEach((e) => {
                    e.style.borderColor = "transparent";
                });
            });
            setTimeout(() => {
                CURRENT_HIGHLIGHTS.forEach((h) => {
                    h.highlightElements.forEach((e) => {
                        e.style.borderColor = h.color;
                    });
                });
            }, 200 * 2);
        };
    }, 400 * 2);

    document.addEventListener("keydown", (e) => {
        if (e.ctrlKey && e.altKey && e.key === "a") {
            handleContextShortcut();
        }
        if (e.ctrlKey && e.altKey && e.key === "s") {
            handlePromptShortcut();
        }
        if (e.ctrlKey && e.altKey && e.key === "d") {
            handleAskShortcut();
        }
    });
})();



