'use strict';

const commentRe = /(^\/\/)/;

/**
 * @description Check if line starts with comment.
 * @param  {string} [line] - Current line being linted.
 * @returns {boolean} True if comment found, false if not.
 */
const startsWithComment = function(line) {
  let starts = false;

  // ex }, but only if we've already establish that we're not in a hash
  if (line.indexOf('//') !== -1 && commentRe.test(line.trim())) {
    starts = true;
  }

  return starts;
};

module.exports = startsWithComment;
