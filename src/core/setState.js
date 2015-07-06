'use strict'

// super simple.
// if theres anything on the line besides whitespace, it aint empty
var emptyLineRe = /\S/

/**
 * @description sets values like context, determine whether we even run tests, etc
 * @param {string} [line] curr line being linted
 * @returns {Function | undefined} undefined if we catch something, else lint()
 */
var setState = function( line ) {
	this.state.context = this.setContext( this.cache.line )

	// ignore the current line if @stylint ignore
	if ( this.cache.comment.indexOf( '@stylint ignore' ) !== -1 ) {
		return
	}

	// if @stylint on / off commands found in the code
	if ( this.stylintOn( line ) ||
		this.stylintOff( line ) === false ) {
		return
	}

	// if hash starting / ending, set state and return early
	if ( this.hashOrCSSStart( line ) ||
		this.hashOrCSSEnd( line ) === false ) {
		return
	}

	// if starting / ending keyframes
	if ( this.keyframesStart( line ) ||
		this.keyframesEnd( line ) === false ) {
		return
	}

	// if entire line is comment
	if ( this.startsWithComment( line ) ) {
		return
	}

	// if empty line
	if ( !emptyLineRe.test( line ) ) {
		this.cache.sortOrderCache = []
		return
	}

	// actually run tests if we made it this far
	if ( this.state.testsEnabled ) {
		return this.lint()
	}
}

module.exports = setState
