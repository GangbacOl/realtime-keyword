import TrendCrawler from "./TrendCrawler.js";
import GoogleTrend from "./GoogleTrend.js";
import Tester from "./Tester.js";

const crawler = new TrendCrawler();
const init = async () => {
  console.log("hot items syncing");
  await crawler.setHotItems();
  chrome.storage.local.set({ hotItems: crawler.getHotItems() }, () => {});
};
init();
setInterval(async () => {
  init();
}, 60 * 3 * 1000);

const googleTrend = new GoogleTrend();
const tester = new Tester();
