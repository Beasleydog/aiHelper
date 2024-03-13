async function requestContent(url){
    return new Promise((res)=>{
    let w = window.open(`${url}#AI_HELPER_SCRAPE`, "_blank",{
        width:0,
        height:0,
        left:0,
        top:0,
        location:0,
        menubar:0,
        toolbar:0,
        status:0,
        scrollbars:0,
        resizable:0,
    });
    let c = (e)=>{
        console.log(e);
        return;
        if(e.origin!=urlOrigin)return;
        w.close();
        res(e.data);

        bc.close();
    };
    const bc = new BroadcastChannel("AI_HELPER_SCRAPE_CONTENT");
    bc.onmessage= c;
    console.log(bc);
});
}
module.exports=requestContent;