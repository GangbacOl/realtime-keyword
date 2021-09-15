class Crawler {
  static isDownloading = false;
  constructor(target) {
    this.TARGET_URL = target;
  }
  TARGET_URL = "";
  recentResponse;
  timeStamp = new Date();
  _getTimeStamp = () => {
    return this.timeStamp;
  };
  _setTimeStamp = (timeStamp) => {
    this.timeStamp = timeStamp;
  };

  _request = async () => {
    // return result
    const result = {};
    if (Crawler.isDownloading) {
      return { result: false, msg: "Already downloading..." };
    }
    try {
      const response = await fetch(this.TARGET_URL);
      result.result = true;
      result.data = response;
      this.recentResponse = response;
      this.timeStamp = new Date();
    } catch (err) {
      console.log(err);
      result.result = false;
    } finally {
      Crawler.isDownloading = false;
      return result;
    }
  };
}

export default Crawler;
