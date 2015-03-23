'use strict';

// check that commas are followed by spaces
module.exports = function checkQuoteStyle( line, quotePref ) {
	if ( typeof line !== 'string' || typeof quotePref !== 'string' ) {
		return;
	}

	var innerCheck;

	// if ' or " is present on the line at all
	if ( line.indexOf("'") !== -1 || line.indexOf('"') !== -1 ) {
		if ( quotePref === 'single' ) {
			// if " isn't found, return true
			if ( line.indexOf('"') === -1 ) {
				return true;
			}
			// " are still allowed if used inside '', so we have to check that
			else if ( line.match(/('.*')+/) ) {
				innerCheck = line.match(/('.*')+/)[1].match(/(".*")+/);

				// if "" is being used inside single quotes, let it pass
				if ( innerCheck ) {
					return true;
				}
				// else error
				else {
					return false
				}
			}
			else {
				return false;
			}
		}
		else if ( quotePref === 'double' ) {
			// true if " is found and ' is not found
			if ( line.indexOf("'") === -1 ) {
				return true;
			}
			// ' are still allowed if used inside "", so we have to check that
			else if ( line.match(/(".*")+/) ) {
				innerCheck = line.match(/(".*")+/)[1].match(/('.*')+/);

				if ( innerCheck ) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		}
	}
}
