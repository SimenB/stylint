'use strict';


// dont throw false positives on user created names or syntax
var ignoreMeRe = /^[.#]|[${}=>&*]|(&:)|(if)|(for)|(@block)(@import)(@media)(@extends)/;

// check that selector properties are sorted alphabetically
module.exports = function sortAlphabetically() {
	// dont check for alpbaetical order inside a hash
	if ( this.state.hash ) { return; }

	var arr = this.cache.line.split(/[\s\t,:]/).filter(
		function( str ) {
			return str.length > 0;
		}
	);
	var sortedArr = [];
	var isItSorted = true;
	var currContext = this.getContext( this.config.indentSpaces, this.cache.line );

	// if current context switched, reset array
	if ( this.cache.prevContext !== currContext ) {
		this.cache.alphaCache = [];
	}

	// the big long list of things we dont check,
	// if anythign is true just return early
	if ( typeof arr[0] === 'undefined' ||
		currContext === 0 ||
		ignoreMeRe.test( this.cache.line ) ||
		this.cache.line.indexOf('(') !== -1 ||
		this.cache.line.indexOf(')') !== -1 ) {
		return true;
	}

	this.cache.alphaCache.push( arr[ 0 ] );

	// create a copy of the cache for comparison
	this.cache.alphaCache.forEach(function( val, i ) {
		sortedArr.push( this.cache.alphaCache[i] );
	});

	// and then sort it
	sortedArr = sortedArr.sort();

	// compare each value individually against the sorted copy
	this.cache.alphaCache.forEach(function( val, i ) {
		// if any value doesn't match we know it's not in alphabetical order
		if ( sortedArr[i] !== this.cache.alphaCache[i] ) {
			isItSorted = false;
			return;
		}
	});

	// save our curr context so we can use it next time
	this.cache.prevContext = currContext;

	if ( isItSorted === false ) {
		cache.warnings.push(  'Property is not in alphabetical order' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return isItSorted;
};
