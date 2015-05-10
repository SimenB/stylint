'use strict';

/**
 * @description sets values like context, determine whether we even run tests, etc
 * @return Function
 */
module.exports = function setState() {
	var line = this.cache.line;
	var stateM = this.__proto__.stateMethods;

	// if hash starting, or hash ending, set state and return early
	if ( stateM.hashStart.call(this, line) || stateM.hashEnd.call(this, line) ) {
		return;
	}

	if ( stateM.keyframesStart.call(this, line) || stateM.keyframesEnd.call(this, line) ) {
		return;
	}

	// by default we skip css literals, but if css literal option set to true we throw a warning
	if ( !this.config.cssLiteral && line.indexOf('@css') !== -1 ) {
		this.state.cssBlock = true;
		this.state.testsEnabled = false;
		return;
	}

	// if we're in a css block, check for the end of it
	if ( this.state.cssBlock ) {
		// hash ending checks for } as the first character
		if ( stateM.hashEnd.call(this, line) ) {
			this.state.cssBlock = false;
			this.state.testsEnabled = true;
			return;
		}
	}

	if ( !this.state.testsEnabled ) {
		stateM.stylintOn.call(this, line);
	}
	else {
		stateM.stylintOff.call(this, line);
	}

	// run tests
	if ( this.state.testsEnabled && !stateM.startsWithComment.call(this, line) ) {
		this.setContext(line);
		return this.lint();
	}
};
