'use strict';

var tabs  = /\t/; // was a tab used, at all
var spaces = /(  )+/;  // check for 2 or more spaces (if hard tabs, shouldn't find anything)

/**
 * check for mixed spaces and tabs
 * @param  {string} line  the line being tested
 * @param  {number} indentSpaces  default is 4. if set to false the we do hard tabs instead of spaces
 * @return {boolean} true if mixed spaces and tabs, false if not
 * @todo  this is kinda not 100% reliable in it's current form
 */
module.exports = function mixed(line) {
	var isMixed = false;

	// if this isnt set to false then we're indenting with spaces, so check for tabs
	if ( typeof this.config.indentSpaces === 'number' ) {
		if ( tabs.test(line) ) {
			isMixed = true;
		}
	}
	// else you're a hard tab believer
	// look for 2 or more spaces
	else if ( spaces.test( line ) ) {
		isMixed = true;
	}

	if ( isMixed === true ) {
		this.cache.warnings.push( 'mixed spaces and tabs' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isMixed;
};
