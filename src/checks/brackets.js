'use strict';

const ignoreRe = /\(.*\)|@extend|\(|if|for(?!\w)|else|return|@block|@media|@import|@require|,$/;
const stripRe = /(?=\S)\[\S+\]|(\.|#)\w+/;
const equalsRe = /( =|\?=|\+=|-=)+/;
const validJSON = require('../data/valid.json');

/**
 * @description Check for brackets
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if bracket found, false if not.
 */
const brackets = function (line) {
  // in order if:
  // 1 in hash or css block
  // 2 variable or hash or block
  // 3 mixin
  // 4 .selector,
  if (this.state.hashOrCSS ||
    line.trim().length === 0 ||
    equalsRe.test(line) ||
    ignoreRe.test(line)) {
    return;
  }

  let arr = ['hint'];
  let isCSS = false;
  let isMixin = false;
  let bracket = false;

  if (this.state.conf === 'never') {
    // ex: $hash = { is ok but .class = { is not
    if (line.indexOf('{') !== -1 &&
      line.indexOf('=') === -1 &&
      line.indexOf('}') === -1) {
      bracket = true;
    }
    // ex: } is okay if ending a hash. otherwise it is NOT okay
    // one liners are lame but ok ( check for = { )
    else if (line.indexOf('}') !== -1 && line.indexOf('{') === -1) {
      bracket = true;
    }
  }
  else if (this.state.conf === 'always') {
    if (bracket === false) {
      arr = this.splitAndStrip(new RegExp(/[\s\t,:]/), line);

      if (typeof arr[0] !== 'undefined') {
        arr[0] = arr[0].replace(stripRe, '').trim();

        isCSS = validJSON.css.some(css => arr[0] === css || this.checkPrefix(arr[0], css, validJSON));

        isMixin = this.cache.customProperties.some(mixin => arr[0] === mixin);
      }

      // basically, we don't care about properties like margin or padding
      if (line.trim().indexOf('}') !== -1 || isCSS || isMixin) {
        return;
      }

      if (line.indexOf('{') !== -1) {
        bracket = true;
        this.state.openBracket = true;
      }
      // ex: } is okay if ending a hash. otherwise it is NOT okay
      else if (line.indexOf('}') !== -1 && this.state.openBracket) {
        bracket = true;
        this.state.openBracket = false;
      }
    }
  }

  if (this.state.conf === 'never' && bracket === true) {
    this.msg('unnecessary bracket', line.indexOf('{'));
  }
  else if (this.state.conf === 'always' && bracket === false) {
    this.msg('always use brackets when defining selectors', line.length);
  }

  return bracket;
};

module.exports = brackets;
