'use strict';

// we only want to check semicolons on properties/values
var ignoreRe = /[&$.#=>]|(if)|(for)|(else)|(@block)/gm; // 3


/**
 * @description check that selector properties are sorted accordingly
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var semicolons = function( line ) {
	var semicolon = false;

	if ( this.state.conf === 'never' && line.indexOf( ';' ) !== -1 ) {
		semicolon = true;
	}
	else if ( this.state.conf === 'always' &&
		!ignoreRe.test( line ) &&
		this.state.context > 0 ) {

		if ( line.indexOf( ';' ) !== -1 ) {
			semicolon = true;
		}
	}

	if ( this.state.conf === 'never' && semicolon ) {
		this.msg( 'unecessary semicolon found' );
	}
	else if ( this.state.conf === 'always' && !semicolon ) {
		this.msg( 'missing semicolon' );
	}

	return semicolon;
};

module.exports = semicolons;
