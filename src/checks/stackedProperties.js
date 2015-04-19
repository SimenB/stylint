'use strict';

// one liners are bad for you
module.exports = function checkForOneLiners() {
	var isOneLiner = false;
	var arr = line.trim().split(';');

	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	if ( arr && arr.length > 1 ) {
		isOneLiner =  true;
	}

	if ( isOneLiner === true ) {
		this.cache.warnings.push( 'avoid one liners. put properties on their own line. ' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return isOneLiner;
};
