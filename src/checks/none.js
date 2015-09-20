'use strict'

var alwaysRe = /((border)|(outline))+(:|\s)+0(?!-)/
var neverRe = /((border)|(outline))+(:|\s)+(none)+(?!-)/


/**
 * @description checks for border none or outline none
 * @param {string} [line] curr line being linted
 * @return {boolean} true if none used, false if not
 */
var none = function( line ) {
	if ( line.indexOf( 'border' ) === -1 &&
		line.indexOf( 'outline' ) === -1 ) {
		return
	}

	var badSyntax = false

	// return true if border|outline is followed by a 0
	if ( this.state.conf === 'always' && alwaysRe.test( line ) === false ) {
		badSyntax = true
		this.msg( 'none is preferred over 0' )
	}
	// return true if border|outline is followed by none
	else if ( this.state.conf === 'never' && neverRe.test( line ) === true ) {
		badSyntax = true
		this.msg( '0 is preferred over none' )
	}

	return badSyntax
}

module.exports = none
