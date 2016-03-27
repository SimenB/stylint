'use strict'

/**
 * @description basically just sets the severity and routes output to the reporter
 * @param {string} [str] outputted string from one of the checks
 * @param {number} [column] column where error was found
 * @returns {Function} push formatted output to appropriate array
*/
var msg = function( str, column ) {
	var arr

	this.cache.columnNo = typeof column !== 'undefined' ? column : -1; 

	// determine which group the msg belongs to
	arr = this.state.severity === 'Warning' ? this.cache.warnings : this.cache.errs

	// push the final output
	return arr.push( this.reporter( str ) )
}

module.exports = msg
