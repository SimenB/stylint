'use strict';

/**
 * @description Check for keyframes, which have some special rules.
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if keyframes starting, false if not.
 */
const rootStart = function(line) {
  if (this.state.root || !this.state.testsEnabled) {
    return;
  }

  if (line.indexOf(':root') !== -1) {
    this.state.root = true;
  }

  return this.state.root;
};

module.exports = rootStart;
