'use strict';

/**
 * @description sets values like context, determine whether we even run tests, etc
 * @return Function
 */
module.exports = function setState() {
	this.state.context = this.setContext(this.cache.line);
	var line = this.cache.line;
	var stateM = this.__proto__.stateMethods;

	if ( stateM.stylintOn.call(this, line) || stateM.stylintOff.call(this, line) === false ) {
		return;
	}

	// if hash starting, or hash ending, set state and return early
	if ( stateM.hashOrCSSStart.call(this, line) || stateM.hashOrCSSEnd.call(this, line) ) {
		return;
	}

	if ( stateM.keyframesStart.call(this, line) || stateM.keyframesEnd.call(this, line) ) {
		return;
	}

	if ( stateM.startsWithComment.call(this, line) ) {
		return;
	}

	// run tests
	if ( this.state.testsEnabled  ) {
		return this.lint();
	}
};
