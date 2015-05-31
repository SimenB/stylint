'use strict';

// one liners are bad for you
module.exports = function stackedProperties(line) {
	var oneLiner = false;
	var arr = this.splitAndStrip( ';', line.trim() );

	if ( arr && arr.length > 1 ) {
		oneLiner =  true;
	}

	if ( oneLiner ) {
		this.msg('avoid one liners. put properties on their own line');
	}

	return oneLiner;
};
