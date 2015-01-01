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


var ignoreMe = /[$.#{}(=]|(if)|(for)|(@block)/, // dont throw false positives on user created names or syntax
    valid = false,
    html = [
        'a',
        'abbr',
        'abel',
        'acronym',
        'address',
        'applet',
        'area',
        'article',
        'aside',
        'audio',
        'b',
        'bdi',
        'bdo',
        'big',
        'blockquote',
        'body',
        'button',
        'button[disabled]',
        'br',
        'caption',
        'canvas',
        'cite',
        'code',
        'col',
        'colgroup',
        'data',
        'datalist',
        'dd',
        'del',
        'details',
        'dfn',
        'div',
        'dl',
        'dt',
        'em',
        'fieldset',
        'figure',
        'figcaption',
        'footer',
        'form',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'html',
        'i',
        'iframe',
        'img',
        'input',
        'input[disabled]',
        'input[type=submit]',
        'input[type="submit"]',
        "input[type='submit']",
        'input[type=search]',
        'input[type="search"]',
        "input[type='search']",
        'input[type=button]',
        'input[type="button"]',
        "input[type='button']",
        'input[type=reset]',
        'input[type="reset"]',
        "input[type='reset']",
        'ins',
        'kbd',
        'keygen',
        'label',
        'legend',
        'li',
        'main',
        'map',
        'mark',
        'math',
        'menu',
        'menuitem',
        'meter',
        'nav',
        'object',
        'ol',
        'optgroup',
        'option',
        'output',
        'param',
        'p',
        'pre',
        'progress',
        'q',
        'ruby',
        'rt',
        'rp',
        's',
        'samp',
        'section',
        'select',
        'small',
        'source',
        'span',
        'strike',
        'strong',
        'sub',
        'sup',
        'summary',
        'svg',
        'table',
        'tbody',
        'td',
        'textarea',
        'tfoot',
        'th',
        'thead',
        'time',
        'tr',
        'track',
        'tt',
        'ul',
        'var',
        'video',
        'wbr'
    ];


module.exports = function checkForValid( line, valid ) {
    var arr = line.split(/[\s\t,:]/);

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