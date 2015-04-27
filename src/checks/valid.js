'use strict';

// dont throw false positives on user created names or syntax
var attributeRe = /^\[\S+\]/;
var elAttributeRe = /(?=\S)+\[\S+\]/gm;
var ignoreMeRe = /[&$.#(=>]|({[\S]+})|(if)|(for)|(else)|(@block)/;
var isNumRe = /\d(?=[px]|%|[em]|[rem]|[vh]|[vw]|[vmin]|[vmax]|[ex]|[ch]|[mm]|[cm]|[in]|[pt]|[pc]|[mozmm])/;


/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/
module.exports = function valid(line) {
	// from and to are keyframes specific properties, but arent valid outside that context
	if ( !this.state.keyframes ) {
		if ( line.indexOf('from ') !== -1 || line.indexOf('to ') !== -1 ) {
			return;
		}
	}

	// split by tabs and spaces, tabs mess with pattern matching
	var isValid = false;
	var arr = this.stripWhiteSpace(new RegExp(/[\s\t,]/), line);

	// not empty, not something we ignore
	if ( !ignoreMeRe.test( line ) &&
		this.state.hash === false &&
		!attributeRe.test( arr[0] ) &&
		!isNumRe.test( arr[0] ) &&
		typeof arr[0] !== 'undefined' ) {

		// if using an attribute selector ( div[madeUpAttribute] ), strip it out first ( div )
		if ( elAttributeRe.test( arr[0] ) ) {
			arr[0] = arr[0].replace(elAttributeRe, '');
		}

		this.valid.css.forEach(function(val) {
			var i = 0;
			var j = 0;

			// if property matches (border, margin)
			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			// if property + prefix matches (-webkit-border-radius)
			for ( i; i < this.valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( this.valid.prefixes[ i ] + val ) ) {
					isValid = true;
					return;
				}
			}
		}.bind(this));

		this.valid.html.forEach(function( val ) {
			var i = 0;

			// if property matches (div, article)
			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			// if property matches + pseudo matches (a:hover, button:focus)
			for ( i; i < this.valid.pseudo.length; i++ ) {
				if ( arr[ 0 ] === ( val + this.valid.pseudo[ i ] ) ) {
					isValid = true;
					return;
				}
			}
		}.bind(this));
	}
	else {
		isValid = true;
	}

	if ( isValid === false ) {
		this.cache.warnings.push( 'property is not valid' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isValid;
};
