import _ from 'lodash';

import loggerService from './logger';

class HotjarService {

  constructor() {
    this.instance = null;
  }

  init() {

    loggerService.info('[HotjarService] init');

    if (!_.isFunction(window.hj)) {
      loggerService.info('[HotjarService] init > hj not found');
      return;
    }

    loggerService.info('[HotjarService] init > hj found and running');

    this.instance = window.hj;

  }

  trigger(eventName) {

    loggerService.info('[HotjarService] trigger', eventName);

    if (!this.instance) {
      loggerService.info('[HotjarService] trigger > no instance running');
      return;
    }

    this.instance('trigger', eventName);

  }

}

export default new HotjarService();
