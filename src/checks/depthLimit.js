'use strict';

var ampRe = /^&/;  // check if using & selector before we count tabs

/**
 * check nesting depth
 * @param  {string} line  the line being tested
 * @param  {number} limit the total number of indents allowed, not counting &: selectors
 * @param  {number} indentSpaces  default is 4. if no indents found will check depth using spaces
 * @return {boolean} true if nesting is too deep, false if not
 * @todo  this is kinda not 100% reliable in it's current form, also could be refactors
 */
module.exports = function depthLimit(line) {
	var context = this.getContext(line);
	var badNesting = false;

	// trim string and check if line starts with &
	// reduce context in that case
	// @TODO not really ideal
	if ( ampRe.test( line.trim() ) ) {
		context = context - 1;
	}

	if ( context > this.config.depthLimit ) {
		badNesting = true; // return true;
	}

	if ( badNesting === true ) {
		this.cache.warnings.push( 'selector depth greater than', this.config.depthLimit + ':' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badNesting;
};
