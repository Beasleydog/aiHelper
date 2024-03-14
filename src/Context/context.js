const requestContent = require('../Scraping/requestContent');

function Context(text){
    this.text = text;
    this.urls=[];
    this.addURL=async (url)=>{
        let newUrlObj = {
            url:url,
            content:await requestContent(url)
        }
        this.urls.push(url);
    }
    this.extractURLS=(t)=>{
        return t;   
    };
}
module.exports = Context;