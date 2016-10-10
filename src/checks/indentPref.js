'use strict';

/**
 * @description Checks that the # of spaces used is consistent
 * @returns {boolean} True if # of spaces correct, false if not.
 */
const indentPref = function () {
  const spaces = this.state.conf;
  const context = this.state.context;

  if (typeof spaces !== 'number') {
    return;
  }

  let indentCorrect = true;

  if (context % 1 !== 0) {
    indentCorrect = false;
  }

  // if spaces === 2 and context === 1.5 (meaning 1.5 levels... or 3 spaces)
  // then the index for the warning msg is 2 * 1.5, or 3 spaces
  const index = spaces * context;

  if (indentCorrect === false) {
    this.msg(`incorrect # of spaces for indent, use ${spaces}`, index);
  }

  return indentCorrect;
};

module.exports = indentPref;
