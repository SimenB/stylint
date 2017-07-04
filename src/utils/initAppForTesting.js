'use strict';

const stylint = require('../../index');

const initAppForTesting = () => {
  const app = stylint().create();

  // turn on strict mode from this point and turn off unnecessary logging
  app.state.quiet = true;
  app.state.watching = true;

  return app;
}

module.exports = initAppForTesting;
