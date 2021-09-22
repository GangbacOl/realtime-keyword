import OptionPanel from "./OptionPanel.js";

class Tester {
  constructor() {
    this.optionPanel = new OptionPanel();
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
    console.log(optionPanel.getGeoList());
  }

  setItems() {
    crawler.setHotItems();
    console.log("setted");
  }
}

export default Tester;
