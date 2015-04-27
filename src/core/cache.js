var stampit = require('stampit');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	cache: {
		alphaCache: [], // we keep a context based arr of selectors here to check alpha order
		file: '', // curr file we're testing
		filesLen: 0, // # of files we're testing
		fileNo: 0, // curr # of filesLen we're on
		line: '', // curr line we're testing
		lineNo: 0, // curr line number we're testing
		msg: '', // the done message (55 warnings blah blah)
		prevFile: '', // the previous file
		prevLine: '', // the previous line
		rootCache: [], // array of all selectors at the root level. file specific unless global turned on
		selectorCache: [], // array of selectors in the current context
		warnings: [], // array of the errors detected so far
		zCache: [] // array of z-index uses
	}
});
