import React from 'react';

import hotjarService from './hotjar';

const isProduction = (process.env.NODE_ENV === 'production');

const Services = () => {

  React.useEffect(() => {

    if (!isProduction) {
      return;
    }

    hotjarService.init();
    
  }, []);

  return null;

};

export default Services;
