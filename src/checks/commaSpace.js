'use strict'

// if , is present on line and its not followed by a space
var noSpaceRe = /,\S/
var withSpaceRe = /,\s/
var removeQuotesRe = /(["'])(?:(?=(\\?))\2.)*?\1/g

/**
 * @description if set to always, enforces spaces after commas. if set to never, disallows spaces
 * @param {string} [line] curr line being linted
 * @returns {boolean} true if space missing, false if not
 */
var commaSpace = function( line ) {
	// conditions where testing isn't needed.
	// 1: no comma on line at all
	// 2: comma ends the line, as in a list
	// 3: comma is
	if ( line.indexOf( ',' ) === -1 ||
		line.trim().indexOf( ',' ) === line.length - 1 ) {
		return
	}

	var trimmedLine = line.replace( removeQuotesRe, '' ).trim()

	// if after stripping out quotes, we don't have a comma
	// then exit without an error (the comma was inside the quotes)
	if ( trimmedLine.indexOf( ',' ) === -1 ) return

	// if spaces should be follow commas, but there is no space on the line
	if ( this.state.conf === 'always' && noSpaceRe.test( trimmedLine ) ) {
		this.msg( 'commas must be followed by a space for readability' )
	}
	// if spaces should not be followed by a comma, but there are spaces anyway
	else if ( this.state.conf === 'never' && withSpaceRe.test( trimmedLine ) ) {
		this.msg( 'spaces after commas are not allowed' )
	}

	return noSpaceRe.test( trimmedLine ) && !withSpaceRe.test( trimmedLine )
}

module.exports = commaSpace
