async function grabYoutubeTranscript() {
    //Open transcript thingymabob
    await new Promise((res) => {
        let i = setInterval(() => {
            let expandButton = document.getElementById("expand");
            if (!expandButton) return;
            expandButton.click();
            document.getElementById("primary-button").children[0].children[0].children[0].click();
            clearInterval(i);
            res("done");
        }, 100);
    });

    //Wait for it to load
    const lines = await new Promise((res) => {
        let i = setInterval(() => {
            let lines = document.getElementsByClassName("segment style-scope ytd-transcript-segment-renderer");
            if (lines.length > 0) {
                clearInterval(i);
                res(lines);
            }
            console.log(lines.length);
        }, 100);
    });
    console.log("GOT LINES!");
    const fullTranscript = [...lines].map(x => x.children[2].innerText).join(" ");

    return fullTranscript;
}
module.exports = grabYoutubeTranscript;