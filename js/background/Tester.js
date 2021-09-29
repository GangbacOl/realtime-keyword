import GeoOptionPanel from "./GeoOptionPanel.js";
import { PORT_NAME } from "./constants.js";

class Tester {
  constructor() {
    this.geoOptionPanel = new GeoOptionPanel();
  }

  displayTimeStamp() {
    console.log(crawler._getTimeStamp());
  }

  displayItems() {
    chrome.storage.local.get(["hotItems"], function (result) {
      console.log(result);
    });
  }

  displayItemDays() {
    chrome.storage.local.get(["hotItems"], function (result) {
      console.log(result);
      const hotItems = result.hotItems;
      console.log(hotItems);
      console.log(Object.keys(hotItems));

      for (let dayAgo of Object.keys(hotItems)) {
        hotItems[dayAgo].forEach((e) => {
          console.log(`${dayAgo}일 전`);
          console.log(e);
        });
      }
    });
  }

  displayGeos() {
    console.log(this.geoOptionPanel.getGeoList());
  }

  async displayCurrentGeoSetting() {
    console.log(await this.geoOptionPanel.getCurrentGeoSetting());
  }

  async setGeo(geo) {
    console.log(await this.geoOptionPanel.setGeoSetting(geo));
  }

  async helloToPopupToBackgroundPort() {
    let port = chrome.runtime.connect({ name: PORT_NAME });
  }

  setItems() {
    crawler.setHotItems();
    console.log("setted");
  }
}

export default Tester;
