'use strict';

const valueRe = /(margin|padding)+[:| ]/;

/**
 * @description Check for 0 0 0 0 or 50px 0 50px 0 type mistakes
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if efficient, false if not.
 */
const efficient = function (line) {
  // line doesn't have margin or padding then there's nothing to do here
  if (!valueRe.test(line)) {
    return;
  }

  let isEfficient = true;
  const arr = this.splitAndStrip(new RegExp(/[\s\t]/), line);

  // if margin or padding we run the tests
  // if line is potentially inefficient it needs to be at least this long
  if (arr.length > 2) {
    // ex: margin 0 5px
    if (arr.length === 3) {
      // ex margin 0 0
      if (arr[1] === arr[2]) {
        isEfficient = false;
      }
    }
    // ex margin 0 5px 10px
    else if (arr.length === 4 && arr[1] === arr[3]) {
      // ex margin 0 5px 0
      isEfficient = false;
    }
    // ex margin 0 50px 10px 7px
    else if (arr.length === 5) {
      // ex margin 0 5px 0 5px or
      if ((arr[1] === arr[3] && arr[2] === arr[4]) ||
        (arr[1] !== arr[3] && arr[2] === arr[4])) {
        isEfficient = false;
      }
    }
  }

  const index = line.indexOf(arr[1]);

  if (this.state.conf === 'never' && isEfficient === true) {
    this.msg('the value on this line is too succinct', index);
  }
  else if (this.state.conf === 'always' && isEfficient === false) {
    this.msg('the value on this line could be more succinct', index);
  }

  return isEfficient;
};

module.exports = efficient;
