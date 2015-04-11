var stampit = require('stampit');

/**
 * @description i hold the state
 * @return {Object} [i expose properties to the entire app]
 */
module.exports = stampit().state({
	valid: require('../data/getValid')()
});
// var valid = require('../data/getValid')();
