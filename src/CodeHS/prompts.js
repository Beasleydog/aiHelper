function answerQuestionPrompt(question,answers){
    return `Question: ${question}
    Answers:${answers.map((x,i)=>{
        return `"Number ${i}: ${x}$`;
    }).join("\n")}
    [INST]Think about the question and its potential answer.
    Briefly explain your reasoning and then output the number of the answer you think is correct.
    Your response MUST end with a phrase like "Number 0" or "Number 1".`
}
module.exports = {answerQuestionPrompt};