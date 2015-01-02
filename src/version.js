const fs = require('fs');

// called when --version or -v flags used, just displays version number
module.exports = function version() {
    var ver = JSON.parse( fs.readFileSync('package.json') ).version;
    console.log( chalk.blue('\nStylint version: '), ver, '\n' );
}