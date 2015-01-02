/**
* check against a JSON of all valid css properties and values
* @returns false if property or value not considered valid
* @returns true if valid
* @returns undefined if not testable (hmmm)
*/


// super super rough atm
// @TODO inherit check for all values
// @TODO regex to match any color
// @TODO regex to match any length (ie, px, %, whatever)
// @TODO dont throw warnings if html


const
    ignoreMe = /[$.#{}(=]|(if)|(for)|(@block)/, // dont throw false positives on user created names or syntax
    valid = false;


module.exports = function checkForValidProperties( line, validCSS, validHTML ) {
    'use strict';
    if ( typeof line === 'undefined' ||
        typeof validCSS === 'undefined' ||
        typeof validHTML === 'undefined' ) {
        return;
    }

    var arr = line.split(/[\s\t,:]/),
        len = validHTML.length,
        i = 0;

    // not empty, not something we ignore
    if ( arr[0].length > 0 && !ignoreMe.test( line ) ) {

        // loop through our valid css json
        for ( var prop in validCSS ) {

            // get keys, the properties, which is where we'll start
            if ( validCSS.hasOwnProperty( prop ) ) {

                // if we have an exact css match
                if ( arr[0] === prop ) {
                    return true;
                }
                // else no css match, check if html property
                else {
                    // loop through html array
                    for ( i; i < len; i++ ) {
                        // if exact string match,
                        if ( arr[ 0 ] === validHTML[ i ] ) {
                            valid = true;
                            // console.log( html[i] );
                            return true;
                        }
                    }
                }
            }
        }

        // no matches return false
        return false;
    }
    else {
        return true;
    }
 }