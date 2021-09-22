import { geoList } from "./constants.js";

class GeoOptionPanel {
  constructor() {
    this.geoList = geoList;
    this.geoOptionKey = "geoSetting";
  }

  getGeoList() {
    return this.geoList;
  }

  getCurrentGeoSetting() {
    return new Promise((resolve) =>
      chrome.storage.local.get([this.geoOptionKey], (result) => resolve(result))
    );
  }
}

export default GeoOptionPanel;
