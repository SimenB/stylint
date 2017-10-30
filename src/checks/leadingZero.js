'use strict';

const decimalRe = /[^\d+](0+\.\d+)|[\s,(](\.\d+)/i;
const leadZeroRe = /[^\d+](0+\.\d+)/;
const nonZeroRe = /[\s,(](\.\d+)/;

/**
 * @description Check for leading 0 on numbers (0.5).
 * @param {string} [line] - Current line being linted.
 * @returns {boolean|undefined} True if mixed, false if not.
 */
const leadingZero = function(line) {
  if (!decimalRe.test(line)) {
    return;
  }

  const leadZeroFound = leadZeroRe.exec(line);
  const leadZeroMissing = nonZeroRe.exec(line);

  if (this.state.conf === 'always' && leadZeroMissing) {
    this.msg(
      'leading zeros for decimal points are required',
      leadZeroMissing.index
    );
  } else if (this.state.conf === 'never' && leadZeroFound) {
    this.msg(
      'leading zeros for decimal points are unnecessary',
      leadZeroFound.index
    );
  }

  return leadZeroFound;
};

module.exports = leadingZero;
