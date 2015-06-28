'use strict'

var selRe = /^[#.]+/
var commaRe = /,$/


/**
 * @description check for brackets
 * @param {string} [line] curr line being linted
 * @returns {boolean | undefined} true if bracket found, false if not, undefined if we skip
 */
var brackets = function( line ) {
	if ( this.state.hashOrCSS ) { return }
	if ( this.state.conf === 'always' && !selRe.test( line ) ) { return }
	if ( commaRe.test( line ) ) { return }

	var bracket = false

	if ( this.state.conf === 'never' ) {
		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf( '{' ) !== -1 && line.indexOf( '=' ) === -1 ) {
			bracket = true
			this.state.openBracket = true
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf( '}' ) !== -1 ) {
			bracket = true
			this.state.openBracket = false
		}
	}
	else if ( this.state.conf === 'always' ) {
		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf( '{' ) !== -1 && line.indexOf( '=' ) === -1 ) {
			bracket = true
			this.state.openBracket = true
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf( '}' ) !== -1 && this.state.openBracket ) {
			bracket = true
			this.state.openBracket = false
		}
	}

	if ( this.state.conf === 'never' && bracket ) {
		this.msg( 'unecessary bracket' )
	}
	else if ( this.state.conf === 'always' && !bracket ) {
		this.msg( 'always use brackets when defining selectors' )
	}

	return bracket
}

module.exports = brackets
