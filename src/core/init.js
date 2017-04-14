'use strict';

const defaults = require('lodash').defaults;

const defaultOptions = {
  watch: false,
  config: null,
  strict: false,
  callback() {},
  formatter: null
};

const loadFormatter = function(formatter) {
  try {
    this.reporter = require(`../formatters/${formatter}`);
  }
  catch (err) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }

    throw `${formatter} is an invalid formatter.`
  }
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

  // if you want to use transparent mixins, pass in an array of them
  // this also covers the (more common probably) custom property use case
  this.cache.customProperties = this.config.mixins || this.config.customProperties || this.cache.customProperties;

  // we do the check here just in case
  // they don't pass in a reporter when using a custom config
  /* eslint-disable import/no-dynamic-require */
  if (this.config.formatter) {
    this.reporter = loadFormatter(this.config.format);
  } else {
    this.reporter = require('./reporter');
  }
  /* eslint-enable */

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
