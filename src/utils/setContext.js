'use strict';

/**
 * @description Whitespace is the 1 true god of stylus, set context based on that.
 * @param {string} [line] - Curr line being linted.
 * @returns {number} Number of indents deep we are.
 */
const setContext = function(line) {
  let context = 0;
  let indentPref = this.config.indentPref.expect || this.config.indentPref;

  this.state.prevContext = this.state.context;

  // no matter what our indentPref is,
  // try to get context as best as possible

  // get context if tabs
  if (line.charAt(0) === '\t') {
    context = /^\t+/.exec(line)[0].length;
  } else if (line.charAt(0) === ' ') {
    // get context if spaces
    // set default if no indentPref set
    if (typeof indentPref !== 'number') {
      indentPref = 2;
    }

    context = /^\s+/.exec(line)[0].length / indentPref;
  }

  return context;
};

module.exports = setContext;
