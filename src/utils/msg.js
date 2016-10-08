'use strict'


/**
 * @description add violation to an array
 * @param {string} [message] outputted string from one of the checks
 * @param {number} [column] column number if applicable to the check
 * @returns {void}
 */
var msg = function( message, column ) {
	this.cache.messages.push( {
		message: message,
		severity: this.state.severity,
		file: this.cache.file,
		lineNo: this.cache.lineNo,
		col: column,
		origLine: this.cache.origLine,
		rule: this.cache.rule
	} )
}

module.exports = msg
