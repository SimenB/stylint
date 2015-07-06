'use strict'

var decimalRe = /\.\d/
var leadZeroRe = /0\.(?!\.)/


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( !decimalRe.test( line ) ) { return }

	var leadZero = false

	// return true if leading zero found and not used as part of range
	if ( leadZeroRe.test( line ) ) {
		leadZero = true
	}

	if ( this.state.conf === 'always' && !leadZero ) {
		this.msg( 'leading zeros for decimal points are required' )
	}
	else if ( this.state.conf === 'never' && leadZero ) {
		this.msg( 'leading zeros for decimal points are unecessary' )
	}

	return leadZero
}

module.exports = leadingZero
