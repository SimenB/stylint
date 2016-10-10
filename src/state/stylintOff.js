'use strict';

/**
 * @description Toggle stylint off.
 * @param  {string} [line] - Current line being linted.
 * @returns {boolean} True if stylint on, false if not.
 */
const stylintOff = function (line) {
  if (!this.state.testsEnabled) {
    return;
  }

  // ex: $hash = { is ok but .class = { is not
  if (line.indexOf('@stylint off') !== -1) {
    this.state.testsEnabled = false;
  }

  return this.state.testsEnabled;
};

module.exports = stylintOff;
