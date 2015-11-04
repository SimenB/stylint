'use strict'

var decimalRe = /\.\d/
var leadZeroRe = /0\.(?!\.)/
var nonZeroRe = /[123456789]\./


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( !decimalRe.test( line ) ) { return }

	var leadZero

	// return true if leading zero found and not used as part of range
	if ( leadZeroRe.test( line ) ) {
		leadZero = true
	}
	else if ( !leadZeroRe.test( line ) && !nonZeroRe.test( line ) ) {
		leadZero = false
	}

	if ( this.state.conf === 'always' && leadZero === false ) {
		this.msg( 'leading zeros for decimal points are required' )
	}
	else if ( this.state.conf === 'never' && leadZero === true ) {
		this.msg( 'leading zeros for decimal points are unecessary' )
	}

	return leadZero
}

module.exports = leadingZero
