'use strict';

// check for specified extend preference
module.exports = function extendPref(line) {
	if ( line.indexOf('@extend') === -1 ) { return; }

	var extendIncorrect = false;

	// prefer @extends to @extend
	// extremely petty, i know
	if ( this.state.conf === '@extends' && line.indexOf('@extends ') === -1 ) {
		extendIncorrect = true;
	}
	// else @extend is your pref
	else if ( this.state.conf === '@extend' && line.indexOf('@extend ') === -1 ) {
		extendIncorrect = true;
	}

	if ( extendIncorrect ) {
		this.msg('please use ' + this.state.conf);
	}

	return extendIncorrect;
};
