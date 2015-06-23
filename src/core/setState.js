'use strict';

var emptyLineRe = /\s(?!\S)/;

/**
 * @description sets values like context, determine whether we even run tests, etc
 * @returns {Function | undefined} undefined if we catch something, else lint()
 */
var setState = function() {
	var line = this.cache.line;
	var stateM = Object.getPrototypeOf( this ).stateMethods;

	this.state.context = this.setContext( this.cache.line );

	// if empty line
	if ( emptyLineRe.test( line ) ) {
		this.cache.sortOrderCache = [];
		return;
	}

	// ignore the current line if @stylint ignore
	if ( this.cache.comment.indexOf( '@stylint ignore' ) !== -1 ) {
		return;
	}

	// if @stylint on / off commands found in the code
	if ( stateM.stylintOn.call( this, line ) ||
		stateM.stylintOff.call( this, line ) === false ) {
		return;
	}

	// if hash starting / ending, set state and return early
	if ( stateM.hashOrCSSStart.call( this, line ) ||
		stateM.hashOrCSSEnd.call( this, line ) === false ) {
		return;
	}

	// if starting / ending keyframes
	if ( stateM.keyframesStart.call( this, line ) ||
		stateM.keyframesEnd.call( this, line ) === false ) {
		return;
	}

	// if entire line is comment
	if ( stateM.startsWithComment.call( this, line ) ) {
		return;
	}

	// run tests if we made it this far
	if ( this.state.testsEnabled ) {
		return this.lint();
	}
};

module.exports = setState;
