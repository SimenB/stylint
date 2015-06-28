'use strict'

/**`
 * @description called when -h or --help used, just displays options
 * @return {undefined} just console logs the flags
 */
var help = function () {
	console.log( '\nStylint' )
	console.log( 'Usage: stylint [dir | file] [options]\n' )
	console.log( 'Options:' )
	console.log( '-h', '--help', '  Display list of commands' )
	console.log( '-w', '--watch', ' Watch file or directory and run lint on change' )
	console.log( '-c', '--config', '    Pass in location of custom config file' )
	console.log( '-s', '--strict', '    Run all tests, regardless of config' )
	console.log( '-v', '--version', '   Get current version\n' )
}

module.exports = help
