import React from 'react';

import loggerService from './logger';
import analyticsService from './analytics';
import hotjarService from './hotjar';

const isProduction = (process.env.NODE_ENV === 'production');

const Services = () => {

  React.useEffect(() => {

    if (!isProduction) {
      return;
    }

    loggerService.init();
    analyticsService.init();
    hotjarService.init();
    
  }, []);

  return null;

};

export default Services;
