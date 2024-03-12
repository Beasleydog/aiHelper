function shouldInjectScraper(url){
    return url.includes("AI_HELPER_SCRAPE");
}
module.exports=shouldInjectScraper;