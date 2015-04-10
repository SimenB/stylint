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
module.exports = function checkForValidProperties( line, valid ) {
	if ( typeof line !== 'string' ||
		typeof valid === 'undefined' ) {
		return;
	}

	// split by tabs and spaces, tabs mess with pattern matching
	var arr = line.split(/[\s\t,]/);
	var isValid = false;

	// remove white space
	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

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

		valid.css.forEach(function( val ) {
			var i = 0;
			var j = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( i; i < valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( valid.prefixes[ i ] + val ) ) {
					isValid = true;
					return;
				}
			}

			for ( j; j < valid.pseudo.length; j++ ) {
				if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
					isValid = true;
					return;
				}
			}
		});

		valid.html.forEach(function( val ) {
			var i = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( i; i < valid.pseudo.length; i++ ) {
				if ( arr[ 0 ] === ( val + valid.pseudo[ i ] ) ) {
					isValid = true;
					return;
				}
			}
		});
	}
	else {
		isValid = true;
	}

	return isValid;
};
