const askAI = require("../AI/askAI");
const {answerQuestionPrompt} = require("./prompts");

function quizHints(){
    const questionMap = [...document.getElementsByClassName("quiz-questions")[0].children].map((x)=>{
        return {
            element:x,
        questionText:x.children[3].innerText,
            answers:[...[...x.children][4].children].map(x=>x.innerText)
        }
        });
console.log(questionMap);
    questionMap.forEach(async (x)=>{
        let prompt = answerQuestionPrompt(x.questionText,x.answers);
        let response = await askAI(prompt);

        let responseText = document.createElement("p");
        responseText.innerText = response;
        x.element.appendChild(responseText);
    })

    return true;
}
module.exports = quizHints;