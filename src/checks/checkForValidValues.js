// super super rough atm
// @TODO inherit check for all values
// @TODO regex to match any color
// @TODO regex to match any length (ie, px, %, whatever)
'use strict';

var
    ignoreMe = /[$.#{}(=]|(if)|(for)|(@block)/, // dont throw false positives on user created names or syntax
    valid = false;

/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/
module.exports = function checkForValidProperties( line, valid ) {
    if ( typeof line !== 'string' ||
        typeof valid === 'undefined' ) {
        return;
    }

    var len = validHTML.length,
        i = 0;

    // filter out white space
    arr = arr.filter(function( str ) {
        return str.length > 0;
    });

    // not empty, not something we ignore
    if ( !ignoreMe.test( line ) ) {

        // loop through our valid css json
        for ( var prop in validCSS ) {

            // console.log( validCSS[prop] );

            // get keys, the properties, which is where we'll start
            if ( validCSS.hasOwnProperty( prop ) ) {

                // loop through css array
                if ( validCSS[prop] ) {
                    for ( i; i < validCSS[prop].length; i++ ) {
                        // if exact string match,
                        if ( arr[1] === validCSS[ i ] ) {
                            valid = true;
                            return true;
                        }
                    }
                }

                // // if we have an exact css match
                // if ( arr[0] === valid[prop] ) {
                //     return true;
                // }
                // // else no css match, check if html property
                // else {

                //     // loop through html array
                //     for ( i; i < len; i++ ) {
                //         // if exact string match,
                //         if ( arr[0] === validHTML[ i ] ) {
                //             valid = true;
                //             // console.log( html[i] );
                //             return true;
                //         }
                //     }
                // }
            }
        }

        return false;
    }
 }