'use strict';

var isNumRe = /[ :]0(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

// check for 0unit (0 is preferred)
module.exports = function checkForZeroUnits( app ) {
	var badZero = false;

	if ( isNumRe.test( app.cache.line ) ) {
		badZero = true;
	}

	if ( badZero === true ) {
		app.cache.warnings.push(  '0 is preferred. Unit value is unnecessary' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return badZero;
};
