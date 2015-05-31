'use strict';

var aboveZeroRe = /\d0/;
var hasUnitRe = /[ :]0(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

// check for 0unit (0 is preferred)
module.exports = function zeroUnits(line) {
	if ( this.state.keyframes || line.indexOf('0') === -1 ) { return; }

	var hasUnits = false;

	// if config set to never and 0 is followed by any unit
	if ( this.state.conf === 'never' && hasUnitRe.test(line) ) {
		hasUnits = true;
		this.msg('0 is preferred. Unit value is unnecessary');
	}
	// if config set to always, we need to do an extra check
	// to avoid throwing false positions on numbers like 50px
	else if ( this.state.conf === 'always' && ( hasUnitRe.test(line) || aboveZeroRe.test(line) ) ) {
		hasUnits = true;
		this.msg('Including the unit value is preferred');
	}

	return hasUnits;
};
