'use strict';

// checks for extra space when declaring mixins before variables
module.exports = function checkMixinStyle( app ) {
	var hasExtraSpace = true;

	// if mixin exists and it has params
	if ( app.cache.line.indexOf('(') !== -1 &&
		app.cache.line.indexOf('()') === -1 ) {

		if ( app.cache.line.indexOf('( ') === -1 ||
			app.cache.line.indexOf(' )') === -1) {
			hasExtraSpace = false;
		}
	}

	if ( hasExtraSpace === false ) {
		app.cache.warnings.push( '( param1, param2 ) is preferred over (param1, param2)' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return hasExtraSpace;
};
