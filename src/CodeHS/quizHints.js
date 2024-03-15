const askAI = require("../AI/askAI");
const { answerQuestionPrompt } = require("./prompts");
const requestContent = require("../Scraping/requestContent");
const webArticleFromQuery = require("../WebSearch/webArticleFromQuery");
async function quizHints() {
    const questionMap = [...document.getElementsByClassName("quiz-questions")[0].children].map((x) => {
        return {
            element: x,
            questionText: x.children[3].innerText,
            answers: [...[...x.children][4].children].map(x => x.innerText)
        }
    });

    questionMap.forEach((x) => {
        const button = document.createElement("button");
        button.innerText = "Get Hint";
        button.onclick = async () => {
            console.log(x);
            const helpfulHints = await webArticleFromQuery(x.questionText.replaceAll("\n", " "));
            const prompt = answerQuestionPrompt(x.questionText, x.answers, helpfulHints.text);
            const answer = await askAI(prompt);

            console.log(answer);
            //Extract the number from the answer
            const number = Number(answer.match(/\d+/)[0]);

            //Click the correct answer
            x.element.children[4].children[number].children[0].click();
        }
        x.element.appendChild(button);
    });
}
module.exports = quizHints;