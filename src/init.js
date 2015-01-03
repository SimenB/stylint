const
    fs   = require('fs'),
    read = require('./read');


/**
 * kicks off the app. sets up config and kicks off reading the files
 * @param  {string} dir          [dir | filename | 'nothing']
 * @param  {string} customConfig [path to custom config file]
 * @return {function}            [now that we have the dir and the config, read the files]
 */
module.exports = function init( dir, customConfig ) {
    'use strict';

    if ( typeof dir === 'undefined' ) {
        throw Error('Dir or filename not defined');
    }
    else if ( typeof dir !== 'string' ) {
        throw Error('Dir or filename should be a string');
    }

    init.config = {
        'borderNone': true, // check for use of border none and recommend border 0
        'brackets': false, // check for { or }, unless used in a hash
        'colons': false, // check for unecessary colons
        'commaSpace': true, // check for spaces after commas (0, 0, 0, .18)
        'commentSpace': false, // check for space after line comment
        'cssLiteral': false, // if true disallow css literals
        'depthLimit': 4, // set a maximum selector depth (dont nest more than 4 deep)
        'efficient': true, // check for margin 0 0 0 0 and recommend margin 0
        'enforceVarStyle': false, // check for $ when declaring vars (doesnt check use)
        'enforceBlockStyle': false, // check for @block when defining blocks
        'extendPref': false, // prefer a specific syntax when using @extends (or @extend)
        'indentSpaces': 4, // how many spaces should we prefer when indenting, pass in false if hard tabs
        'leadingZero': true, // find cases where 0.# is used, prefer .#
        'maxWarnings': 10, // should we have a max amount of warnings, and error out if we go over
        'mixed': true, // check for mixed spaces and tabs
        'namingConvention': false, // lowercase-dash, camelCase, lowercase-underscore, or false (dont check)
        'parenSpace': false, // check for extra space inside parens when defining or using mixins
        'placeholders': true, // only allow @extending of placeholder vars
        'semicolons': false, // check for unecessary semicolons
        'trailingWhitespace': true, // check for trailing whitespace
        'universal': true, // check for use of * and recommend against it
        'valid': true, // check if prop or value is a valid assignment
        'zeroUnits': true, // check for use of 0px | 0em | 0rem | 0% | etc and recommend 0 instead
        'zIndexr': false // find z index values and suggested a normalized value of 5 (so, 5 - 10 - 15 - 20 )
    };

    if ( customConfig ) {
        fs.readFile( customConfig, function( err, data) {
            if ( err ) { throw err; }
            config = JSON.parse( data );
            return read( dir, init.config );
        });
    }
    else {
        return read( dir, init.config );
    }
}