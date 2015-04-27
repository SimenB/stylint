'use strict';

module.exports = function stylintOn(line) {
	if ( this.state.testsEnabled ) { return; }

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('@stylint on') !== -1 ) {
		this.state.testsEnabled = true;
	}

	return this.state.testsEnabled;
};
