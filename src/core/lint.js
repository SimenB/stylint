'use strict';

const entries = require('object.entries');

/**
 * @description Runs tests according to config (or all if strict is true).
 * @returns {Function | undefined} Undefined if just calling the method, function is linting over.
 */
const lint = function() {
  entries(Object.getPrototypeOf(this).lintMethods).filter(check => this.config[check[0]]).forEach(check => {
    const checkName = check[0];
    const checkFunc = check[1];
    // save config rule name for use in reporters
    this.cache.rule = checkName;
    // state.conf === 'always' || 'never' || etc
    this.state.conf = this.config[checkName].expect || this.config[checkName];
    // state.severity === 'error' || 'warning'
    this.state.severity = this.config[checkName].error ? 'error' : 'warning';
    // run the actual check against the line
    checkFunc.call(this, this.cache.line, this.cache.source);
  });

  // save our curr context so we can use it next time
  // this.cache.prevFile = this.cache.file
  this.cache.prevLine = this.cache.line;
};

module.exports = lint;
