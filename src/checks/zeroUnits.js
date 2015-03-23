'use strict';

var isNumRe = /[ :]0(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

// check for 0unit (0 is preferred)
module.exports = function checkForZeroUnits( line ) {
	if ( typeof line !== 'string' ) { return; }

	if ( isNumRe.test( line ) ) {
		return true;
	}
	else {
		return false;
	}
};
