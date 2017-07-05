'use strict';

const path = require('path');
const process = require('process');
const FORMATTER_DIR = '../formatters/';
const isPath = (x) => x.indexOf('/') > -1

const getFormatter = function(formatterName = 'default') {
  if (typeof formatterName !== 'string') {
    throw new TypeError('Formatter must be a valid string.');
  }

  let prefix = '../formatters/';

  if (isPath(formatterName)) {
    prefix = '';
  }

  const formatterPath = path.resolve(`${prefix}${formatterName}`);

  try {
    return require(formatterPath);
  } catch (error) {
    error.message = `Formatter failed to load: ${formatterPath}\nError:\n\n${error.message}`;
    throw error;
  }
};

module.exports = getFormatter;
