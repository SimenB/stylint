'use strict'

/**
 * @description add violation to an array
 * @param {string} [str] outputted string from one of the checks
 * @returns {Array} push formatted output to appropriate array
*/
var msg = function( str ) {
	return this.cache.allViolations.push( {
		message: str,
		severity: this.state.severity,
		file: this.cache.file,
		lineNo: this.cache.lineNo,
		origLine: this.cache.origLine
	} )
}

module.exports = msg
