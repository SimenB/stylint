'use strict';

const
    fs = require('fs'),
    done = require('./done'),
    test = require('./test');


/**
 * @description parses file for testing by removing extra new lines and block comments
 * @param  {string} file        [the current file being parsed]
 * @param  {number} len         [total number of files to parse]
 * @param  {number} fileNum     [the current file being parsed (# of len) ]
 * @returns test function
 */
module.exports = function parse( app, file, len, fileNum ) {
    let stripComments = /(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)/gm;

    return fs.readFile(file, { encoding: 'utf8' }, function( err, data ) {
        if ( err ) { throw err; }
        let lines;

        // remove block comments / empty lines from files
        lines = data.replace(stripComments, function( match ) {
            let lines = match.split(/\r\n|\r|\n/),
                lineLen = lines.length - 1;

            if ( lineLen === 1 ) {
                return ' ';
            }
            else {
                let output = ' ';

                while ( lineLen-- ) {
                    output += '\n';
                }

                return output;
            }
        });

        lines = lines.split('\n');

        /**
         * so, this function trims each line and then tests it
         * @param  {string} [line] the line of stylus to test
         * @return {function} run test
         */
        lines.forEach(function( line, i ) {
            let output = line.trim();
            // line nos don't start at 0
            i++;
            return test( app, line, i, output, file );
        });

        // if at the last file, call the done function to output results
        if ( fileNum === len ) {
            return done( app );
        }
    });
}