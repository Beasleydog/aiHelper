const grabYoutubeTranscript = require("./grabYoutubeTranscript");

function pageContent() {
    let locHref = location.href;
    window.addEventListener("load", () => {
        //Extra buffer, sometimes onload isnt enough for some reason
        setTimeout(async () => {
            console.log("load");
            let msg = {
                type: "AI_HELPER_SCRAPE_RETURN",
                url: locHref,
                text: document.body.innerText,
                html: document.body.innerHTML
            };

            //Special case for youtube
            if (location.href.includes("https://www.youtube.com/watch")) {
                msg.text = await grabYoutubeTranscript();
            }

            if (window.opener) {
                //What a nice, respectful tab
                window.opener.postMessage(msg, "*");
            } else {
                //This is a stupid tab
                //We need to amplify the message to the opener
                const requesterOrigin = locHref.split("AI_HELPER_SCRAPE_")[1];
                const w = window.open(`${requesterOrigin}#AI_HELPER_AMPLIFY_SCRAPE`, "_blank");

                let c = (e) => {
                    if (e.data != "AI_HELPER_AMPLIFY_SCRAPE_READY") return;
                    msg.type = "AI_HELPER_SCRAPE_AMPLIFY";
                    w.postMessage(msg, "*");
                    window.removeEventListener("message", c);
                    w.close();

                    //Incase we somehowe werent closed already
                    window.close();
                }

                window.addEventListener("message", c);
            }
        }, 500);
    });
}
module.exports = pageContent;
