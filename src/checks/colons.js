'use strict';

// we only want to check colons on properties/values
var ignoreRe = /[&$.#>]|(if)|(for)|(else)|(@block)|=$|=\s/gm;


/**
 * @description check for colons
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if colon found, false if not
 */
var colons = function( line ) {
	if ( ignoreRe.test( line ) || this.state.context === 0 ) { return; }

	var colon;
	var arr = line.split( ' ' );

	if ( this.state.conf === 'always' && arr[0].indexOf( ':' ) === -1 ) {
		colon = false;
	}
	// : is allowed in hashes
	else if ( this.state.conf === 'never' && !this.state.hash && line.indexOf( ':' ) !== -1 ) {
		colon = true;
	}

	if ( this.state.conf === 'always' && colon === false ) {
		this.msg( 'missing colon between property and value' );
	}
	else if ( this.state.conf === 'never' && colon === true ) {
		this.msg( 'unecessary colon found' );
	}

	return colon;
};

module.exports = colons;
