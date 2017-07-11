'use strict';

const path = require('path');
const _ = require('lodash');

const isPath = x => x.indexOf('/') > -1;

const getNameFromFormatter = formatterObject => {
  if (!formatterObject.name) {
    throw new TypeError("Formatter configuration 'name' key is missing.");
  }
  return formatterObject.name;
};

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
