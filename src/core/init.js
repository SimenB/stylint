'use strict';

const defaults = require('lodash').defaults;

const defaultOptions = {
  watch: false,
  config: null,
  strict: false,
  callback() {},
};

/**
 * @description initialization function, does routing and kicks it all off
 * @param {Object} [options] options passed to stylint
 * @param {String} [pathPassed] path to files to lint
 * @return {Function} always returns a function, determined by cli flags
 */
const init = function (options, pathPassed) {
  // TODO: Object.assign
  const optionsWithDefaults = defaults(options || {}, defaultOptions);

  this.config = this.setConfig(optionsWithDefaults.config);

  // if you want to use transparent mixins, pass in an array of them
  // this also covers the (more common probably) custom property use case
  this.cache.customProperties = this.config.mixins || this.config.customProperties || this.cache.customProperties;

  // we do the check here just in case
  // they don't pass in a reporter when using a custom config
  /* eslint-disable import/no-dynamic-require */
  if (optionsWithDefaults.reporter) {
    this.reporter = require(optionsWithDefaults.reporter);
  } else if (this.config.reporter) {
    this.reporter = require(this.config.reporter);
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
