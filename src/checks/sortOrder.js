'use strict';

var ignoreMeRe = /^[.#]|[${}=>&*]|(&:)|(if)|(for)|(@block)(@import)(@media)(@extends)/;
var ordering = require('../data/ordering.json');


// check that selector properties are sorted accordingly
// original params: line, valid, sortOrder
module.exports = function sortOrder(line) {
	// we don't alphabetize the root yet
	if ( this.state.context === 0 || this.state.hash || ignoreMeRe.test(line) ) {
		return;
	}

	/*
	 * 1 we strip out mixins, and whitespace, and get the line as an array
	 * 2 we need a sorted array to compare our cache against
	 * 3 equals the custom sorting array via the config (or the ordering json)
	 * 4 assume sorted by default
	 */
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t,:]/), line.replace(/(\(.+\))/,'') ); // 1
	var sortedArr = []; // 2
	var orderingArr = []; // 3
	var isItSorted = true; // 4

	// if current context switched, reset array
	if ( this.state.context !== this.state.prevContext ) {
		this.cache.sortOrderCache = [];
	}

	// then we push the latest property to the cache
	this.cache.sortOrderCache.push(arr[0]);

	// create a copy of the cache now for comparison against
	sortedArr = this.cache.sortOrderCache.slice(0);

	// and then sort it (by default alphabetically)
	if ( this.config.sortOrder === 'alphabetical' ) {
		sortedArr = sortedArr.sort();
	}
	// if not default, we can either use the grouped option
	// or a custom sorting order, specificed by a config file
	else if ( this.config.sortOrder === 'grouped' || Array.isArray(this.config.sortOrder) ) {
		// use custom ordering if specified, or fall back to in-built grouped ordering
		orderingArr = Array.isArray(this.config.sortOrder) ? this.config.sortOrder : ordering.grouped;


		console.log( 'pre-sorted', sortedArr );
		// console.log( 'ordered by', orderingArr );
		/**
		 * @description iterate over our cache copy, and sort it according to our config
		 * @return {boolean} true if ordered correctly, false if not
		 */
		sortedArr = sortedArr.sort(function(a, b) {
			var aIndex = orderingArr.indexOf(a);
			var bIndex = orderingArr.indexOf(b);

			// allow properties that don't exist in ordering array to be last
			if (bIndex < 0) {
				bIndex = orderingArr.length;
			}

			// -1 if our 'sorted (not yet sorted)' array is not in the right order
			if (aIndex < bIndex) {
				return -1;
			}
			// and 1 if it is
			else if (bIndex < aIndex) {
				return 1;
			}
		});

		console.log( 'sorted', sortedArr );
		console.log( 'cache', this.cache.sortOrderCache );
	}

	// now compare our two arrays
	// one sorted according to the config, and one as appears in the file
	if ( this.cache.sortOrderCache.length === sortedArr.length ) {
		if ( this.state.context === this.state.prevContext ) {
			// compare each value individually
			this.cache.sortOrderCache.forEach(function(val, i) {
				// if any value doesn't match quit the forEach
				if ( sortedArr[i] !== this.cache.sortOrderCache[i] ) {
					isItSorted = false;
					return;
				}
			}.bind( this ));
		}
	}

	if ( isItSorted === false ) {
		this.cache.warnings.push( 'prefer ' + this.config.sortOrder + ' when sorting properties. \nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isItSorted;
};
