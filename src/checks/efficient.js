'use strict';

var valueRe = /(margin|padding)+[:| ]/;

// check for 0 0 0 0 or 50px 0 50px 0 type mistakes
module.exports = function efficient(line) {
	// line doesnt have margin or padding then there's nothin to do here
	if ( !valueRe.test(line) ) { return; }

	var notEfficient = false;
	var arr = this.splitAndStrip( new RegExp(/[\s\t]/), line );

	// if margin or padding we run the tests
	// if line is potentially inefficient it needs to be at least this long
	if ( arr.length > 2 ) {
		// ex: margin 0 5px
		if ( arr.length === 3 ) {
			// ex margin 0 0
			if ( arr[1] === arr[2] )  {
				notEfficient = true;
			}
		}
		// ex margin 0 5px 10px
		else if ( arr.length === 4 && arr[1] === arr[3] ) {
			// ex margin 0 5px 0
			notEfficient = true;
		}
		// ex margin 0 50px 10px 7px
		else if ( arr.length === 5 ) {
			// ex margin 0 5px 0 5px or
			if ( ( arr[1] === arr[3] && arr[2] === arr[4] ) ||
			 ( arr[1] !== arr[3] && arr[2] === arr[4] ) ) {
				notEfficient = true;
			}
		}
	}

	if ( notEfficient ) {
		this.msg('the value on this line could be more succinct');
	}

	return notEfficient;
};
