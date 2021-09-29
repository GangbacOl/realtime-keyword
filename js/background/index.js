import TrendCrawler from "./TrendCrawler.js";
import portRouter from './portRouter/index.js'
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

const tester = new Tester();


chrome.runtime.onConnect.addListener(portRouter)

tester.displayGeos();
tester.displayCurrentGeoSetting();
tester.setGeo({ id: "KR", name: "대한민국" });
tester.displayCurrentGeoSetting();
