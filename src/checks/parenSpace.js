'use strict';

var parensRe = /\(.+\)/;
var parensWithSpaceRe = /\(\s+|\s\)+/;

// checks for extra space when declaring mixins before variables
module.exports = function parenSpace(line) {
	if ( !parensRe.test(line) ) { return; }
	var hasSpaces = false;

	// if mixin exists and it has params
	if ( parensWithSpaceRe.test(line) ) {
		hasSpaces = true;
	}

	if ( this.config.parenSpace === 'always' && !hasSpaces ) {
		this.cache.warnings.push( '( param1, param2 ) is preferred over (param1, param2)' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	if ( this.config.parenSpace === 'never' && hasSpaces ) {
		this.cache.warnings.push( '(param1, param2) is preferred over ( param1, param2 )' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return hasSpaces;
};
