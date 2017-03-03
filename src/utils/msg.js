'use strict';

/**
 * @description Add violation to an array.
 * @param {string} message - Outputted string from one of the checks.
 * @param {number} [column] - Column number if applicable to the check.
 */
const msg = function(message, column) {
  this.cache.messages.push({
    message,
    severity: this.state.severity,
    file: this.cache.file,
    line: this.cache.lineNo,
    column,
    source: this.cache.source,
    ruleId: this.cache.rule,
  });
};

module.exports = msg;
