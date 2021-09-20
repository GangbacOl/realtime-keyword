const DAILY_POPULAR_URL =
  "https://trends.google.com/trends/trendingsearches/daily?geo=KR";

class GoogleTrend extends Crawler {
  constructor() {
    super(DAILY_POPULAR_URL);
  }

  _getGeoSelector() {}

  async getAbleGeos() {
    const dailyPage = this._request();
    console.log(dailyPage);
  }
}

export default GoogleTrend;
