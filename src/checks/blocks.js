'use strict'

var eqEndRe = /=$|=\s$/


/**
 * @description depending on settings, enforce of disallow @block when defining block vars
 * @param {string} [line] curr line being linted
 * @returns {boolean | undefined} true if @block found, false if not, undefined if we skip
 */
var blocks = function( line ) {
	if ( line.indexOf( '=' ) === -1 ) { return }

	var block

	// if = ends the line and not a block var or hash
	var indexOfBlock = line.indexOf( '@block' );
    if ( indexOfBlock === -1 && eqEndRe.test( line ) ) {
		block = false
	}
	else if ( indexOfBlock !== -1 ) {
		block = true
	}

	if ( this.state.conf === 'always' && block === false ) {
		this.msg( 'block variables must include @block', line.length )
	}
	else if ( this.state.conf === 'never' && block === true ) {
		this.msg( '@block is not allowed', indexOfBlock )
	}

	return block
}

module.exports = blocks
