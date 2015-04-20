'use strict';

// check that quote style is consistent with config
module.exports = function checkQuoteStyle(line) {
	var quotePref = this.config.quotePref; // convenience
	var badQuotes = false;

	// if '' quotes preferred and "" quotes are on the line
	if ( quotePref === 'single' && line.indexOf('"') !== -1 ) {
		// "" are still allowed if used inside '', so we have to check that
		if ( line.match(/('.*')+/) ) { // && // cant do [1] on something thats undefined
			if ( !line.match(/('.*')+/)[1].match(/(".*")+/) ) {
				// if "" is on the line but isn't inside '', we got bad quotes
				badQuotes = true;
			}
		}
		else {
			badQuotes = true;
		}
	}
	// if "" quotes preferred and '' quotes are on the line
	else if ( quotePref === 'double' && line.indexOf("'") !== -1 ) {
		// '' are still allowed if used inside "", so we have to check that
		if ( line.match(/(".*")+/) ) { // && // cant do [1] on something thats undefined
			if ( !line.match(/(".*")+/)[1].match(/('.*')+/) ) {
				// if "" is on the line but isn't inside '', we got bad quotes
				badQuotes = true;
			}
		}
		else {
			badQuotes = true;
		}
	}

	if ( badQuotes === true ) {
		this.cache.warnings.push( 'preferred quote style is ' + quotePref + ' quotes' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return badQuotes;
};
