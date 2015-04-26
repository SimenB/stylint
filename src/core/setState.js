'use strict';

/**
 * @description sets values like context, determine whether we even run tests, etc
 * @return Function
 */
module.exports = function setState() {
	var stateM = this.__proto__.stateMethods;

	// if hash starting, or hash ending, set state and return early
	if ( stateM.hashStart.call(this, this.cache.line) || stateM.hashEnd.call(this, this.cache.line) ) {
		return;
	}

	if ( stateM.keyframeStart.call(this, this.cache.line) || stateM.keyframeEnd.call(this, this.cache.line) ) {
		return;
	}

	// by default we skip css literals, but if css literal option set to true we throw a warning
	if ( !this.config.cssLiteral && this.cache.line.indexOf('@css') !== -1 ) {
		this.state.cssBlock = true;
		this.state.testsEnabled = false;
		return;
	}

	// if we're in a css block, check for the end of it
	if ( this.state.cssBlock ) {
		// hash ending checks for } as the first character
		if ( stateM.hashEnd.call(this, this.cache.line) ) {
			this.state.cssBlock = false;
			this.state.testsEnabled = true;
			return;
		}
	}

	if ( !this.state.testsEnabled ) {
		stateM.stylintOn.call(this, this.cache.line);
	}
	else {
		stateM.stylintOff.call(this, this.cache.line);
	}

	// run tests
	if ( this.state.testsEnabled && !stateM.startsWithComment.call(this, this.cache.line) ) {
		this.setContext(this.cache.line);
		return this.lint();
	}
};
