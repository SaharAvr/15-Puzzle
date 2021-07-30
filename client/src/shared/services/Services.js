import React from 'react';

import hotjarService from './hotjar';

const Services = () => {

  React.useEffect(() => {
    hotjarService.init();
  }, []);

  return null;

};

export default Services;
