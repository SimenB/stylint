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


// dont throw false positives on user created names or syntax
const ignoreMe = /[$.#{}(=]|(if)|(for)|(@block)/;


module.exports = function checkForValidProperties( line, valid ) {
    'use strict';
    if ( typeof line === 'undefined' ||
        typeof valid === 'undefined' ) {
        return;
    }

    var arr = line.split(/[\s\t,:]/),
        len = valid.html.length,
        i = 0;

    // not empty, not something we ignore
    if ( arr[0].length > 0 && !ignoreMe.test( line ) ) {

        // loop through our valid css json
        for ( var prop in valid.css ) {

            // get keys, the properties, which is where we'll start
            if ( valid.css.hasOwnProperty( prop ) ) {

                // if we have an exact css match
                if ( arr[ 0 ] === prop ) {
                    return true;
                }
                // else no css match, check if html property
                else {
                    // loop through html array
                    for ( i; i < len; i++ ) {
                        // console.log( arr[ 0 ] );
                        // console.log( valid.html[ i ] );
                        // if exact string match,
                        if ( arr[ 0 ] === valid.html[ i ] ) {
                            // valid = true;
                            // console.log( html[i] );
                            return true;
                        }
                    }
                }
            }
        }

        // process.exit();

        // no matches return false
        return false;
    }
    else {
        return true;
    }
 }