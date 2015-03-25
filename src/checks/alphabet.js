'use strict';

var
	prevContext = 0,
	// dont throw false positives on user created names or syntax
	ignoreMe = /^[.#]|[${}=>&*]|(&:)|(if)|(for)|(@block)(@import)(@media)(@extends)/;

// check that selector properties are sorted alphabetically
module.exports = function sortAlphabetically( line, valid ) {
	if ( typeof line !== 'string' || typeof valid !== 'object' ) { return; }

	var
		arr = line.split(/[\s\t,:]/),
		indentCount = 0,
		currContext = 0,
		isItSorted = false,
		textIndex = 0,
		sortedArr = [],
		validCSS = false;

	// quick and dirty fixes for now, didnt' account for hard tabs for context check
	// this just gets the number of indents so we don't throw false positives
	if ( typeof this.config.indentSpaces !== 'number' ) {
		while ( line.charAt( textIndex++ ) === '\t' ) {
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
		}.bind( this ));
	}

	// if current context switched, reset array
	if ( prevContext !== currContext ) {
		this.alphaCache = [];
	}

	// we don't alphabetize the root yet
	if ( currContext === 0 ) {
		return true;
	}

	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	// push prop values into our 'cache' @TODO do i need that length check?
	if ( typeof arr[0] !== 'undefined' && arr[0].length > 0 && currContext > 0 && !ignoreMe.test( line ) ) {
		valid.css.forEach(function( val ) {
			var i = 0, j = 0;

			if ( arr[ 0 ] === val ) {
				validCSS = true;
				return;
			}

			for ( i; i < valid.prefixes.length; i++ ) {
				if ( arr[ 0 ] === ( valid.prefixes[ i ] + val ) ) {
					validCSS = true;
					return;
				}
			}

			for ( j; j < valid.pseudo.length; j++ ) {
				if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
					validCSS = true;
					return;
				}
			}
		}.bind( this ));

		if ( validCSS ) {
			this.alphaCache.push( arr[ 0 ] );
		}
	}
	else {
		return true;
	}

	if ( line.indexOf('(') !== -1 && line.indexOf(')') !== -1 ) {
		return true;
	}

	if ( ignoreMe.test( line ) || this.alphaCache.length < 1 ) {
		return true;
	}

	// create a copy of the cache for comparison
	this.alphaCache.forEach(function( val, i ) {
		sortedArr.push( this.alphaCache[i] );
	}.bind( this ));

	// and then sort it
	sortedArr = sortedArr.sort();

	// now compare
	if ( this.alphaCache.length === sortedArr.length ) {

		if ( this.state.hash === false && currContext === prevContext ) {

			// compare each value individually
			this.alphaCache.forEach(function( val, i ) {
				// if any value doesn't match quit the forEach
				if ( sortedArr[i] !== this.alphaCache[i] ) {
					isItSorted = false;
					return;
				}
				// if match, check for valid css before we set it to true
				else {
					valid.css.forEach(function( val ) {
						var i = 0, j = 0;

						if ( this.alphaCache[ 0 ] === val ) {
							isItSorted = true;
							return;
						}

						for ( i; i < valid.prefixes.length; i++ ) {
							if ( this.alphaCache[ 0 ] === ( valid.prefixes[ i ] + val ) ) {
								isItSorted = true;
								return;
							}
						}

						for ( j; j < valid.pseudo.length; j++ ) {
							if ( this.alphaCache[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
								isItSorted = true;
								return;
							}
						}
					}.bind( this ));

					valid.html.forEach(function( val ) {
						var i = 0;

						if ( this.alphaCache[ 0 ] === val ) {
							isItSorted = true;
							return;
						}

						for ( i; i < valid.pseudo.length; i++ ) {
							if ( this.alphaCache[ 0 ] === ( val + valid.pseudo[ i ] ) ) {
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
	prevContext = currContext;

	return isItSorted;
};
