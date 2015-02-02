'use strict';

var syntaxIgnore = /[,{}]|(:after|:active|:before|@import|@media|:hover|@font-face)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( line, file ) {
	if ( typeof line !== 'string' ) { return; }

	var
		arr = line.split(/[\s\t]/),
		isThereADupe = false,
		textIndex = 0,
		indentCount = 0,
		currContext = 0,
		usingTabs = false;


	// quick and dirty fixes for now, didnt' account for hard tabs for context check
	// this just gets the number of indents so we don't throw false positives
	if ( typeof this.config.indentSpaces !== 'number' ) {
		usingTabs = true;

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
	if ( this.prevContext !== currContext ) {
		this.selectorCache = [];
	}

	// if root check not global, wipe on each new file
	if ( this.prevFile !== file && !this.config.globalDupe ) {
		this.rootCache = [];
	}

	// keep track of and check root selectors too
	if ( currContext === 0 ) {
		// if curr line is already in our cache, we have a dupe
		// file specific check
		if ( !this.config.globalDupe && this.prevFile !== file ) {
			// check against prev line to make sure we're not in a list of selectors
			if ( this.rootCache.indexOf( line ) !== -1 && this.prevLine.indexOf(',') === -1 ) {
				isThereADupe = true;
			}
		}
		// global check
		else {
			if ( this.rootCache.indexOf( line ) !== -1 && this.prevLine.indexOf(',') === -1 ) {
				isThereADupe = true;
			}
		}

		// undefined check is for whitespace
		if ( typeof arr[0] !== 'undefined' &&
			!syntaxIgnore.test( line ) &&
			this.prevLine.indexOf(',') === -1 ) {
			this.rootCache.push( line );
		}
	}

	// if curr line is already in our cache, we have a dupe
	if ( this.selectorCache.indexOf( arr[0] ) !== -1 ) {
		if ( this.selectorCache[ this.selectorCache.indexOf( arr[0] ) ].trim() === line.trim() ) {
			isThereADupe = true;
		}
	}

	// cache the lines in the curr context
	if ( typeof arr[0] !== 'undefined' && !syntaxIgnore.test(line) ) {
		this.selectorCache.push( arr[0] );
	}

	// save our curr context so we can use it to see our place
	this.prevFile = file;
	this.prevLine = line;
	this.prevContext = currContext;

	return isThereADupe;
}