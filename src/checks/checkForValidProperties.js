/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/

// dont throw false positives on user created names or syntax
const ignoreMe = /[$.#{}(=>]|(if)|(for)|(@block)/;


module.exports = function checkForValidProperties( line, valid ) {
    'use strict';
    if ( typeof line === 'undefined' ||
        typeof valid === 'undefined' ) {
        return;
    }

    // split by tabs and spaces, tabs mess with pattern matching
    var arr = line.split(/[\s\t,:]/),
        len = valid.html.length,
        isValid = false;

    // remove white space
    arr = arr.filter(
        function( str ) {
            return str.length > 0;
        }
    );

    // not empty, not something we ignore
    if ( !ignoreMe.test( line ) &&
        this.state.hash === false &&
        typeof arr[0] !== 'undefined' ) {

        valid.css.forEach(function( val, index ) {
            var i = 0,
                j = 0;

            if ( arr[ 0 ] === val ) {
                isValid = true;
                return;
            }

            for ( i; i < valid.prefixes.length; i++ ) {
                if ( arr[ 0 ] === ( valid.prefixes[ i ] + val ) ) {
                    isValid = true;
                    return;
                }
            }

            for ( j; j < valid.pseudo.length; j++ ) {
                if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
                    isValid = true;
                    return;
                }
            }
        });

        valid.html.forEach(function( val, index ) {
            var i = 0,
                j = 0;

            if ( arr[ 0 ] === val ) {
                isValid = true;
                return;
            }

            for ( j; j < valid.pseudo.length; j++ ) {
                if ( arr[ 0 ] === ( val + valid.pseudo[ j ] ) ) {
                    isValid = true;
                    return;
                }
            }
        });
    }
    else {
        isValid = true;
    }

    // return true if valid match found
    if ( isValid ) {
        return true;
    }
    else {
        return false;
    }
 }