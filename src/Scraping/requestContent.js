async function requestContent(url) {
    return new Promise((res) => {
        let currentOrigin = new URL(location.href).origin;
        let w = window.open(`${url}#AI_HELPER_SCRAPE_${currentOrigin}`, "_blank");
        let c = (e) => {
            const urlOrigin = new URL(url).origin;
            try {
                if (e.currentTarget.name != "AI_HELPER_SCRAPE_AMPLIFY") {
                    if (e.origin != urlOrigin) {
                        console.log("ORIGIN RETURN");
                        return;
                    }
                }
            } catch { }
            if (e.data.type != "AI_HELPER_SCRAPE_RETURN") return;
            clean();
            res(e.data);
        };
        window.addEventListener("message", c);

        //Backup incase requested content is stupid
        const bc = new BroadcastChannel(`AI_HELPER_SCRAPE_AMPLIFY`);
        bc.onmessage = c;

        setTimeout(() => {
            //Failure ☹️
            clean();
            res({
                type: "AI_HELPER_SCRAPE_RETURN",
                url: url,
                text: "",
                html: ""
            });
        }, 30 * 1000);

        let clean = () => {
            w.close();
            window.removeEventListener("message", c);
            bc.close();
        }
    });
}
module.exports = requestContent;