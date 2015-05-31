var path = require('path');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = {
	comment: '', // the current line comment on the line
	errs: [], // array of errors detected so far
	file: '', // curr filename we're testing
	files: [], // all files as an arr
	filesLen: 0, // # of files we're testing
	fileNo: 0, // curr # of filesLen we're on
	line: '', // curr line we're testing
	lineNo: 0, // curr line number we're testing
	msg: '', // the done message (55 warnings blah blah)
	prevFile: '', // the previous file
	prevLine: '', // the previous line
	dir: path.dirname(require.main.filename), // index.js directory
	sCache: {}, // each key is an array of selectors in that context
	sortOrderCache: [], // we keep a context based arr of selectors here to check sort orde
	warnings: [], // array of the errors detected so far
	zCache: [] // array of z-index uses
};
