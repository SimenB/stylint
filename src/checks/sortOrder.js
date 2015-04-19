'use strict';

var ignoreMe = /^[.#]|[${}=>&*]|(&:)|(if)|(for)|(@block)(@import)(@media)(@extends)/,
	ordering = require('../data/ordering.json');

// check that selector properties are sorted accordingly
// original params: line, valid, sortOrder
module.exports = function checkSortOrder() {
	var arr = this.cache.line.split(/[\s\t,:]/);
	var indentCount = 0;
	var currContext = 0;
	var isItSorted = false;
	var textIndex = 0;
	var sortedArr = [];
	var validCSS = false;

	// quick and dirty fixes for now, didnt' account for hard tabs for context check
	// this just gets the number of indents so we don't throw false positives
	if ( typeof this.config.indentSpaces !== 'number' ) {
		while ( this.cache.line.charAt( textIndex++ ) === '\t' ) {
			currContext++;
		}
	}
	else {
		arr.forEach(function( val, i ) {
			if ( arr[i].length === 0 ) {
				indentCount++; // spaces or tabs
			}
			else {
				currContext = indentCount / this.config.indentSpaces;
			}
		});
	}

	// if current context switched, reset array
	if ( this.cache.prevContext !== currContext ) {
		this.cache.sortOrderCache = [];
	}

	// we don't alphabetize the root yet
	if ( currContext === 0 ) {
		return true;
	}

	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	// push prop values into our 'cache' @TODO do i need that length check?
	if ( typeof arr[0] !== 'undefined' && arr[0].length > 0 && currContext > 0 && !ignoreMe.test( this.cache.line ) ) {
		this.valid.css.forEach(function( val ) {
			var i = 0, j = 0;

			if ( arr[ 0 ] === val ) {
				validCSS = true;
				return;
			}

			for ( i; i < this.valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( this.valid.prefixes[ i ] + val ) ) {
					validCSS = true;
					return;
				}
			}

			for ( j; j < this.valid.pseudo.length; j++ ) {
				if ( arr[ 0 ] === ( val + this.valid.pseudo[ j ] ) ) {
					validCSS = true;
					return;
				}
			}
		}.bind( this ));

		if ( validCSS ) {
			this.cache.sortOrderCache.push( arr[ 0 ] );
		}
	}
	else {
		return true;
	}

	if ( this.cache.line.indexOf('(') !== -1 && this.cache.line.indexOf(')') !== -1 ) {
		return true;
	}

	if ( ignoreMe.test( this.cache.line ) || this.cache.sortOrderCache.length < 1 ) {
		return true;
	}

	// create a copy of the cache for comparison
	sortedArr = this.cache.sortOrderCache.slice(0);

	// and then sort it
	if ( this.config.sortOrder === 'alphabetical' ) {
		sortedArr = sortedArr.sort();
	}
	else if ( this.config.sortOrder === 'grouped' || Array.isArray(this.config.sortOrder) ) {
		// use custom ordering if specified, or fall back to in-built grouped ordering
		var orderingArr = Array.isArray(sortOrder) ? this.config.sortOrder : ordering.grouped;

		sortedArr = sortedArr.sort(function( a, b ) {
			var aIndex = orderingArr.indexOf(a),
				bIndex = orderingArr.indexOf(b);

			// allow properties does not exist in ordering array to be last in order
			if (bIndex < 0) bIndex = orderingArr.length;

			if (aIndex < bIndex) {
				return -1;
			}
			else if (bIndex < aIndex) {
				return 1;
			}
		});
	}

	// now compare
	if ( this.cache.sortOrderCache.length === sortedArr.length ) {

		if ( this.state.hash === false && currContext === this.cache.prevContext ) {

			// compare each value individually
			this.cache.sortOrderCache.forEach(function( val, i ) {
				// if any value doesn't match quit the forEach
				if ( sortedArr[i] !== this.cache.sortOrderCache[i] ) {
					isItSorted = false;
					return;
				}
				// if match, check for valid css before we set it to true
				else {
					this.valid.css.forEach(function( val ) {
						var i = 0, j = 0;

						if ( this.cache.sortOrderCache[ 0 ] === val ) {
							isItSorted = true;
							return;
						}

						for ( i; i < this.valid.prefixes.length; i++ ) {
							if ( this.cache.sortOrderCache[ 0 ] === ( this.valid.prefixes[ i ] + val ) ) {
								isItSorted = true;
								return;
							}
						}

						for ( j; j < this.valid.pseudo.length; j++ ) {
							if ( this.cache.sortOrderCache[ 0 ] === ( val + this.valid.pseudo[ j ] ) ) {
								isItSorted = true;
								return;
							}
						}
					}.bind( this ));

					this.valid.html.forEach(function( val ) {
						var i = 0;

						if ( this.cache.sortOrderCache[ 0 ] === val ) {
							isItSorted = true;
							return;
						}

						for ( i; i < this.valid.pseudo.length; i++ ) {
							if ( this.cache.sortOrderCache[ 0 ] === ( val + this.valid.pseudo[ i ] ) ) {
								isItSorted = true;
								return;
							}
						}
					}.bind( this ));
				}
			}.bind( this ));
		}
		else {
			isItSorted = true;
		}
	}

	// save our curr context so we can use it to see our place
	this.cache.prevContext = currContext;

	if ( !isItSorted ) {
		this.cache.warnings.push( 'prefer ' + this.config.sortOrder + ' when sorting properties. \nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + this.cache.line.trim() );
	}

	return isItSorted;
};
