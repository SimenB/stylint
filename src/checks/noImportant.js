'use strict';

/**
 * @description disallows use of !important
 * @param {string} [line] curr line being linted
 * @return {boolean} true if !important used, false if not
 */
const noImportant = function (line) {
  let important = false;
  const index = line.indexOf('!important');

  // return true if border|outline is followed by a 0
  if (index !== -1) {
    important = true;
  }

  if (important === true) {
    this.msg('!important is disallowed', index);
  }

  return important;
};

module.exports = noImportant;
