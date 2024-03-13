const askAI = require("../AI/askAI");
const {answerQuestionPrompt} = require("./prompts");
const requestContent=require("../Scraping/requestContent");
async function quizHints(){
    const questionMap = [...document.getElementsByClassName("quiz-questions")[0].children].map((x)=>{
        return {
            element:x,
        questionText:x.children[3].innerText,
            answers:[...[...x.children][4].children].map(x=>x.innerText)
        }
        });
console.log(questionMap);
console.log(requestContent);
        for(var i = 0;i<questionMap.length;i++){
            let firstFiveWordsOfQuestion=questionMap[i].questionText.split(" ").slice(0,5).join(" ");
            let targetURL = `https://quizlet.com/webapi/3.2/suggestions/word?clientId=-1692779200083616130&limit=3&localTermId=-1&prefix=${firstFiveWordsOfQuestion}&wordLang=en`;
            console.log(targetURL);
            let apiResponse = await requestContent(targetURL);
            console.log(apiResponse);
            await new Promise((res)=>{
                setTimeout(res,100);
            });
    }

    return true;
}
module.exports = quizHints;