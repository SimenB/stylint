'use strict';

var
    prevFile = '',
    prevContext = 0,
    ignoreMe = /(@media)/,
    syntaxIgnore = /[},]|(:after|:active|:before|@import|@media|:not)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( line, file ) {
    if ( typeof line !== 'string' ) { return; }

    var
        arr = line.split(/[\s\t]/),
        isThereADupe = false,
        indentCount = 0,
        currContext = 0;

    // get our context, ie, the indent level of the group of properties we're checking
    arr.forEach(function( val, i ) {
        if ( arr[i].length === 0 ) {
            indentCount++; // spaces or tabs
        }
        else {
            currContext = indentCount / this.config.indentSpaces;
        }
    }.bind( this ));

    // remove blank spaces now that we have our context
    arr = arr.filter(function( str ) {
        return str.length > 0;
    });

    // if current context switched, reset array
    if ( prevContext !== currContext ) {
        this.selectorCache = [];
    }

    // keep track of and check root selectors too
    if ( currContext === 0 ) {
        // if curr line is already in our cache, we have a dupe
        if ( !this.config.globalDupe && prevFile !== file ) {
            if ( this.rootCache.indexOf( arr[0] ) !== -1 && !ignoreMe.test( line ) ) {
                isThereADupe = true;
            }
        }
        else {
            if ( this.rootCache.indexOf( arr[0] ) !== -1 && !ignoreMe.test( line ) ) {
                isThereADupe = true;
            }
        }

        if ( typeof arr[0] !== 'undefined' && !syntaxIgnore.test( this.rootCache[ this.rootCache.length - 1 ] ) ) {
            this.rootCache.push( arr[0] );
        }
    }

    // if curr line is already in our cache, we have a dupe
    if ( this.selectorCache.indexOf( arr[0] ) !== -1 ) {
        isThereADupe = true;
    }

    // cache the lines in the curr context
    if ( typeof arr[0] !== 'undefined' ) {
        this.selectorCache.push( arr[0] );
    }

    // save our curr context so we can use it to see our place
    prevFile = file;
    prevContext = currContext;

    return isThereADupe;
}