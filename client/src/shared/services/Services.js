import React from 'react';

import analyticsService from './analytics';
import hotjarService from './hotjar';

const isProduction = (process.env.NODE_ENV === 'production');

const Services = () => {

  React.useEffect(() => {

    if (!isProduction) {
      return;
    }

    analyticsService.init();
    hotjarService.init();
    
  }, []);

  return null;

};

export default Services;
