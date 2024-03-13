function pageContent(){
    console.log("THIS IS MY OPENER",opener);
    let msg = {
        url:location.href,
        text:document.body.innerText,
        html:document.body.innerHTML
    };
    console.log("PAGE CONTENT");
    console.log(msg);
    const bc = new BroadcastChannel("AI_HELPER_SCRAPE_CONTENT");
    //Send msg to bc
    bc.postMessage(msg);
}
module.exports = pageContent;
