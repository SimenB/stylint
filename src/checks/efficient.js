'use strict';

var valueRe = /(margin|padding)+[:| ]/;

// check for 0 0 0 0 or 50px 0 50px 0 type mistakes
module.exports = function checkForEfficiency() {
	// line doesnt have margin or padding then there's nothin to do here
	if ( !valueRe.test(this.cache.line) ) {
		return;
	}

	var isEfficient = true;
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), this.cache.line );

	// if margin or padding we run the tests
	// if line is potentially inefficient it needs to be at least this long
	if ( arr.length > 2 ) {
		// ex: margin 0 5px
		if ( arr.length === 3 ) {
			// ex margin 0 0
			if ( arr[1] === arr[2] )  {
				isEfficient = false;
			}
		}
		// ex margin 0 5px 10px
		else if ( arr.length === 4 && arr[1] === arr[3] ) {
			// ex margin 0 5px 0
			isEfficient = false;
		}
		// ex margin 0 50px 10px 7px
		else if ( arr.length === 5 ) {
			// ex margin 0 5px 0 5px or
			if ( ( arr[1] === arr[3] && arr[2] === arr[4] ) ||
			 ( arr[1] !== arr[3] && arr[2] === arr[4] ) ) {
				isEfficient = false;
			}
		}
	}

	if ( isEfficient === false ) {
		this.cache.warnings.push( 'the value on this line could be more succinct:' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return isEfficient;
};
