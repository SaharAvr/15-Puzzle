import _ from 'lodash';

class AnalyticsService {

  constructor() {
    this.instance = null;
  }

  init() {

    if (!_.has(window.dataLayer)) {
      return;
    }

    this.instance = window.dataLayer;

  }

}

export default new AnalyticsService();
