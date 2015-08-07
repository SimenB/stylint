'use strict'


/**
 * @description checks that the # of spaces used is consistent
 * @returns {boolean} true if # of spaces correct, false if not
 */
var indentPref = function() {
	if ( typeof this.state.conf !== 'number' ) { return }

	var indentCorrect = true

	if ( this.state.context % 1 !== 0 ) {
		indentCorrect = false
	}

	if ( indentCorrect === false ) {
		this.msg( 'incorrect # of spaces for indent, use ' + this.state.conf )
	}

	return indentCorrect
}

module.exports = indentPref
