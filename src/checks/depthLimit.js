'use strict';

var ampRe = /^(\&\:)/;  // check if using & selector before we count tabs

/**
 * check nesting depth
 * @param  {string} line  the line being tested
 * @param  {number} limit the total number of indents allowed, not counting &: selectors
 * @param  {number} indentSpaces  default is 4. if no indents found will check depth using spaces
 * @return {boolean} true if nesting is too deep, false if not
 * @todo  this is kinda not 100% reliable in it's current form, also could be refactors
 */
module.exports = function depthLimit() {
	var count = 0;
	var index = 0;
	var limit = this.config.depthLimit;
	var badNesting = false;

	// get all single spaces in the line (NOT stripping out whitespace, the opposite)
	var arr = this.cache.lineArr.filter(function( str ) {
		return str.length === 0;
	});

	// trim string and check if line starts with &:,
	// if true then subtract one from count (for indents) and add one to limit (for spaces)
	if ( ampRe.test( this.cache.line.trim() ) ) {
		count = count - 1;
		limit = limit + 1;
	}

	// pref is defined (it is by default), then assume we indent with spaces
	if ( this.config.indentSpaces ) {
		if ( arr.length / this.config.indentSpaces > limit ) {
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

	if ( badNesting === true ) {
		this.cache.warnings.push( 'selector depth greater than', this.config.depthLimit + ':' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badNesting;
};
