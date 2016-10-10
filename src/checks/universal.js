'use strict';

// checks if * is a valid use case or not
const universalRe = /( |\w|\d|'|"|\*|\/)(\*)( |\w|\d|'|"|\*|\$|\=)/;

/**
 * @description check for * selector
 * @param {string} [line] current line being linted
 * @returns {boolean} true if * on line, false if not
 */
const universal = function (line) {
  const index = line.indexOf('*');
  if (index === -1) return;

  let hasUniversal = false;

  if (!universalRe.test(line)) {
    hasUniversal = true;
  }

  if (this.state.conf === 'never' && hasUniversal === true) {
    this.msg('* selector is disallowed', index);
  }

  return hasUniversal;
};

module.exports = universal;
