'use strict';

// checks for extra space when declaring mixins before variables
module.exports = function parenSpace(line) {
	var hasExtraSpace = true;

	// if mixin exists and it has params
	if ( line.indexOf('(') !== -1 && line.indexOf('()') === -1 ) {
		if ( line.indexOf('( ') === -1 || line.indexOf(' )') === -1) {
			hasExtraSpace = false;
		}
	}

	if ( hasExtraSpace === false ) {
		this.cache.warnings.push( '( param1, param2 ) is preferred over (param1, param2)' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return hasExtraSpace;
};
