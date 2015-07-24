'use strict'

/**
 * @description basically just sets the severity and routes output to the reporter
 * @param {string} [str] outputted string from one of the checks
 * @returns {Function} push formatted output to appropriate array
*/
var msg = function( str ) {
	var arr

	// determine which group the msg belongs to
	arr = this.state.severity === 'Warning' ? this.cache.warnings : this.cache.errs

	this.cache.allViolations.push( {
		message: str,
		severity: this.state.severity,
		file: this.cache.file,
		lineNo: this.cache.lineNo,
		origLine: this.cache.origLine
	} )

	// push the final output
	return arr.push( this.reporter( str ) )
}

module.exports = msg
