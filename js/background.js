function parseXML (data) {
    var xml, tmp;
    if (!data || typeof data !== "string") {
        return null;
    }
    try {
        if (window.DOMParser) { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, "text/xml");
        } else { // IE
            xml = new ActiveXObject("Microsoft.XMLDOM");
            xml.async = "false";
            xml.loadXML(data);
        }
    } catch(e) {
        xml = undefined;
    }
    if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
        throw new Error("Invalid XML: " + data);
    }
    return xml;
}

function xmlToJson(xml) {
   
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for(var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = xmlToJson(item);
            } else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xmlToJson(item));
            }
        }
    }
    return obj;
}

class Crawler {
    static isDownloading = false
    constructor(target) {
        this.TARGET_URL = target
    }
    TARGET_URL =  ""
    recentReponse
    timeStamp = new Date()

    _request = async () => { // return result
        const result = {}
        if ( Crawler.isDownloading ) {
            return { result: false, msg: "Already downloading..." }
        }
        try {
            const response = await fetch(this.TARGET_URL)
            result.result = true
            result.data = response
            this.recentResponse = response
            this.timeStamp = new Date()
        } catch (err) {
            console.log(err)
            result.result = false
        } finally {
            Crawler.isDownloading = false
            return result
        }
    }

}

class TrendCrawler extends Crawler {
    
    parsedXml
    hotItems

    constructor () {
        super("https://trends.google.com/trends/trendingsearches/daily/rss?geo=KR")
    }

    _getText = async () => {
        const result = await this._request()
        if ( !result ) {
            return null
        }
        const text = await result.data.text()
        return text
    }

    parseHotItems = (xmlDoc) => {
        const items = xmlDoc?.rss?.channel?.item
        return items
    }

    syncHotItems = async () => {
        try {
            const xmlString = await this._getText()
            
        } catch (err) {
            console.log(err)
        }
    }
    
    storeData = (data) => {
        try {
            const stringData = JSON.stringify(data)
            chrome.storage.sync.set({key: value}, function() {
                console.log("recent timeStamp : ",this.timeStamp)
            });
        } catch (err) {
            return { result: false }
        }
    }
}


const tester = async () => {
    const crawler = new TrendCrawler()
    console.log(" crawling 시작 ")
    console.log(crawler.timeStamp)
    console.log(crawler)
    
    console.log ( xmlToJson(parseXML(await crawler._getXmlString()) ))
}

tester()