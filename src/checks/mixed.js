'use strict';

// was a tab used, at all
const tabs = /\t/;
// check for 2 or more spaces (if hard tabs, shouldn't find anything)
const spaces = /( {2,})+/;
// don't throw false positives if line ends in comment
const trimRightRe = /( |\t)+(\/\/)+.+$/gm;

/**
 * @description Check for mixed spaces and tabs.
 * @param {string} [line] - Current line being linted.
 * @param {string} [source] - Current line before being stripped.
 * @returns {boolean} True if mixed, false if not.
 */
const mixed = function (line, source) {
  const trimRight = source.replace(trimRightRe, '');
  let isMixed = false;
  const indentPref = this.config.indentPref.expect || this.config.indentPref;
  const isNum = typeof indentPref === 'number';

  // regexp obj or null
  const hasTabs = tabs.exec(trimRight);
  const hasSpaces = spaces.exec(trimRight);

  // if this isnt set to false then we're indenting with spaces,
  // so check against tabs
  if (isNum) {
    if (hasTabs) {
      isMixed = true;
    }
  }
  // else you're a hard tab believer (go you)
  // look for 2 or more spaces
  else if (hasSpaces) {
    isMixed = true;
  }

  if (isMixed === true) {
    const index = isNum ? hasTabs.index : hasSpaces.index;
    this.msg('mixed spaces and tabs', index);
  }

  return isMixed;
};

module.exports = mixed;
