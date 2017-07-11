'use strict';

const path = require('path');
const _ = require('lodash');

const isPath = x => x.indexOf('/') > -1;

/**
 * @description Returns the name of the provided formatter object.
 * @param {Object} formatterObject - A formatter configuration object.
 * @returns {string} The name of the formatter.
 */
const getNameFromFormatter = formatterObject => {
  if (!formatterObject.name) {
    throw new TypeError("Formatter configuration 'name' key is missing.");
  }
  return formatterObject.name;
};

/**
 * @description Dynamically loads a formatter using the provided path.
 * @param {string} formatterPath - The path to the formatter.
 * @returns {Function} The stylint formatter located at the provided path.
 */
const loadFormatter = formatterPath => {
  try {
    /* eslint-disable import/no-dynamic-require */
    return require(formatterPath);
    /* eslint-enable */
  } catch (error) {
    error.message = `Formatter failed to load: ${formatterPath}\nError:\n\n${error.message}`;
    throw error;
  }
};

/**
 * @description Provided with a formatter name or configuration object, this
 *   returns a valid formatter function. The returned formatter can be a
 *   formatter native to Stylint, a third-party formatter included
 *   in the project, or a separate file.
 * @param {Object|string|void} formatter - The desired formatter.
 * @returns {Function} A formatter function that formats a Stylint report.
 */
const getFormatter = function(formatter) {
  let formatterName = formatter || 'default';

  if (_.isObject(formatter)) {
    formatterName = getNameFromFormatter(formatter);

    if (formatter.thirdParty) {
      return loadFormatter(formatterName);
    }
  }

  let prefix = path.join('src', 'formatters');

  if (isPath(formatterName)) {
    prefix = '';
  }

  return loadFormatter(path.resolve(prefix, formatterName));
};

module.exports = getFormatter;
