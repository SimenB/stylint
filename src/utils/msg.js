'use strict';

/**
 * @description Add violation to an array.
 * @param {Object} report - Outputted string from one of the checks.
 * @param {string} report.message - Outputted string from one of the checks.
 * @param {number} [report.column] - Column number if applicable to the check.
 */
const msg = function(report) {
  const message = report.message;
  const column = report.column;

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
