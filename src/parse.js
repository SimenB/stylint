const
    fs   = require('fs'),
    test = require('./test');


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param  {string} file        [the current file being parsed]
 * @param  {number} len         [total number of files to parse]
 * @param  {number} currFile    [the current file being parsed (# of len) ]
 * @param  {number} config      [our config object]
 * @returns function
 */
module.exports = function parse( file, len, currFile, config ) {
    'use strict';

    var stripComments = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)/g,
        fileContent = fs.readFileSync( file, 'utf8' ),
        cleanFile = fileContent.replace(stripComments, function( match ) {
            var lines = match.split(/\r\n|\r|\n/),
                lineLen = lines.length - 1,
                output = ' ';

            if ( lineLen === 1 ) {
                return ' ';
            }
            else {
                while ( lineLen-- ) {
                    output += '\n';
                }
                return output;
            }
        }),
        lines = cleanFile.split('\n');

    /**
     * so, this function trims each line and then tests it
     * @param  {string}     the line of stylus to test
     * @return {function}   run test
     */
    lines.forEach(function( line, i ) {
        var output = line.trim();
        // line nos don't start at 0
        i++;
        return test( false, config, line, i, output, file );
    });

    // if at the last file, call the done function to output results
    if ( currFile === len ) {
        return test( true, config );
    }
}