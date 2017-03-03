'use strict';

// check for unnecessary tabs or whitespace at eol
const whitespaceRe = /[ \t]+$/;
// anything BUT whitespace (we don't want to return false positives on empty lines)
const anythingElseRe = /[^ \t]/;

/**
 * @description Check for trailing whitespace.
 * @param  {string} [line] - Current line being linted.
 * @param {string} [source] - Current line before being stripped.
 * @returns {boolean} True if whitespace found, false if not..
 */
const trailingWhitespace = function(line, source) {
  let whitespace = false;
  const hasWhitespace = whitespaceRe.exec(source);

  // not an empty line, with whitespace at the end
  if (anythingElseRe.test(source) && hasWhitespace) {
    whitespace = true;
  }

  if (this.state.conf === 'never' && whitespace) {
    this.msg('trailing whitespace', hasWhitespace.index);
  }

  return whitespace;
};

module.exports = trailingWhitespace;
