'use strict'

var parensRe = /\(.+\)/
var parensBeginWithSpaceRe = /\(\s+/
var parensEndWithSpaceRe = /\s+\)+/


/**
 * @description checks for extra space when using parens
 * @param {string} [line] curr line being linted
 * @param {string} [origLine] curr line before being stripped
 * @return {boolean} true if placeholder used, false if not
 */
var parenSpace = function( line, origLine ) {
	if ( !parensRe.test( origLine ) ) { return }

	var hasStartSpace = parensBeginWithSpaceRe.test( origLine )
	var hasEndSpace = parensEndWithSpaceRe.test( origLine )

	if ( this.state.conf === 'always' && !( hasStartSpace && hasEndSpace ) ) {
		this.msg( '( param1, param2 ) is preferred over (param1, param2)' )
	}
	else if ( this.state.conf === 'never' && ( hasStartSpace || hasEndSpace ) ) {
		this.msg( '(param1, param2) is preferred over ( param1, param2 )' )
	}

	return hasStartSpace && hasEndSpace
}

module.exports = parenSpace
