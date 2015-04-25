'use strict';

var isNumRe = /[ :]0(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

// check for 0unit (0 is preferred)
module.exports = function zeroUnits(line) {
	if ( this.state.keyframes ) { return; }
	var badZero = false;

	if ( isNumRe.test( line ) ) {
		badZero = true;
	}

	if ( badZero === true ) {
		this.cache.warnings.push(  '0 is preferred. Unit value is unnecessary' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badZero;
};
