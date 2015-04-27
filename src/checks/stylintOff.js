'use strict';

module.exports = function stylintOff(line) {
	if ( !this.state.testsEnabled ) { return; }

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('@stylint off') !== -1 ) {
		this.state.testsEnabled = false;
	}

	return this.state.testsEnabled;
};
