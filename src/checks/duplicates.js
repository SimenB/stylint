'use strict';

var syntaxIgnore = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( line, file ) {
	if ( typeof line !== 'string' ) { return; }

	var
		arr = line.split(/[\s\t]/),
		isThereADupe = false,
		textIndex = 0,
		indentCount = 0,
		currContext = 0;

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

	// remove blank spaces now that we have our context
	arr = arr.filter(function( str ) {
		return str.length > 0;
	});

	// if current context switched, reset array
	if ( this.cache.prevContext !== currContext ) {
		this.cache.selectorCache = [];
	}

	// if root check not global, wipe on each new file
	if ( this.cache.prevFile !== file && !this.config.globalDupe ) {
		this.cache.rootCache = [];
	}

	// keep track of and check root selectors too
	if ( currContext === 0 ) {
		// if curr line is already in our cache, we have a dupe
		// file specific check
		if ( !this.config.globalDupe && this.cache.prevFile !== file ) {
			// check against prev line to make sure we're not in a list of selectors
			if ( this.cache.rootCache.indexOf( line ) !== -1 &&
				this.cache.prevLine.indexOf(',') === -1 ) {
				isThereADupe = true;
			}
		}
		// global check
		else {
			if ( this.cache.rootCache.indexOf( line ) !== -1 &&
				this.cache.prevLine.indexOf(',') === -1 ) {
				isThereADupe = true;
			}
		}

		// undefined check is for whitespace
		if ( typeof arr[0] !== 'undefined' &&
			!syntaxIgnore.test( line ) &&
			typeof this.cache.prevLine !== 'undefined' &&
			this.cache.prevLine.indexOf(',') === -1 ) {
			this.cache.rootCache.push( line );
		}
	}

	// if curr line is already in our cache, we have a dupe
	if ( this.cache.selectorCache.indexOf( arr[0] ) !== -1 ) {
		isThereADupe = true;
	}

	// cache the lines in the curr context
	if ( typeof arr[0] !== 'undefined' && !syntaxIgnore.test(line) ) {
		this.cache.selectorCache.push( arr[0] );
	}

	// save our curr context so we can use it to see our place
	this.cache.prevFile = file;
	this.cache.prevLine = line;
	this.cache.prevContext = currContext;

	return isThereADupe;
};
