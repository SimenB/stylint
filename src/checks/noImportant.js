'use strict'


/**
 * @description disallows use of !important
 * @param {string} [line] curr line being linted
 * @return {boolean} true if !important used, false if not
 */
var noImportant = function( line ) {
	var important = false

	var indexOfImportant = line.indexOf( '!important' );
	if ( indexOfImportant !== -1 ) {
		important = true
	}

	if ( important === true ) {
		this.msg( '!important is disallowed ', indexOfImportant )
	}

	return important
}

module.exports = noImportant
