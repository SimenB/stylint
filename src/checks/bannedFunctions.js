'use strict';

/**
 * @description Disallows use of a specific list of key words.
 * @param {Object} context - Linting context.
 * @param {Array<String>} [context.config] - Function to report violations.
 * @param {Function} context.report - Function to report violations.
 * @param {string} context.line - Current line being linted.
 * @returns {void} Nothing.
 */
const bannedFunctions = function(context) {
  const line = context.line;
  const bannedFunctionList = context.config || [];

  bannedFunctionList.forEach(func => {
    const index = line.indexOf(func);
    if (index !== -1) {
      context.report({
        message: `unexpected banned function ${func} encountered`,
        column: index,
      });
    }
  });
};

module.exports = bannedFunctions;
