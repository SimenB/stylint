'use strict'

var tabs = /\t/ // was a tab used, at all
var spaces = /( {2,})+/ // check for 2 or more spaces (if hard tabs, shouldn't find anything)


/**
 * @description check for mixed spaces and tabs
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if mixed, false if not
 */
var mixed = function( line ) {
	var isMixed = false
	var indentPref = this.config.indentPref.expect || this.config.indentPref
	var isNum = typeof indentPref === 'number'

	// regexp obj or null
	var hasTabs = tabs.exec( line )
	var hasSpaces = spaces.exec( line )

	// if this isnt set to false then we're indenting with spaces,
	// so check against tabs
	if ( isNum ) {
		if ( hasTabs ) {
			isMixed = true
		}
	}
	// else you're a hard tab believer (go you)
	// look for 2 or more spaces
	else if ( hasSpaces ) {
		isMixed = true
	}

	if ( isMixed === true ) {
		var index = isNum ? hasTabs.index : hasSpaces.index
		this.msg( 'mixed spaces and tabs', index )
	}

	return isMixed
}

module.exports = mixed
