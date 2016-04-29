'use strict'

var stringRe = /(?=["'])(?:"[^"\\]*(?:\\[\s\S][^"\\]*)*"|'[^'\\]*(?:\\[\s\S][^'\\]*)*')/g


/**
 * @description check that quote style is consistent with config
 * @param  {string} [line] curr line being linted
 * @return {boolean} true if in order, false if not
 */
var quotePref = function( line ) {
	if ( line.indexOf( '"' ) === -1 && line.indexOf( "'" ) === -1 ) {
		return
	}

	stringRe.lastIndex = 0

	var badQuotes = false
	var match

	while ( ( match = stringRe.exec( line ) ) !== null ) {
		// if '' quotes preferred and match starts with double "" quote
		if ( this.state.conf === 'single' && match[0].indexOf( '"' ) === 0 ) {
			badQuotes = true
			this.msg( 'preferred quote style is ' + this.state.conf + ' quotes' )
		}
		// if "" quotes preferred and match start with single '' quote
		else if ( this.state.conf === 'double' && match[0].indexOf( "'" ) === 0 ) {
			badQuotes = true
			this.msg( 'preferred quote style is ' + this.state.conf + ' quotes' )
		}
	}

	return badQuotes
}

module.exports = quotePref
