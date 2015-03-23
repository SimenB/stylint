'use strict';

// check for 0 0 0 0 or 50px 0 50px 0 type mistakes
module.exports = function checkForEfficiency( line, arr ) {
	if ( typeof line !== 'string' ||typeof arr === 'undefined' ) { return; }

	// line doesnt have margin or padding then there's nothin to do here
	if ( line.indexOf('margin') === -1 && line.indexOf('padding') === -1 ) {
		return;
	}

	// filter the array from the line with all white space removed
	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	// if margin or padding we run the tests
	if ( arr[0] === 'margin' ||
		arr[0] === 'padding' ||
		arr[0] === '\tmargin' ||
		arr[0] === '\tpadding' ) {

		// if line is potentially inefficient it needs to be at least this long
		if ( arr.length > 2 ) {
			// ex: margin 0 5px
			if ( arr.length === 3 ) {
				// ex margin 0 0
				if ( arr[1] === arr[2] )  {
					return false;
				}
				else {
					return true;
				}
			}
			// ex margin 0 5px 10px
			else if ( arr.length === 4 ) {
				// ex margin 0 5px 0
				if ( arr[1] === arr[3] ) {
					return false;
				}
				else {
					return true;
				}
			}
			// ex margin 0 50px 10px 7px
			else if ( arr.length === 5 ) {
				// ex margin 0 5px 0 5px
				if ( arr[1] === arr[3] && arr[2] === arr[4] ) {
					return false;
				}
				// ex margin 0 5px 5px 5px
				else if ( arr[1] !== arr[3] && arr[2] === arr[4] ) {
					return false;
				}
				else {
					return true;
				}
			}
		}
		else {
			return true;
		}
	}
};
