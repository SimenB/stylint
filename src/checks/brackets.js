'use strict';

module.exports = function checkForBadBrackets() {
	var badBracket = false;

	// just strips out interpolated variables, simplifies the check
	var line = this.cache.line.replace(/{\S+}/, '');

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
		badBracket = true;
	}

	// ex: } is okay if ending a hash. otherwise it is not okay
	if ( line.indexOf('}') !== -1 && !this.state.hash ) {
		badBracket = true;
	}

	if ( badBracket === true ) {
		this.cache.warnings.push( 'unecessary bracket' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badBracket;
};
