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
module.exports = function checkForValidProperties( app ) {
	// split by tabs and spaces, tabs mess with pattern matching
	// var arr = app.cache.line.split(/[\s\t,]/);
	var line = app.cache.line; // convenience
	var isValid = false;
	var arr = app.stripWhiteSpace(new RegExp(/[\s\t,]/), app.cache.line);

	// not empty, not something we ignore
	if ( !ignoreMeRe.test( line ) &&
		app.state.hash === false &&
		!attributeRe.test( arr[0] ) &&
		!isNumRe.test( arr[0] ) &&
		typeof arr[0] !== 'undefined' ) {

		// if using an attribute selector ( div[madeUpAttribute] ), strip it out first ( div )
		if ( elAttributeRe.test( arr[0] ) ) {
			arr[0] = arr[0].replace(elAttributeRe, '');
		}

		app.valid.css.forEach(function( val ) {
			var i = 0;
			var j = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( i; i < app.valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( app.valid.prefixes[ i ] + val ) ) {
					isValid = true;
					return;
				}
			}

			for ( j; j < app.valid.pseudo.length; j++ ) {
				if ( arr[ 0 ] === ( val + app.valid.pseudo[ j ] ) ) {
					isValid = true;
					return;
				}
			}
		});

		app.valid.html.forEach(function( val ) {
			var i = 0;

			if ( arr[ 0 ] === val ) {
				isValid = true;
				return;
			}

			for ( i; i < app.valid.pseudo.length; i++ ) {
				if ( arr[ 0 ] === ( val + app.valid.pseudo[ i ] ) ) {
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
