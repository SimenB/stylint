'use strict';

var syntaxIgnore = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( line, file, app ) {
	if ( typeof line !== 'string' ||
		typeof file !== 'string' ||
		typeof app !== 'object' ) {
		return;
	}

	// remove blank spaces now that we have our context
	var arr = app.stripWhiteSpace( line );
	var currContext = app.getContext( app.config.indentSpaces, line );
	var isThereADupe = false;

	// before we add an item to a cache array
	// make sure it's not whitespace or syntax or whatever
	function lineIsAcceptable( line ) {
		return (
			!syntaxIgnore.test(line) &&
			typeof arr[0] !== 'undefined' &&
			typeof app.cache.prevLine !== 'undefined' &&
			app.cache.prevLine.indexOf(',') === -1
		);
	}

	// if current context switched, reset array
	if ( app.cache.prevContext !== currContext || app.cache.prevFile !== file ) {
		app.cache.selectorCache = [];
	}

	// if root check not global, wipe on each new file
	if ( !app.config.globalDupe && app.cache.prevFile !== file ) {
		app.cache.rootCache = [];
	}

	// keep track of and check root selectors too
	if ( currContext === 0 ) {
		// if curr line is already in our cache, we have a dupe
		if ( app.cache.prevLine.indexOf(',') === -1 &&
			app.cache.rootCache.indexOf( line ) !== -1 ) {
			isThereADupe = true;
		}

		// undefined check is for whitespace
		if ( lineIsAcceptable( line ) ) {
			app.cache.rootCache.push( line );
		}
	}
	// if selector is nested we check the selectorCache instead of rootCache
	else {
		if ( app.cache.prevLine.indexOf(',') === -1 &&
			app.cache.selectorCache.indexOf( arr[0] ) !== -1 ) {
			isThereADupe = true;
		}
		// cache the lines in the curr context
		if ( lineIsAcceptable( line ) ) {
			app.cache.selectorCache.push( arr[0] );
		}
	}

	// save our curr context so we can use it next time
	app.cache.prevFile = file;
	app.cache.prevLine = line;
	app.cache.prevContext = currContext;

	return isThereADupe;
};
