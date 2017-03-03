'use strict';

/**
 * @description If we disallowed css literals, check for them and return true if found.
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if @css found, false if not.
 * @todo do i still work with setState?
 */
const cssLiteral = function(line) {
  if (this.state.hashOrCSS) {
    return;
  }
  let isCSSLiteral = false;
  const index = line.indexOf('@css');

  if (index !== -1) {
    isCSSLiteral = true;
  }

  if (this.state.conf === 'never' && isCSSLiteral === true) {
    this.msg('css literals are disallowed', index);
  }

  return isCSSLiteral;
};

module.exports = cssLiteral;
