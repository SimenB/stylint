'use strict';

var
    prevFile = '',
    prevContext = 0,
    media = /(@media)/,
    syntaxIgnore = /[,]|(:after|:active|:before|@import|@media|:not|:hover)/;

// check that selector properties are sorted alphabetically
module.exports = function duplicateSelectors( line, file ) {
    if ( typeof line !== 'string' ) { return; }

    var
        arr = line.split(/[\s\t]/),
        isThereADupe = false,
        textIndex = 0,
        indentCount = 0,
        currContext = 0,
        usingTabs = false,
        saveIndexOf = 0;


    // quick and dirty fixes for now, didnt' account for hard tabs for context check
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
    if ( prevContext !== currContext ) {
        this.selectorCache = [];
    }

    // console.log( line );
    // console.log( 'currContext', currContext );
    // console.log( 'prevContext', prevContext );

    // keep track of and check root selectors too
    if ( currContext === 0 ) {
        // if curr line is already in our cache, we have a dupe
        if ( !this.config.globalDupe && prevFile !== file ) {
            if ( this.rootCache.indexOf( arr[0] ) !== -1 && !media.test( line ) ) {
                saveIndexOf = this.rootCache.indexOf( arr[0] );

                if ( this.rootCache[ saveIndexOf ] === line ) {
                    isThereADupe = true;
                }
            }
        }
        else {
            if ( this.rootCache.indexOf( arr[0] ) !== -1 && !media.test( line ) ) {
                saveIndexOf = this.rootCache.indexOf( arr[0] );

                if ( this.rootCache[ saveIndexOf ] === line ) {
                    isThereADupe = true;
                }
            }
        }

        if ( typeof arr[0] !== 'undefined' && !syntaxIgnore.test( this.rootCache[ this.rootCache.length - 1 ] ) ) {
            this.rootCache.push( arr[0] );
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
    prevFile = file;
    prevContext = currContext;

    return isThereADupe;
}