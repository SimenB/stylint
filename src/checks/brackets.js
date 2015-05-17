'use strict';

module.exports = function brackets( line ) {
	if ( !this.state.hashOrCSS ) { return; }
	var badBracket = false;
	var line = line.replace(/{\S+}/, '');

	// ex: $hash = { is ok but .class = { is not
	if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
		badBracket = true;
	}
	// ex: } is okay if ending a hash. otherwise it is not okay
	else if ( line.indexOf('}') !== -1 && !this.state.hash ) {
		badBracket = true;
	}

	if ( badBracket === true ) {
		this.cache.warnings.push( 'unecessary bracket' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badBracket;
};
