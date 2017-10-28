'use strict';

/**
 * @description Runs tests according to config (or all if strict is true).
 * @returns {Function | undefined} Undefined if just calling the method, function is linting over.
 */
const lint = function() {
  let method;
  const checks = Object.getPrototypeOf(this).lintMethods;

  // TODO: Fix this!
  /* eslint-disable */
  for (method in checks) {
    if (checks.hasOwnProperty(method)) {
      /* eslint-enable */
      if (this.config[method]) {
        // save config rule name for use in formatters
        this.cache.rule = method;
        // state.conf === 'always' || 'never' || etc
        this.state.conf = this.config[method].expect || this.config[method];
        // state.severity === 'error' || 'warning'
        this.state.severity = this.config[method].error ? 'error' : 'warning';
        // run the actual check against the line
        checks[method].call(this, this.cache.line, this.cache.source);
      }
    }
  }

  // save our curr context so we can use it next time
  // this.cache.prevFile = this.cache.file
  this.cache.prevLine = this.cache.line;
};

module.exports = lint;
