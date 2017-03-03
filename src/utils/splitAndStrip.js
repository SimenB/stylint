'use strict';

/**
 * @description Alliteration. Split a str according to re, and filter out empty indexes.
 * @param {Object} [re] - Regex object for splitting.
 * @param {string} [line] - Curr line being linted.
 * @returns {Array} Split and filtered array.
*/
const splitAndStrip = function(re, line) {
  return line.split(re).filter(str => str.length > 0);
};

module.exports = splitAndStrip;
