'use strict';

// check for specified extend preference
module.exports = function checkExtendStyle( line, pref ) {
	if ( typeof line !== 'string' ||
		typeof pref === 'undefined' ||
		line.indexOf('@extend') === -1 ) {
		return;
	}

	if ( pref === '@extends' ) {
		if ( line.indexOf('@extend ') !== -1 ) {
			return false;
		}
		else if ( line.indexOf('@extends ') !== -1 ) {
			return true;
		}
	}
	else if ( pref === '@extend' ) {
		if ( line.indexOf('@extends ') !== -1 ) {
			return false;
		}
		else if ( line.indexOf('@extend ') !== -1 ) {
			return true;
		}
	}
};
