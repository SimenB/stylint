'use strict';

// check for specified extend preference
module.exports = function extendPref(line) {
	if ( line.indexOf('@extend') === -1 ) { return; }
	var extendsCorrect = true;

	// prefer @extends to @extend
	// extremely petty, i know
	if ( this.config.extendsPref === '@extends' ) {
		if ( line.indexOf('@extends ') === -1 ) {
			extendsCorrect = false;
		}
	}
	// else @extend is your pref
	else {
		if ( line.indexOf('@extend ') === -1 ) {
			extendsCorrect = false;
		}
	}

	if ( extendsCorrect === false ) {
		this.cache.warnings.push( 'please use the ' + this.config.extendPref + ' syntax when extending' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return extendsCorrect;
};
