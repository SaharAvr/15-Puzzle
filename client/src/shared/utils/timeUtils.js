import _ from 'lodash';

export default {
  formatTime: time => _.replace((new Date(time)).toUTCString(), /.*(\d{2}:\d{2}:\d{2}).*/, '$1'),
};
