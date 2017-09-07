'use strict';

const path = require('path');

const NATIVE_FORMATTER_PATH = path.join('src', 'formatters');

/**
 * @description Dynamically loads a formatter using the provided path.
 * @param {string} formatterPath - The path to the formatter.
 * @returns {Function} The stylint formatter located at the provided path.
 * @throws Throws error when formatter is not found.
 */
const loadFormatter = function(formatterPath) {
  try {
    /* eslint-disable import/no-dynamic-require */
    return require(formatterPath);
    /* eslint-enable */
  } catch (error) {
    error.message = `Formatter failed to load: ${formatterPath}\n\n${error.message}`;
    throw error;
  }
};

/**
 * @description Provided with a formatter name or configuration object, this
 *   returns a valid formatter function. The returned formatter can be a
 *   formatter native to Stylint, a third-party formatter included
 *   in the project, or a separate file.
 * @param {string} formatter - The desired formatter.
 * @returns {Function} A formatter function that formats a Stylint report.
 * @throws Throws error when all formatter formats are attempted and none are found.
 */
const getFormatter = function(formatter) {
  const nativeFormatterPath = path.resolve(NATIVE_FORMATTER_PATH, formatter);
  const fileFormatterPath = path.resolve(formatter);
  let formatterFn;

  try {
    formatterFn = loadFormatter(nativeFormatterPath);
  } catch (nativeFormatterError) {
    try {
      formatterFn = loadFormatter(formatter);
    } catch (thirdPartyFormatterError) {
      formatterFn = loadFormatter(fileFormatterPath);
    }
  }

  return formatterFn;
};

module.exports = getFormatter;
