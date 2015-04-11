'use strict';

// check that quote style is consistent with config
module.exports = function checkQuoteStyle( line, quotePref ) {
	if ( typeof line !== 'string' ||
		typeof quotePref !== 'string' ) {
		return;
	}

	var innerCheck; // just hoisted. check for inner quotes which are valid '""'
	var badQuotes = false;

	// check if ' or " is present on the line at all
	if ( line.indexOf("'") === -1 &&
		line.indexOf('"') === -1 ) {
		return badQuotes;
	}

	// if '' quotes preferred and "" quotes are on the line
	if ( quotePref === 'single' && line.indexOf('"') !== -1 ) {
		badQuotes = true;

		// "" are still allowed if used inside '', so we have to check that
		if ( line.match(/('.*')+/) && // cant do [1] on something thats undefined
			line.match(/('.*')+/)[1].match(/(".*")+/) ) {
			// if "" is on the line but isn't inside '', we got bad quotes
			badQuotes = false;
		}
	}
	// if "" quotes preferred and '' quotes are on the line
	else if ( quotePref === 'double' && line.indexOf("'") !== -1 ) {
		badQuotes = true;

		// '' are still allowed if used inside "", so we have to check that
		if ( line.match(/(".*")+/) && // cant do [1] on something thats undefined
			line.match(/(".*")+/)[1].match(/('.*')+/) ) {
			// if "" is on the line but isn't inside '', we got bad quotes
			badQuotes = false;
		}
	}

	return badQuotes;
};
