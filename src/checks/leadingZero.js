'use strict'

var decimalRe = /[^\d+](0+\.\d+)|[\s,\(](\.\d+)/i
var leadZeroRe = /[^\d+](0+\.\d+)/g
var nonZeroRe = /[\s,\(](\.\d+)/g
var match


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean|undefined} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( !decimalRe.test( line ) ) { return }

	leadZeroRe.lastIndex = 0
	nonZeroRe.lastIndex = 0

	if ( this.state.conf === 'always' ) {
		while ( ( match = nonZeroRe.exec( line ) ) !== null ) {
			this.msg( 'leading zeros for decimal points are required', line.indexOf( match[1], match.index ) )
		}
	}
	else if ( this.state.conf === 'never' ) {
		while ( ( match = leadZeroRe.exec( line ) ) !== null ) {
			this.msg( 'leading zeros for decimal points are unnecessary', line.indexOf( match[1], match.index ) )
		}
	}

	return leadZeroRe.test( line )
}

module.exports = leadingZero
