'use strict';

/**
 * @description wrapper for parse for programmatic use
 * @param {String} string the text to parse
 * @param {Object} [config] an object containing config to lint by
 * @param {String} [filename] the name of the file
 * @returns {Object} an object containing the complete report from linting
 */
const lintString = function (string, config, filename) {
  // reset stuff
  this.resetOnChange();

  if (config) {
    this.init({ config });
  }

  // make sure there is no output to the console
  this.state.quiet = true;

  // don't kill process
  this.state.watching = true;

  // never kill the linter
  this.config.maxErrors = null;
  this.config.maxWarnings = null;

  this.cache.files = [filename];

  return this.parse(null, [string], true);
};

module.exports = lintString;
