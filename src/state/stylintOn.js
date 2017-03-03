'use strict';

/**
 * @description Toggle stylint back on.
 * @param  {string} [line] - Current line being linted.
 * @returns {boolean} True if stylint on, false if not.
 */
const stylintOn = function(line) {
  if (this.state.testsEnabled) {
    return;
  }

  // ex: $hash = { is ok but .class = { is not
  if (line.indexOf('@stylint on') !== -1) {
    this.state.testsEnabled = true;
  }

  return this.state.testsEnabled;
};

module.exports = stylintOn;
