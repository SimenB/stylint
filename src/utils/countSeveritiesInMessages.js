'use strict';

const _ = require('lodash');

function countSeverities (messages) {
  const warningsOrErrors = _.countBy(messages, 'severity');
  const errorCount = warningsOrErrors.error || 0;
  const warningCount = warningsOrErrors.warning || 0;

  return { errorCount: errorCount, warningCount: warningCount };
}

module.exports = countSeverities;
