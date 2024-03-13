async function requestContent(url){
    return new Promise((res)=>{
    let w = window.open(`${url}#AI_HELPER_SCRAPE`, "_blank");
    let c = (e)=>{
        const urlOrigin = new URL(url).origin;
        if(e.origin!=urlOrigin)return;
        window.removeEventListener("message", c);
        w.close();
        res(e.data);
    };
    window.addEventListener("message", c);
});
}
module.exports=requestContent;