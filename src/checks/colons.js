'use strict'

var validJSON = require( '../data/valid.json' )
// we only want to check colons on properties/values
var ignoreRe = /( (^[&$=#>.]) | + | , | ~ | { | } | \( | if | for(?!\w) | else | @block | @media | @import | @require )/m


/**
 * @description check for colons
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if colon found, false if not
 */
var colons = function( line ) {
	if ( ignoreRe.test( line ) || this.state.context === 0 ) { return }

	// null just so i can test better
	var colon
	var hasPseudo = false
	var arr = this.splitAndStrip( new RegExp( /\s/ ), line )

	if ( this.state.conf === 'always' &&
		arr.length > 1 &&
		arr[0].indexOf( ':' ) === -1 ) {
		colon = false
	}
	// : is allowed in hashes
	else if ( this.state.conf === 'never' &&
		!this.state.hash && line.indexOf( ':' ) !== -1 ) {

		// check for pseudo selector first
		hasPseudo = validJSON.pseudo.some( function( val ) {
			return line.indexOf( val ) !== -1
		} )

		if ( !hasPseudo ) {
			colon = true
		}
	}

	if ( this.state.conf === 'always' && colon === false ) {
		this.msg( 'missing colon between property and value' )
	}
	else if ( this.state.conf === 'never' && colon === true ) {
		this.msg( 'unecessary colon found' )
	}

	return colon
}

module.exports = colons
