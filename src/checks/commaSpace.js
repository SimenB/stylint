'use strict'

// if , is present on line and its not followed by a space
var noSpaceRe = /,\S/


/**
 * @description if set to always, enforces spaces after commas. if set to never, disallows spaces
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if space missing, false if not
 */
var commaSpace = function( line ) {
	// conditions where testing isn't needed.
	// 1: no comma on line at all
	// 2: comma ends the line, as in a list
	if ( line.indexOf( ',' ) === -1 ||
		line.indexOf( ',' ) === line.length - 1 ) {
		return
	}

	var noSpaceAfterComma = false

	if ( noSpaceRe.test( line ) ) {
		noSpaceAfterComma = true
	}

	// if spaces should be follow commas, but there is no space on the line
	if ( this.state.conf === 'always' && noSpaceAfterComma === true ) {
		this.msg( 'commas must be followed by a space for readability' )
	}
	// if spaces should not be followed by a comma, but there are spaces anyway
	else if ( this.state.conf === 'never' && noSpaceAfterComma === false ) {
		this.msg( 'spaces after commas are not allowed' )
	}

	return noSpaceAfterComma
}

module.exports = commaSpace
