'use strict';

// check if using selector before we count depth
// definitely not the best way to do this,
const ampRe = /^(&|\/{1}|\.\.\/|~\/)/;

/**
 * @description Check nesting depth.
 * @param  {string} [line] - Current line being linted.
 * @returns {boolean} True if nesting is too deep, false if not..
 * @todo this is kinda not 100% reliable in it's current form, also could be refactors
 */
const depthLimit = function(line) {
  let context = this.state.context;
  let badNesting = false;
  const limit = this.config.depthLimit ? this.config.depthLimit : 5;

  // trim string and check if line starts with &
  // reduce context in that case
  // @TODO not really ideal
  if (ampRe.test(line.trim())) {
    context -= 1;
  }

  if (context > limit) {
    badNesting = true;
  }

  if (badNesting === true) {
    this.msg(`selector depth greater than ${limit}`);
  }

  return badNesting;
};

module.exports = depthLimit;
