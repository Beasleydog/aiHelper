const grabYoutubeTranscript = require("./grabYoutubeTranscript");

function pageContent() {
    let locHref = location.href;
    const regex = /AI_HELPER_SCRAPE_(.*?)_/;
    const REQUEST_ID = locHref.match(regex);

    window.addEventListener("load", () => {
        //Extra buffer, sometimes onload isnt enough for some reason
        setTimeout(async () => {
            console.log("load");
            let msg = {
                type: "AI_HELPER_SCRAPE_RETURN",
                url: locHref,
                text: document.body.innerText,
                html: document.body.innerHTML,
                REQUEST_ID: REQUEST_ID[1]
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
                const regex = /AI_HELPER_SCRAPE_.*_(.*)/;
                const requesterOrigin = locHref.match(regex)[1];
                const w = window.open(`${requesterOrigin}#AI_HELPER_AMPLIFY_SCRAPE`, "_blank");

                let c = (e) => {
                    if (e.data != "AI_HELPER_AMPLIFY_SCRAPE_READY") return;
                    msg.type = "AI_HELPER_SCRAPE_AMPLIFY";
                    w.postMessage(msg, "*");
                    window.removeEventListener("message", c);
                    setTimeout(()=>{
                    w.close();

                    // Incase we somehowe werent closed already
                    window.close();
                },500);
                }

                window.addEventListener("message", c);
            }
        }, 500);
    });
}
module.exports = pageContent;
