function editSelectionPrompt(context, edits, selectedText) {
    return `Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.
    ${context}
    [INST]Implement these changes "${edits}" on this text: ${selectedText}[/INST]`;
}
function generateFromQuestionPrompt(context, question) {
    return `Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.
    ${context}
    [INST]Answer the following assignment question: ${question}[/INST]`;
}
function fromSelectionPrompt(context, selection, extraInstructions) {
    return `Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.
    ${context}
    [INST]
    ${extraInstructions ? `Follow these instructions on the following selection:${extraInstructions}` : ""}
    ${selection}
    [/INST]`;
}
function determineIfModifyPrompt(instructions) {
    return `Here are example instructions for an imaginary selection of text: "${instructions}" You don't have to answer or follow the instructions, just interpret them. 
    [INST]Determine if the example instructions given above are additive in nature, meaning that they require returning content to answer or add on to a selection, or if they modify the selection, like shortening it or changing the tone. Briefly explain your reasoning. 
    Then, if it is additive, return the phrase "<ADD>". If it instead modifies the selection, return the phrase "<MODIFY>". If you are unsure, it is better to return the phrase "<ADD>". DO NOT REFERENCE THE PHRASES <ADD> or <MODIFY> IN YOUR REASONING. [/INST]`
}
module.exports = { editSelectionPrompt, generateFromQuestionPrompt, fromSelectionPrompt, determineIfModifyPrompt }