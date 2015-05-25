'use strict';

var dollaRe = /\$\w/;
var parensRe = /\(.+\)/;
var ignoreRe = /(if)|(for)|(else)|(@media)|(@block)|(calc)|(=|= )$/; // 3

// check that $ is used when declaring vars
module.exports = function prefixVarsWithDollar(line) {
	if ( this.state.hashOrCSS || ignoreRe.test(line) ) { return; }
	var hasDolla = true;
	var mixinArr = [];

	// if line has a mixin, we need check each param for missing $
	// else we just check if = is present && $ is prefixing something
	if ( this.config.prefixVarsWithDollar === 'always' ) {
		if ( parensRe.test(line) && this.state.context === '0' ) {
			mixinArr = line.match(parensRe)[0].split(',');

			console.log( mixinArr );

			// returns true if every param has $, or false if even one is missing
			hasDolla = mixinArr.every(function(param) {
				return dollaRe.test(param);
			});
		}
		else if ( line.indexOf('=') !== -1 && !dollaRe.test(line) ) {
			hasDolla = false;
		}
	}

	// the never check is easier, since any $ means it fails
	if ( this.config.prefixVarsWithDollar === 'never' && !dollaRe.test(line) ) {
		hasDolla = false;
	}

	if ( this.config.prefixVarsWithDollar === 'always' && !hasDolla ) {
		this.cache.warnings.push( 'variables and parameters must be prefixed with the $ sign.' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	if ( this.config.prefixVarsWithDollar === 'never' && hasDolla ) {
		this.cache.warnings.push( '$ sign is disallowed for variables and parameters' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return hasDolla;
};
