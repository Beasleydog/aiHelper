function quizHints(){
    const questionMap = [...document.getElementsByClassName("quiz-questions")[0].children].map((x)=>{
        return {
        questionText:x.children[3].innerText,
            answers:[...[...x.children][4].children].map(x=>x.innerText)
        }
        });

    questionMap.forEach(()=>{
        
    })

    return true;
}
module.exports = quizHints;