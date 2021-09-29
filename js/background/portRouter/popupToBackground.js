import { geoList } from "../constants.js";
import GeoOptionPanel from "../GeoOptionPanel.js";

const geoOptionPanel = new GeoOptionPanel();

const ptbRouter = (msg) => {
  const { task, data } = msg;

  if (task === "change-geo") {
    const { geoCode } = data;
    const targetGeo = geoList.find((element) => element.id === geoCode);

    if (!targetGeo) {
      // undefined
      return false;
    }

    const settedSetting = await geoOptionPanel.setGeoSetting(targetGeo);
    if (settedSetting.id === targetGeo.id) {
      // success
    } else {
      // something wrong
    }
  }
};

export default ptbRouter;
