'use strict';

var ampRe = /^(\&\:)/;  // check if using & selector before we count tabs

/**
 * check nesting depth
 * @param  {string} line  the line being tested
 * @param  {number} limit the total number of indents allowed, not counting &: selectors
 * @param  {number} indentSpaces  default is 4. if no indents found will check depth using spaces
 * @return {boolean} true if nesting is too deep, false if not
 * @todo  this is kinda not 100% reliable in it's current form
 */
module.exports = function checkNesting( app ) {
	if ( typeof line !== 'string' ||
		typeof arr === 'undefined' ||
		typeof limit === 'undefined' ||
		typeof indentSpaces === 'undefined' ) {
		return;
	}

	var count = 0;
	var index = 0;
	var limit = app.config.depthLimit;
	var badNesting = false;

	// get all single spaces in the line (NOT stripping out whitespace, the opposite)
	var arr = app.cache.lineArr.filter(function( str ) {
		return str.length === 0;
	});

	// trim string and check if line starts with &:,
	// if true then subtract one from count (for indents) and add one to limit (for spaces)
	if ( ampRe.test( app.cache.line.trim() ) ) {
		count = count - 1;
		limit = limit + 1;
	}

	// pref is defined (it is by default), then assume we indent with spaces
	if ( app.config.indentSpaces ) {
		if ( arr.length / app.config.indentSpaces > limit ) {
			badNesting = true; // return true;
		}
	}
	else {
		// if not we check hard tabs
		// get all tabs, starting at beginning of string
		while ( line.charAt( index++ ) === '\t' ) {
			count++;
		}

		if ( count > limit ) {
			badNesting = true; // return true;
		}
	}


	return badNesting;
};
