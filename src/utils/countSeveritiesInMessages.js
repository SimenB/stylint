'use strict'

var _ = require( 'lodash' )

function countSeverities( messages ) {
	var warningsOrErrors = _.countBy( messages, 'severity' )
	var errorCount = warningsOrErrors.error || 0
	var warningCount = warningsOrErrors.warning || 0

	return { errorCount: errorCount, warningCount: warningCount }
}

module.exports = countSeverities
