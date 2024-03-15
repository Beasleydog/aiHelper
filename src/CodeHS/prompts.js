function answerQuestionPrompt(question, answers, context) {
    return `Context: ${context}
    Question: ${question}
    Answers:${answers.map((x, i) => {
        return `"Number ${i}: ${x}$`;
    }).join("\n")}
    [INST]Using the context, think about the question and its potential answer. Then, fill in the blank. Number _ is correct. YOU MUST NOT RETURN ANYTHING ELSE EXCEPT THE NUMBER TO GO IN THE BLANK[/INST]`
}
module.exports = { answerQuestionPrompt };