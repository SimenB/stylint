'use strict';

var tabs = /\t/; // was a tab used, at all
var spaces = /(  )+/; // check for 2 or more spaces (if hard tabs, shouldn't find anything)


/**
 * check for mixed spaces and tabs
 * @param  {string} line  the line being tested
 * @param  {number} indentSpaces  default is 4. if set to false the we do hard tabs instead of spaces
 * @return {boolean} true if mixed spaces and tabs, false if not
 */
module.exports = function mixed(line) {
	var isMixed = false;
	var isNum = typeof this.config.indentPref === 'number';

	// if this isnt set to false then we're indenting with spaces, so check for tabs
	if ( isNum ) {
		if ( tabs.test(line) ) {
			isMixed = true;
		}
	}
	// else you're a hard tab believer (go you)
	// look for 2 or more spaces
	else if ( spaces.test( line ) ) {
		isMixed = true;
	}

	if ( isMixed ) {
		this.msg('mixed spaces and tabs');
	}

	return isMixed;
};
