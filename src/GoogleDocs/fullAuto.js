const getDocText = require("./utils/getDocText.js");
const askAI = require("../AI/askAI.js");
// askAI(fullText+"[INST]Return the missing parts (noted by <STUDENT_ANSWER>) of the students assignment. For each instance of <STUDENT_ANSWER>, return a short yet accurate answer that answers the associated prompt. Return your responses in a numbered list format. The first <STUDENT_ANSWER> should be returned prefixed with a 1., continue this pattern for the future answers.[/INST]",(a,b)=>{
//     console.log(a,b);
//     })

function fullAuto() {
    let magic = document.createElement("button");
    magic.innerText = "button";
    document.getElementById("docs-menubar").appendChild(magic);

    magic.onclick = () => {
        let fullText = getDocText();
        console.log(fullText);
        askAI(fullText + "[INST]Attatched is a student's school assignment. Your job is to determine the main questions or tasks of the assignment. Return a list of sentences that precede areas where the student needs to input their answer. [/INST]", (a, b) => {
            console.log(a, b);
        })
    }
}
module.exports = fullAuto;