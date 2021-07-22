import _ from 'lodash';

const apiBase = (() => {

  if (process.env.NODE_ENV === 'development') {
    return `${window.location.protocol}//${window.location.hostname}:${process.env.REACT_APP_LOCAL_SERVER_PORT}${process.env.REACT_APP_API_BASE}`;
  }

  return process.env.REACT_APP_API_BASE;
  
})();

const endpoints = {
  CONFIGURATION: '/configuration',
  RECORD: '/record',
  LEADERBOARD: '/leaderboard',
};

const restUrls = _.reduce(endpoints, (res, endpoint, endpointKey) => {
  res[endpointKey] = `${apiBase}${endpoint}`;
  return res;
}, {});

export default restUrls;
