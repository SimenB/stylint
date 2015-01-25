'use strict';

var
    prevContext = 0,
    // dont throw false positives on user created names or syntax
    ignoreMe = /[$.#{}(=>&)*]|(if)|(for)|(@block)(@media)(@extends)/;

// check that selector properties are sorted alphabetically
module.exports = function sortAlphabetically( line, valid ) {
    if ( typeof line !== 'string' || typeof valid !== 'object' ) { return; }

    var
        indentCount = 0,
        currContext = 0,
        isItSorted = false,
        arr = line.split(/[\s\t,:]/),
        sortedArr = [],
        validCSS = false;

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
        this.alphaCache = [];
    }

    // push prop values into our 'cache'
    if ( typeof arr[0] !== 'undefined' && arr[0].length > 0 && currContext > 0 && !ignoreMe.test( line ) ) {
        valid.css.forEach(function( val, index ) {
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
                    valid.css.forEach(function( val, index ) {
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

                    valid.html.forEach(function( val, index ) {
                        var i = 0, j = 0;

                        if ( this.alphaCache[ 0 ] === val ) {
                            isItSorted = true;
                            return;
                        }

                        for ( j; j < valid.pseudo.length; j++ ) {
                            if ( this.alphaCache[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
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

    // console.log('is it sorted: ', isItSorted)

    return isItSorted;
}