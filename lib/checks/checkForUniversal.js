/**
* check for * selector.
* technically this is used as part of resets often, for good reason, despite its slowness
* which is why i'm setting it up as a warning as it won't break code but maybe you prefer to not use it
*/
var starS = /(\* )/,                  // check for space after star (inside a docblockr comment)
	starO = /(\/\*\*)/ || /(\/\*)/,   // check for star selector as opening comment
	starR = /(\*=)/,                  // check for use in regex
	starE = /(\*\/)/;                 // finally, check for star selector as closing comment

module.exports = function checkForUniversal( line ) {
	if ( typeof line === 'undefined' ) { return; }

	if ( line.indexOf('*') !== -1 ) {
		// check for various places where the * is valid (just comment checks atm)
		if ( !starS.test(line)
			&& !starO.test(line)
			&& !starR.test(line)
			&& !starE.test(line) ) {
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