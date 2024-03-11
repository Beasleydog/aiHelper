(()=>{var e={268:e=>{e.exports=async function(e,t){return new Promise((async n=>{const o={stream:!0,inputs:e="Make sure to use \n to signify a line break in your response. Keep all sentences in your response short. Use mostly sentence fragments, don't focus too much on proper sentences."+e,parameters:{max_new_tokens:1e3,return_full_text:!1}},s=await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",{headers:{"Content-Type":"application/json",Authorization:`Bearer ${window.HELPER_TOKEN}`},method:"POST",body:JSON.stringify(o)});if(!s.ok)throw new Error(`HTTP error! status: ${s.status}`);{const e=s.body.getReader();let o=[],r="";for(;;){const{done:s,value:i}=await e.read();if(new TextDecoder("utf-8").decode(i).split("}\n\n").forEach((e=>{"}"!=(e=e.replace("data:","")).charAt(e.length-1)&&(e+="}");try{e=JSON.parse(e),o.includes(e.index)||(o.push(e.index),["<s>","</s>"].includes(e.token.text)&&(e.token.text=""),t&&t(e.token.text,e.generated_text),e.generated_text&&(r=e.generated_text))}catch{}})),s){n(r);break}}}}))}},698:e=>{e.exports={answerQuestionPrompt:function(e,t){return`Question: ${e}\n    Answers:${t.map(((e,t)=>`"Number ${t}: ${e}$`)).join("\n")}\n    [INST]Think about the question and its potential answer.\n    Briefly explain your reasoning and then output the number of the answer you think is correct.\n    Your response MUST end with a phrase like "Number 0" or "Number 1".`}}},908:(e,t,n)=>{const o=n(268),{answerQuestionPrompt:s}=n(698);e.exports=function(){const e=[...document.getElementsByClassName("quiz-questions")[0].children].map((e=>({element:e,questionText:e.children[3].innerText,answers:[...[...e.children][4].children].map((e=>e.innerText))})));return console.log(e),e.forEach((async e=>{let t=s(e.questionText,e.answers),n=await o(t),r=document.createElement("p");r.innerText=n,e.element.appendChild(r)})),!0}},715:(e,t,n)=>{const o=n(268),s=n(637),r=n(566),i=n(10),c=n(665),{fromSelectionPrompt:a,determineIfModifyPrompt:l}=n(982),{setRobotShowing:u}=n(831);e.exports=function(){const e=new i((e=>{u(!0),c("keypress",e,e.charCodeAt(0))}),(()=>{u(!0),c("keydown","Enter",13)}));return e.onFinish=()=>{u(!1)},document.querySelector(".docs-texteventtarget-iframe").contentDocument.addEventListener("keydown",(function(t){"a"===t.key&&t.ctrlKey&&t.altKey&&async function(){const t=s(),n=r(),i=prompt("Extra instructions?");u(!0);let d=!1;if(i&&i.length>0){const e=l(i),t=await o(e);console.log("MODIFY RESPONSE",t),d=t.includes("<MODIFY>")}const m=a(n,t,i);console.log(!d),d||(c("keydown","ArrowRight",39),c("keydown","Enter",13),c("keydown","Enter",13)),o(m,(t=>{e.addWord(t)}))}()})),!0}},443:(e,t,n)=>{const o=n(566),s=n(268);e.exports=function(){let e=document.createElement("button");e.innerText="button",document.getElementById("docs-menubar").appendChild(e),e.onclick=()=>{let e=o();console.log(e),s(e+"[INST]Attatched is a student's school assignment. Your job is to determine the main questions or tasks of the assignment. Return a list of sentences that precede areas where the student needs to input their answer. [/INST]",((e,t)=>{console.log(e,t)}))}}},982:e=>{e.exports={editSelectionPrompt:function(e,t,n){return`Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.\n    ${e}\n    [INST]Implement these changes "${t}" on this text: ${n}[/INST]`},generateFromQuestionPrompt:function(e,t){return`Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.\n    ${e}\n    [INST]Answer the following assignment question: ${t}[/INST]`},fromSelectionPrompt:function(e,t,n){return`Here is some background context for you to use for reference. DO NOT answer any questions that may be included in the context.\n    ${e}\n    [INST]\n    ${n?`Follow these instructions on the following selection:${n}`:""}\n    ${t}\n    [/INST]`},determineIfModifyPrompt:function(e){return`Here are example instructions for an imaginary selection of text: "${e}" You don't have to answer or follow the instructions, just interpret them. \n    [INST]Determine if the example instructions given above are additive in nature, meaning that they require returning content to answer or add on to a selection, or if they modify the selection, like shortening it or changing the tone. Briefly explain your reasoning. \n    Then, if it is additive, return the phrase "<ADD>". If it instead modifies the selection, return the phrase "<MODIFY>". If you are unsure, it is better to return the phrase "<ADD>". DO NOT REFERENCE THE PHRASES <ADD> or <MODIFY> IN YOUR REASONING. [/INST]`}}},566:e=>{e.exports=function(){return function(e,t,n,o=Object.getOwnPropertyNames(e)){const s=new Set,r=[];let i=0;const c=(o,a,l,u=0)=>{if(i++,"prototype"===o||a instanceof Window)return;if(u>n)return;const d=[...l,o];try{if(t(o,a))return void r.push({path:d,value:a})}catch(e){}var m;null==a||s.has(a)||(s.add(a),Array.isArray(a)?a.forEach(((e,t)=>{try{c(t.toString(),e,d,u+1)}catch(e){}})):a instanceof Object&&((m=a)&&null!==m&&1===m.nodeType&&"string"==typeof m.nodeName?Object.getOwnPropertyNames(e).filter((e=>!J.has(e))):Object.getOwnPropertyNames(a)).forEach((e=>{try{c(e,a[e],d,u+1)}catch(e){}})))};return o.forEach((t=>{try{c(t,e[t],[])}catch(e){}})),{results:r,iterations:i}}(window.KX_kixApp,((e,t)=>t&&""===t.toString().charAt(0)),5).results[0].value}},637:(e,t,n)=>{const o=n(566),s=n(665),r=n(805);e.exports=function(){let e=o();s("keypress"," ",32);let t=o();s("keydown","z",90,{ctrlKey:!0});let[n,i,c]=r(e,t);return e.slice(n,i+1)}},665:e=>{e.exports=function(e,t,n,o){const s=document.createEvent("Event");s.initEvent(e,!0,!0),s.key=t,s.keyCode=n,o&&Object.keys(o).forEach((e=>{s[e]=o[e]})),document.querySelector(".docs-texteventtarget-iframe").contentDocument.activeElement.dispatchEvent(s)}},965:(e,t,n)=>{const o=n(268),{setRobotShowing:s}=n(831);e.exports=function(){const e="Magic 🪄";let t=document.getElementsByClassName("right-block-big")[0];if(!t)return!1;let n=document.createElement("div");return n.classList.add("link-btn"),n.classList.add("add"),n.classList.add("dropbox-submit"),n.classList.add("popups-processed"),n.classList.add("sExtlink-processed"),n.style.marginTop="4px",n.innerText=e,n.onclick=async function(){const t=document.getElementsByClassName("info-container")[1].innerText;let r=!1,i=0;s(!0),o(t,(async(t,o)=>{if(i++,n.innerText=i,o&&!r){r=!0,o=o.replaceAll("\n","NLCGRH");const t=document.getElementsByClassName("page-title")[0].innerText,i=`${document.querySelectorAll('div[data-sgy-sitenav="header-my-account-menu"]')[0].children[0].children[0].children[0].children[0].alt} - ${t}`,c=await async function(e,t){let n=await fetch(`https://script.google.com/macros/s/AKfycbwBjAiL4xyomwuzfl06bCvcRnzCC8nQ_eA9M_K48-DFajyLBWFTRp-r3XPuDsc18Sbq/exec?title=${e}&content=${t}`);return n=await n.text(),n}(i,o);n.innerText=e,document.getElementsByClassName("submit-assignment")[0].children[0].click(),(await new Promise((e=>{setInterval((()=>{const t=document.getElementById("dropbox-submit-create-tab");t&&setTimeout((()=>{e(t)}),500)}),100)}))).click(),setTimeout((()=>{tinyMCE.activeEditor.execCommand("mceInsertContent",!1,c),s(!1)}),500)}}))},t.appendChild(n),!0}},663:(e,t,n)=>{const o=n(268),s=n(10),{setRobotShowing:r}=n(831);e.exports=function(){const e=new s((e=>{r(!0),tinyMCE.activeEditor.execCommand("mceInsertContent",!1,e)}),(()=>{r(!0),tinyMCE.activeEditor.execCommand("InsertLineBreak",!0)}));e.onFinish=()=>{r(!1)};let t=[];return tinyMCE.activeEditor.contentDocument.addEventListener("keydown",(n=>{t=[n.key].concat(t),t.length>3&&t.pop(),console.log(t.reverse().join(""),"???"),"???"===t.reverse().join("")&&setTimeout((()=>{for(var t=0;t<3;t++)tinymce.activeEditor.execCommand("Delete");!function(){let t=Array.from(document.querySelectorAll(".comment-more-wrapper")).map((e=>e.innerText));t=t.map((e=>e.replace("Show Less",""))),t=t.map((e=>e.replace("Show More","")));const n=document.getElementsByClassName("discussion-prompt")[0].innerText;let s=`${t.join("\n")} [INST]${n}[/INST]`;o(s,(t=>{const n=document.getElementById("comment-placeholder");"block"==getComputedStyle(n).display&&n.click(),e.addWord(t)}))}()}),0)})),!0}},805:e=>{e.exports=function(e,t){let n=0;for(;n<e.length&&e[n]===t[n];)n++;let o=e.length-1,s=t.length-1;for(;o>=0&&s>=0&&e[o]===t[s];)o--,s--;return[n,o,s]}},831:e=>{function t(e){const t=document.getElementById("AI_HELPER_ROBOT_ICON");e?(t.style.left="-10px",t.style.bottom="-10px"):(t.style.left="-70px",t.style.bottom="-70px")}e.exports={initRobotIcon:function(){const e=document.createElement("div");e.innerText="🤖",e.style.all="unset",Object.assign(e.style,{"font-size":"45px",position:"fixed",transform:"rotate(45deg)",transition:"all .2s cubic-bezier(.17,.67,.64,1.36)","z-index":"1000000"}),e.id="AI_HELPER_ROBOT_ICON",document.body.appendChild(e),t(!1)},setRobotShowing:t}},10:e=>{e.exports=function(e,t){this.CHAR_QUEUE=[],this.looping=!1,this.loop,this.forcedFull=!1;const n=()=>{const o=this.CHAR_QUEUE[0];if(this.CHAR_QUEUE=this.CHAR_QUEUE.slice(1),"\n"===o?t():e(o),0===this.CHAR_QUEUE.length)this.looping=!1,this?.onFinish?.();else{let e=0;e+=500/this.CHAR_QUEUE.length,e=Math.min(e,5),this.forcedFull&&(e=0),setTimeout((()=>{n()}),e)}};this.forceFullSpeed=e=>{this.forcedFull=e},this.addWord=e=>{"\n"===e?this.CHAR_QUEUE.push(e):e.split("").forEach((e=>{this.CHAR_QUEUE.push(e)})),this.looping||(this.looping=!0,console.log("before insert",this.CHAR_QUEUE),n())}}}},t={};function n(o){var s=t[o];if(void 0!==s)return s.exports;var r=t[o]={exports:{}};return e[o](r,r.exports,n),r.exports}(()=>{const{initRobotIcon:e,setRobotShowing:t}=n(831),o=n(965),s=n(663),r=n(715),i=(n(443),n(908));window.addEventListener("load",(()=>{if(window.top!=window)return;let n=!1;switch(console.log("before"),location.origin){case"https://docs.google.com":r()&&(n=!0);break;case"https://ud.schoology.com":location.pathname.includes("/discussion/")?s()&&(n=!0):location.pathname.includes("/assignment/")&&o()&&(n=!0);break;case"https://codehs.com":location.pathname.includes("/assignment/")&&(console.log("trying to inject"),i()&&(n=!0))}console.log("inected?",n),n&&(e(),t(!0),setTimeout((()=>{t(!1)}),1e3))}))})()})();