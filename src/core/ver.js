'use strict'

var pkg = require( '../../package.json' )

// called when --version or -v flags used, just displays version number
var ver = function() {
	return console.log( '\nStylint version: ' + pkg.version + '\n' )
}

module.exports = ver
