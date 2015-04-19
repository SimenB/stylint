'use strict';

var syntaxIgnoreRe = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( app ) {
	// remove blank spaces now that we have our context
	var arr = app.stripWhiteSpace( new RegExp(/[\s\t]/), app.cache.line );
	var currContext = app.getContext( app.config.indentSpaces, app.cache.line );
	var isThereADupe = false;

	// before we add an item to a cache array
	// make sure it's not whitespace or syntax or whatever
	function _lineIsAcceptable( line ) {
		return (
			!syntaxIgnoreRe.test(line) &&
			typeof arr[0] !== 'undefined' &&
			typeof app.cache.prevLine !== 'undefined' &&
			app.cache.prevLine.indexOf(',') === -1
		);
	}

	// if current context switched, reset array
	if ( app.cache.prevContext !== currContext || app.cache.prevFile !== app.cache.file ) {
		app.cache.selectorCache = [];
	}

	// if root check not global, wipe on each new file
	if ( !app.config.globalDupe && app.cache.prevFile !== app.cache.file ) {
		app.cache.rootCache = [];
	}

	// keep track of and check root selectors too
	if ( currContext === 0 ) {
		// if curr line is already in our cache, we have a dupe
		if ( app.cache.prevLine.indexOf(',') === -1 &&
			app.cache.rootCache.indexOf( app.cache.line ) !== -1 ) {
			isThereADupe = true;
		}

		// undefined check is for whitespace
		if ( _lineIsAcceptable( app.cache.line ) ) {
			app.cache.rootCache.push( app.cache.line );
		}
	}
	// if selector is nested we check the selectorCache instead of rootCache
	else {
		if ( app.cache.prevLine.indexOf(',') === -1 &&
			app.cache.selectorCache.indexOf( arr[0] ) !== -1 ) {
			isThereADupe = true;
		}
		// cache the lines in the curr context
		if ( _lineIsAcceptable( app.cache.line ) ) {
			app.cache.selectorCache.push( arr[0] );
		}
	}

	// save our curr context so we can use it next time
	app.cache.prevFile = app.cache.file;
	app.cache.prevLine = app.cache.line;
	app.cache.prevContext = currContext;

	if ( isThereADupe === true ) {
		app.cache.warnings.push( 'duplicate property or selector, consider merging' + '\nFile: ' + app.cache.file + '\nLine: ' + app.cache.lineNo + ': ' + app.cache.line.trim() );
	}

	return isThereADupe;
};
