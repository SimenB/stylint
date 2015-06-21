'use strict';

var leadZeroRe = /0\.(?!\.)/;


/**
 * @description check for leading 0 on numbers ( 0.5 )
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if mixed, false if not
 */
var leadingZero = function( line ) {
	if ( line.indexOf( '.' ) === -1 ) { return; }

	var leadZero = false;
	var arr = this.splitAndStrip( new RegExp( /[\s\t]/ ), line );

	// return true if leading zero found and not used as part of range
	leadZero = arr.some( function( val ) {
		return leadZeroRe.test( val );
	} );

	if ( this.state.conf === 'always' && !leadZero ) {
		this.msg( 'leading zeros for decimal points are required' );
	}
	else if ( this.state.conf === 'never' && leadZero ) {
		this.msg( 'leading zeros for decimal points are unecessary' );
	}

	return leadZero;
};

module.exports = leadingZero;
