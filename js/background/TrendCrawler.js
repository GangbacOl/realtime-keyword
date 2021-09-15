import Crawler from "./Crawler.js";
import {
  xmlToJson,
  parseXML,
  getEpochDate,
  getSelectedKeysFromObject,
} from "./utils.js";

const KOREAN_TREND_RESOURCE_URL =
  "https://trends.google.com/trends/trendingsearches/daily/rss?geo=KR";

class TrendCrawler extends Crawler {
  parsedXml;
  hotItems;
  surviveKeys = [];
  constructor() {
    super(KOREAN_TREND_RESOURCE_URL);
    this.surviveKeys = [
      "title",
      "ht:approx_traffic",
      "description",
      "pubDate",
      "ht:picture",
      "ht:news_item",
    ];
    this.keyChangeTo = {
      "ht:approx_traffic": "traffic",
      "ht:picture": "picture",
      "ht:news_item": "news_items",
    };
    this.newsKeyChangeTo = {
      "ht:news_item_title": "title",
      "ht:news_item_url": "url",
      "ht:news_item_source": "source",
    };
    this.MAX_NEWS_COUNT = 2;
  }

  filterKeys = (items, surviveKeys, keysChangeTo) => {
    // all those are array
    const newItems = [];
    items.forEach((item) => {
      const newItem = { ...getSelectedKeysFromObject(item, surviveKeys) };

      const changeKey = (item, keysChangeTo) => {
        for (let key of Object.keys(keysChangeTo)) {
          // custom
          let tmp = item[key];
          if (key === "ht:news_item" && tmp !== null) {
            if (!tmp.length) {
              tmp = [tmp];
            }
            tmp = this.filterKeys(
              tmp,
              Object.keys(this.newsKeyChangeTo),
              this.newsKeyChangeTo,
              1
            );
          }
          delete item[key];
          item[keysChangeTo[key]] = tmp;
        }

        return item;
      };

      newItems.push(changeKey(newItem, keysChangeTo));
    });

    return newItems;
  };

  divideByDate = (items) => {
    const today = getEpochDate(new Date());
    let dividedDatas = [[]];
    for (let key of Object.keys(items)) {
      const itemDate = getEpochDate(new Date(items[key].pubDate["#text"]));
      const divideIndex = (today - itemDate).toString();

      if (dividedDatas.length <= divideIndex) {
        dividedDatas.push([items[key]]);
      } else {
        dividedDatas[divideIndex].push(items[key]);
      }
    }
    return dividedDatas;
  };

  _getText = async () => {
    const result = await this._request();
    if (!result) {
      return null;
    }
    const text = await result.data.text();
    return text;
  };

  _parseHotItems = (xmlDoc) => {
    const items = xmlDoc?.rss?.channel?.item;
    return items;
  };

  setHotItems = async () => {
    try {
      const xmlString = await this._getText();
      const xmlDoc = xmlToJson(parseXML(xmlString));
      let items = this._parseHotItems(xmlDoc);
      items = Object.values(items);
      items = this.filterKeys(items, this.surviveKeys, this.keyChangeTo);
      this.hotItems = this.divideByDate(items);
    } catch (err) {
      console.log("error occured");
      console.log(err);
    }
  };

  getHotItems = () => {
    return this.hotItems;
  };
}

export default TrendCrawler;
