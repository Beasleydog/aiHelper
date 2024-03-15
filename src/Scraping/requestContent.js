async function requestContent(url) {
    return new Promise((res) => {
        //Note that we can't just match by url. Sometabs redirect or add wacky stuff to the url when you visit.
        let REQUEST_ID = Math.random().toString(36).substring(7);

        let currentOrigin = new URL(location.href).origin;
        let w = window.open(`${url}#AI_HELPER_SCRAPE_${REQUEST_ID}_${currentOrigin}`, "_blank");
        
        let c = (e) => {
            console.log("Message recieved",e.data);
            if (e.data.type != "AI_HELPER_SCRAPE_RETURN") return;
            if(e.data.REQUEST_ID != REQUEST_ID) return;
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