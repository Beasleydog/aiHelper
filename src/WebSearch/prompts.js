function webSearchFromContextAndSelectionPrompt(context, selection) {
    return `Current Date:${new Date().toDateString()}
    Here is some background context: ${context}
    The user will do web research based on the following selection: ${selection}
    [INST]Generate a short web search prompt for the user to use to find more information about the selection. 
    The prompt should be a question or a request for information that can be answered by a web search. 
    The prompt should be short and to the point. Do not include any information that is already in the selection. It is crucial you include the date in the prompt to ensure up-to-date results. [/INST]`
}
module.exports = { webSearchFromContextAndSelectionPrompt }