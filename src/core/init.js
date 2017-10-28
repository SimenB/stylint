'use strict';

const defaults = require('lodash').defaults;
const getFormatter = require('../utils/getFormatter');

const defaultOptions = {
  watch: false,
  config: null,
  strict: false,
  callback() {},
  formatter: null,
};

/**
 * @description Initialization function, does routing and kicks it all off.
 * @param {Object} [options] - Options passed to stylint.
 * @param {string} [pathPassed] - Path to files to lint.
 * @returns {Function} Always returns a function, determined by cli flags.
 */
const init = function(options, pathPassed) {
  // TODO: Object.assign
  const optionsWithDefaults = defaults(options || {}, defaultOptions);

  this.config = this.setConfig(optionsWithDefaults.config);

  const formatterName = optionsWithDefaults.formatter || this.config.formatter.name;
  this.formatter = getFormatter(formatterName);

  // if you want to use transparent mixins, pass in an array of them
  // this also covers the (more common probably) custom property use case
  this.cache.customProperties = this.config.mixins || this.config.customProperties || this.cache.customProperties;

  // if path/ passed in use that for the dir
  this.state.path = pathPassed || this.state.path || process.cwd();
  this.callback = this.callback || optionsWithDefaults.callback;

  // fire watch or read based on flag
  if (optionsWithDefaults.watch) {
    return this.watch();
  }

  return this;
};

module.exports = init;
