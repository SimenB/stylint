'use strict';

var alwaysRe = /((border)|(outline))+(:|\s)+0(?!-)/;
var neverRe = /((border)|(outline))+(:|\s)+(none)+(?!-)/;

// checks for border none or outline none
module.exports = function none(line) {
	if ( line.indexOf('border') === -1 &&
		line.indexOf('outline') === -1 ) {
		return;
	}

	var none = false;

	// return true if border|outline is followed by a 0
	if ( this.state.conf === 'always' && !alwaysRe.test(line) ) {
		none = true;
		this.msg('none is preferred over 0');
	}
	// return true if border|outline is followed by none
	else if ( this.state.conf === 'never' && neverRe.test(line) ) {
		none = true;
		this.msg('0 is preferred over none');
	}

	return none;
};
