import { geoList } from "../constants.js";

const ptbRouter = (msg) => {
  const { task, data } = msg;

  if (task === "change-geo") {
    const { geoCode } = data;
    const isGeoExist = !(
      geoList.find((element) => element.id === geoCode) === -1
    );

    if (!isGeoExist) {
      return false;
    }
  }
};

export default ptbRouter;
