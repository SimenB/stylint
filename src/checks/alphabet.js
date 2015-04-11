'use strict';

// dont throw false positives on user created names or syntax
var ignoreMeRe = /^[.#]|[${}=>&*]|(&:)|(if)|(for)|(@block)(@import)(@media)(@extends)/;

// check that selector properties are sorted alphabetically
module.exports = function sortAlphabetically( app ) {
	// dont check for alpbaetical order inside a hash
	if ( app.state.hash ) { return; }

	var arr = app.cache.line.split(/[\s\t,:]/).filter(
		function( str ) {
			return str.length > 0;
		}
	);
	var sortedArr = [];
	var isItSorted = true;
	var currContext = app.getContext( app.config.indentSpaces, app.cache.line );

	// if current context switched, reset array
	if ( app.cache.prevContext !== currContext ) {
		app.cache.alphaCache = [];
	}

	// the big long list of things we dont check,
	// if anythign is true just return early
	if ( typeof arr[0] === 'undefined' ||
		currContext === 0 ||
		ignoreMeRe.test( app.cache.line ) ||
		app.cache.line.indexOf('(') !== -1 ||
		app.cache.line.indexOf(')') !== -1 ) {
		return true;
	}

	app.cache.alphaCache.push( arr[ 0 ] );

	// create a copy of the cache for comparison
	app.cache.alphaCache.forEach(function( val, i ) {
		sortedArr.push( app.cache.alphaCache[i] );
	});

	// and then sort it
	sortedArr = sortedArr.sort();

	// compare each value individually against the sorted copy
	app.cache.alphaCache.forEach(function( val, i ) {
		// if any value doesn't match we know it's not in alphabetical order
		if ( sortedArr[i] !== app.cache.alphaCache[i] ) {
			isItSorted = false;
			return;
		}
	});

	// save our curr context so we can use it next time
	app.cache.prevContext = currContext;

	return isItSorted;
};
