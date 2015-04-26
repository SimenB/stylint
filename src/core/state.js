var stampit = require('stampit');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	state: {
		context: 0, // what is our level of nesting?
		cssBlock: false, // are we in a css literal
		exitCode: 1, // err or no err
		hasComment: false, // checks for // in a line
		hash: false, // are we in a hash
		keyframes: false, // are we in @keyframes
		killSwitch: false, // are we over our warning limit
		path: '', // curr dir || file
		prevContext: 0, // save the last context as well
		strictMode: false, // run all tests regardless?
		testsEnabled: true, // are we running linter tests
		toggleBlock: false, // @stylint off
		quiet: false, // turn off console logs
		watching: false // are we watching
	}
});
