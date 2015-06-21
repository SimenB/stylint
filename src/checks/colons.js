'use strict';


/**
 * @description check for colons
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if colon found, false if not
 */
var colons = function( line ) {
	var colon = false;

	// : is allowed in hashes
	if ( !this.state.hash && line.indexOf( ':' ) !== -1 ) {
		colon = true;
	}

	if ( colon ) {
		this.msg( 'unecessary colon found' );
	}

	return colon;
};

module.exports = colons;
