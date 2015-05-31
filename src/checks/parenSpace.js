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

	if ( this.state.conf === 'always' && !hasSpaces ) {
		this.msg('( param1, param2 ) is preferred over (param1, param2)');
	}
	else if ( this.state.conf === 'never' && hasSpaces ) {
		this.msg('(param1, param2) is preferred over ( param1, param2 )');
	}

	return hasSpaces;
};
