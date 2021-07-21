import _ from 'lodash';

const endpoints = {
  CONFIGURATION: '/configuration',
  RECORD: '/record',
  LEADERBOARD: '/leaderboard',
};

const restUrls = _.reduce(endpoints, (res, value, key) => {
  res[key] = `${process.env.REACT_APP_API_BASE}${value}`;
  return res;
}, {});

export default restUrls;
