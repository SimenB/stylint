'use strict';

/**
 * @description Check for specified extend preference
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if wrong style used, false if not.
 */
const extendPref = function(line) {
  if (line.indexOf('@extend') === -1) {
    return;
  }

  let extendIncorrect = false;

  // prefer @extends to @extend
  // extremely petty, i know
  if (this.state.conf === '@extends' && line.indexOf('@extends ') === -1) {
    extendIncorrect = true;
  } else if (this.state.conf === '@extend' && line.indexOf('@extend ') === -1) {
    // else @extend is your pref
    extendIncorrect = true;
  }

  if (extendIncorrect === true) {
    this.msg(`please use ${this.state.conf}`);
  }

  return extendIncorrect;
};

module.exports = extendPref;
