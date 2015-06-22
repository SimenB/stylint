'use strict';

var validJSON = require( '../data/valid.json' );
// we only want to check colons on properties/values
var ignoreRe = /[&$.#>]|\(|(if)|(for)|(else)|(@block)|=$|=\s|,$/gm;
// quickie just to alleviate a bug with 1.0.0
var pseudo = [
	'{',
	'::-moz-inner-focus',
	':active',
	':checked',
	':disabled',
	':empty',
	':enabled',
	':first-child',
	':first-letter',
	':first-line',
	':first-of-type',
	':focus',
	':hover',
	':last-child',
	':last-of-type',
	':link',
	':not',
	':nth-child',
	':nth-last-child',
	':nth-last-of-type',
	':nth-of-type',
	':only-child',
	':only-of-type',
	':optional',
	':selection',
	'::selection',
	':target',
	':visited'
];


/**
 * @description check for colons
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if colon found, false if not
 */
var colons = function( line ) {
	if ( ignoreRe.test( line ) || this.state.context === 0 ) { return; }

	var colon;
	var hasPseudo = false;
	// var validCSS = false;
	var arr = line.split( ' ' );

	if ( this.state.conf === 'always' && arr.length > 1 && arr[0].indexOf( ':' ) === -1 ) {
		// validCSS = validJSON.css.some( function( css ) {
		// 	return arr[0] === css || this.checkPrefix( arr[0], css, validJSON );
		// }.bind( this ) );

		colon = false;
		// if ( validCSS ) {
		// 	colon = false;
		// }
	}
	// : is allowed in hashes
	else if ( this.state.conf === 'never' && !this.state.hash && line.indexOf( ':' ) !== -1 ) {
		hasPseudo = pseudo.some( function( val ) {
			return line.indexOf( val ) !== -1;
		} );

		if ( !hasPseudo ) {
			colon = true;
		}
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
