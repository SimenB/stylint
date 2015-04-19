'use strict';

// one liners are bad for you
module.exports = function checkForOneLiners( line ) {
	if ( typeof line !== 'string' ) { return; }

	var isOneLiner = false;
	var arr = line.trim().split(';');

	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	if ( arr && arr.length > 1 ) {
		isOneLiner =  true;
	}

	return isOneLiner;
};
