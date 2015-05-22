'use strict';

var selRe = /^[#.]+/m;

module.exports = function brackets( line ) {
	if ( this.state.hashOrCSS || !selRe.test( line ) ) { return; }
	var bracket = false;

	if ( this.config.brackets === 'never' ) {
		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
			bracket = true;
			this.state.openBracket = true;
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf('}') !== -1 ) {
			bracket = true;
			this.state.openBracket = false;
		}
	}
	else if ( this.config.brackets === 'always' ) {
		// ex: $hash = { is ok but .class = { is not
		if ( line.indexOf('{') !== -1 && line.indexOf('=') === -1 ) {
			bracket = true;
			this.state.openBracket = true;
		}
		// ex: } is okay if ending a hash. otherwise it is NOT okay
		else if ( line.indexOf('}') !== -1 && this.state.openBracket ) {
			bracket = true;
			this.state.openBracket = false;
		}
	}

	if ( this.config.brackets === 'never' && bracket ) {
		this.cache.warnings.push( 'unecessary bracket' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}
	else if ( this.config.brackets === 'always' && !bracket ) {
		this.cache.warnings.push( 'brackets must always be used with selectors' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return bracket;
};
