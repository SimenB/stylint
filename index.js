// modules
const   fs          = require('fs'),
        chalk       = require('chalk'),
        fileinput   = require('fileinput'),
        stream      = require('stream'),
        readline    = require('readline'),
        _           = require('lodash');


// regexes
const   comment = /\/\/\s/,                 // check for space after comment line
        starS   = /(\* )/,                 // check for space after star (inside a docblockr comment)
        starO   = /(\/\*\*)/ || /(\/\*)/,   // check for star selector as opening comment
        starE   = /(\*\/)/;                 // finally, check for star selector as closing comment

// other stuff
var errors = [],
    warnings = [],
    files = [],
    count = 0;


fileinput.input('test/test.styl').on('line', function(line) {
    var line = line.toString();
    count += 1;

    // check for comment
    if (line.indexOf('//') !== -1) {
        // check for space after comment, if no space, return warning
        if (!comment.test(line)) {
            warnings.push('space after comment is preferred: \n' + count + ': ' + line);
        }
    }

    // check for 0px
    if (line.indexOf(' 0px') !== -1) {
        warnings.push('0 is preferred over 0px. Found on line: \n' + count + ': ' + line)
    }

    /**
     * check for * selector. (super basic atm, @TODO needs to not trigger on regex selectors)
     * technically this is used as part of resets often, for good reason, despite its slowness
     * which is why i'm setting it up as a warning as it won't break code but you might prefer to not use it
     */
    if (line.indexOf('*') !== -1) {
    	// check for various places where the * is valid (just comment checks atm)
        if (!starO.test(line) && !starE.test(line) && !starS.test(line)) {
            warnings.push('* selector is very slow. Found on line: \n' + count + ': ' + line);
        }
    }

    // check for semicolons
    if (line.indexOf(';') !== -1) {
        errors.push('semicolon found on line: \n' + count + ': ' + line)
    }
}).
on('error', function(err) {
    throw err;
}).
on('end', function() {
    for (var i = 0; i < warnings.length; i++) {
        console.log( chalk.yellow('Warning: ' + warnings[i]) );
    }
    for (var i = 0; i < errors.length; i++) {
        console.log( chalk.red('Error: ' + errors[i]) );
    }
});


// fs.readFile('test/test.styl', 'utf8', function(err, data) {
//     if (err) {
//         return console.error(err);
//     }

//     // console.log(data);
//     // console.log(typeof data);
//     console.log(semi.exec(data))

//     if (!_.isNull(semi.exec(data))) {
//         console.log('Match!');
//     }
//     else {
//         console.log('No Match!');
//     }
// });

// fileinput.input().on('line', function(line) {
//     console.log( fileinput.lineno(), line.toString('utf8') );
// });


// var instream = fs.createReadStream(process.argv[2]);
// var outstream = new stream;
// outstream.readable = true;
// outstream.writable = true;

// var rl = readline.createInterface({
//     input: instream,
//     output: outstream,
//     terminal: false
// });

// rl.on('line', function(line) {
//     console.log(line);
//     //Do your stuff ...
//     //Then write to outstream
//     // rl.write(cubestuff);
// }).
// on('error', function(err) {
//     throw err;
// });

// fs.readdir(process.argv[2], function(err, contents) {
//     if (err) throw err;

//     contents.forEach(function(file) {
//         files.push(file);
//     });
// });
