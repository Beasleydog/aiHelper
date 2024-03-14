const sendKeyToDoc  = require("./sendKeyToDoc.js");

function getAllLinks(){
    let urls=[];
    let countInARow=0;
    while(true){
        sendKeyToDoc("keydown","n",78,{
            altKey:true,
            ctrlKey:true
        });
        sendKeyToDoc("keyup","n",78,{
            altKey:true,
            ctrlKey:true
        });
        sendKeyToDoc("keydown","l",78,{
            altKey:true,
            ctrlKey:true
        });
        sendKeyToDoc("keyup","l",78,{
            altKey:true,
            ctrlKey:true
        });
        let selectedUrl=document.getElementById("docs-linkbubble-link-text").href;
        if(urls.includes(selectedUrl)){
            countInARow++;
            if(countInARow==urls.length){
                break;
            }
        }else{
            urls.push(selectedUrl);
            countInARow=0;
        }
    }
    return urls;
}
module.exports=getDocLinks;