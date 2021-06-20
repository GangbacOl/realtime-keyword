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
const getEpochDate = (targetDay) => {
    const standardDay = new Date('1970-01-01 00:00:00');
    const res = Math.abs(standardDay - targetDay) / 1000;
    console.log(res)
    const betweens = Math.floor(res / 86400);
    return betweens
}


class Crawler {
    static isDownloading = false
    constructor(target) {
        this.TARGET_URL = target
    }
    TARGET_URL =  ""
    recentResponse
    timeStamp = new Date()
    _getTimeStamp = () => {
        return this.timeStamp
    }
    _setTimeStamp = (timeStamp) => {
        this.timeStamp = timeStamp
    }

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
    surviveKeys = []
    constructor () {
        super("https://trends.google.com/trends/trendingsearches/daily/rss?geo=KR")
        this.surviveKeys = [
            "title",
            "ht:approx_traffic",
            "description",
            "pubDate",
            "ht:picture",
            "ht:news_item"
        ]
        this.keyChangeTo = {
            "ht:approx_traffic":"traffic",
            "ht:picture":"picture",
            "ht:news_item":"news_items",
        }
        this.newsKeyChangeTo = {
            "ht:news_item_title": "title",
            "ht:news_item_url": "url",
            "ht:news_item_source": "source"
        }
        this.MAX_NEWS_COUNT = 2
    }


    filterKeys = (items, surviveKeys, keysChangeTo) => { // all those are array
        const newItems = []
        items.forEach(item => {
            const newItem = {}
            surviveKeys.forEach(targetKey => {
                newItem[targetKey] = item[targetKey]
            })
            
            const changeKey = (item,keysChangeTo) => {
                for (let key of Object.keys(keysChangeTo)) {
                    // custom
                    let tmp = item[key]
                    if ( key === "ht:news_item" && tmp !== null) {
                        if (!tmp.length) {
                            tmp = [tmp]
                        }
                        tmp = this.filterKeys(tmp,Object.keys(this.newsKeyChangeTo),this.newsKeyChangeTo,1)
                    }
                    delete item[key]
                    item[keysChangeTo[key]] = tmp
                }
                
                return item
            }
            
            newItems.push(changeKey(newItem,keysChangeTo))
        })

        return newItems
    }

    divideByDate = (items) => {
        const today = getEpochDate((new Date()))
        let dividedDatas = [[]]
        for (let key of Object.keys(items)) {
            const itemDate = getEpochDate(new Date(items[key].pubDate["#text"]))
            const divideIndex = (today - itemDate).toString()
            
            if (dividedDatas.length <= divideIndex) { 
                dividedDatas.push([items[key]])
            } else {
                dividedDatas[divideIndex].push(items[key])
            }
        }
        return dividedDatas
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

    setHotItems = async () => {
        try {
            const xmlString = await this._getText()
            const xmlDoc = xmlToJson(parseXML(xmlString))
            let items = this.parseHotItems(xmlDoc)
            items = Object.values(items)
            items = this.filterKeys(items,this.surviveKeys,this.keyChangeTo)
            this.hotItems = this.divideByDate(items)
        } catch (err) {
            console.log("error occured")
            console.log(err)
        }
    }

    getHotItems = () => {
        return this.hotItems
    }
    
}

const crawler = new TrendCrawler()
const init = async () => {
    console.log("hot items syncing")
    await crawler.setHotItems()
    chrome.storage.local.set({'hotItems': crawler.getHotItems()}, ()=>{});
}
init ()
setInterval(async () => {
    init()
}, (60 * 3 * 1000));

class Tester {

    displayTimeStamp = () => {
        console.log(crawler._getTimeStamp())
    }
    
    displayItems = () => {
        chrome.storage.local.get(['hotItems'], function(result) {
            console.log(result)
        })
    }

    displayItemDays = () => {
        chrome.storage.local.get(['hotItems'], function(result) {
            console.log(result)
            const hotItems = result.hotItems
            console.log(hotItems)
            console.log(Object.keys(hotItems))
            
            for (let dayAgo of Object.keys(hotItems) ) {
                hotItems[dayAgo].forEach ( e=> {
                    console.log(`${dayAgo}일 전`)
                    console.log(e)
                })
            }
        });
    }
    
    setItems = () => {
        crawler.setHotItems()
        console.log("setted")
    }
}

const tester = new Tester()