'use strict';

/**
 * @description Disallows use of a specific list of key words.
 * @param {string} [line] - Current line being linted.
 * @returns {boolean} True if function is banned, false if not.
 */
const bannedFunctions = function(line) {
  let found = false;
  const bannedFunctionList = this.config.bannedFunctions || [];
  let index = -1;

  bannedFunctionList.forEach(func => {
    index = line.indexOf(func);
    if (index !== -1) {
      found = true;
      this.msg(`unexpected banned function ${func} encountered`, index);
    }
  });

  return found;
};

module.exports = bannedFunctions;
