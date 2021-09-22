import { geoList } from "./constants.js";

class OptionPanel {
  constructor() {
    this.geoList = geoList;
  }

  getGeoList() {
    return this.geoList;
  }
}

export default GoogleTrend;
