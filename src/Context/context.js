const requestContent = require('../Scraping/requestContent');

function Context() {
    //Store url content across multiple requests
    this.urlCache = [];
    this.urls = [];
    this.addedContexts = [];
    this.addURL = async (url) => {
        if (this.urls.find(x => x.url === url)) return;

        const cached = this.urlCache.find(x => x.url === url);

        let newUrlObj = {
            url: url,
            content: cached?.content || (await requestContent(url)).text
        }

        if (!cached) {
            this.urlCache.push(newUrlObj);
        }

        this.urls.push(newUrlObj);
    }
    this.addContext = (c) => {
        this.addedContexts.push(c);
    }
    this.fullContext = () => {
        const allWebsiteContextsString = this.urls.map(x => {
            return `<${x.url}>
                ${x.content}
            </${x.url}>`
        }).join("\n");

        const addedContextsString = this.addedContexts.join("\n");

        const fullContext = `${allWebsiteContextsString}
        ${addedContextsString}`;

        return fullContext;
    }
    this.extractURLS = (t) => {
        return t;
    };
    this.clear = () => {
        this.urls = [];
        this.addedContexts = [];
    }
}
module.exports = Context;