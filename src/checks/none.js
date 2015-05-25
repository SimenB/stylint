'use strict';

var alwaysRe = /((border)|(outline))+(:|\s)+0(?!-)/;
var neverRe = /((border)|(outline))+(:|\s)+(none)+(?!-)/;

// checks for border none or outline none
module.exports = function none(line) {
	if ( line.indexOf('border') === -1 &&
		line.indexOf('outline') === -1 ) {
		return;
	}

	// depending on the config
	// if always, false if 'none' not found, or true if 'none' found
	// if never, false if '0' not found, or true if '0' found
	var badLine = false;

	// return true if border|outline is followed by a 0
	if ( this.config.none === 'always' && !alwaysRe.test(line) ) {
		badLine = true;
	}

	// return true if border|outline is followed by none
	if ( this.config.none === 'never' && neverRe.test(line) ) {
		badLine = true;
	}

	if ( this.config.none === 'always' && !badLine ) {
		this.cache.warnings.push( 'none is preferred over 0' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	if ( this.config.none === 'never' && badLine ) {
		this.cache.warnings.push( '0 is preferred over none' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return badLine;
};
