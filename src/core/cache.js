var path = require( 'path' )

// the main cache bject
var cache = {
	allViolations: [], // an array containing every warning or error
	comment: '', // the current line comment on the line, if there is one
	file: '', // curr filename we're testing
	files: [], // all files as an arr
	filesLen: 0, // # of files we're testing
	fileNo: 0, // curr # of filesLen we're on
	line: '', // curr line we're testing
	lineNo: 0, // curr line number we're testing
	mixins: [], // an array of all declared mixins
	msg: '', // the done message (55 warnings blah blah)
	origLine: '', // original line before stripping/trimming
	prevFile: '', // the previous file
	prevFileNo: 0, // prev file no
	prevLine: '', // the previous line
	reporterCache: {}, // a cache for use by the reporter
	dir: path.dirname( require.main.filename ), // index.js directory
	sCache: { '0': [] }, // each key is an array of selectors in that context
	sortOrderCache: [], // we keep a context based arr of selectors here to check sort orde
	zCache: [] // array of z-index uses
}

module.exports = cache
