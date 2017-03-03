'use strict';

const aboveZeroRe = /\d0/;
const hasUnitRe = /[ :]0+?(?=px|%|em|rem|v(h|w)|v(min|max)|ex|ch|mm|cm|in|pt|pc|mozmm)/;
const relativeValRe = /line-height|font-size|font-weight/;

/**
 * @description Check for 0unit.
 * @param {string} [line] - Current line being linted.
 * @returns {boolean | undefined} True if has units, else false, undefined if skipped.
 */
const zeroUnits = function(line) {
  // if in keyframes don't check
  // if no 0 on line don't check
  // if relative values like font-weight, don't check
  if (this.state.keyframes || line.indexOf('0') === -1 || relativeValRe.test(line)) {
    return;
  }

  let isCorrect = true;
  const always = this.state.conf === 'always';
  const never = this.state.conf === 'never';
  const hasUnit = hasUnitRe.exec(line);
  const aboveZero = aboveZeroRe.exec(line);

  // if config set to never and 0 is followed by any unit
  if (never && hasUnit) {
    isCorrect = false;
  } else if (always && (!hasUnit && !aboveZero)) {
    // if config set to always, we need to do an extra check
    // to avoid throwing false positions on numbers like 50px
    isCorrect = false;
  }

  if (never && isCorrect === false) {
    this.msg('0 is preferred. Unit value is unnecessary', hasUnit.index);
  } else if (always && isCorrect === false) {
    this.msg('Including the unit value is preferred');
  }

  return isCorrect;
};

module.exports = zeroUnits;
