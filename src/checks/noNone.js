'use strict';

var noneRe = /((border)|(outline))+(:|\s)+(none)+(?!-)/;

// checks for border none
module.exports = function checkBorderNone() {
	var badBorder = false;

	// return true if border none found
	if ( noneRe.test( this.cache.line ) ) {
		badBorder = true;
	}

	if ( badBorder === true ) {
		this.cache.warnings.push( '0 is preferred over none' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badBorder;
};
