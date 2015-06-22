'use strict';

/**
 * @description whitespace is the 1 tru god of stylus, set context based on that
 * @param {string} [line] curr line being linted
 * @returns {number} # of indents deep we are
*/
var setContext = function( line ) {
	var i = 0;
	var context = 0;
	var whitespace = 0;

	this.state.prevContext = this.state.context;

	if ( line.charAt( 0 ) === '\t' ) {
		while ( line.charAt( i++ ) === '\t' ) {
			context++;
		}
	}
	if ( line.charAt( 0 ) === ' ' ) {
		line.split( /[\s\t]/ ).forEach( function( val ) {
			if ( val.length === 0 ) {
				whitespace++; // spaces or tabs
			}
			else {
				context = whitespace / this.config.indentPref;
			}
		}.bind( this ) );
	}

	return context;
};

module.exports = setContext;
