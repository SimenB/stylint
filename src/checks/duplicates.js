'use strict';

var syntaxIgnoreRe = /^{|[,}]|(:after|:active|:before|@import|@require|@extend|@media|:hover|@font-face|src)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicates(line) {
	// remove blank spaces now that we have our context
	var arr = this.stripWhiteSpace( new RegExp(/[\s\t]/), line );
	var isThereADupe = false;

	// before we add an item to a cache array
	// make sure it's not whitespace or syntax or whatever
	function _lineIsAcceptable(app) {
		return (
			!syntaxIgnoreRe.test(line) &&
			typeof arr[0] !== 'undefined' &&
			line.indexOf(',') === -1
		);
	}

	// console.log( this );
	console.log( 'prevLine: ', this.cache.prevLine );
	console.log( 'line: ', line );
	console.log( 'prevFile: ', this.cache.prevFile );
	console.log( 'file: ', this.cache.file );
	console.log( 'prevContext: ', this.state.prevContext );
	console.log( 'context: ', this.state.context );

	// if current context switched, reset array
	if ( this.state.prevContext !== this.state.context || this.cache.prevFile !== this.cache.file ) {
		this.cache.selectorCache = [];
	}

	// if root check not global, wipe on each new file
	if ( !this.config.globalDupe && this.cache.prevFile !== this.cache.file ) {
		this.cache.rootCache = [];
	}

	// keep track of and check root selectors too
	if ( this.state.context === 0 ) {
		// if curr line is already in our cache, we have a dupe
		if ( _lineIsAcceptable(this) ) {
			if ( this.cache.rootCache.indexOf(line) !== -1 ) {
				isThereADupe = true;
			}

			this.cache.rootCache.push( line );
		}
	}
	// if selector is nested we check the selectorCache instead of rootCache
	else {
		console.log( arr[0] );
		console.log( this.cache.selectorCache )
		if ( _lineIsAcceptable(this) ) {
			if ( this.cache.selectorCache.indexOf(arr[0]) !== -1 ) {
				isThereADupe = true;
			}

			this.cache.selectorCache.push( arr[0] );
		}
	}
	if ( isThereADupe === true ) {
		this.cache.warnings.push( 'duplicate property or selector, consider merging' + '\nFile: ' + this.cache.file + '\nLine: ' + this.cache.lineNo + ': ' + line.trim() );
	}

	return isThereADupe;
};
