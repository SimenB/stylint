const stampit = require('stampit');

// group together 'core' methods
const core = stampit().methods({
  cache: require('./cache'),
  state: require('./state'),
  config: require('./config'),
  init: require('./init'),
  done: require('./done'),
  read: require('./read'),
  parse: require('./parse'),
  setState: require('./setState'),
  lint: require('./lint'),
  lintString: require('./lintString'),
  transformMessages: require('./transformMessages'),
  watch: require('./watch'),

	// utilities below
	// necessary to keep them in the same namespace
  checkPrefix: require('../utils/checkPrefix'),
  checkPseudo: require('../utils/checkPseudo'),
  getFiles: require('../utils/getFiles'),
  msg: require('../utils/msg'),
  resetOnChange: require('../utils/resetOnChange'),
  setConfig: require('../utils/setConfig'),
  setContext: require('../utils/setContext'),
  splitAndStrip: require('../utils/splitAndStrip'),
  trimLine: require('../utils/trimLine')
});

module.exports = core;
