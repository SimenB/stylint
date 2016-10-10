'use strict';


/**
 * @description add violation to an array
 * @param {string} [message] outputted string from one of the checks
 * @param {number} [column] column number if applicable to the check
 * @returns {void}
 */
const msg = function (message, column) {
  this.cache.messages.push({
    message: message,
    severity: this.state.severity,
    file: this.cache.file,
    line: this.cache.lineNo,
    column: column,
    source: this.cache.source,
    ruleId: this.cache.rule
  });
};

module.exports = msg;
