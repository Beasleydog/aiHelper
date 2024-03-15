//This function is used if a tab that is stupid is opened.
//Stupid: doesnt like being opened programmatically so it clears opener, making it impossible to normally postmsg back
function amplifyScrapedContent() {
    const c = (e) => {
        if (e.data.type != "AI_HELPER_SCRAPE_AMPLIFY") return;
        let msg = {
            ...e.data,
            type: "AI_HELPER_SCRAPE_RETURN",
        };
        console.log(msg);
        const bc = new BroadcastChannel("AI_HELPER_SCRAPE_AMPLIFY");
        bc.postMessage(msg);
        bc.close();

        window.removeEventListener("message", c);
    }
    window.addEventListener("message", c);
    console.log("opener is ", window.opener);
    window.opener.postMessage("AI_HELPER_AMPLIFY_SCRAPE_READY", "*");
}
module.exports = amplifyScrapedContent;