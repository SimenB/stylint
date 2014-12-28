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

var ignoreMe = /[$.#{}(]|(if)|(for)/, // dont throw false positives on user created names or syntax
    valid = false,
    html = [
        'html',
        'body',
        'div',
        'span',
        'applet',
        'object',
        'iframe',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'blockquote',
        'pre',
        'a',
        'abbr',
        'acronym',
        'address',
        'big',
        'cite',
        'code',
        'del',
        'dfn',
        'em',
        'img',
        'ins',
        'kbd',
        'q',
        's',
        'samp',
        'small',
        'strike',
        'strong',
        'sub',
        'sup',
        'tt',
        'var',
        'dl',
        'dt',
        'dd',
        'ol',
        'ul',
        'li',
        'fieldset',
        'form',
        'abel',
        'legend',
        'table',
        'caption',
        'tbody',
        'tfoot',
        'thead',
        'tr',
        'th',
        'td'
    ];



module.exports = function checkForValid( line, valid ) {
    var arr = line.trim().split(' ');

    console.log( arr );

    // not empty, not something we ignore
    if ( arr[0].length > 0 && !ignoreMe.test( arr[0] ) ) {

        // loop through our valid css json
        for ( var prop in valid ) {

            // get keys, the properties, which is where we'll start
            if ( valid.hasOwnProperty( prop ) ) {

                // if we have an exact css match
                if ( arr[0] === prop ) {
                    // console.log( prop );
                    return true;
                }
                // else no css match, check html
                else {

                    // loop through html array
                    for ( var i = 0; i < html.length; i++ ) {

                        // if exact string match,
                        if ( arr[0] === html[i] ) {
                            valid = true;
                            // console.log( html[i] );
                            return true;
                        }
                    }
                }
            }
        }

        return false;
    }
 }