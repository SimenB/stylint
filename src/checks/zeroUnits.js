'use strict';

var aboveZeroRe = /\d0/;
var hasUnitRe = /[ :]0(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;

// check for 0unit (0 is preferred)
module.exports = function zeroUnits(line) {
	if ( this.state.keyframes || line.indexOf('0') === -1 ) { return; }
	var hasUnits = false;

	// if config set to never and 0 is followed by any unit
	if ( this.config.zeroUnits === 'never' && hasUnitRe.test(line) ) {
		hasUnits = true;
	}

	// if config set to always, we need to do an extra check
	// to avoid throwing false positions on numbers like 50px
	if ( this.config.zeroUnits === 'always' ) {
		if ( hasUnitRe.test(line) || aboveZeroRe.test(line) ) {
			hasUnits = true;
		}
	}

	if ( this.config.zeroUnits === 'never' && hasUnits ) {
		this.cache.warnings.push(  '0 is preferred. Unit value is unnecessary' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	if ( this.config.zeroUnits === 'always' && !hasUnits ) {
		this.cache.warnings.push( 'Including the unit value is preferred' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return hasUnits;
};
