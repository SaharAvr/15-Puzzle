import _ from 'lodash';

class HotjarService {

  constructor() {
    this.instance = null;
  }

  init() {

    if (!_.isFunction(window.hj)) {
      return;
    }

    this.instance = window.hj;

  }

  trigger(eventName) {

    if (!this.instance) {
      return;
    }

    this.instance('trigger', eventName);

  }

}

export default new HotjarService();
