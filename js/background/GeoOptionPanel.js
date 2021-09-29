import { geoList, GEO_OPTION_KEY } from "./constants.js";

class GeoOptionPanel {
  constructor() {
    this.geoList = geoList;
    this.geoOptionKey = GEO_OPTION_KEY;
  }

  getGeoList() {
    return this.geoList;
  }

  getCurrentGeoSetting() {
    return new Promise((resolve) =>
      chrome.storage.local.get([this.geoOptionKey], (result) => resolve(result))
    );
  }

  setGeoSetting(geo) {
    return new Promise((resolve) =>
      chrome.storage.local.set({ [this.geoOptionKey]: geo }, async () => {
        resolve(await this.getCurrentGeoSetting());
      })
    );
  }
}

export default GeoOptionPanel;
