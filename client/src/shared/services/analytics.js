import loggerService from './logger';

class AnalyticsService {

  constructor() {
    this.instance = null;
  }

  init() {

    loggerService.info('[AnalyticsService] init');
    
    if (!window.dataLayer) {
      loggerService.info('[AnalyticsService] init > ga not found');
      return;
    }

    loggerService.info('[AnalyticsService] init > ga found and running');

    this.instance = window.dataLayer;

  }

}

export default new AnalyticsService();
