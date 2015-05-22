'use strict';

module.exports = function brackets( line ) {
	if ( this.state.hashOrCSS ) { return; }
	line = line.replace(/{\S+}/, ''); // strip interpolation
	var badBracket = false;

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
		badBracket = true;
	}
	// ex: } is okay if ending a hash. otherwise it is NOT okay
	else if ( line.indexOf('}') !== -1 ) {
		badBracket = true;
	}

	if ( badBracket === true ) {
		this.cache.warnings.push( 'unecessary bracket' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badBracket;
};
