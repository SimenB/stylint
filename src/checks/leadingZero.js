'use strict'

var decimalRe = /(?:^|[^a-z])\.\d/i
var leadZeroRe = /(?:^|\D)0\.\d/
var nonZeroRe = /(?:^|\D)\.\d/


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( !decimalRe.test( line ) ) { return }

	var leadZeroFound = leadZeroRe.test( line )
	var leadZeroMissing = nonZeroRe.test( line )

	if ( this.state.conf === 'always' && leadZeroMissing ) {
		this.msg( 'leading zeros for decimal points are required' )
	}
	else if ( this.state.conf === 'never' && leadZeroFound ) {
		this.msg( 'leading zeros for decimal points are unecessary' )
	}

	return leadZeroFound
}

module.exports = leadingZero
